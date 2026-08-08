import { Bell, BellOff, UsersRound } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { CHAT_IMAGE_POST, MESSAGE_REACTION_POST } from '../../../Api/index';
import { useChatNotifications } from '../../../ChatNotificationsContext';
import useFetch from '../../../Hooks/useFetch';
import { useUser } from '../../../UserContext';
import Head from '../../Helper/Head';
import { MAIN_CHAT_ROOM } from './chatConfig';
import { buildConnectedLabel, buildTypingLabel } from './chatLabels';
import { reconcileReactions } from './chatMessageUtils';
import { useChatMessages } from './useChatMessages';
import { useChatRoom } from './useChatRoom';
import { useChatSocket } from './useChatSocket';
import { useNotificationPermission } from './useNotificationPermission';
import styles from './UserChat.module.css';
import { UserChatList } from './UserChatList';
import { MessageInput } from './UserMessageInput';
import { UserMessages } from './UserMessages';

const UserChat = () => {
  const { data } = useUser();
  const { request } = useFetch();
  const { latestDirectMessage, unreadByRoom, markRoomRead } =
    useChatNotifications();
  const [messageState, setMessageState] = useState('');
  const messagesContainerRef = useRef(null);
  const userName = data?.nome || 'Usuário';

  const {
    supported: notificationsSupported,
    permission: notificationPermission,
    enabled: notificationsEnabled,
    requestPermission: requestNotificationPermission,
    toggleMute: toggleNotificationMute,
  } = useNotificationPermission();

  const notificationLabel = {
    default: 'Ativar notificações de mensagem',
    denied: 'Notificações bloqueadas. Libere no cadeado da barra de endereço.',
    granted: notificationsEnabled
      ? 'Notificações ativas. Clique para silenciar.'
      : 'Notificações silenciadas. Clique para reativar.',
  }[notificationPermission];

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
    updateMessageReactions,
    toggleMessageReaction,
  } = useChatMessages({
    roomId: activeRoomState.postId,
    request,
    onInitialLoad: scrollToLastMessage,
  });
  const {
    usersState,
    typingUsersState,
    connectionState,
    errorState,
    sendMessage,
    sendTyping,
    sendReaction,
  } = useChatSocket({
    roomId: activeRoomState.postId,
    currentUserId: data?.id,
    onMessage: (incomingMessage) => {
      addMessage(incomingMessage);
      scrollToLastMessage();
    },
    onReactionUpdate: ({ messageId, reactions }) => {
      updateMessageReactions(
        messageId,
        reconcileReactions(reactions, data?.id),
      );
    },
  });

  useEffect(() => {
    if (!latestDirectMessage) return;

    registerDirectMessage(latestDirectMessage);
    if (
      Number(activeRoomState.postId) === Number(latestDirectMessage.room_id)
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
    async (event, attachment = null) => {
      event.preventDefault();

      const text = messageState.trim();
      if ((!text && !attachment) || connectionState !== 'connected') return;

      const clientId =
        globalThis.crypto?.randomUUID?.() ||
        `${Date.now()}-${Math.random().toString(16).slice(2)}`;

      // A foto aparece como pendente com o preview local (objectURL) até o
      // servidor confirmar e a reconciliação por clientId trocar pela URL real.
      addPendingMessage({
        clientId,
        sender: userName,
        message: text,
        userId: data?.id,
        ...(attachment ? { type: 'image', imageUrl: attachment.preview } : {}),
      });
      setMessageState('');
      scrollToLastMessage();

      try {
        let attachmentPayload = null;

        if (attachment) {
          const { url, options } = CHAT_IMAGE_POST(
            activeRoomState.postId,
            attachment.file,
          );
          const { json, response } = await request(url, options);

          if (!response?.ok || !json?.url) {
            throw new Error(json?.message || 'Falha ao enviar a foto.');
          }

          attachmentPayload = { type: 'image', imageUrl: json.url };
        }

        const confirmedMessage = await sendMessage(
          text,
          clientId,
          attachmentPayload,
        );
        if (attachment) URL.revokeObjectURL(attachment.preview);
        if (confirmedMessage) {
          registerDirectMessage(confirmedMessage);
        }
      } catch {
        failPendingMessage(clientId);
      }
    },
    [
      activeRoomState.postId,
      addPendingMessage,
      connectionState,
      data?.id,
      failPendingMessage,
      messageState,
      registerDirectMessage,
      request,
      scrollToLastMessage,
      sendMessage,
      userName,
    ],
  );

  const handleToggleReaction = useCallback(
    async (messageId, emoji) => {
      if (!data?.id) return;

      toggleMessageReaction(messageId, emoji, data.id);

      try {
        const { url, options } = MESSAGE_REACTION_POST(messageId, emoji);
        const { json, response } = await request(url, options);

        if (response?.ok && Array.isArray(json?.reactions)) {
          const reactions = reconcileReactions(json.reactions, data.id);
          updateMessageReactions(messageId, reactions);
          sendReaction(messageId, reactions);
          return;
        }

        toggleMessageReaction(messageId, emoji, data.id);
        console.error('Erro ao reagir à mensagem:', response?.statusText);
      } catch (error) {
        toggleMessageReaction(messageId, emoji, data.id);
        console.error('Erro ao reagir à mensagem:', error);
      }
    },
    [
      data?.id,
      request,
      sendReaction,
      toggleMessageReaction,
      updateMessageReactions,
    ],
  );

  const peerIsPresent = usersState.some(
    (user) => Number(user.id) === Number(activeRoomState.userId),
  );
  const connectedLabel = buildConnectedLabel({
    roomType: activeRoomState.type,
    peerIsPresent,
    userCount: usersState.length,
  });
  const connectionLabel = {
    connected: connectedLabel,
    connecting: 'Conectando…',
    joining: 'Entrando na conversa…',
    disconnected: 'Reconectando…',
    error: 'Sem conexão',
  }[connectionState];

  const typingLabel = buildTypingLabel(
    typingUsersState.map((user) => user.name),
  );

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

          {notificationsSupported && (
            <button
              type="button"
              className={styles.notificationToggle}
              onClick={
                notificationPermission === 'default'
                  ? requestNotificationPermission
                  : toggleNotificationMute
              }
              disabled={notificationPermission === 'denied'}
              aria-pressed={notificationsEnabled}
              aria-label={notificationLabel}
              title={notificationLabel}
            >
              {notificationsEnabled ? (
                <Bell size={20} />
              ) : (
                <BellOff size={20} />
              )}
            </button>
          )}
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
          onToggleReaction={handleToggleReaction}
          roomType={activeRoomState.type}
        />

        <p className={styles.typingIndicator} role="status" aria-live="polite">
          {typingLabel && (
            <>
              <span className={styles.typingDots} aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
              {typingLabel}
            </>
          )}
        </p>

        <MessageInput
          message={messageState}
          setMessage={setMessageState}
          handleSubmit={handleSubmit}
          isConnected={connectionState === 'connected'}
          onTyping={sendTyping}
        />
      </div>
    </section>
  );
};

export { UserChat };
