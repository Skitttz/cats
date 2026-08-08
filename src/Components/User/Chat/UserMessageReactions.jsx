import { QUICK_REACTIONS } from './chatConfig';
import styles from './UserChat.module.css';

const reactionLabel = (emoji) =>
  QUICK_REACTIONS.find((reaction) => reaction.emoji === emoji)?.label ||
  'emoji';

function UserMessageReactions({
  message,
  canReact,
  pickerOpen,
  onPickerToggle,
  onToggleReaction,
}) {
  const reactions = Array.isArray(message.reactions) ? message.reactions : [];

  return (
    <div className={styles.reactionBar}>
      {reactions.length > 0 && (
        <div className={styles.reactionList}>
          {reactions.map((reaction) => (
            <button
              key={reaction.emoji}
              type="button"
              className={`${styles.reactionChip} ${
                reaction.reactedByMe ? styles.reactionChipMine : ''
              }`}
              aria-pressed={reaction.reactedByMe}
              aria-label={`Reagir com ${reactionLabel(reaction.emoji)}, ${
                reaction.count
              } ${reaction.count === 1 ? 'reação' : 'reações'}`}
              onClick={() => onToggleReaction(reaction.emoji)}
            >
              <span aria-hidden="true">{reaction.emoji}</span>
              <span>{reaction.count}</span>
            </button>
          ))}
        </div>
      )}

      {canReact && (
        <div className={styles.reactionPickerWrap}>
          <button
            type="button"
            className={styles.reactionTrigger}
            aria-label="Reagir a esta mensagem"
            aria-expanded={pickerOpen}
            onClick={onPickerToggle}
          >
            <span aria-hidden="true">😺</span>
          </button>

          {pickerOpen && (
            <div
              className={styles.reactionPicker}
              role="menu"
              aria-label="Reações rápidas"
            >
              {QUICK_REACTIONS.map((reaction) => (
                <button
                  key={reaction.emoji}
                  type="button"
                  role="menuitem"
                  className={styles.reactionOption}
                  aria-label={`Reagir com ${reaction.label}`}
                  onClick={() => onToggleReaction(reaction.emoji)}
                >
                  <span aria-hidden="true">{reaction.emoji}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export { UserMessageReactions };
