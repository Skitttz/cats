import { useCallback, useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import { ROOM_MESSAGE_GET, ROOM_MESSAGE_POST } from '../../../Api/index';
import UserPhoto2 from '../../../Assets/cats.svg';
import useFetch from '../../../Hooks/useFetch';
import { useUser } from '../../../UserContext';
import Head from '../../Helper/Head';
import styles from './UserChat.module.css';
import formatDate from './UserChatDate';
import UserChatList from './UserChatList';
import MessageInput from './UserMessageInput';
import UserMessages from './UserMessages';

const urlApp = import.meta.env.VITE_APP_URL || 'http://localhost:3001';

const UserChat = () => {
  const { data } = useUser();
  const { request } = useFetch();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [messageHistoryLoaded, setMessageHistoryLoaded] = useState(false);

  const messagesContainerRef = useRef(null);
  const socketRef = useRef(null);

  const userName = data?.nome || `Usuário_${new Date()}`;
  const roomId = 'SalaPrincipal';
  const localDate = formatDate(new Date());

  // Rolagem automática para última mensagem
  const scrollToLastMessage = useCallback(() => {
    if (messagesContainerRef.current) {
      const items = messagesContainerRef.current.querySelectorAll(
        `.${styles.message}`,
      );
      if (items.length > 0) {
        items[items.length - 1].scrollIntoView({
          behavior: 'smooth',
          block: 'end',
        });
      }
    }
  }, []);

  // Função para normalizar formato das mensagens
  const normalizeMessage = useCallback((messageData) => {
    return {
      sender: messageData.sender,
      message: messageData.message || messageData.msg, // Aceita tanto 'message' quanto 'msg'
      date: messageData.date || messageData.timestamp, // Aceita tanto 'date' quanto 'timestamp'
    };
  }, []);

  // Inicializar socket
  useEffect(() => {
    const socket = io(urlApp, { transports: ['websocket'] });
    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('joinRoom', { roomId, userName });
    });

    socket.on('updateUsers', (updatedUsers) => {
      setUsers(updatedUsers);
    });

    socket.on('message', (data) => {
      const normalizedMessage = normalizeMessage(data);
      setMessages((prev) => [...prev, normalizedMessage]);
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
  }, [roomId, userName, scrollToLastMessage, normalizeMessage]);

  useEffect(() => {
    if (!messageHistoryLoaded) {
      const loadHistory = async () => {
        const { url, options } = ROOM_MESSAGE_GET(210);
        const { json, response } = await request(url, options);

        if (response.ok && json) {
          // Corrigindo a transformação dos dados do histórico
          const transformed = json.map((item) => ({
            sender: item.sender,
            message: item.msg, // Usando 'msg' como vem da API
            date: item.timestamp, // Usando 'timestamp' como vem da API
          }));

          setMessages((prev) => [...prev, ...transformed]);
          setMessageHistoryLoaded(true);
          setTimeout(scrollToLastMessage, 50);
        } else {
          console.error('Erro ao carregar histórico:', response?.statusText);
        }
      };
      loadHistory();
    }
  }, [messageHistoryLoaded, request, scrollToLastMessage]);

  const sendMessage = useCallback(() => {
    if (message.trim() !== '' && socketRef.current) {
      // Enviando no formato que o socket espera
      socketRef.current.emit('message', {
        message, // ou msg: message, dependendo do que o servidor espera
        roomId,
        sender: userName, // Garantindo que o sender seja enviado
        timestamp: localDate, // ou date: localDate, dependendo do que o servidor espera
      });
      setMessage('');
    }
  }, [message, roomId, userName, localDate]);

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();

      const requestBody = {
        msg: message,
        id: 210,
        sender: data?.nome || userName, // Fallback para userName
        date: localDate,
      };

      const { url, options } = ROOM_MESSAGE_POST(210, { ...requestBody });
      request(url, options);

      sendMessage();
    },
    [message, data?.nome, userName, localDate, request, sendMessage],
  );

  return (
    <section className={`${styles.chatContainer} animeLeft`}>
      <UserChatList users={users} />
      <Head title="Chat" />
      <div className={styles.mainMsgContainer}>
        <div className={styles.headerContact}>
          <p className={styles.nameUserTarget}>Chat Room</p>
          <img src={UserPhoto2} alt="Chat" />
        </div>

        <UserMessages
          data={data}
          messages={messages}
          messagesContainerRef={messagesContainerRef}
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
