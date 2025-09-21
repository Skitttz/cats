import React from 'react';
import { STATS_GET } from '../../Api/index';
import useFetch from '../../Hooks/useFetch';
import { useUser } from '../../UserContext';
import Error from '../Helper/Error';
import Head from '../Helper/Head';
import Loading from '../Helper/Loading';
import styles from './UserStats.module.css';

const UserStatsGraph = React.lazy(() => import('./UserStatsGraph'));

const UserStats = () => {
  const { data, error, loading, request } = useFetch();
  const { data: dataUser, loading: dataLoading } = useUser();
  React.useEffect(() => {
    async function getData() {
      const { url, options } = STATS_GET();
      await request(url, options);
    }
    getData();
  }, [request]);

  if (loading) return <Loading />;
  if (error) return <Error />;

  if (data) {
    return (
      <section className={`${styles.container} animeLeft`}>
        <Head title="Estatísticas" />

        <div className={styles.welcomeHeader}>
          <div className={styles.welcomeContent}>
            <h1 className={styles.welcomeTitle}>
              Olá,{' '}
              <b>
                {dataUser.nome[0].toUpperCase() + dataUser.nome.substring(1)}
              </b>
              !
            </h1>
            <p className={styles.welcomeDescription}>
              Acompanhe a popularidade dos seus gatinhos e descubra quais posts
              fizeram mais sucesso 😻
            </p>
          </div>
        </div>

        <div className={styles.quickSummary}>
          <div className={styles.summaryCard}>
            <div className={styles.summaryIcon}>🚀</div>
            <div className={styles.summaryContent}>
              <h3>Total de Posts</h3>
              <span className={styles.summaryNumber}>{data.length}</span>
            </div>
          </div>

          <div className={styles.summaryCard}>
            <div className={styles.summaryIcon}>⭐</div>
            <div className={styles.summaryContent}>
              <h3>Post Mais Visualizado</h3>
              <span className={styles.summaryText}>
                {data.sort((a, b) => Number(b.acessos) - Number(a.acessos))[0]
                  ?.title || 'N/A'}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.graphsContainer}>
          <React.Suspense
            fallback={
              <div className={styles.graphPlaceholder}>
                <div className={styles.loadingSpinner}></div>
                <p>Carregando gráficos...</p>
              </div>
            }
          >
            <UserStatsGraph data={data} />
          </React.Suspense>
        </div>
      </section>
    );
  }

  return null;
};

export default UserStats;
