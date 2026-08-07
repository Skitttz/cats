import { useMemo } from 'react';
import styles from './UserChatList.module.css';

const UserChatList = ({
  users = [],
  currentUserId,
  activeRoomPostId,
  mainRoomPostId,
  onSelectUser,
  onSelectMainRoom,
  isLoading = false,
}) => {
  const uniqueUsers = useMemo(() => {
    const seen = new Set();
    return users
      .filter((user) => user && user.name && user.id !== currentUserId)
      .filter((user) => {
        const key = user.id || user.name;
        if (seen.has(key)) {
          return false;
        }
        seen.add(key);
        return true;
      });
  }, [users, currentUserId]);

  return (
    <div
      className={`${styles.containerListUser} ${
        isLoading ? styles.loading : ''
      }`}
    >
      <div className={styles.containerTitulo}>
        <h2 className={styles.titleUserList}>🐱</h2>
      </div>
      <ul className={styles.listNames}>
        <li
          className={`${styles.userNames} ${
            activeRoomPostId === mainRoomPostId ? styles.activeRoom : ''
          }`}
        >
          <button
            type="button"
            className={`${styles.userLink} ${styles.roomButton}`}
            onClick={onSelectMainRoom}
            title="Voltar para a Sala Principal"
          >
            <span className={styles.userName}># Sala Principal</span>
          </button>
        </li>

        {uniqueUsers.length === 0 && !isLoading ? (
          <li className={styles.emptyMessage}>
            🐾 Nenhum gatinho por aqui ainda...
          </li>
        ) : (
          uniqueUsers.map((user, index) => (
            <li
              key={user.id || `user-${index}`}
              className={styles.userNames}
              style={{
                animationDelay: `${index * 0.1}s`,
              }}
            >
              <button
                type="button"
                className={`${styles.userLink} ${styles.roomButton}`}
                title={`Conversar com ${user.name}`}
                onClick={() => onSelectUser(user)}
              >
                <span className={styles.userName}>{user.name}</span>
                <span className={styles.onlineIndicator} title="Online agora">
                  🟢
                </span>
              </button>
            </li>
          ))
        )}
      </ul>
      <div className={styles.listFooter}>
        <div className={styles.stats}>
          <span className={styles.onlineUsers}>
            🟢 {uniqueUsers.length} online
          </span>
        </div>
      </div>
    </div>
  );
};

export { UserChatList };
