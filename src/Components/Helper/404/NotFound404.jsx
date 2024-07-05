import React from 'react';
import Error404Cat from '../../../Assets/cat-error-404.svg';
import styles from './NotFound404.module.css';

const NotFound404 = () => {
  return (
    <div className={`${styles.containerError} container mainContainer`}>
      <Error404Cat />
      <p className={styles.errorText}>
        Oh, não! Parece que você se aventurou em um território desconhecido,
        onde nenhum gatinho ousou ir antes. 🐾
      </p>
    </div>
  );
};

export default NotFound404;
