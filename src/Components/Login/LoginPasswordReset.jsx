import React from 'react';
import Input from '../Forms/Input';
import Button from '../Forms/Button';
import useForm from '../../Hooks/useForm';
import useFetch from '../../Hooks/useFetch';
import PasswordStrong from './PasswordStrong';

import { PASSWORD_RESET } from '../../Api/index';
import Error from '../Helper/Error';
import { useNavigate } from 'react-router-dom';
import Head from '../Helper/Head';

const LoginPasswordReset = () => {
  const [login, setLogin] = React.useState();
  const [key, setKey] = React.useState();
  const password = useForm('password');
  const { error, loading, request } = useFetch();
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    if (password.validate()) {
      const { url, options } = PASSWORD_RESET({
        login,
        key,
        password: password.value,
      });
      const { response } = await request(url, options);
      if (response.ok) {
        navigate('/login');
      }
    }
  }

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const key = params.get('key');
    const login = params.get('login');
    if (key) setKey(key);
    if (login) setLogin(login);
  }, []);
  return (
    <div>
      <Head title="Redefinir Senha" />
      <form onSubmit={handleSubmit}>
        <h1 className="title">Redefina a senha</h1>
        <Input
          label="Nova senha"
          type="password"
          name="password"
          {...password}
        />
        <PasswordStrong>{password.value}</PasswordStrong>
        {loading ? (
          <Button disable>Redefinindo...</Button>
        ) : (
          <Button>Redefinir</Button>
        )}
      </form>
      <Error error={error} />
    </div>
  );
};

export default LoginPasswordReset;
