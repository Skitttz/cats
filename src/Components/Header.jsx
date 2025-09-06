import React from 'react';
import styles from './Header.module.css';
import { Link, NavLink, Navigate, useNavigate } from 'react-router-dom';
import Cats from '../Assets/cats.svg';
import MinhaConta from '../Assets/usuario.svg';
import Sair from '../Assets/sair.svg';
import { useUser } from '../UserContext';
import UserLogoutModal from './User/UserLogoutModal';
import { disableScroll } from './Utils/ScrollUtility';
import { Pets } from '@mui/icons-material';

const Header = () => {
  const { data, userLogout } = useUser();
  const [modalLogout, setModalLogout] = React.useState(null);
  const navigate = useNavigate();

  function handleLogout() {
    userLogout();
    navigate('/login');
  }
  disableScroll(!!modalLogout);
  return (
    <>
      <header className={styles.header}>
        <nav className={`${styles.nav} container`}>
          <NavLink className={styles.logo} to={'/'} aria-label="Cats - Home">
            <Cats />
          </NavLink>
          {data ? (
            <div className={styles.loginContainer}>
              <p className={styles.paragraphName}>
                Olá,{' '}
                <a
                  href=""
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/conta');
                  }}
                  style={{ color: '#333' }}
                  className={styles.nome}
                >
                  {data.nome[0].toUpperCase() + data.nome.substring(1)}
                </a>
              </p>
              <Link className={styles.login} to="/conta">
                <button className={styles.btnMinha}>
                  <MinhaConta />
                </button>
              </Link>
              <button
                className={styles.sair}
                onClick={() => setModalLogout(true)}
              >
                <Sair />
              </button>
            </div>
          ) : (
            <div className={styles.containerLogin}>
              <Link className={styles.login} to="/login">
                Entrar
              </Link>
              <Link className={styles.signIn} to="/login/criar">
                Criar Conta
                <Pets />
              </Link>
            </div>
          )}
        </nav>
      </header>
      {modalLogout && (
        <UserLogoutModal
          setModalLogout={setModalLogout}
          handleLogout={handleLogout}
        />
      )}
    </>
  );
};

export default Header;
