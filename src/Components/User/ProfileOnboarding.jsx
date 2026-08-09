import { UserRoundCheck } from 'lucide-react';
import { Navigate, useNavigate } from 'react-router';
import { USER_ONBOARDING_UPDATE } from '../../Api';
import useFetch from '../../Hooks/useFetch';
import useForm from '../../Hooks/useForm';
import { useUser } from '../../UserContext';
import Button from '../Forms/Button';
import Input from '../Forms/Input';
import Error from '../Helper/Error';
import Head from '../Helper/Head';
import styles from './ProfileOnboarding.module.css';

const ProfileOnboarding = () => {
  const displayName = useForm('displayName');
  const { data, refreshUser } = useUser();
  const { error, loading, request } = useFetch();
  const navigate = useNavigate();

  if (!data?.onboarding_required) {
    return <Navigate to="/conta" replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!displayName.validate()) return;

    const { url, options } = USER_ONBOARDING_UPDATE({
      display_name: displayName.value,
    });
    const { response } = await request(url, options);

    if (response?.ok) {
      await refreshUser();
      navigate('/conta', { replace: true });
    }
  }

  return (
    <section className={`${styles.container} animeLeft`}>
      <Head title="Complete seu perfil" />
      <div className={styles.card}>
        <span className={styles.icon} aria-hidden="true">
          <UserRoundCheck />
        </span>
        <p className={styles.eyebrow}>Só falta um detalhe</p>
        <h1 className="title">Como devemos chamar você?</h1>
        <p className={styles.description}>
          Seu nome de exibição será público em fotos, comentários e conversas.
          Seu login continuará privado e será usado apenas para entrar na conta.
        </p>

        <form onSubmit={handleSubmit}>
          <Input
            label="Nome de exibição"
            type="text"
            name="display_name"
            autoComplete="nickname"
            {...displayName}
          />
          {loading ? (
            <Button disabled>Salvando...</Button>
          ) : (
            <Button>Continuar</Button>
          )}
          <Error error={error} />
        </form>
      </div>
    </section>
  );
};

export default ProfileOnboarding;
