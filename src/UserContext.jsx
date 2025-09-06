import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TOKEN_POST, TOKEN_VALIDATE_POST, USER_GET } from './Api';

export const UserContext = React.createContext();

export const UserStorage = ({ children }) => {
  const [data, setData] = React.useState(null);
  const [login, setLogin] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const navigate = useNavigate();

  async function getUser(token) {
    const { url, options } = USER_GET(token);
    const response = await fetch(url, options);
    const json = await response.json();
    setData(json);
    setLogin(true);
  }

  async function userLogin(username, password) {
    try {
      setError(null);
      setLoading(true);
      const { url, options } = TOKEN_POST({ username, password });
      const tokenRes = await fetch(url, options);
      if (!tokenRes.ok)
        throw new Error(
          `Arrrgh! 🙀 Parece que alguém arranhou as credenciais! 🐾 Usuário ou senha não encontrados, por favor, verifique e tente novamente. 😺`,
        );
      const { token } = await tokenRes.json();
      window.localStorage.setItem('token', token);
      await getUser(token);
      navigate('/conta');
    } catch (err) {
      setError(err.message);
      setTimeout(() => {
        setError(null);
      }, 20000);
    } finally {
      setLoading(false);
    }
  }

  const userLogout = React.useCallback(async function () {
    setData(null);
    setError(null);
    setLoading(false);
    setLogin(false);
    window.localStorage.removeItem('token');
  }, []);

  React.useEffect(() => {
    async function autoLogin() {
      const token = window.localStorage.getItem('token');
      if (token) {
        try {
          setError(null);
          setLoading(true);
          const { url, options } = TOKEN_VALIDATE_POST(token);
          const response = await fetch(url, options);
          if (!response.ok) throw new Error('Token Inválido');
          const json = await response.json();
          await getUser(token);
        } catch (err) {
          userLogout();
          setError(err.message);
        } finally {
          setLoading(false);
        }
      } else {
        setLogin(false);
      }
    }
    autoLogin();
  }, [userLogout]);

  return (
    <UserContext.Provider
      value={{ userLogin, userLogout, data, error, loading, login }}
    >
      {children}
    </UserContext.Provider>
  );
};

export function useUser() {
  const context = React.useContext(UserContext);

  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }

  return context;
}
