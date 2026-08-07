import Cookies from 'js-cookie';
import { useCallback, useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import { CHAT_SERVER_URL } from './chatConfig';

const useChatSocket = ({ roomId, onMessage }) => {
  const [usersState, setUsersState] = useState([]);
  const [connectionState, setConnectionState] = useState('connecting');
  const [errorState, setErrorState] = useState('');
  const socketRef = useRef(null);
  const activeRoomRef = useRef({ roomId });
  const onMessageRef = useRef(onMessage);

  activeRoomRef.current = { roomId };
  onMessageRef.current = onMessage;

  const joinRoom = useCallback((socket, requestedRoomId) => {
    setConnectionState('joining');
    setErrorState('');
    setUsersState([]);

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
  }, []);

  useEffect(() => {
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
    });

    socket.on('updateUsers', setUsersState);
    socket.on('message', (message) => {
      if (String(message?.room_id) === String(activeRoomRef.current.roomId)) {
        onMessageRef.current(message);
      }
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
      socket.disconnect();
      socketRef.current = null;
    };
  }, [joinRoom]);

  useEffect(() => {
    if (!socketRef.current?.connected) return;

    joinRoom(socketRef.current, roomId);
  }, [joinRoom, roomId]);

  const sendMessage = useCallback(
    (message, clientId) => {
      const socket = socketRef.current;

      if (!socket?.connected) {
        return Promise.reject(new Error('Chat desconectado. Aguarde a reconexão.'));
      }

      setErrorState('');

      return new Promise((resolve, reject) => {
        socket.timeout(12000).emit(
          'message',
          { roomId: String(roomId), message, clientId },
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

  return {
    usersState,
    connectionState,
    errorState,
    sendMessage,
  };
};

export { useChatSocket };
