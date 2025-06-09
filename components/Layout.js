import Link from 'next/link';
import styles from '../styles/Home.module.css';

export default function Layout({ children }) {
  return (
    <div className={styles.container}>
      <nav style={{ marginBottom: '2rem' }}>
        <Link href="/" className={styles.botao} style={{ marginRight: '1rem' }}>🏠 Início</Link>
        <Link href="/about" className={styles.botao} style={{ marginRight: '1rem' }}>👥 Sobre nós</Link>
        <Link href="/shows" className={styles.botao} style={{ marginRight: '1rem' }}>🎤 Shows</Link>
        <Link href="/pass" className={styles.botao} style={{ marginRight: '1rem' }}>🔒 Conteúdo</Link>
        <Link href="/panel" className={styles.botao}>⚙️ Painel</Link>
      </nav>

      {children}

      <footer style={{ marginTop: '3rem', textAlign: 'center', color: '#aaa', maxWidth: 600 }}>
        <p>2025 Todos os direitos © DIA TREZE - Desenvolvido por D13 Website</p>
        <p>
          <a href="https://www.instagram.com/diatrezebr/" target="_blank" rel="noopener noreferrer" style={{ color: '#ccc', textDecoration: 'underline' }}>
            Instagram
          </a>{' | '}
          <a href="https://wa.me/5566996613122" target="_blank" rel="noopener noreferrer" style={{ color: '#ccc', textDecoration: 'underline' }}>
            WhatsApp
          </a>{' | '}
          <a href="mailto:contatodiatreze@outlook.com.br" style={{ color: '#ccc', textDecoration: 'underline' }}>
            Email
          </a>
        </p>
        <p style={{ marginTop: '1rem' }}>
          Dia Treze é um espaço onde há música, mesmo sem a fama e o reconhecimento como grandes estúdios musicais. Aqui, acreditamos que tudo vai dar certo.
          Com João MC e Murilo MC como o vocal, cada música é uma música única. O nome do estúdio carrega uma sugestão de nossos colaboradores, e cada música,
          cada letra, é criada com paixão por nossa equipe. Esse é o nosso orgulho, é a nossa Dia Treze!!!
        </p>
      </footer>
    </div>
  );
}
