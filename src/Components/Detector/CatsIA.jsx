import React from 'react';
import '@tensorflow/tfjs-backend-cpu';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import Loading from '../Helper/Loading';
import styles from './CatsIA.module.css';

const CatsIA = ({ img, onCatDetection }) => {
  const [predictions, setPredictions] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [isCat, setIsCat] = React.useState(false);
  let isCatDetected = false; // Declare a variável aqui fora

  const suporte = (
    <a href="mailto:seuendereco@email.com">Entre em contato com o suporte</a>
  );

  async function objectDetector() {
    const model = await cocoSsd.load();
    const imageElement = new Image();
    imageElement.src = URL.createObjectURL(img);

    imageElement.onload = async () => {
      const detected = await model.detect(imageElement, 10);
      setPredictions(detected);
      setLoading(false);

      // Verifique previsao é um gato retorna true ou false
      isCatDetected = detected.some((prediction) => prediction.class == 'cat');

      // Atualize o estado isCat com base na detecção
      onCatDetection(isCatDetected);
      setIsCat(isCatDetected);
    };
  }

  React.useEffect(() => {
    if (img) {
      setLoading(true);
      objectDetector();
    }
  }, [img]);

  return (
    <>
      {/*  linecode -> Para ver todos os box de obj da IA
      <div>
        {predictions.map((prediction, index) => (
          <div
            style={{
              display: "flex",
              backgroundColor: "purple",
              marginTop: "1rem",
              borderRadius: "0.2rem",
            }}
          >
            <li style={{ color: "white", textAlign: "center" }} key={index}>
              <p> {prediction.class}</p>
            </li>
          </div>
        ))} 
        </div>
        */}
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
