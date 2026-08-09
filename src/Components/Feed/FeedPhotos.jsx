import { keepPreviousData, useQuery } from '@tanstack/react-query';
import React from 'react';
import { NavLink } from 'react-router';
import { PHOTOS_GET } from '../../Api/index';
import AddPhotosSvg from '../../Assets/adicionar.svg';
import useFetch from '../../Hooks/useFetch';
import Button from '../Forms/Button';
import Error from '../Helper/Error';
import Loading from '../Helper/Loading';
import { CurrentPathProfileUser } from '../Utils/CurrentRoute';
import styles from './FeedPhotos.module.css';
import FeedPhotosItem from './FeedPhotosItem';
import { useUser } from '../../UserContext';

const FeedPhotos = ({ page, user, setModalPhoto, setInfinite }) => {
  const { request } = useFetch();
  const { data: currentUser } = useUser();
  const pathnameProfile = CurrentPathProfileUser();

  const {
    data: photos,
    error: photosError,
    isLoading: photosLoading,
  } = useQuery({
    queryKey: ['photos', user, page],
    queryFn: async () => {
      const total = window.innerWidth <= 640 ? 4 : 3;
      const { url, options } = PHOTOS_GET({ page, total, user });
      const { response, json } = await request(url, options);

      if (response?.ok && json.length < total) {
        setInfinite(false);
      }

      return json;
    },
    placeholderData: keepPreviousData,
  });

  if (photosError) return <Error error={photosError?.message} />;
  if (photosLoading) return <Loading />;

  if ((!photos || photos.length === 0) && user !== 0) {
    const isOwner =
      (typeof user === 'string' &&
        user === currentUser?.public_id &&
        pathnameProfile) ||
      (typeof user === 'number' && user === currentUser?.id && pathnameProfile);

    if (isOwner) {
      return (
        <div className={`${styles.noPostUser} animeOpacity`}>
          <div>
            <p>Ops! Parece que seu estoque de gatinhos está vazio.</p>
            <p>Ainda não existem postagens para exibir.</p>
          </div>
          <div className={styles.containerButtons}>
            <NavLink to={'/conta/post'}>
              <Button>Criar primeiro post 🐾</Button>
            </NavLink>
            ou selecione
            <NavLink to={'/conta/post'} aria-label="Icone Nav">
              <AddPhotosSvg />
            </NavLink>
          </div>
        </div>
      );
    }

    return (
      <div className={`${styles.noPostUser} animeOpacity`}>
        <div>
          <p>Ops! Parece que este usuário ainda não compartilhou nadinha.</p>
          <p>Ainda deve estar criando novidades fofinhas... 😺✨</p>
        </div>
      </div>
    );
  }

  if (photos)
    return (
      <ul className={`${styles.feed} animeLeft`}>
        {photos.map((photo) => (
          <FeedPhotosItem
            key={photo.id}
            photo={photo}
            setModalPhoto={setModalPhoto}
          />
        ))}
      </ul>
    );

  return null;
};

export default FeedPhotos;
