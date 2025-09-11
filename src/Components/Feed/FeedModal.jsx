import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { PHOTO_GET } from '../../Api/index';
import useFetch from '../../Hooks/useFetch';
import Error from '../Helper/Error';
import Loading from '../Helper/Loading';
import PhotoContent from '../Photo/PhotoContent';
import styles from './FeedModal.module.css';

const FeedModal = ({ photo, setModalPhoto }) => {
  const { request } = useFetch();

  const { data, error, isLoading, isError } = useQuery({
    queryKey: ['photo', photo?.id],
    queryFn: async () => {
      const { url, options } = PHOTO_GET(photo.id);
      const { json } = await request(url, options);
      return json;
    },
    enabled: !!photo?.id, // só roda quando o id existe
  });

  function handleOutSideClick(event) {
    if (event.target === event.currentTarget) {
      setModalPhoto(null);
    }
  }

  return (
    <div className={styles.modal} onClick={handleOutSideClick}>
      {isError && <Error error={error?.message || 'Erro ao carregar foto'} />}
      {isLoading && <Loading />}
      {data && <PhotoContent data={data} />}
    </div>
  );
};

export default FeedModal;
