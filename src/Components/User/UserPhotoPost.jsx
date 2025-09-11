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
  const { data, error, loading, request } = useFetch();
  const [isCatDetected, setIsCatDetected] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (data) navigate('/conta');
  }, [data, navigate]);

  function handleCatDetection(isCatDetected) {
    setIsCatDetected(isCatDetected);
  }
  function handleSubmit(event) {
    event.preventDefault();

    if (descricao.validate() && idade.validate() && isCatDetected) {
      const formData = new FormData();
      formData.append('img', img.raw);
      formData.append('nome', nome.value);
      formData.append('descricao', descricao.value);
      formData.append('idade', idade.value);

      const { url, options } = PHOTO_POST(formData);
      request(url, options);
    } else {
      return null;
    }
  }

  function handleImgChange({ target }) {
    setImg({
      preview: URL.createObjectURL(target.files[0]),
      raw: target.files[0],
    });
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
        <input
          className={styles.inputFile}
          type="file"
          name="img"
          id="img"
          onChange={handleImgChange}
        />

        {loading ? (
          <Button disabled>Enviando...🙀</Button>
        ) : (
          <Button>Enviar 😸</Button>
        )}
        <Error error={error} />
        <p className={styles.aviso}>
          <span>AVISO: </span>Evite imagens muito pequenas, isso garantirá que
          as fotos sejam exibidas com melhor qualidade dando nitidez e charme!
          😺📸
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
              <React.Suspense fallback={<div></div>}>
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
