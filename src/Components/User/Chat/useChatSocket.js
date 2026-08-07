import Cookies from 'js-cookie';
import { useCallback, useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import { CHAT_SERVER_URL } from './chatConfig';

const useChatSocket = ({ roomId, userName, onMessage }) => {
  const [usersState, setUsersState] = useState([]);
  const socketRef = useRef(null);
  const activeRoomRef = useRef({ roomId, userName });
  const onMessageRef = useRef(onMessage);

  activeRoomRef.current = { roomId, userName };
  onMessageRef.current = onMessage;

  useEffect(() => {
    const socket = io(CHAT_SERVER_URL, {
      transports: ['websocket'],
      auth: { token: Cookies.get('token') },
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      const activeRoom = activeRoomRef.current;
      socket.emit('joinRoom', {
        roomId: String(activeRoom.roomId),
        userName: activeRoom.userName,
      });
    });

    socket.on('connect_error', (error) => {
      console.error('[Socket]:', error.message);
    });

    socket.on('updateUsers', setUsersState);
    socket.on('message', (message) => onMessageRef.current(message));
    socket.on('joinedRoom', ({ users: roomUsers }) =>
      setUsersState(roomUsers),
    );
    socket.on('error', (error) => {
      console.error('[Error]:', error);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [userName]);

  useEffect(() => {
    if (!socketRef.current?.connected) return;

    socketRef.current.emit('joinRoom', {
      roomId: String(roomId),
      userName,
    });
  }, [roomId, userName]);

  const sendMessage = useCallback(
    (message, onSuccess) => {
      if (!socketRef.current) return;

      socketRef.current.emit(
        'message',
        { roomId: String(roomId), message },
        (acknowledgement) => {
          if (acknowledgement?.ok) {
            onSuccess?.();
            return;
          }

          console.error(
            'Erro ao enviar mensagem:',
            acknowledgement?.error,
          );
        },
      );
    },
    [roomId],
  );

  return { usersState, sendMessage };
};

export { useChatSocket };
