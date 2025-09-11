import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Heart } from 'lucide-react';
import React from 'react';
import { HAS_LIKE_GET, LIKE_POST, PHOTO_LIKE_GET } from '../../Api/index';
import { useUser } from '../../UserContext';
import useFetch from '../../Hooks/useFetch';
import styles from './PhotoLike.module.css';

const PhotoLike = ({ id, className = '' }) => {
  const { login } = useUser();
  const { request } = useFetch();
  const queryClient = useQueryClient();

  const isUserLoggedIn = Boolean(login);

  // Query: total de likes
  const {
    data: totalLikes = 0,
    error: totalError,
    isLoading: totalLoading,
  } = useQuery({
    queryKey: ['photoLikes', id],
    queryFn: async () => {
      const { json } = await request(
        PHOTO_LIKE_GET(id).url,
        PHOTO_LIKE_GET(id).options,
      );
      return json?.total_likes ?? 0;
    },
    enabled: !!id,
  });

  // Query: se o usuário já curtiu
  const {
    data: hasLike = false,
    error: likeError,
    isLoading: likeLoading,
  } = useQuery({
    queryKey: ['hasLike', id],
    queryFn: async () => {
      const { json } = await request(
        HAS_LIKE_GET(id).url,
        HAS_LIKE_GET(id).options,
      );
      return json?.liked ?? false;
    },
    enabled: !!id && isUserLoggedIn,
  });

  // Mutation: alternar like
  const mutation = useMutation({
    mutationFn: async () => {
      const { json } = await request(
        LIKE_POST(id).url,
        LIKE_POST(id).options,
      );
      return json;
    },
    onMutate: async () => {
      await queryClient.cancelQueries(['photoLikes', id]);
      await queryClient.cancelQueries(['hasLike', id]);

      const prevLikes = queryClient.getQueryData(['photoLikes', id]);
      const prevHasLike = queryClient.getQueryData(['hasLike', id]);

      queryClient.setQueryData(['hasLike', id], !prevHasLike);
      queryClient.setQueryData(
        ['photoLikes', id],
        (old) => (prevHasLike ? old - 1 : old + 1),
      );

      return { prevLikes, prevHasLike };
    },
    onError: (_, __, context) => {
      if (context?.prevLikes !== undefined) {
        queryClient.setQueryData(['photoLikes', id], context.prevLikes);
        queryClient.setQueryData(['hasLike', id], context.prevHasLike);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(['photoLikes', id]);
      queryClient.invalidateQueries(['hasLike', id]);
    },
  });

  return (
    <div className={`${styles.likeContainer} ${className}`}>
      <button
        className={`${styles.likeBtn} ${hasLike ? styles.liked : ''}`}
        onClick={() => mutation.mutate()}
        disabled={!isUserLoggedIn || mutation.isLoading}
        aria-label={hasLike ? 'Descurtir post' : 'Curtir post'}
        type="button"
      >
        <Heart
          size={20}
          fill={hasLike ? '#ef4444' : 'none'}
          color={hasLike ? '#ef4444' : '#6b7280'}
          className={styles.heartIcon}
        />
      </button>

      {totalLoading ? (
        <span className={styles.likeCount} aria-hidden="true">
          ⏳
        </span>
      ) : (
        <span
          className={styles.likeCount}
          aria-label={`${totalLikes} ${
            totalLikes === 1 ? 'curtida' : 'curtidas'
          }`}
        >
          {totalLikes}
        </span>
      )}

      {(totalError || likeError) && (
        <div className={styles.errorMessage} role="alert">
          Erro: {(totalError || likeError)?.message}
        </div>
      )}
    </div>
  );
};

export default React.memo(PhotoLike);
