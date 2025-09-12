import React from 'react';
import styles from './UserChat.module.css';

function UserMessages({ data, messages, messagesContainerRef }) {
  return (
    <div className={styles.containerMsg} ref={messagesContainerRef}>
      {messages.map((msg, index) => {
        const isMyMessage = msg.sender === data.nome;
        const bubbleClass = isMyMessage ? styles.myBubble : styles.otherBubble;
        const rowClass = isMyMessage
          ? styles.myMessageRow
          : styles.otherMessageRow;
        const dateClass = isMyMessage ? styles.myDate : styles.otherDate;

        return (
          <div
            key={`message_${index}`}
            className={`${styles.messageRow} ${rowClass}`}
          >
            {/* {!isMyMessage && (
              <img
                src={msg.avatar || '/default-avatar.png'}
                alt="avatar"
                className={styles.avatar}
              />
            )} */}

            <div className={`${styles.messageBubble} ${bubbleClass}`}>
              {!isMyMessage && (
                <span className={styles.senderName}>{msg.sender}</span>
              )}

              <p className={styles.messageText}>{msg.message}</p>

              <span className={`${styles.messageDate} ${dateClass}`}>
                {msg.date}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default UserMessages;
