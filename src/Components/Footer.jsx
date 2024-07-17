import React from 'react';
import styles from './Footer.module.css';
import Cats from '../Assets/cats.svg';
import { InfoOutlined } from '@mui/icons-material';
import InfoProjectModal from './InfoProject';
import { NavLink } from 'react-router-dom';
const Footer = () => {
  const [infoModal, setInfoModal] = React.useState(null);
  return (
    <>
      <footer className={styles.footer}>
        <div className={styles.container}>
          <nav className={styles.containerNetwork}>
            <button
              className={styles.btnInfo}
              href=""
              onClick={() => {
                setInfoModal(true);
              }}
            >
              <InfoOutlined /> <span>Sobre</span>
            </button>
          </nav>
          <div className={styles.containerMain}>
            <NavLink to={'/'}>
              <Cats />
            </NavLink>
          </div>
          <div className={styles.containerExtra}>
            <p>© 2024 Cats</p>
          </div>
        </div>
      </footer>
      {infoModal && <InfoProjectModal setInfoModal={setInfoModal} />}
    </>
  );
};

export default Footer;
