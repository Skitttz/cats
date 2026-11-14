import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { PHOTO_GET } from '../../Api/index';
import useFetch from '../../Hooks/useFetch';
import Error from '../Helper/Error';
import Loading from '../Helper/Loading';
import PhotoContent from '../Photo/PhotoContent';
import styles from './FeedModal.module.css';
import Dialog from '../Helper/Dialog';

const FeedModal = ({ photo, setModalPhoto }) => {
  const { requestOrThrow: request } = useFetch();

  const { data, error, isLoading, isError } = useQuery({
    queryKey: ['photo', photo?.id],
    queryFn: async ({ signal }) => {
      const { url, options } = PHOTO_GET(photo.id);
      const { json } = await request(url, { ...options, signal });
      return json;
    },
    enabled: !!photo?.id, // só roda quando o id existe
  });

  function handleCloseModal() {
    setModalPhoto(null);
  }

  return (
    <Dialog label="Visualização da foto" className={styles.modal} onClose={handleCloseModal}>
      <button type="button" className={styles.closeButton} onClick={handleCloseModal} aria-label="Fechar foto">×</button>
      {isError && <Error error={error?.message || 'Erro ao carregar foto'} />}
      {isLoading && <Loading />}
      {data && (
        <PhotoContent data={data} handleCloseModalPhoto={handleCloseModal} />
      )}
    </Dialog>
  );
};

export default FeedModal;
