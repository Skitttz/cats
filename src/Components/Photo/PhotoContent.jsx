import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../../UserContext';
import Image from '../Helper/Image';
import PhotoComments from './PhotoComments';
import styles from './PhotoContent.module.css';
import PhotoDelete from './PhotoDelete';

const PhotoContent = ({ data, single, handleCloseModalPhoto }) => {
  const user = useUser();
  if (!data || !data.photo) return null;
  const { photo, comments } = data;
  return (
    <div className={`${styles.photo} ${single ? styles.single : ''}`}>
      <div className={styles.img}>
        <Image src={photo.src} alt={photo.title} />
      </div>
      <div className={styles.details}>
        <div style={{ position: 'relative' }}>
          <p className={styles.author}>
            {user.data && user.data.username === photo.author ? (
              <PhotoDelete
                id={photo.id}
                queryKey={['photo', photo.id]}
                userId={user.data.id}
                handleCloseModalPhoto={handleCloseModalPhoto}
              />
            ) : (
              <Link to={`/perfil/${photo.author}`}>@{photo.author}</Link>
            )}

            <span className={styles.view}>{photo.acessos}</span>
          </p>
          <h1 className={`${styles.titlePhoto} title`}>
            <Link style={{ wordBreak: 'break-all' }} to={`/photo/${photo.id}`}>
              {photo.title}
            </Link>
          </h1>
          <ul className={styles.attributes}>
            <li style={{ wordBreak: 'break-all' }}>{photo.descricao} </li>
          </ul>
          <div className={styles.line}></div>
        </div>
      </div>

      <PhotoComments
        single={single}
        idade={photo.idade}
        descricao={photo.descricao}
        id={photo.id}
        comments={comments}
      />
    </div>
  );
};

export default PhotoContent;
