import { useCallback, useEffect, useRef, useState } from 'react';
import { useChatNotifications } from '../../../ChatNotificationsContext';
import { UsersRound } from 'lucide-react';
import useFetch from '../../../Hooks/useFetch';
import { useUser } from '../../../UserContext';
import Head from '../../Helper/Head';
import { MAIN_CHAT_ROOM } from './chatConfig';
import styles from './UserChat.module.css';
import { UserChatList } from './UserChatList';
import { MessageInput } from './UserMessageInput';
import { UserMessages } from './UserMessages';
import { useChatMessages } from './useChatMessages';
import { useChatRoom } from './useChatRoom';
import { useChatSocket } from './useChatSocket';

const UserChat = () => {
  const { data } = useUser();
  const { request } = useFetch();
  const {
    latestDirectMessage,
    unreadByRoom,
    markRoomRead,
  } = useChatNotifications();
  const [messageState, setMessageState] = useState('');
  const messagesContainerRef = useRef(null);
  const userName = data?.nome || 'Usuário';

  const scrollToLastMessage = useCallback(() => {
    setTimeout(() => {
      const messageRows = messagesContainerRef.current?.querySelectorAll(
        `.${styles.messageRow}`,
      );
      const lastMessage = messageRows?.[messageRows.length - 1];

      lastMessage?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 50);
  }, []);

  const {
    activeRoomState,
    directRoomsState,
    openDirectMessage,
    openConversation,
    registerDirectMessage,
    openMainRoom,
  } = useChatRoom({ currentUserId: data?.id, request });
  const {
    messagesState,
    hasMoreState,
    loadingOlderState,
    loadOlderMessages,
    addMessage,
    addPendingMessage,
    failPendingMessage,
  } = useChatMessages({
    roomId: activeRoomState.postId,
    request,
    onInitialLoad: scrollToLastMessage,
  });
  const { usersState, connectionState, errorState, sendMessage } = useChatSocket({
    roomId: activeRoomState.postId,
    onMessage: (incomingMessage) => {
      addMessage(incomingMessage);
      scrollToLastMessage();
    },
  });

  useEffect(() => {
    if (!latestDirectMessage) return;

    registerDirectMessage(latestDirectMessage);
    if (
      Number(activeRoomState.postId) ===
      Number(latestDirectMessage.room_id)
    ) {
      markRoomRead(activeRoomState.postId);
    }
  }, [
    activeRoomState.postId,
    latestDirectMessage,
    markRoomRead,
    registerDirectMessage,
  ]);

  useEffect(() => {
    if (activeRoomState.type === 'direct') {
      markRoomRead(activeRoomState.postId);
    }
  }, [activeRoomState.postId, activeRoomState.type, markRoomRead]);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      const text = messageState.trim();
      if (!text || connectionState !== 'connected') return;

      const clientId = globalThis.crypto?.randomUUID?.() ||
        `${Date.now()}-${Math.random().toString(16).slice(2)}`;

      addPendingMessage({
        clientId,
        sender: userName,
        message: text,
        userId: data?.id,
      });
      setMessageState('');
      scrollToLastMessage();

      try {
        const confirmedMessage = await sendMessage(text, clientId);
        if (confirmedMessage) {
          registerDirectMessage(confirmedMessage);
        }
      } catch {
        failPendingMessage(clientId);
      }
    },
    [
      addPendingMessage,
      connectionState,
      data?.id,
      failPendingMessage,
      messageState,
      registerDirectMessage,
      scrollToLastMessage,
      sendMessage,
      userName,
    ],
  );

  const peerIsPresent = usersState.some(
    (user) => Number(user.id) === Number(activeRoomState.userId),
  );
  const connectedLabel =
    activeRoomState.type === 'direct'
      ? peerIsPresent
        ? 'Online nesta conversa'
        : 'Aguardando a outra pessoa'
      : usersState.length <= 1
        ? 'Só você está na sala'
        : `${usersState.length} pessoas na sala`;
  const connectionLabel = {
    connected: connectedLabel,
    connecting: 'Conectando…',
    joining: 'Entrando na conversa…',
    disconnected: 'Reconectando…',
    error: 'Sem conexão',
  }[connectionState];

  return (
    <section className={`${styles.chatContainer} animeLeft`}>
      <UserChatList
        users={usersState}
        conversations={directRoomsState}
        unreadByRoom={unreadByRoom}
        currentUserId={data?.id}
        activeRoomPostId={activeRoomState.postId}
        mainRoomPostId={MAIN_CHAT_ROOM.postId}
        onSelectUser={openDirectMessage}
        onSelectConversation={openConversation}
        onSelectMainRoom={openMainRoom}
      />
      <Head title="Chat" />
      <div className={styles.mainMsgContainer}>
        <div className={styles.headerContact}>
          <div
            className={`${styles.headerAvatar} ${
              activeRoomState.type === 'main'
                ? styles.groupAvatar
                : styles.directAvatar
            }`}
            aria-hidden="true"
          >
            {activeRoomState.type === 'main' ? (
              <UsersRound size={21} />
            ) : (
              activeRoomState.title.charAt(0).toUpperCase()
            )}
          </div>
          <div className={styles.headerRoomInfo}>
            <div className={styles.headerTitleRow}>
              <p className={styles.nameUserTarget}>{activeRoomState.title}</p>
              <span className={styles.roomTypeBadge}>
                {activeRoomState.type === 'main' ? 'Grupo' : 'Privado'}
              </span>
            </div>
            <p className={styles.connectionStatus} data-state={connectionState}>
              <span aria-hidden="true" /> {connectionLabel}
            </p>
          </div>
        </div>

        {errorState && (
          <p className={styles.chatError} role="status">
            {errorState}
          </p>
        )}

        <UserMessages
          data={data}
          messages={messagesState}
          messagesContainerRef={messagesContainerRef}
          hasMore={hasMoreState}
          loadingOlder={loadingOlderState}
          onLoadOlder={loadOlderMessages}
          roomType={activeRoomState.type}
        />

        <MessageInput
          message={messageState}
          setMessage={setMessageState}
          handleSubmit={handleSubmit}
          isConnected={connectionState === 'connected'}
        />
      </div>
    </section>
  );
};

export { UserChat };
