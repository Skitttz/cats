import { useState } from 'react';
import styles from './UserChat.module.css';
import { UserMessageReactions } from './UserMessageReactions';

function ChatMessageImage({ src, alt }) {
  const [loadedState, setLoadedState] = useState(false);

  return (
    <span className={styles.messageImageWrap}>
      {!loadedState && (
        <span className={styles.messageImageSkeleton} aria-hidden="true" />
      )}
      <img
        className={styles.messageImage}
        src={src}
        alt={alt}
        loading="lazy"
        style={loadedState ? undefined : { opacity: 0 }}
        onLoad={() => setLoadedState(true)}
      />
    </span>
  );
}

function UserMessages({
  data,
  messages,
  messagesContainerRef,
  hasMore,
  loadingOlder,
  onLoadOlder,
  onToggleReaction,
  roomType,
}) {
  const [pickerForState, setPickerForState] = useState(null);

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
        const stackClass = isMyMessage ? styles.myStack : styles.otherStack;
        const dateClass = isMyMessage ? styles.myDate : styles.otherDate;
        // Só mensagens já persistidas (id numérico) aceitam reação.
        const canReact = Number.isSafeInteger(Number(msg.id));

        return (
          <div key={msg.id} className={`${styles.messageRow} ${rowClass}`}>
            <div className={`${styles.messageStack} ${stackClass}`}>
              <div className={`${styles.messageBubble} ${bubbleClass}`}>
                {!isMyMessage && roomType === 'main' && (
                  <span className={styles.senderName}>{msg.sender}</span>
                )}

                {msg.type === 'image' && msg.imageUrl && (
                  <a
                    className={styles.messageImageLink}
                    href={msg.imageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Abrir a foto enviada por ${msg.sender} em nova aba`}
                  >
                    <ChatMessageImage
                      src={msg.imageUrl}
                      alt={`Foto do gatinho enviada por ${msg.sender}`}
                    />
                  </a>
                )}

                {msg.message && (
                  <p className={styles.messageText}>{msg.message}</p>
                )}

                <span className={`${styles.messageDate} ${dateClass}`}>
                  {msg.date}
                </span>
                {isMyMessage && msg.status !== 'sent' && (
                  <span
                    className={`${styles.deliveryStatus} ${
                      msg.status === 'failed' ? styles.deliveryFailed : ''
                    }`}
                  >
                    {msg.status === 'failed' ? 'Não enviada' : 'Enviando…'}
                  </span>
                )}
              </div>

              <UserMessageReactions
                message={msg}
                canReact={canReact}
                pickerOpen={pickerForState === msg.id}
                onPickerToggle={() =>
                  setPickerForState((current) =>
                    current === msg.id ? null : msg.id,
                  )
                }
                onToggleReaction={(emoji) => {
                  setPickerForState(null);
                  onToggleReaction(msg.id, emoji);
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export { UserMessages };
