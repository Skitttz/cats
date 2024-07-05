import React from 'react';
import styles from './Loading.module.css';
import LoadingSvg from '../../Assets/carregando.svg';
import LoadingLogoSvg from '../../Assets/loadingLogo.svg';

const Loading = () => {
  return (
    <>
      <div className={styles.logoContainer}>
        <div className={styles.logo}>
          <LoadingLogoSvg />
        </div>
      </div>
      <div className={styles.wrapper}>
        <div className={styles.loading}>
          <LoadingSvg />
        </div>
      </div>
    </>
  );
};

export default Loading;
