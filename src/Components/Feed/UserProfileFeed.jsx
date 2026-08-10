import React from 'react';
import { FeedShell } from './FeedShell';
import styles from './ProfileFeed.module.css';
import { useFeedPhotos } from './useFeedPhotos';

function UserProfileFeed({ user }) {
  const feed = useFeedPhotos(user);

  const emptyState = (
    <div className={`${styles.noPostUser} animeOpacity`}>
      <div>
        <p>Ops! Parece que este usuário ainda não compartilhou nadinha.</p>
        <p>Ainda deve estar criando novidades fofinhas... 😺✨</p>
      </div>
    </div>
  );

  return <FeedShell {...feed} emptyState={emptyState} />;
}

export { UserProfileFeed };
