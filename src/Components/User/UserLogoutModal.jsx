import React from 'react';
import styles from './UserLogoutModal.module.css';
import Logo from '../../Assets/cats.svg';
import { Link } from 'react-router';

const UserLogoutModal = ({ setModalLogout, handleLogout }) => {
  function handleOutSideClick(event) {
    if (event.target === event.currentTarget) {
      setModalLogout(null);
    }
  }
  return (
    <div>
      <div
        className={`${styles.modal} animeOpacity`}
        onClick={handleOutSideClick}
      >
        <div className={`${styles.dialogModal} animeDown`}>
          <div className={styles.contentContainer}>
            <Logo />
            <h4>Pensando em partir? 🐾 </h4>
            <p>
              Lembre-se, seus amigos peludos estarão esperando ansiosamente pela
              sua volta!
            </p>
          </div>
          <div className={styles.buttonContainer}>
            <Link className={styles.buttonRefuse} onClick={handleOutSideClick}>
              Ficar com os gatinhos 😺
            </Link>
            <Link
              className={styles.buttonAccept}
              onClick={(e) => {
                e.preventDefault();
                handleLogout();
                handleOutSideClick(e);
              }}
            >
              Sim, quero sair 🚪💨
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLogoutModal;
