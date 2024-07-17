import React from 'react';
import Enviar from '../../Assets/enviar.svg';
import Emoji from '../../Assets/emoji.svg';
import { COMMENT_POST } from '../../Api/index';
import useFetch from '../../Hooks/useFetch';
import Error from '../Helper/Error';
import styles from './PhotoCommentsForm.module.css';
import EmojiPicker from 'emoji-picker-react';

const PhotoCommentsForm = ({ id, setComments, single }) => {
  const [comment, setComment] = React.useState('');
  const pickerRef = React.useRef(null);
  const { request, error } = useFetch();
  const inputTextComment = React.useRef(null);
  const [showPicker, setShowPicker] = React.useState(false);

  const handleClickOutside = (event) => {
    if (pickerRef.current && !pickerRef.current.contains(event.target)) {
      // Clique fora do EmojiPicker, então feche-o
      setShowPicker(false);
    }
  };

  React.useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    // Remova event listeners quando o componente é desmontado
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const addEmojiToTextarea = (emojiObj) => {
    const textarea = inputTextComment.current;
    const startPosition = textarea.selectionStart;
    const endPosition = textarea.selectionEnd;
    const commentValue = comment;

    const updatedComment =
      commentValue.substring(0, startPosition) +
      emojiObj.emoji +
      commentValue.substring(endPosition);

    setComment(updatedComment);
    setShowPicker(false);
    inputTextComment.current.focus();
  };

  async function handleSubmit(event) {
    event.preventDefault();
    const { url, options } = COMMENT_POST(id, { comment });
    const { response, json } = await request(url, options);
    if (response.ok) {
      setComment('');
      setComments((comments) => [...comments, json]);
    }
  }

  function handleOutSideEmoji(event) {
    if (EmojiPicker && !EmojiPicker.contains(event.target)) {
      setShowPicker(false);
    }
  }

  const togglePicker = () => {
    setShowPicker((val) => !val);
  };

  return (
    <>
      <form
        className={`${styles.form} ${single ? styles.single : styles.normal}`}
        onSubmit={handleSubmit}
      >
        <div className={styles.line}>
          {error ? (
            <span
              style={{ color: '#ff5733', fontWeight: 530, fontSize: '0.8rem' }}
              className="animeComments"
            >
              Ops! Para continuar insira algo. 😺
            </span>
          ) : (
            ' '
          )}
        </div>
        <textarea
          className={styles.textArea}
          ref={inputTextComment}
          id="comment"
          name="comment"
          placeholder="Adicione um comentário..."
          value={comment}
          onChange={({ target }) => setComment(target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault(); // Impede a quebra de linha padrão no textarea
              handleSubmit(e);
            }
          }}
        />
        {comment ? (
          <button className={styles.btn} id="submitButton">
            <Enviar />
          </button>
        ) : (
          <button className={`${styles.btn} ${styles.disabled}`}>
            <Enviar />
          </button>
        )}

        <Emoji
          className={styles.btnEmoji}
          style={{ cursor: 'pointer' }}
          onClick={togglePicker}
        />
      </form>

      {showPicker && (
        <div
          ref={pickerRef}
          className={styles.emojiPicker}
          style={{
            position: 'absolute',
            zIndex: 12000,
            right: '50px',
            bottom: '75px',
            backgroundColor: '#fff',
            border: '1px solid #ccc',
            borderRadius: '4px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
          }}
        >
          <EmojiPicker
            height={400}
            width={500}
            pickerStyle={{ position: 'absolute' }} // Aplicar o estilo personalizado aqui
            onEmojiClick={addEmojiToTextarea}
          />
        </div>
      )}
    </>
  );
};

export default PhotoCommentsForm;
