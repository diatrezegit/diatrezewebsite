import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';

export default function AppPage() {
  const [isAndroid, setIsAndroid] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    setIsAndroid(userAgent.includes('android'));
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.titulo}>📱 Aplicativo da D13</h1>
      <p className={styles.subtitulo} style={{ maxWidth: 600, textAlign: 'center' }}>
        Baixe nosso app para ter uma melhor experiência pelo site!
      </p>

      {isAndroid && (
        <a
          href="/files/DiaTrezeApp_release.apk"
          download
          className={styles.botao}
          style={{ marginTop: '2rem' }}
        >
          📥 Baixar App Android
        </a>
      )}

      {!isAndroid && (
        <p style={{ marginTop: '2rem', color: '#aaa', fontSize: '0.9rem' }}>
          O app está disponível apenas para dispositivos Android.
        </p>
      )}
    </div>
  );
}