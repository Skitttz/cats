import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PHOTO_POST } from '../../Api';
import useFetch from '../../Hooks/useFetch';
import useForm from '../../Hooks/useForm';
import Button from '../Forms/Button';
import Input from '../Forms/Input';
import Error from '../Helper/Error';
import Head from '../Helper/Head';
import styles from './UserPhotoPost.module.css';

const CatsIA = React.lazy(() => import('../Detector/CatsIA'));

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png'];
const ACCEPTED_EXTENSIONS = ['.jpg', '.jpeg', '.png'];

const UserPhotoPost = () => {
  const nome = useForm();
  const descricao = useForm('description');
  const idade = useForm('age');
  const [img, setImg] = React.useState({ preview: null, raw: null });
  const [imgError, setImgError] = React.useState('');
  const [catDetectionError, setCatDetectionError] = React.useState(false);
  const { data, error, loading, request } = useFetch();
  const [isCatDetected, setIsCatDetected] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (data) navigate('/conta');
  }, [data, navigate]);

  React.useEffect(() => {
    return () => {
      if (img.preview) URL.revokeObjectURL(img.preview);
    };
  }, [img.preview]);

  const validateImage = (file) => {
    setImgError('');
    if (!file) {
      setImgError('Por favor, selecione uma imagem.');
      return false;
    }

    const fileName = file.name.toLowerCase();
    const isValidExtension = ACCEPTED_EXTENSIONS.some((ext) =>
      fileName.endsWith(ext),
    );
    const isValidType = ACCEPTED_IMAGE_TYPES.includes(file.type);

    if (!isValidExtension || !isValidType) {
      setImgError('Formato não suportado. Use JPEG (.jpg) ou PNG (.png).');
      return false;
    }

    return true;
  };

  const handleImgChange = ({ target }) => {
    const file = target.files[0];
    if (!file) {
      setImg({ preview: null, raw: null });
      setImgError('');
      setIsCatDetected(false);
      setCatDetectionError(false);
      return;
    }

    if (validateImage(file)) {
      if (img.preview) URL.revokeObjectURL(img.preview);
      setImg({ preview: URL.createObjectURL(file), raw: file });
      setImgError('');
      setIsCatDetected(false);
      setCatDetectionError(false);
    } else {
      setImg({ preview: null, raw: null });
      setIsCatDetected(false);
      setCatDetectionError(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!img.raw) {
      setImgError('Por favor, selecione uma imagem.');
      return;
    }

    if (!isCatDetected) {
      setImgError('Ops! A imagem deve conter um gato 😺.');
      return;
    }

    if (
      nome.validate() &&
      descricao.validate() &&
      idade.validate() &&
      img.raw &&
      isCatDetected
    ) {
      const formData = new FormData();
      formData.append('img', img.raw);
      formData.append('nome', nome.value);
      formData.append('descricao', descricao.value);
      formData.append('idade', idade.value);

      const { url, options } = PHOTO_POST(formData);
      request(url, options);
    }
  };

  const handleCatDetection = React.useCallback(
    (catDetected) => {
      setIsCatDetected(catDetected);
      setCatDetectionError(!catDetected && !imgError);
    },
    [imgError],
  );

  return (
    <section className={`${styles.photoPost} animeLeft`}>
      <Head title="Postar Foto" />
      <form onSubmit={handleSubmit}>
        <Input label="Nome" type="text" name="nome" {...nome} />
        <Input
          label="Legenda"
          type="text"
          name="descricao"
          placeholder="Escreva uma legenda..."
          style={200}
          {...descricao}
        />
        <Input label="Idade" type="text" name="idade" {...idade} />

        <div className={styles.fileInputContainer}>
          <input
            id="img"
            type="file"
            accept=".jpg,.jpeg,.png"
            onChange={handleImgChange}
            className={styles.inputFile}
          />
        </div>

        <Button disabled={loading || !!imgError || !img.raw || !isCatDetected}>
          {loading ? 'Enviando...🙀' : 'Enviar 😸'}
        </Button>

        <Error error={error || imgError} />

        <p className={styles.aviso}>
          <strong>AVISO:</strong> Evite enviar imagens maiores que 10MB para não
          sobrecarregar o servidor 😺📸
          <span className={styles.hashtag}> #GatinhosNaMedida</span>
        </p>
      </form>

      {img.preview && (
        <div className={styles.previeContainer}>
          <div
            className={`${styles.preview} animeLeft`}
            style={{ backgroundImage: `url(${img.preview})` }}
          />
          <React.Suspense fallback={<div>Carregando detector de gatos...</div>}>
            <CatsIA
              key={img.raw?.name || 'no-image'}
              img={img.raw}
              onCatDetection={handleCatDetection}
            />
          </React.Suspense>
        </div>
      )}
    </section>
  );
};

export default UserPhotoPost;
