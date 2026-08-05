import Cookies from 'js-cookie';
import { useCallback, useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import { ROOM_MESSAGE_GET } from '../../../Api/index';
import useFetch from '../../../Hooks/useFetch';
import { useUser } from '../../../UserContext';
import { formatDateMessage } from '../../../Utils/format-date-message';
import Head from '../../Helper/Head';
import styles from './UserChat.module.css';
import UserChatList from './UserChatList';
import MessageInput from './UserMessageInput';
import UserMessages from './UserMessages';

const urlApp = import.meta.env.VITE_APP_URL || 'http://localhost:3001';

const ROOM_ID = 210;
const ROOM_SOCKET_ID = 'SalaPrincipal';
const PAGE_SIZE = 50;

const toUiMessage = (msg) => ({
  id: msg.id,
  sender: msg.sender,
  message: msg.msg,
  userId: msg.user_id,
  date: formatDateMessage(new Date(String(msg.timestamp).replace(' ', 'T'))),
});

const mergeMessages = (current, incoming) => {
  const byId = new Map(current.map((msg) => [msg.id, msg]));
  incoming.forEach((msg) => byId.set(msg.id, msg));
  return [...byId.values()].sort((a, b) => a.id - b.id);
};

const UserChat = () => {
  const { data } = useUser();
  const { request } = useFetch();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [loadingOlder, setLoadingOlder] = useState(false);

  const messagesContainerRef = useRef(null);
  const socketRef = useRef(null);
  const messagesRef = useRef(messages);
  messagesRef.current = messages;

  const userName = data?.nome || 'Usuário';

  const scrollToLastMessage = useCallback(() => {
    if (messagesContainerRef.current) {
      const items = messagesContainerRef.current.querySelectorAll(
        `.${styles.messageRow}`,
      );
      if (items.length > 0) {
        items[items.length - 1].scrollIntoView({
          behavior: 'smooth',
          block: 'end',
        });
      }
    }
  }, []);

  const loadHistory = useCallback(
    async (beforeId) => {
      const { url, options } = ROOM_MESSAGE_GET(ROOM_ID, {
        perPage: PAGE_SIZE,
        beforeId,
      });
      const { json, response } = await request(url, options);

      if (response.ok && Array.isArray(json)) {
        setMessages((prev) => mergeMessages(prev, json.map(toUiMessage)));
        setHasMore(json.length === PAGE_SIZE);
        return json.length;
      }

      console.error('Erro ao carregar histórico:', response?.statusText);
      return 0;
    },
    [request],
  );

  useEffect(() => {
    loadHistory().then((count) => {
      if (count > 0) {
        setTimeout(scrollToLastMessage, 50);
      }
    });
  }, [loadHistory, scrollToLastMessage]);

  const loadOlderMessages = useCallback(async () => {
    const oldest = messagesRef.current[0];
    if (!oldest || loadingOlder) return;

    setLoadingOlder(true);
    await loadHistory(oldest.id);
    setLoadingOlder(false);
  }, [loadHistory, loadingOlder]);

  useEffect(() => {
    const socket = io(urlApp, {
      transports: ['websocket'],
      auth: { token: Cookies.get('token') },
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('joinRoom', { roomId: ROOM_SOCKET_ID, userName });
    });

    socket.on('connect_error', (err) => {
      console.error('[Socket]:', err.message);
    });

    socket.on('updateUsers', (updatedUsers) => {
      setUsers(updatedUsers);
    });

    socket.on('message', (msg) => {
      setMessages((prev) => mergeMessages(prev, [toUiMessage(msg)]));
      setTimeout(scrollToLastMessage, 50);
    });

    socket.on('joinedRoom', ({ users }) => {
      setUsers(users);
    });

    socket.on('error', (err) => {
      console.error('[Error]:', err);
    });

    return () => {
      socket.disconnect();
    };
  }, [userName, scrollToLastMessage]);

  // O envio vai só pelo socket: o servidor persiste no WP e devolve a mensagem
  // já com id do banco via broadcast. O input só limpa com ack de sucesso.
  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();

      const text = message.trim();
      if (!text || !socketRef.current) return;

      socketRef.current.emit(
        'message',
        { roomId: ROOM_SOCKET_ID, message: text },
        (ack) => {
          if (ack?.ok) {
            setMessage('');
          } else {
            console.error('Erro ao enviar mensagem:', ack?.error);
          }
        },
      );
    },
    [message],
  );

  return (
    <section className={`${styles.chatContainer} animeLeft`}>
      <UserChatList users={users} />
      <Head title="Chat" />
      <div className={styles.mainMsgContainer}>
        <div className={styles.headerContact}>
          <p className={styles.nameUserTarget}>Chat Room</p>
        </div>

        <UserMessages
          data={data}
          messages={messages}
          messagesContainerRef={messagesContainerRef}
          hasMore={hasMore}
          loadingOlder={loadingOlder}
          onLoadOlder={loadOlderMessages}
        />

        <MessageInput
          message={message}
          setMessage={setMessage}
          handleSubmit={handleSubmit}
        />
      </div>
    </section>
  );
};

export default UserChat;
