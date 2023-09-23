import React from "react";
import styles from "./UserChat.module.css";

function UserMessages({ data, messages, messagesContainerRef }) {
  return (
    <div className={styles.containerMsg} ref={messagesContainerRef}>
      {messages.map((msg, index) => (
        <div
          className={
            msg.sender === data.nome
              ? `${styles.containerMsgMySelf}`
              : `${styles.containerMsgOther} `
          }
          key={`message_${index}`} // Chave única para a div da mensagem
        >
          <div
            key={`sender_${index}`} // Chave única para o nome do remetente
            className={styles.sender}
            style={{ fontWeight: 700 }}
          >
            {msg.sender === data.nome ? "" : `${msg.sender}`}
          </div>
          <div className={styles.containerMsgAndDate}>
            <div
              key={`text_${msg.id}`} // Chave única para o texto da mensagem
              style={{ marginBottom: "8px", wordBreak: "break-all" }}
              className={
                msg.sender === data.nome
                  ? `${styles.msgMyself} ${styles.message} `
                  : `${styles.msgUnique} ${styles.message} `
              }
            >
              <p
                style={{ wordBreak: "break-all" }}
                className={styles.messageText}
              >
                {msg.message}
              </p>

              <span
                style={{
                  marginBottom: "2px",
                }}
                className={
                  msg.sender === data.nome
                    ? `${styles.messageDate}  `
                    : `${styles.messageDate} ${styles.messageDateOther}   `
                }
              >
                {msg.date}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default UserMessages;
