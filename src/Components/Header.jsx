import { PawPrint } from 'lucide-react';
import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import Cats from '../Assets/cats.svg';
import Sair from '../Assets/sair.svg';
import MinhaConta from '../Assets/usuario.svg';
import { useUser } from '../UserContext';
import styles from './Header.module.css';
import UserLogoutModal from './User/UserLogoutModal';
import { disableScroll } from './Utils/ScrollUtility';

const Header = () => {
  const { data, userLogout, loading } = useUser();
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

          {loading ? (
            <div className={styles.containerLogin}>
              <span className={styles.skeleton}>⏳</span>
            </div>
          ) : data ? (
            <div className={styles.loginContainer}>
              <p className={styles.paragraphName}>
                Olá,{' '}
                <a
                  href=""
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/conta');
                  }}
                  className={styles.nome}
                >
                  {data.nome[0].toUpperCase() + data.nome.substring(1)}
                </a>
              </p>
              <Link to="/conta">
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
                <PawPrint />
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
