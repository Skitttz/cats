import React from 'react';
import { NavLink } from 'react-router';
import AddPhotosSvg from '../../Assets/adicionar.svg';
import Button from '../Forms/Button';
import { FeedShell } from './FeedShell';
import styles from './ProfileFeed.module.css';
import { useFeedPhotos } from './useFeedPhotos';

function MyProfileFeed({ user }) {
  const feed = useFeedPhotos(user);

  const emptyState = (
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

  return <FeedShell {...feed} emptyState={emptyState} />;
}

export { MyProfileFeed };
