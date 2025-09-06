import { Info } from 'lucide-react';
import React from 'react';
import { NavLink } from 'react-router-dom';
import Cats from '../Assets/cats.svg';
import styles from './Footer.module.css';
import InfoProjectModal from './InfoProject';
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
              <Info /> <span>Sobre</span>
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
