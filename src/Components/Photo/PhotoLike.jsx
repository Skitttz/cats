import { Heart } from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { HAS_LIKE_GET, LIKE_POST, PHOTO_LIKE_GET } from '../../Api/index';
import useFetch from '../../Hooks/useFetch';
import { useUser } from '../../UserContext';
import styles from './PhotoLike.module.css';

const LIKE_MESSAGES = {
  LIKED: 'Post foi curtido!',
  UNLIKED: 'Post foi descurtido!',
};

const PhotoLike = ({ id, className = '' }) => {
  const { error, request, loading } = useFetch();
  const { login } = useUser();

  const [likeState, setLikeState] = useState({
    isLiked: false,
    total: 0,
    isAnimating: false,
  });

  const isUserLoggedIn = useMemo(() => Boolean(login), [login]);
  const canInteract = useMemo(
    () => isUserLoggedIn && !loading,
    [isUserLoggedIn, loading],
  );

  const updateLikeState = useCallback((updates) => {
    setLikeState((prev) => ({ ...prev, ...updates }));
  }, []);

  const fetchInitialData = useCallback(async () => {
    if (!id) return;

    try {
      const [likeStatusResult, totalLikesResult] = await Promise.allSettled([
        request(...HAS_LIKE_GET(id)),
        request(...PHOTO_LIKE_GET(id)),
      ]);

      if (likeStatusResult.status === 'fulfilled') {
        const { response, json } = likeStatusResult.value;
        if (response?.ok && json?.liked !== undefined) {
          updateLikeState({ isLiked: json.liked });
        }
      }

      if (totalLikesResult.status === 'fulfilled') {
        const { response, json } = totalLikesResult.value;
        if (response?.ok && typeof json?.total_likes === 'number') {
          updateLikeState({ total: json.total_likes });
        }
      }
    } catch (err) {
      console.error('Error fetching initial like data:', err);
    }
  }, [id, request, updateLikeState]);

  const handleLikeToggle = useCallback(async () => {
    if (!canInteract || !id) return;

    const originalState = likeState;

    updateLikeState((prev) => {
      const newIsLiked = !prev.isLiked;
      const newTotal = prev.total + (newIsLiked ? 1 : -1);
      return {
        ...prev,
        isLiked: newIsLiked,
        total: newTotal,
        isAnimating: newIsLiked,
      };
    });

    try {
      const { url, options } = LIKE_POST(id);
      const { response, json } = await request(url, options);

      if (response?.ok) {
        if (newIsLiked) {
          setTimeout(() => updateLikeState({ isAnimating: false }), 300);
        }
      } else {
        updateLikeState(originalState);
        console.error(
          'Like operation failed:',
          json?.message || 'Unknown error',
        );
      }
    } catch (err) {
      // Revert on error
      updateLikeState(originalState);
      console.error('Error toggling like:', err);
    }
  }, [canInteract, id, likeState, request, updateLikeState]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const renderLikeButton = () => (
    <button
      className={`${styles.likeBtn} ${likeState.isLiked ? styles.liked : ''} ${
        likeState.isAnimating ? styles.animating : ''
      } ${className}`}
      onClick={handleLikeToggle}
      disabled={!canInteract}
      aria-label={likeState.isLiked ? 'Descurtir post' : 'Curtir post'}
      type="button"
    >
      <Heart
        size={20}
        fill={likeState.isLiked ? '#ef4444' : 'none'}
        color={likeState.isLiked ? '#ef4444' : '#6b7280'}
        className={styles.heartIcon}
      />
    </button>
  );

  const renderLikeCount = () => (
    <span
      className={styles.likeCount}
      aria-label={`${likeState.total} ${
        likeState.total === 1 ? 'curtida' : 'curtidas'
      }`}
    >
      {likeState.total}
    </span>
  );

  return (
    <div className={`${styles.likeContainer} ${className}`}>
      {renderLikeButton()}
      {renderLikeCount()}

      {error && (
        <div className={styles.errorMessage} role="alert">
          Erro: {error}
        </div>
      )}
    </div>
  );
};

export default React.memo(PhotoLike);
