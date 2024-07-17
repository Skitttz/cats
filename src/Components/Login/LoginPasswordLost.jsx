import React from 'react';
import Input from '../Forms/Input';
import Button from '../Forms/Button';
import useForm from '../../Hooks/useForm';
import useFetch from '../../Hooks/useFetch';
import { PASSWORD_LOST } from '../../Api/index';
import Error from '../Helper/Error';
import Head from '../Helper/Head';

const LoginPasswordLost = () => {
  const login = useForm();
  const { data, loading, error, request } = useFetch();
  async function handleSubmit(event) {
    event.preventDefault();
    if (login.validate()) {
      const { url, options } = PASSWORD_LOST({
        login: login.value,
        url: window.location.href.replace('recuperar', 'redefinir'),
      });
      const { json } = await request(url, options);
    }
  }
  return (
    <section className="animeLeft">
      <Head title="Recuperar Senha" />
      <h1 className="title" style={{ marginBottom: '2rem' }}>
        Recuperar a senha
      </h1>
      {typeof data === 'string' ? (
        <span
          style={{
            color: '#0BE628',
            fontWeight: '600',
            backgroundColor: 'rgba(12,40,111,0.8)',
            borderRadius: '6px',
            padding: '8px',
          }}
        >{`${data} 😺📧`}</span>
      ) : (
        <form onSubmit={handleSubmit}>
          <Input
            label="Digite o Email ou o Nome de Usuário"
            type="text"
            name="login"
            {...login}
          />
          {loading ? (
            <Button disabled>Enviar Email</Button>
          ) : (
            <Button>Enviar Email</Button>
          )}
          <Error error={error} />
        </form>
      )}
    </section>
  );
};

export default LoginPasswordLost;
