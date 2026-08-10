import React from 'react';
import { FeedShell } from './FeedShell';
import styles from './GlobalFeed.module.css';
import { useFeedPhotos } from './useFeedPhotos';

function GlobalFeed() {
  const feed = useFeedPhotos();

  const endOfFeedMessage = (
    <p className={`${styles.noPost} animeDown`}>
      O estoque de gatinhos acabou não existem mais postagens.
    </p>
  );

  return (
    <FeedShell
      {...feed}
      emptyState={endOfFeedMessage}
      footer={feed.hasNextPage ? null : endOfFeedMessage}
    />
  );
}

export { GlobalFeed };
