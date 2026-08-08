import EmojiPicker from 'emoji-picker-react';
import { ImagePlus, Smile, X } from 'lucide-react';
import { memo, useEffect, useRef, useState } from 'react';
import styles from './UserChat.module.css';

const MemoizedEmojiPicker = memo(EmojiPicker);

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

function MessageInput({ message, setMessage, handleSubmit, isConnected, onTyping }) {
  const inputTextmessage = useRef(null);
  const pickerRef = useRef(null);
  const emojiButtonRef = useRef(null);
  const [showPickerState, setShowPickerState] = useState(false);
  const typingSentAtRef = useRef(0);
  const typingTimeoutRef = useRef(null);
  const fileInputRef = useRef(null);
  const [attachmentState, setAttachmentState] = useState(null);
  const [attachmentErrorState, setAttachmentErrorState] = useState('');
  const attachmentRef = useRef(null);
  attachmentRef.current = attachmentState;

  const notifyTyping = () => {
    if (!onTyping) return;

    const now = Date.now();
    if (now - typingSentAtRef.current >= 2000) {
      typingSentAtRef.current = now;
      onTyping(true);
    }

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      typingSentAtRef.current = 0;
      onTyping(false);
    }, 3000);
  };

  const stopTyping = () => {
    clearTimeout(typingTimeoutRef.current);
    if (onTyping && typingSentAtRef.current > 0) {
      typingSentAtRef.current = 0;
      onTyping(false);
    }
  };

  const handleSend = (event) => {
    stopTyping();

    const attachment = attachmentState;
    handleSubmit(
      event,
      attachment ? { file: attachment.file, preview: attachment.preview } : null,
    );

    if (attachment) {
      // O preview local segue vivo na mensagem pendente; o UserChat revoga
      // o objectURL quando a mensagem for confirmada.
      attachmentRef.current = null;
      setAttachmentState(null);
    }
  };

  const handleImagePick = ({ target }) => {
    const file = target.files?.[0];
    target.value = '';

    if (!file) return;

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setAttachmentErrorState(
        'Formato não suportado. O gatinho só posa em JPEG, PNG ou WebP.',
      );
      return;
    }

    if (file.size > MAX_IMAGE_BYTES) {
      setAttachmentErrorState('A foto do gatinho não pode passar de 5 MB.');
      return;
    }

    if (attachmentState?.preview) URL.revokeObjectURL(attachmentState.preview);
    setAttachmentState({ file, preview: URL.createObjectURL(file) });
    setAttachmentErrorState('');
  };

  const removeAttachment = () => {
    if (attachmentState?.preview) URL.revokeObjectURL(attachmentState.preview);
    attachmentRef.current = null;
    setAttachmentState(null);
    setAttachmentErrorState('');
  };

  const handleClickOutside = (event) => {
    if (emojiButtonRef.current?.contains(event.target)) return;

    if (pickerRef.current && !pickerRef.current.contains(event.target)) {
      setShowPickerState(false);
    }
  };

  const togglePicker = () => {
    setShowPickerState((currentState) => !currentState);
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
    if (showPickerState && pickerRef.current) {
      pickerRef.current.focus();
    }
  }, [showPickerState]);

  useEffect(() => {
    return () => {
      clearTimeout(typingTimeoutRef.current);
      if (attachmentRef.current?.preview) {
        URL.revokeObjectURL(attachmentRef.current.preview);
      }
    };
  }, []);

  return (
    <>
      {attachmentState && (
        <div className={styles.attachmentPreview}>
          <img
            className={styles.attachmentThumb}
            src={attachmentState.preview}
            alt="Prévia da foto do gatinho"
          />
          <span className={styles.attachmentHint}>
            Foto pronta para miar! Escreva uma legenda ao lado, se quiser.
          </span>
          <button
            type="button"
            className={styles.attachmentRemove}
            onClick={removeAttachment}
            aria-label="Remover foto anexada"
          >
            <X size={16} />
          </button>
        </div>
      )}
      {attachmentErrorState && (
        <p className={styles.attachmentError} role="alert">
          {attachmentErrorState}
        </p>
      )}
      <form className={styles.containerSendMessage} onSubmit={handleSend}>
        <button
          type="button"
          className={styles.iconButton}
          onClick={() => fileInputRef.current?.click()}
          disabled={!isConnected}
          aria-label="Anexar foto do gatinho"
        >
          <ImagePlus size={22} />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className={styles.fileInput}
          onChange={handleImagePick}
          tabIndex={-1}
          aria-hidden="true"
        />
        <button
          ref={emojiButtonRef}
          type="button"
          className={`${styles.iconButton} ${styles.emojiToggle}`}
          onClick={togglePicker}
          disabled={!isConnected}
          aria-label="Abrir lista de emojis"
          aria-expanded={showPickerState}
        >
          <Smile size={22} />
        </button>
        <label htmlFor="message-input" className="sr-only">
          Digite sua mensagem
        </label>
        <textarea
          id="message-input"
          ref={inputTextmessage}
          style={{ resize: 'none' }}
          className={styles.messageInput}
          placeholder={
            isConnected ? 'Digite sua mensagem...' : 'Reconectando ao chat...'
          }
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            if (e.target.value.trim()) {
              notifyTyping();
            } else {
              stopTyping();
            }
          }}
          disabled={!isConnected}
          maxLength={1000}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend(e);
            }
          }}
        ></textarea>
        <button
          className={styles.sendButton}
          disabled={!isConnected || (!message.trim() && !attachmentState)}
        >
          Enviar
        </button>
        {message.length > 900 && (
          <span className={styles.charCount}>{message.length}/1000</span>
        )}
      </form>
      {showPickerState && (
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

export { MessageInput };
