import React from 'react';
import styles from './UserChat.module.css';

function UserMessages({
  data,
  messages,
  messagesContainerRef,
  hasMore,
  loadingOlder,
  onLoadOlder,
}) {
  return (
    <div className={styles.containerMsg} ref={messagesContainerRef}>
      {hasMore && (
        <button
          type="button"
          className={styles.loadOlder}
          onClick={onLoadOlder}
          disabled={loadingOlder}
        >
          {loadingOlder ? 'Carregando...' : 'Carregar mensagens antigas'}
        </button>
      )}

      {messages.map((msg) => {
        const isMyMessage = msg.userId === data?.id;
        const bubbleClass = isMyMessage ? styles.myBubble : styles.otherBubble;
        const rowClass = isMyMessage
          ? styles.myMessageRow
          : styles.otherMessageRow;
        const dateClass = isMyMessage ? styles.myDate : styles.otherDate;

        return (
          <div key={msg.id} className={`${styles.messageRow} ${rowClass}`}>
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
