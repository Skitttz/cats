import { useRegisterSW } from 'virtual:pwa-register/react';
import styles from './PwaUpdatePrompt.module.css';

function PwaUpdatePrompt() {
  const {
    needRefresh: [needRefreshState, setNeedRefreshState],
    updateServiceWorker,
  } = useRegisterSW();

  if (!needRefreshState) return null;

  return (
    <div className={styles.prompt} role="status">
      <span className={styles.text}>
        Uma nova versão do Cats está disponível
      </span>
      <button
        type="button"
        className={styles.accept}
        onClick={() => updateServiceWorker(true)}
      >
        Atualizar
      </button>
      <button
        type="button"
        className={styles.dismiss}
        onClick={() => setNeedRefreshState(false)}
      >
        Agora não
      </button>
    </div>
  );
}

export { PwaUpdatePrompt };
