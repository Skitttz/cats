import Cookies from 'js-cookie';
import React from 'react';
import { useNavigate } from 'react-router';
import { TOKEN_POST, TOKEN_VALIDATE_POST, USER_GET } from './Api';

export const UserContext = React.createContext();

export const UserStorage = ({ children }) => {
  const [data, setData] = React.useState(null);
  const [login, setLogin] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [isInitialized, setIsInitialized] = React.useState(false);
  const navigate = useNavigate();

  async function getUser(token) {
    const { url, options } = USER_GET(token);
    const response = await fetch(url, options);
    const json = await response.json();
    if (!response.ok) {
      throw new Error(json?.message || 'Não foi possível carregar sua conta.');
    }
    setData(json);
    setLogin(true);
    return json;
  }

  async function refreshUser() {
    const token = Cookies.get('token');
    if (!token) return null;

    return getUser(token);
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
      Cookies.set('token', token, { expires: 7, secure: true });
      const user = await getUser(token);
      navigate(
        user.onboarding_required ? '/conta/completar-perfil' : '/conta',
      );
    } catch (err) {
      setError(err.message);
      setTimeout(() => {
        setError(null);
      }, 20000);
    } finally {
      setLoading(false);
    }
  }

  const userLogout = React.useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
    setLogin(false);
    Cookies.remove('token');
  }, []);

  React.useEffect(() => {
    async function autoLogin() {
      const token = Cookies.get('token');
      if (token) {
        try {
          setError(null);
          const { url, options } = TOKEN_VALIDATE_POST();
          const response = await fetch(url, options);
          if (!response.ok) throw new Error('Token Inválido');
          await getUser(token);
        } catch (err) {
          userLogout();
          setError(err.message);
        } finally {
          setLoading(false);
          setIsInitialized(true);
        }
      } else {
        setLogin(false);
        setLoading(false);
        setIsInitialized(true);
      }
    }
    autoLogin();
  }, [userLogout]);

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <UserContext.Provider
      value={{
        userLogin,
        userLogout,
        refreshUser,
        data,
        error,
        loading,
        login,
      }}
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
