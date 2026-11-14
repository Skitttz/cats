import { useEffect, useRef, useState } from 'react';
import Loading from '../Helper/Loading';
import { createCatDetector } from './catDetector';
import styles from './CatsIA.module.css';

async function loadModel() {
  await Promise.all([
    import('@tensorflow/tfjs-backend-cpu'),
    import('@tensorflow/tfjs-backend-webgl'),
  ]);
  const tf = await import('@tensorflow/tfjs-core');
  await tf.ready();
  const cocoSsd = await import('@tensorflow-models/coco-ssd');
  return cocoSsd.load();
}

const CatsIA = ({ img, onCatDetection }) => {
  const [status, setStatus] = useState('analyzing');
  const detectorRef = useRef(null);
  const callbackRef = useRef(onCatDetection);
  callbackRef.current = onCatDetection;

  useEffect(() => {
    const detector = createCatDetector({
      loadModel,
      createImage: () => new Image(),
      createObjectURL: (file) => URL.createObjectURL(file),
      revokeObjectURL: (url) => URL.revokeObjectURL(url),
    });
    detectorRef.current = detector;
    return () => { detector.dispose(); };
  }, []);

  useEffect(() => {
    if (!img) return;
    let cancelled = false;
    setStatus('analyzing');
    callbackRef.current('analyzing');
    const detector = detectorRef.current;
    detector.detect(img).then(
      (isCat) => {
        if (cancelled) return;
        const result = isCat ? 'detected' : 'missing';
        setStatus(result);
        callbackRef.current(result);
      },
      () => {
        if (cancelled) return;
        setStatus('unavailable');
        callbackRef.current('unavailable');
      },
    );
    return () => { cancelled = true; };
  }, [img]);

  if (status === 'analyzing') return (
    <div style={{ marginTop: '1rem', fontWeight: 600 }} role="status">
      <p>Analisando se sua foto tem um gatinho… 🐱🐾</p>
      <Loading />
    </div>
  );

  const messages = {
    detected: 'Excelente escolha! Sua foto pode ser postada 😸🎨🖼️',
    missing: 'Oops! Apenas fotos de gatos são permitidas aqui 🐱🐾. Escolha outra foto ou contate o suporte.',
    unavailable: '⚠️ Detector temporariamente indisponível. Tente selecionar a foto novamente para publicar.',
  };
  return (
    <div className={`${styles.containerMsg} ${status === 'detected' ? styles.isCat : styles.notCat} animeDown`} role="status">
      {messages[status]}
    </div>
  );
};

export default CatsIA;
