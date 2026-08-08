import Cookies from 'js-cookie';
import { useCallback, useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import { CHAT_SERVER_URL } from './chatConfig';

const TYPING_EXPIRATION_MS = 4000;

const useChatSocket = ({ roomId, onMessage, onReactionUpdate, currentUserId }) => {
  const [usersState, setUsersState] = useState([]);
  const [typingUsersState, setTypingUsersState] = useState([]);
  const [connectionState, setConnectionState] = useState('connecting');
  const [errorState, setErrorState] = useState('');
  const socketRef = useRef(null);
  const activeRoomRef = useRef({ roomId });
  const onMessageRef = useRef(onMessage);
  const onReactionUpdateRef = useRef(onReactionUpdate);
  const currentUserIdRef = useRef(currentUserId);
  const typingUsersRef = useRef(new Map());
  const typingTimersRef = useRef(new Map());

  activeRoomRef.current = { roomId };
  onMessageRef.current = onMessage;
  onReactionUpdateRef.current = onReactionUpdate;
  currentUserIdRef.current = currentUserId;

  const publishTypingUsers = useCallback(() => {
    const typingUsers = [...typingUsersRef.current.entries()]
      .map(([id, name]) => ({ id, name }))
      .sort((first, second) => first.name.localeCompare(second.name, 'pt-BR'));
    setTypingUsersState(typingUsers);
  }, []);

  const clearTypingUsers = useCallback(() => {
    typingTimersRef.current.forEach((timerId) => clearTimeout(timerId));
    typingTimersRef.current.clear();
    typingUsersRef.current.clear();
    setTypingUsersState([]);
  }, []);

  const updateTypingUser = useCallback(
    (userId, username, isTyping) => {
      const existingTimer = typingTimersRef.current.get(userId);
      if (existingTimer) {
        clearTimeout(existingTimer);
        typingTimersRef.current.delete(userId);
      }

      if (!isTyping) {
        typingUsersRef.current.delete(userId);
        publishTypingUsers();
        return;
      }

      typingUsersRef.current.set(userId, username);
      typingTimersRef.current.set(
        userId,
        setTimeout(() => {
          typingTimersRef.current.delete(userId);
          typingUsersRef.current.delete(userId);
          publishTypingUsers();
        }, TYPING_EXPIRATION_MS),
      );
      publishTypingUsers();
    },
    [publishTypingUsers],
  );

  const joinRoom = useCallback(
    (socket, requestedRoomId) => {
      setConnectionState('joining');
      setErrorState('');
      setUsersState([]);
      clearTypingUsers();

      socket.timeout(10000).emit(
        'joinRoom',
        { roomId: String(requestedRoomId) },
        (timeoutError, acknowledgement) => {
          if (!timeoutError && acknowledgement?.ok) return;

          setConnectionState('error');
          setErrorState(
            acknowledgement?.error || 'Não foi possível entrar nesta conversa.',
          );
        },
      );
    },
    [clearTypingUsers],
  );

  useEffect(() => {
    const typingTimers = typingTimersRef.current;
    const typingUsers = typingUsersRef.current;
    const socket = io(CHAT_SERVER_URL, {
      transports: ['websocket', 'polling'],
      auth: { token: Cookies.get('token') },
      timeout: 10000,
      reconnectionDelay: 500,
      reconnectionDelayMax: 5000,
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      const activeRoom = activeRoomRef.current;
      joinRoom(socket, activeRoom.roomId);
    });

    socket.on('connect_error', (error) => {
      setConnectionState('error');
      setErrorState('Não foi possível conectar ao chat. Tentando novamente…');
      console.error('[Socket]:', error.message);
    });

    socket.on('disconnect', () => {
      setConnectionState('disconnected');
      setUsersState([]);
      clearTypingUsers();
    });

    socket.on('updateUsers', setUsersState);
    socket.on('typing', ({ roomId: eventRoomId, userId, username, isTyping } = {}) => {
      if (String(eventRoomId) !== String(activeRoomRef.current.roomId)) return;
      if (Number(userId) === Number(currentUserIdRef.current)) return;
      if (!userId || typeof username !== 'string') return;

      updateTypingUser(Number(userId), username, Boolean(isTyping));
    });
    socket.on('message', (message) => {
      if (String(message?.room_id) === String(activeRoomRef.current.roomId)) {
        onMessageRef.current(message);
      }
    });
    socket.on('reactionUpdated', (payload) => {
      if (String(payload?.roomId) !== String(activeRoomRef.current.roomId)) {
        return;
      }

      onReactionUpdateRef.current?.(payload);
    });
    socket.on('joinedRoom', ({ users: roomUsers }) => {
      setUsersState(roomUsers);
      setConnectionState('connected');
      setErrorState('');
    });
    socket.on('chatError', (error) => {
      setErrorState(error?.message || 'O chat encontrou um erro.');
      console.error('[Error]:', error);
    });

    return () => {
      typingTimers.forEach((timerId) => clearTimeout(timerId));
      typingTimers.clear();
      typingUsers.clear();
      socket.disconnect();
      socketRef.current = null;
    };
  }, [clearTypingUsers, joinRoom, updateTypingUser]);

  useEffect(() => {
    if (!socketRef.current?.connected) return;

    joinRoom(socketRef.current, roomId);
  }, [joinRoom, roomId]);

  const sendMessage = useCallback(
    (message, clientId, attachment = null) => {
      const socket = socketRef.current;

      if (!socket?.connected) {
        return Promise.reject(new Error('Chat desconectado. Aguarde a reconexão.'));
      }

      setErrorState('');

      const payload = { roomId: String(roomId), message, clientId };
      if (attachment?.type === 'image' && attachment.imageUrl) {
        payload.type = 'image';
        payload.imageUrl = attachment.imageUrl;
      }

      return new Promise((resolve, reject) => {
        socket.timeout(12000).emit(
          'message',
          payload,
          (timeoutError, acknowledgement) => {
            if (!timeoutError && acknowledgement?.ok) {
              resolve(acknowledgement.message);
              return;
            }

            const errorMessage =
              acknowledgement?.error ||
              'A mensagem demorou demais para ser enviada.';
            setErrorState(errorMessage);
            reject(new Error(errorMessage));
          },
        );
      });
    },
    [roomId],
  );

  const sendTyping = useCallback(
    (isTyping) => {
      const socket = socketRef.current;
      if (!socket?.connected) return;

      socket.emit('typing', { roomId: String(roomId), isTyping: Boolean(isTyping) });
    },
    [roomId],
  );

  // O REST do WordPress persiste a reação; aqui só avisamos a sala.
  const sendReaction = useCallback(
    (messageId, reactions) => {
      const socket = socketRef.current;
      if (!socket?.connected) return;

      socket.emit('reaction', {
        roomId: String(roomId),
        messageId,
        reactions: reactions.map(({ emoji, count, userIds }) => ({
          emoji,
          count,
          userIds,
        })),
      });
    },
    [roomId],
  );

  return {
    usersState,
    typingUsersState,
    connectionState,
    errorState,
    sendMessage,
    sendTyping,
    sendReaction,
  };
};

export { useChatSocket };
