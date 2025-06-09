import styles from '../styles/Home.module.css';

export default function About() {
  return (
    <div className={styles.container}>
      <h1 className={styles.titulo}>📖 Sobre Nós</h1>
      <p className={styles.subtitulo} style={{ textAlign: 'justify' }}>
        A Dia Treze (D13) nasceu de um sonho — o sonho de um garoto <strong>João</strong>, que sempre foi movido por música. Batida, trap, sentimento... tudo isso fez uma parte da vida dele. Com o amor em música, ele decidiu transformar essa paixão em algo maior: uma gravadora e produtora musical.
      </p>
      <p className={styles.subtitulo} style={{ textAlign: 'justify' }}>
        Mas o caminho até aqui não foi tão direto assim. Antes de se chamar Dia Treze, a D13 teve vários outros nomes — alguns bons, outros nem tanto (melhor nem citar). A verdade é que a identidade foi se moldando com o tempo, com os sons, com as ideias. Até que tudo fez sentido na Dia Treze.
      </p>
      <p className={styles.subtitulo} style={{ textAlign: 'justify' }}>
        Só que ninguém faz tudo sozinho. Foi aí que ele chamou <strong>Murilo</strong> — um cara meio bom (mas com muito potencial), que também curtia música... pelo menos um pouco. O convite veio: “Topa participar de uma gravadora?” Murilo pensou duas vezes, fez uma cara de dúvida, mas topou. E foi aí que tudo começou de verdade.
      </p>
      <p className={styles.subtitulo} style={{ textAlign: 'justify' }}>
        Desde então, a D13 deixou de ser só uma ideia e virou uma gravadora musical e produtora de som. Uma gravadora onde cada beat tem propósito e cada letra tem verdade. A gente não tá aqui pra copiar ninguém — a gente tá aqui pra fazer do nosso jeito.
      </p>
      <p className={styles.subtitulo} style={{ textAlign: 'center', fontWeight: 'bold', marginTop: '2rem' }}>
        A D13 é mais do que uma produtora. É o trap, uma família, um grito de quem vive o trap de verdade.<br /><br />
        Aqui, a gente vive o trap.<br />
        Aqui, a gente é o trap.
      </p>
    </div>
  );
}
