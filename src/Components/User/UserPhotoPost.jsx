import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PHOTO_POST } from '../../Api/index';
import useFetch from '../../Hooks/useFetch';
import useForm from '../../Hooks/useForm';
import Button from '../Forms/Button';
import Input from '../Forms/Input';
import Error from '../Helper/Error';
import Head from '../Helper/Head';
import styles from './UserPhotoPost.module.css';

const CatsIA = React.lazy(() => import('../Detector/CatsIA'));

const UserPhotoPost = () => {
  const nome = useForm();
  const descricao = useForm('description');
  const idade = useForm('age');
  const [img, setImg] = React.useState({});
  const [imgError, setImgError] = React.useState('');
  const { data, error, loading, request } = useFetch();
  const [isCatDetected, setIsCatDetected] = React.useState(false);
  const navigate = useNavigate();

  const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  React.useEffect(() => {
    if (data) navigate('/conta');
  }, [data, navigate]);

  function handleCatDetection(isCatDetected) {
    setIsCatDetected(isCatDetected);
  }

  function validateImage(file) {
    setImgError('');

    if (!file) {
      setImgError('Por favor, selecione uma imagem.');
      return false;
    }

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setImgError(
        'Formato não suportado. Por favor, selecione apenas imagens JPEG ou PNG.',
      );
      return false;
    }

    if (file.size > MAX_FILE_SIZE) {
      setImgError('Arquivo muito grande. O tamanho máximo permitido é 10MB.');
      return false;
    }

    return true;
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!img.raw) {
      setImgError('Por favor, selecione uma imagem.');
      return;
    }

    if (descricao.validate() && idade.validate() && isCatDetected && img.raw) {
      const formData = new FormData();
      formData.append('img', img.raw);
      formData.append('nome', nome.value);
      formData.append('descricao', descricao.value);
      formData.append('idade', idade.value);
      const { url, options } = PHOTO_POST(formData);
      request(url, options);
    }
  }

  function handleImgChange({ target }) {
    const file = target.files[0];

    if (!file) {
      setImg({});
      setImgError('');
      return;
    }

    if (validateImage(file)) {
      try {
        const preview = URL.createObjectURL(file);
        setImg({
          preview,
          raw: file,
        });
        setImgError('');
      } catch (error) {
        setImgError('Erro ao processar a imagem. Tente novamente.');
        setImg({});
      }
    } else {
      target.value = '';
      setImg({});
    }
  }

  function clearImage() {
    setImg({});
    setImgError('');
    const fileInput = document.getElementById('img');
    if (fileInput) fileInput.value = '';
  }

  function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  return (
    <section className={`${styles.photoPost} animeLeft`}>
      <Head title="Postar Foto" />
      <form onSubmit={handleSubmit}>
        <Input label="Nome" type="text" name="nome" {...nome} />
        <Input
          label="Legenda"
          type="text"
          name="descricao"
          placeholder={'Escreva uma legenda...'}
          style={200}
          {...descricao}
        />
        <Input label="Idade" type="number" name="idade" {...idade} />

        <div className={styles.fileInputContainer}>
          <label htmlFor="img" className={styles.fileInputLabel}>
            Selecionar Imagem (JPEG/PNG)
          </label>
          <input
            className={styles.inputFile}
            type="file"
            name="img"
            id="img"
            accept=".jpg,.jpeg,.png,image/jpeg,image/png"
            onChange={handleImgChange}
          />

          {img.raw && (
            <div className={styles.fileInfo}>
              <span className={styles.fileName}>
                📁 {img.raw.name} ({formatFileSize(img.raw.size)})
              </span>
              <button
                type="button"
                onClick={clearImage}
                className={styles.clearButton}
                title="Remover imagem"
              >
                ❌
              </button>
            </div>
          )}

          {imgError && <span className={styles.imgError}>{imgError}</span>}
        </div>

        {loading ? (
          <Button disabled>Enviando...🙀</Button>
        ) : (
          <Button disabled={!img.raw || !!imgError}>Enviar 😸</Button>
        )}

        <Error error={error} />

        <p className={styles.aviso}>
          <span>AVISO: </span>Evite imagens muito pequenas, isso garantirá que
          as fotos sejam exibidas com melhor qualidade dando nitidez e charme!
          😺📸 Formatos aceitos: JPEG e PNG (máx. 10MB)
          <span className={styles.hashtag}>#GatosEmAltaResolução </span>
        </p>
      </form>

      <div className={styles.previeContainer}>
        {img.preview && (
          <>
            <div
              className={`${styles.preview} animeLeft`}
              style={{ backgroundImage: `url(${img.preview})` }}
            ></div>
            <div>
              <React.Suspense fallback={<div>Analisando imagem...</div>}>
                <CatsIA img={img.raw} onCatDetection={handleCatDetection} />
              </React.Suspense>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default UserPhotoPost;
