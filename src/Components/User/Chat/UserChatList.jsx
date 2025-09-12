import React, { useEffect, useMemo, useState } from 'react';
import styles from './UserChatList.module.css';

const UserChatList = ({
  users = [],
  onlineUsers = [],
  featuredUsers = [],
  isLoading = false,
}) => {
  const [animationDelay, setAnimationDelay] = useState(0);
  const url = window.location.href;

  const uniqueUsers = useMemo(() => {
    const seen = new Set();
    return users.filter((user) => {
      if (seen.has(user.name)) {
        return false;
      }
      seen.add(user.name);
      return true;
    });
  }, [users]);

  const isUserOnline = (userName) => {
    return onlineUsers.includes(userName);
  };

  const isUserFeatured = (userName) => {
    return featuredUsers.includes(userName);
  };

  const getUserClasses = (userName) => {
    let classes = styles.userNames;
    if (isUserOnline(userName)) {
      classes += ` ${styles.online}`;
    }
    if (isUserFeatured(userName)) {
      classes += ` ${styles.featured}`;
    }
    return classes;
  };

  const createProfileUrl = (userName) => {
    const baseUrl = url.slice(0, url.indexOf('conta'));
    return `${baseUrl}perfil/${userName}`;
  };

  useEffect(() => {
    setAnimationDelay(0);
  }, [users]);

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
        {uniqueUsers.length === 0 && !isLoading ? (
          <li className={styles.emptyMessage}>
            🐾 Nenhum gatinho por aqui ainda...
          </li>
        ) : (
          uniqueUsers.map((user, index) => (
            <li
              key={user.id || `user-${index}`}
              className={getUserClasses(user.name)}
              style={{
                animationDelay: `${index * 0.1}s`,
              }}
            >
              <a
                href={createProfileUrl(user.name)}
                className={styles.userLink}
                title={`Ver perfil de ${user.name}`}
                onClick={(e) => {
                  if (!user.name) {
                    e.preventDefault();
                    console.warn('Nome de usuário inválido');
                  }
                }}
              >
                <span className={styles.userName}>{user.name}</span>
                {isUserOnline(user.name) && (
                  <span className={styles.onlineIndicator} title="Online agora">
                    🟢
                  </span>
                )}
                {isUserFeatured(user.name) && (
                  <span
                    className={styles.featuredBadge}
                    title="Usuário em destaque"
                  >
                    ⭐
                  </span>
                )}
              </a>
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

export default UserChatList;
