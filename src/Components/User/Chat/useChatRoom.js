import { useCallback, useEffect, useState } from 'react';
import { DM_ROOM_POST, DM_ROOMS_GET } from '../../../Api/index';
import { MAIN_CHAT_ROOM } from './chatConfig';

const toDirectRoom = (room) => ({
  postId: Number(room.room_id),
  title: room.user.name,
  type: 'direct',
  userId: Number(room.user.id),
  lastMessage: room.last_message
    ? {
        message: room.last_message.msg,
        sender: room.last_message.sender,
        userId: Number(room.last_message.user_id),
      }
    : null,
});

const useChatRoom = ({ currentUserId, request }) => {
  const [activeRoomState, setActiveRoomState] = useState(MAIN_CHAT_ROOM);
  const [directRoomsState, setDirectRoomsState] = useState([]);

  useEffect(() => {
    if (!currentUserId) return;

    let cancelled = false;

    const loadDirectRooms = async () => {
      const loadedRooms = [];
      for (let page = 1; !cancelled; page += 1) {
        const { url, options } = DM_ROOMS_GET({ page, perPage: 50 });
        const { json, ok, response } = await request(url, options);
        if (cancelled || !ok || !Array.isArray(json)) return;
        const nextRooms = json.map(toDirectRoom).filter(
          (room) => !loadedRooms.some((loaded) => loaded.postId === room.postId),
        );
        // Old deployments may ignore pagination and return the same array.
        if (page > 1 && nextRooms.length === 0) break;
        loadedRooms.push(...nextRooms);
        const totalPages = Number(response.headers.get('X-WP-TotalPages'));
        if (totalPages > 0 ? page >= totalPages : json.length < 50) break;
      }
      if (cancelled) return;
      setDirectRoomsState((currentRooms) => [
        ...loadedRooms.map((room) => {
          const currentRoom = currentRooms.find((candidate) => candidate.postId === room.postId);
          return currentRoom ? { ...room, lastMessage: currentRoom.lastMessage || room.lastMessage } : room;
        }),
        ...currentRooms.filter((room) => !loadedRooms.some((loaded) => loaded.postId === room.postId)),
      ]);
    };

    loadDirectRooms();

    return () => {
      cancelled = true;
    };
  }, [currentUserId, request]);

  const openDirectMessage = useCallback(
    async (user) => {
      if (!user?.id || user.id === currentUserId) return;

      const { url, options } = DM_ROOM_POST(user.id);
      const { json, response } = await request(url, options);

      if (response?.ok && json?.room_id) {
        const directRoom = {
          postId: Number(json.room_id),
          title: user.name,
          type: 'direct',
          userId: Number(user.id),
          lastMessage: null,
        };

        setDirectRoomsState((rooms) => {
          const existingRoom = rooms.find(
            (room) => room.postId === directRoom.postId,
          );
          return [
            {
              ...directRoom,
              ...existingRoom,
              title: directRoom.title,
              userId: directRoom.userId,
            },
            ...rooms.filter((room) => room.postId !== directRoom.postId),
          ];
        });
        setActiveRoomState(directRoom);
        return;
      }

      console.error('Erro ao abrir conversa:', response?.statusText);
    },
    [currentUserId, request],
  );

  const openConversation = useCallback((conversation) => {
    setActiveRoomState(conversation);
  }, []);

  const registerDirectMessage = useCallback(
    (message) => {
      const roomId = Number(message?.room_id);
      if (!roomId) return;

      const members = Array.isArray(message.participants)
        ? message.participants
        : [];
      const otherMember = members.find(
        (member) => Number(member.id) !== Number(currentUserId),
      );
      const contact = otherMember ||
        (Number(message.user_id) !== Number(currentUserId)
          ? { id: message.user_id, name: message.sender }
          : null);

      setDirectRoomsState((rooms) => {
        const existingRoom = rooms.find((room) => room.postId === roomId);
        if (!existingRoom && !contact) return rooms;

        const updatedRoom = {
          ...(existingRoom || {}),
          postId: roomId,
          title: contact?.name || existingRoom.title,
          type: 'direct',
          userId: Number(contact?.id || existingRoom.userId),
          lastMessage: {
            message: message.msg,
            sender: message.sender,
            userId: Number(message.user_id),
          },
        };

        return [
          updatedRoom,
          ...rooms.filter((room) => room.postId !== roomId),
        ];
      });
    },
    [currentUserId],
  );

  const openMainRoom = useCallback(() => {
    setActiveRoomState(MAIN_CHAT_ROOM);
  }, []);

  return {
    activeRoomState,
    directRoomsState,
    openDirectMessage,
    openConversation,
    registerDirectMessage,
    openMainRoom,
  };
};

export { useChatRoom };
