import React from "react";
import styles from "./UserChat.module.css";
import { ReactComponent as Emoji } from "../../../Assets/emoji.svg";
import EmojiPicker from "emoji-picker-react";

function MessageInput({ message, setMessage, handleSubmit }) {
  const inputTextmessage = React.useRef(null);
  const pickerRef = React.useRef(null);
  const [showPicker, setShowPicker] = React.useState(false);

  const handleClickOutside = (event) => {
    if (pickerRef.current && !pickerRef.current.contains(event.target)) {
      // Clique fora do EmojiPicker, então feche-o
      setShowPicker(false);
    }
  };

  const togglePicker = () => {
    setShowPicker((val) => !val);
  };

  React.useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    // Remova event listeners quando o componente é desmontado
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const addEmojiToTextarea = (emojiObj) => {
    const textarea = inputTextmessage.current;
    const startPosition = textarea.selectionStart;
    const endPosition = textarea.selectionEnd;
    const messageValue = message;

    const updatedmessage =
      messageValue.substring(0, startPosition) +
      emojiObj.emoji +
      messageValue.substring(endPosition);

    setMessage(updatedmessage);
    setShowPicker(false);
    inputTextmessage.current.focus();
  };
  return (
    <>
      <form className={styles.containerSendMessage} onSubmit={handleSubmit}>
        <Emoji
          className={styles.btnEmoji}
          style={{ cursor: "pointer", width: "48px" }}
          onClick={togglePicker}
        />
        <textarea
          ref={inputTextmessage}
          style={{ resize: "none" }}
          className={styles.messageInput}
          placeholder="Digite sua mensagem..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault(); // Impede a quebra de linha padrão no textarea
              handleSubmit(e);
            }
          }}
        ></textarea>
        <button className={styles.sendButton}>Enviar</button>
      </form>
      {showPicker && (
        <div
          className={styles.emojiPicker}
          ref={pickerRef}
          style={{
            position: "absolute",
            zIndex: 12000,
            right: "50px",
            bottom: "75px",
            backgroundColor: "#fff",
            border: "1px solid #ccc",
            borderRadius: "4px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
          }}
        >
          <EmojiPicker
            height={400}
            width={500}
            pickerStyle={{ position: "absolute" }} // Aplicar o estilo personalizado aqui
            onEmojiClick={addEmojiToTextarea}
          />
        </div>
      )}
    </>
  );
}

export default MessageInput;
