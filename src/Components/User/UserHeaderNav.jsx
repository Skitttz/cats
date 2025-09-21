import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import AddPhotosSvg from '../../Assets/adicionar.svg';
import ChatSvg from '../../Assets/chat.svg';
import StatsSvg from '../../Assets/estatisticas.svg';
import PhotosSvg from '../../Assets/feed.svg';
import useMedia from '../../Hooks/useMedia';
import styles from './UserHeaderNav.module.css';

const UserHeaderNav = () => {
  const mobile = useMedia('(max-width:40rem)');
  const [mobileMenu, setMobileMenu] = React.useState(false);
  const { pathname } = useLocation();

  React.useEffect(() => {
    setMobileMenu(false);
  }, [pathname]);

  return (
    <>
      {mobile && (
        <button
          aria-label="Menu"
          className={`${styles.mobileBtn} ${
            mobileMenu && styles.mobileBtnActive
          }`}
          onClick={() => setMobileMenu(!mobileMenu)}
        ></button>
      )}
      <nav
        className={`${mobile ? styles.navMobile : styles.nav} ${
          mobileMenu && styles.navMobileActive
        }`}
      >
        <NavLink to="/conta" end>
          <PhotosSvg /> {mobile && 'Minhas Fotos'}
        </NavLink>
        <NavLink to="/conta/post">
          <AddPhotosSvg /> {mobile && 'Adicionar Foto'}
        </NavLink>
        <NavLink className={styles.chat} to="/conta/chat">
          <ChatSvg /> {mobile && 'Chat'}
        </NavLink>
        <NavLink to="/conta/stat">
          <StatsSvg /> {mobile && 'Estatistica'}
        </NavLink>
      </nav>
    </>
  );
};

export default UserHeaderNav;
