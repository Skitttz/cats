import '@tensorflow/tfjs-backend-cpu';
import { useEffect, useState } from 'react';
import Loading from '../Helper/Loading';
import styles from './CatsIA.module.css';

const CatsIA = ({ img, onCatDetection }) => {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isCat, setIsCat] = useState(false);

  async function objectDetector() {
    // Importa dinamicamente apenas quando precisar
    const cocoSsd = await import('@tensorflow-models/coco-ssd');
    const model = await cocoSsd.load();

    const imageElement = new Image();
    imageElement.src = URL.createObjectURL(img);

    imageElement.onload = async () => {
      const detected = await model.detect(imageElement, 10);
      setPredictions(detected);
      setLoading(false);

      const isCatDetected = detected.some(
        (prediction) => prediction.class === 'cat',
      );
      onCatDetection(isCatDetected);
      setIsCat(isCatDetected);
    };
  }

  useEffect(() => {
    if (img) {
      setLoading(true);
      objectDetector();
    }
  }, [img]);

  return (
    <>
      {!loading ? (
        <div
          className={`${styles.containerMsg} ${
            isCat ? styles.isCat : styles.notCat
          } animeDown`}
        >
          {isCat
            ? `Excelente escolha! Sua foto pode ser postada vá em frente 😸🎨🖼️`
            : `Oops! Apenas fotos de gatos são permitidas aqui 🐱🐾🛑. Era uma foto de gato? Para reportar o problema, entre em contato com o suporte`}
        </div>
      ) : (
        <div style={{ marginTop: '1rem', fontWeight: 600 }}>
          <p>
            Peraí, só um pouquinho estamos analisando se sua foto tem um...🐱🐾
          </p>
          <Loading />
        </div>
      )}
    </>
  );
};

export default CatsIA;
