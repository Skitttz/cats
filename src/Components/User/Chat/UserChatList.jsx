import React from "react";
import styles from "./UserChatList.module.css";

const UserChatList = ({ users }) => {
  let url = window.location.href;

  return (
    <div className={styles.containerListUser}>
      <div className={styles.containerTitulo}>
        <h2 className={styles.titleUserList}>Usuários na Sala</h2>
      </div>
      <ul className={styles.listNames}>
        {users.map(
          (user, index) =>
            !users
              .slice(0, index)
              .some((prevUser) => prevUser.name === user.name) && (
              <li key={user.id} className={`${styles.userNames} animeComments`}>
                <a
                  href={`${url.slice(0, url.indexOf("conta"))}perfil/${
                    user.name
                  }`}
                >
                  {user.name}
                </a>
              </li>
            )
        )}
      </ul>
    </div>
  );
};

export default UserChatList;
