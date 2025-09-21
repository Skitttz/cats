import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { PHOTO_DELETE } from '../../Api/index';
import { useUser } from '../../UserContext';
import styles from './PhotoDelete.module.css';

const PhotoDelete = ({ id, queryKey, userId, handleCloseModalPhoto }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const user = useUser();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (photoId) => {
      const { url, options } = PHOTO_DELETE(photoId);
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error('Falha ao deletar a foto');
      }
      return response.json();
    },
    onMutate: async (photoId) => {
      await queryClient.cancelQueries(queryKey);
      const previousData = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old) => {
        if (!old) return old;
        if (Array.isArray(old)) {
          return old.filter((photo) => photo.id !== photoId);
        }
        return old;
      });
      return { previousData };
    },
    onError: (err, photoId, context) => {
      queryClient.setQueryData(queryKey, context.previousData);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({
        queryKey: ['photos', userId],
        exact: false,
      });
    },
  });

  const handleOpenModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleDelete = useCallback(() => {
    mutation.mutate(id, {
      onSuccess: () => {
        setIsModalOpen(false);
        handleCloseModalPhoto();
      },
    });
  }, [id, mutation]);

  const handleOutsideClick = useCallback((event) => {
    if (event.target === event.currentTarget) {
      setIsModalOpen(false);
    }
  }, []);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isModalOpen]);

  console.log({ isModalOpen });

  return (
    <div className={styles.deleteContainer}>
      <button
        onClick={handleOpenModal}
        className={styles.delete}
        aria-label="Abrir modal para deletar foto"
        disabled={mutation.isPending}
      >
        {mutation.isPending ? 'Deletando...' : 'Deletar'}
      </button>

      {isModalOpen &&
        createPortal(
          <div className={styles.modal} onClick={handleOutsideClick}>
            <div className={`${styles.dialogModal} ${styles.animeDown}`}>
              <div className={styles.contentContainer}>
                <h4>Deseja deletar essa foto?</h4>
                <p>
                  Essa ação é permanente e a foto não poderá ser recuperada.
                </p>
              </div>
              <div className={styles.buttonContainer}>
                <button
                  className={styles.buttonRefuse}
                  onClick={handleCloseModal}
                >
                  Manter a foto 🐾
                </button>
                <button className={styles.buttonAccept} onClick={handleDelete}>
                  Sim, deletar 😿
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
};

export default PhotoDelete;
