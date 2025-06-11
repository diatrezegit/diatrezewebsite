import Link from 'next/link';
import styles from '../styles/Home.module.css';

export default function Layout({ children }) {
  return (
    <div className={styles.container}>
      <nav className={styles.navbar}>
        <div className={styles.navHeader}>
          <div className={styles.logo}>🎶 Dia Treze</div>
        </div>

        <div className={styles.links}>
          <Link href="/" className={styles.botao}>🏠 Início</Link>
          <Link href="/about" className={styles.botao}>👥 Sobre nós</Link>
          <Link href="/shows" className={styles.botao}>🎤 Shows</Link>
          <Link href="/pass" className={styles.botao}>🔒 Conteúdo</Link>
          <Link href="/panel" className={styles.botao}>⚙️ Painel</Link>
        </div>
      </nav>

      {children}

      <footer className={styles.rodape}>
        <p>2025 Todos os direitos © DIA TREZE - Desenvolvido por D13 Website</p>
        <p>
          <a href="https://www.instagram.com/diatrezebr/" target="_blank" rel="noopener noreferrer">Instagram</a>{' | '}
          <a href="https://wa.me/5566996613122" target="_blank" rel="noopener noreferrer">WhatsApp</a>{' | '}
          <a href="mailto:contatodiatreze@outlook.com.br">Email</a>
        </p>
        <p>
          Dia Treze é um espaço onde há música, mesmo sem a fama e o reconhecimento como grandes estúdios musicais...
        </p>
      </footer>
    </div>
  );
}
