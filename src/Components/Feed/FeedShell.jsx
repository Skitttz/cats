import React from 'react';
import Error from '../Helper/Error';
import Loading from '../Helper/Loading';
import Button from '../Forms/Button';
import { disableScroll } from '../Utils/ScrollUtility';
import FeedModal from './FeedModal';
import FeedPhotosItem from './FeedPhotosItem';
import styles from './FeedShell.module.css';

function FeedShell({
  photos,
  error,
  isLoading,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
  emptyState = null,
  footer = null,
}) {
  const [modalPhoto, setModalPhoto] = React.useState(null);
  const sentinelRef = React.useRef(null);
  const canLoadMore = hasNextPage && !error;
  const isEmpty = photos.length === 0;
  const isEmptyWithError = error && isEmpty;

  disableScroll(!!modalPhoto);

  React.useEffect(() => {
    const sentinel = sentinelRef.current;
    const canObserve = sentinel && canLoadMore && !isFetchingNextPage;

    if (!canObserve) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) fetchNextPage();
      },
      { rootMargin: '600px' },
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [canLoadMore, isFetchingNextPage, fetchNextPage]);

  if (isEmptyWithError) return <Error error={error.message} />;
  if (isLoading) return <Loading />;
  if (isEmpty) return emptyState;

  return (
    <div>
      {modalPhoto && (
        <FeedModal photo={modalPhoto} setModalPhoto={setModalPhoto} />
      )}
      <ul className={`${styles.feed} animeLeft`}>
        {photos.map((photo) => (
          <FeedPhotosItem
            key={photo.id}
            photo={photo}
            setModalPhoto={setModalPhoto}
          />
        ))}
      </ul>
      {canLoadMore && <div ref={sentinelRef} className={styles.sentinel} />}
      {isFetchingNextPage && <Loading />}
      {error && (
        <div className={styles.feedError}>
          <Error error={error.message} />
          <Button onClick={fetchNextPage}>Tentar novamente</Button>
        </div>
      )}
      {footer}
    </div>
  );
}

export { FeedShell };
