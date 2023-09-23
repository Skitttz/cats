import React from "react";
import io from "socket.io-client";
import styles from "./UserChat.module.css";
import Head from "../../Helper/Head";
import UserPhoto2 from "../../../Assets/cats.svg";
import { useUser } from "../../../UserContext";
import useFetch from "../../../Hooks/useFetch";
import { ROOM_MESSAGE_GET, ROOM_MESSAGE_POST } from "../../../Api";
import UserChatList from "./UserChatList";
import MessageInput from "./UserMessageInput";
import UserMessages from "./UserMessages";
import formatDate from "./UserChatDate";

const socket = io("http://localhost:3000/");

const UserChat = () => {
  const [message, setMessage] = React.useState("");
  const [messages, setMessages] = React.useState([]);
  const { data } = useUser();
  const { request } = useFetch();
  const [messageHistoryLoaded, setMessageHistoryLoaded] = React.useState(false);
  const messagesContainerRef = React.useRef(null);

  const [users, setUsers] = React.useState([]); // Lista de usuários na sala
  const userName = data.nome; // Nome do usuário obtido de data.nome
  const roomId = "SalaPrincipal"; // ID da sala (você pode definir isso como quiser)
  const localDate = formatDate(new Date());

  const scrollToLastMessage = () => {
    if (messagesContainerRef.current) {
      const messages = messagesContainerRef.current.querySelectorAll(
        `.${styles.message}`
      );
      if (messages.length > 0) {
        const lastMessage = messages[messages.length - 1];
        lastMessage.scrollIntoView({ block: "nearest" });
      }
    }
  };

  React.useEffect(() => {
    socket.on("connect", () => {});
    socket.emit("joinRoom", roomId, userName);
    socket.on("updateUsers", (updatedUsers) => {
      setUsers(updatedUsers);
    });

    socket.on("message", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });
    return () => {
      socket.off("message");
    };
  }, [roomId, userName]);

  React.useEffect(() => {
    // Carregue o histórico de mensagens somente se ainda não foi carregado
    if (!messageHistoryLoaded) {
      const loadMessageHistory = async () => {
        const { url, options } = ROOM_MESSAGE_GET(210); // Substitua 210 pelo ID da sala relevante
        const { json, response } = await request(url, options);

        try {
          if (response.ok && json != null) {
            const transformedMessages = json.map((item) => ({
              sender: item.sender,
              message: item.msg, // Mapeie 'msg' para 'message'
              date: item.timestamp,
            }));
            if (Array.isArray(transformedMessages)) {
              // Se a resposta for um array, adicione-a às mensagens existentes.
              setMessages((prevMessages) => [
                ...prevMessages,
                ...transformedMessages,
              ]);
            } else if (typeof transformedMessages === "object") {
              // Se a resposta for um objeto (uma única mensagem), coloque-a em um array e adicione-a às mensagens existentes.
              setMessages((prevMessages) => [
                ...prevMessages,
                transformedMessages,
              ]);
            } else {
              console.error(
                "Dados do servidor não são um array ou objeto:",
                transformedMessages
              );
            }
            setMessageHistoryLoaded(true);
          } else {
            console.error("Erro na resposta do servidor:", response.statusText);
          }
        } catch (error) {
          console.error("Erro ao carregar o histórico de mensagens:", error);
          // Trate o erro de forma apropriada, como exibir uma mensagem de erro para o usuário.
        }
      };
      loadMessageHistory();
    }
    scrollToLastMessage();
  }, [messageHistoryLoaded, request]);

  const sendMessage = () => {
    if (message.trim() !== "") {
      // Configurar os dados que serão enviados no corpo da solicitação
      socket.emit("message", {
        sender: data.nome,
        message: message,
        date: localDate,
      });
      setMessage("");
    }
  };

  function handleSubmit(event) {
    event.preventDefault();
    const requestBody = {
      msg: message, // Nomeie o campo de acordo com o esperado pelo seu endpoint
      id: 210, // Substitua 1 pelo ID da sala de chat relevante
    };
    const { url, options } = ROOM_MESSAGE_POST(210, requestBody);
    request(url, options);
    sendMessage();
    setTimeout(() => {
      scrollToLastMessage();
    }, 10);
  }

  return (
    <section className={`${styles.chatContainer} animeLeft`}>
      <UserChatList users={users} />
      <Head title="Chat" />
      <title className="title">Chat</title>
      <div className={styles.mainMsgContainer}>
        <div className={styles.headerContact}>
          <p className={styles.nameUserTarget}>Chat Room</p>
          <img src={UserPhoto2} alt="" />
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
