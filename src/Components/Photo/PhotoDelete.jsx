import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { PHOTO_DELETE } from '../../Api/index';
import { requestResult, requireSuccess } from '../../Api/request';
import { removePhotoFromFeed } from '../../Utils/queryCache';
import Dialog from '../Helper/Dialog';
import Error from '../Helper/Error';
import styles from './PhotoDelete.module.css';

const PhotoDelete = ({ id, handleCloseModalPhoto }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: async (photoId) => {
      const { url, options } = PHOTO_DELETE(photoId);
      return requireSuccess(await requestResult(url, options)).json;
    },
    onSuccess: async () => {
      await queryClient.cancelQueries({ queryKey: ['photos'] });
      queryClient.setQueriesData({ queryKey: ['photos'] }, (feed) => removePhotoFromFeed(feed, id));
      queryClient.removeQueries({
        predicate: (query) => query.queryKey[0] === 'photo' && Number(query.queryKey[1]) === Number(id),
      });
      setIsModalOpen(false);
      if (handleCloseModalPhoto) handleCloseModalPhoto();
      else navigate('/conta', { replace: true });
      queryClient.invalidateQueries({ queryKey: ['photos'] });
    },
  });

  const closeDialog = () => { if (!mutation.isPending) setIsModalOpen(false); };

  return (
    <div className={styles.deleteContainer}>
      <button type="button" onClick={() => setIsModalOpen(true)} className={styles.delete}
        aria-label="Abrir modal para deletar foto" disabled={mutation.isPending}>
        {mutation.isPending ? 'Deletando...' : 'Deletar'}
      </button>
      {isModalOpen && (
        <Dialog label="Confirmar exclusão da foto" className={styles.modal} onClose={closeDialog}>
          <div className={`${styles.dialogModal} ${styles.animeDown}`}>
            <div className={styles.contentContainer}>
              <h2>Deseja deletar essa foto?</h2>
              <p>Essa ação é permanente e a foto não poderá ser recuperada.</p>
            </div>
            <Error error={mutation.error?.message} />
            <div className={styles.buttonContainer}>
              <button type="button" className={styles.buttonRefuse} onClick={closeDialog} disabled={mutation.isPending}>
                Manter a foto 🐾
              </button>
              <button type="button" className={styles.buttonAccept} onClick={() => mutation.mutate(id)} disabled={mutation.isPending}>
                {mutation.isPending ? 'Deletando...' : 'Sim, deletar 😿'}
              </button>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
};

export default PhotoDelete;
