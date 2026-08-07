import { useCallback, useState } from 'react';
import { DM_ROOM_POST } from '../../../Api/index';
import { MAIN_CHAT_ROOM } from './chatConfig';

const useChatRoom = ({ currentUserId, request }) => {
  const [activeRoomState, setActiveRoomState] = useState(MAIN_CHAT_ROOM);

  const openDirectMessage = useCallback(
    async (user) => {
      if (!user?.id || user.id === currentUserId) return;

      const { url, options } = DM_ROOM_POST(user.id);
      const { json, response } = await request(url, options);

      if (response?.ok && json?.room_id) {
        setActiveRoomState({ postId: json.room_id, title: user.name });
        return;
      }

      console.error('Erro ao abrir conversa:', response?.statusText);
    },
    [currentUserId, request],
  );

  const openMainRoom = useCallback(() => {
    setActiveRoomState(MAIN_CHAT_ROOM);
  }, []);

  return {
    activeRoomState,
    openDirectMessage,
    openMainRoom,
  };
};

export { useChatRoom };
