import { MailCheck } from 'lucide-react';
import { PASSWORD_LOST } from '../../Api/index';
import useFetch from '../../Hooks/useFetch';
import useForm from '../../Hooks/useForm';
import Button from '../Forms/Button';
import Input from '../Forms/Input';
import Error from '../Helper/Error';
import Head from '../Helper/Head';
import styles from './LoginPasswordLost.module.css';

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
      await request(url, options);
    }
  }
  return (
    <section className="animeLeft">
      <Head title="Recuperar Senha" />
      <h1 className="title" style={{ marginBottom: '2rem' }}>
        Recuperar a senha
      </h1>
      {data?.message && !error ? (
        <div className={styles.notification} role="status" aria-live="polite">
          <MailCheck className={styles.icon} aria-hidden="true" />
          <div>
            <strong>
              {data.masked_email
                ? 'Verifique o seu e-mail'
                : 'Solicitação recebida'}
            </strong>
            {data.masked_email && (
              <span className={styles.email}>{data.masked_email}</span>
            )}
            <p>{data.message}</p>
            {data.masked_email && (
              <small>O link expira e só pode ser utilizado uma vez.</small>
            )}
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <Input
            label="Digite seu e-mail ou login"
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
