import { useEffect, useState } from 'react';
import Loading from '../Helper/Loading';
import styles from './CatsIA.module.css';

const CatsIA = ({ img, onCatDetection }) => {
  const [loading, setLoading] = useState(false);
  const [isCat, setIsCat] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!img) return;

    const detectCat = async () => {
      setLoading(true);
      setError(false);

      try {
        await import('@tensorflow/tfjs-backend-cpu');
        await import('@tensorflow/tfjs-backend-webgl');

        const tf = await import('@tensorflow/tfjs-core');

        await tf.ready();

        // Importa o modelo
        const cocoSsd = await import('@tensorflow-models/coco-ssd');
        const model = await cocoSsd.load();

        const imageElement = new Image();
        imageElement.crossOrigin = 'anonymous';

        const imageLoadPromise = new Promise((resolve, reject) => {
          imageElement.onload = resolve;
          imageElement.onerror = reject;
          imageElement.src = URL.createObjectURL(img);
        });

        await imageLoadPromise;

        const predictions = await model.detect(imageElement, 10);
        const catDetected = predictions.some((p) => p.class === 'cat');

        setIsCat(catDetected);
        onCatDetection(catDetected);

        URL.revokeObjectURL(imageElement.src);
      } catch (err) {
        console.error('Erro na detecção de gatos:', err);
        setError(true);
        onCatDetection(false);
      } finally {
        setLoading(false);
      }
    };

    detectCat();
  }, [img, onCatDetection]);

  if (error) {
    return (
      <div className={`${styles.containerMsg} ${styles.notCat} animeDown`}>
        ⚠️ Detector temporariamente indisponível. Você pode prosseguir com a
        foto.
      </div>
    );
  }

  return loading ? (
    <div style={{ marginTop: '1rem', fontWeight: 600 }}>
      <p>Analisando se sua foto tem um gatin...🐱🐾</p>
      <Loading />
    </div>
  ) : (
    <div
      className={`${styles.containerMsg} ${
        isCat ? styles.isCat : styles.notCat
      } animeDown`}
    >
      {isCat
        ? `Excelente escolha! Sua foto pode ser postada vá em frente 😸🎨🖼️`
        : `Oops! Apenas fotos de gatos são permitidas aqui 🐱🐾🛑. Era uma foto de gato? Para reportar o problema, entre em contato com o suporte`}
    </div>
  );
};

export default CatsIA;
