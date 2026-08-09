import Cookies from 'js-cookie';
import React from 'react';
import { useNavigate } from 'react-router';
import io from 'socket.io-client';
import { CHAT_SERVER_URL } from './Components/User/Chat/chatConfig';
import {
  buildDirectMessageNotification,
  isDirectMessageMuted,
  shouldNotifyDirectMessage,
} from './Components/User/Chat/notificationUtils';
import { useUser } from './UserContext';

const ChatNotificationsContext = React.createContext(null);

const ChatNotificationsStorage = ({ children }) => {
  const { data } = useUser();
  const [latestDirectMessage, setLatestDirectMessage] = React.useState(null);
  const [unreadByRoom, setUnreadByRoom] = React.useState({});
  const notificationSequenceRef = React.useRef(0);
  const navigate = useNavigate();

  const notifyDirectMessage = React.useCallback(
    (message) => {
      if (typeof globalThis.Notification === 'undefined') return;

      const allowed = shouldNotifyDirectMessage({
        permission: globalThis.Notification.permission,
        visibility: document.visibilityState,
        message,
        currentUserId: data?.id,
        muted: isDirectMessageMuted(),
      });

      if (!allowed) return;

      const { title, options } = buildDirectMessageNotification(message);
      const notification = new globalThis.Notification(title, options);

      notification.onclick = () => {
        globalThis.focus?.();
        navigate('/conta/chat');
        notification.close();
      };
    },
    [data?.id, navigate],
  );

  const notifyDirectMessageRef = React.useRef(notifyDirectMessage);
  notifyDirectMessageRef.current = notifyDirectMessage;

  React.useEffect(() => {
    if (!data?.id || data.onboarding_required) {
      setLatestDirectMessage(null);
      setUnreadByRoom({});
      return undefined;
    }

    const socket = io(CHAT_SERVER_URL, {
      transports: ['websocket', 'polling'],
      auth: { token: Cookies.get('token') },
      timeout: 10000,
      reconnectionDelay: 500,
      reconnectionDelayMax: 5000,
    });

    socket.on('directMessage', (message) => {
      const roomId = Number(message?.room_id);
      if (!roomId) return;

      notificationSequenceRef.current += 1;
      setLatestDirectMessage({
        ...message,
        notificationId: notificationSequenceRef.current,
      });

      if (Number(message.user_id) !== Number(data.id)) {
        setUnreadByRoom((rooms) => ({
          ...rooms,
          [roomId]: (rooms[roomId] || 0) + 1,
        }));

        notifyDirectMessageRef.current(message);
      }
    });

    return () => socket.disconnect();
  }, [data?.id, data?.onboarding_required]);

  const markRoomRead = React.useCallback((roomId) => {
    setUnreadByRoom((rooms) => {
      if (!rooms[roomId]) return rooms;

      const updatedRooms = { ...rooms };
      delete updatedRooms[roomId];
      return updatedRooms;
    });
  }, []);

  const totalUnread = React.useMemo(
    () =>
      Object.values(unreadByRoom).reduce((total, count) => total + count, 0),
    [unreadByRoom],
  );

  return (
    <ChatNotificationsContext.Provider
      value={{
        latestDirectMessage,
        unreadByRoom,
        totalUnread,
        markRoomRead,
      }}
    >
      {children}
    </ChatNotificationsContext.Provider>
  );
};

const useChatNotifications = () => {
  const context = React.useContext(ChatNotificationsContext);
  if (!context) {
    throw new Error(
      'useChatNotifications deve ser usado dentro de ChatNotificationsStorage.',
    );
  }
  return context;
};

export { ChatNotificationsStorage, useChatNotifications };
