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
  } = useChatMessages({
    roomId: activeRoomState.postId,
    request,
    onInitialLoad: scrollToLastMessage,
  });
  const { usersState, sendMessage } = useChatSocket({
    roomId: activeRoomState.postId,
    userName,
    onMessage: (incomingMessage) => {
      addMessage(incomingMessage);
      scrollToLastMessage();
    },
  });

  // O envio vai só pelo socket: o servidor persiste no WP e devolve a mensagem
  // já com id do banco via broadcast. O input só limpa com ack de sucesso.
  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();

      const text = messageState.trim();
      if (!text) return;

      sendMessage(text, () => setMessageState(''));
    },
    [messageState, sendMessage],
  );

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
          <p className={styles.nameUserTarget}>{activeRoomState.title}</p>
        </div>

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
        />
      </div>
    </section>
  );
};

export { UserChat };
