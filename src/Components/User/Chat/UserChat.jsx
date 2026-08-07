import { useCallback, useRef, useState } from 'react';
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

  const { activeRoomState, openDirectMessage, openMainRoom } = useChatRoom({
    currentUserId: data?.id,
    request,
  });
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
        await sendMessage(text, clientId);
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
      scrollToLastMessage,
      sendMessage,
      userName,
    ],
  );

  const connectionLabel = {
    connected: `${usersState.length} online`,
    connecting: 'Conectando…',
    joining: 'Entrando na conversa…',
    disconnected: 'Reconectando…',
    error: 'Sem conexão',
  }[connectionState];

  return (
    <section className={`${styles.chatContainer} animeLeft`}>
      <UserChatList
        users={usersState}
        currentUserId={data?.id}
        activeRoomPostId={activeRoomState.postId}
        mainRoomPostId={MAIN_CHAT_ROOM.postId}
        onSelectUser={openDirectMessage}
        onSelectMainRoom={openMainRoom}
      />
      <Head title="Chat" />
      <div className={styles.mainMsgContainer}>
        <div className={styles.headerContact}>
          <div>
            <p className={styles.nameUserTarget}>{activeRoomState.title}</p>
            <p className={styles.connectionStatus} data-state={connectionState}>
              <span aria-hidden="true" />
              {connectionLabel}
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
