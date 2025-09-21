import EmojiPicker from 'emoji-picker-react';
import { memo, useEffect, useRef, useState } from 'react';
import Emoji from '../../../Assets/emoji.svg';
import styles from './UserChat.module.css';

const MemoizedEmojiPicker = memo(EmojiPicker);

function MessageInput({ message, setMessage, handleSubmit }) {
  const inputTextmessage = useRef(null);
  const pickerRef = useRef(null);
  const [showPicker, setShowPicker] = useState(false);

  const handleClickOutside = (event) => {
    if (pickerRef.current && !pickerRef.current.contains(event.target)) {
      setShowPicker(false);
    }
  };

  const togglePicker = () => {
    setShowPicker((val) => !val);
  };

  const addEmojiToTextarea = (emojiObj) => {
    const textarea = inputTextmessage.current;
    const startPosition = textarea.selectionStart;
    const endPosition = textarea.selectionEnd;
    const messageValue = message;

    const updatedMessage =
      messageValue.substring(0, startPosition) +
      emojiObj.emoji +
      messageValue.substring(endPosition);

    setMessage(updatedMessage);
    setTimeout(() => {
      textarea.selectionStart = startPosition + emojiObj.emoji.length;
      textarea.selectionEnd = startPosition + emojiObj.emoji.length;
      textarea.focus();
    }, 0);
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (showPicker && pickerRef.current) {
      pickerRef.current.focus();
    }
  }, [showPicker]);

  return (
    <>
      <form className={styles.containerSendMessage} onSubmit={handleSubmit}>
        <Emoji
          className={styles.btnEmoji}
          style={{ cursor: 'pointer', width: '48px' }}
          onClick={togglePicker}
          role="button"
          aria-label="Abrir Lista de Emojis"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              togglePicker();
            }
          }}
        />
        <label htmlFor="message-input" className="sr-only">
          Digite sua mensagem
        </label>
        <textarea
          id="message-input"
          ref={inputTextmessage}
          style={{ resize: 'none' }}
          className={styles.messageInput}
          placeholder="Digite sua mensagem..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={1000}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        ></textarea>
        <button className={styles.sendButton} disabled={!message.trim()}>
          Enviar
        </button>
        {message.length > 900 && (
          <span className={styles.charCount}>{message.length}/1000</span>
        )}
      </form>
      {showPicker && (
        <div className={styles.emojiPicker} ref={pickerRef}>
          <MemoizedEmojiPicker
            height={400}
            width={500}
            onEmojiClick={addEmojiToTextarea}
            theme="auto"
          />
        </div>
      )}
    </>
  );
}

export default MessageInput;
