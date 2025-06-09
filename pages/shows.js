import { useState } from 'react';
import styles from '../styles/Home.module.css'; // Certifique-se de que esse caminho está correto

export default function Shows() {
  const [aceitou, setAceitou] = useState(false);

  const handleChange = (e) => {
    setAceitou(e.target.checked);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto', color: '#f1f1f1', fontFamily: 'Poppins, sans-serif', background: '#0e0e0e' }}>
      {!aceitou ? (
        <>
          <h1>📄 Termos & Regras para Agendar um Show da D13 (Duo Mirim do Trap)</h1>
          <ol>
            <li><strong>📅 Agendamento:</strong> mínimo 15 dias de antecedência. Confirmação após sinal (50%).</li>
            <li><strong>💰 Cachê & Pagamento:</strong> valor conforme local. Pagamento: 50% reserva + 50% até o dia.</li>
            <li><strong>🛠️ Estrutura:</strong> contratante oferece palco, som, luz. Podemos indicar parceiros.</li>
            <li><strong>🧍‍♂️🧍‍♀️ Acompanhamento:</strong> responsáveis estarão presentes.</li>
            <li><strong>🚗 Deslocamento & Hospedagem:</strong> fora do RJ, transporte e hospedagem para 4 adultos + 4 crianças.</li>
            <li><strong>❌ Cancelamento:</strong> &lt; 7 dias → perda do sinal. Cancelado por D13 → reembolso ou remarcação.</li>
            <li><strong>📸 Imagem & Divulgação:</strong> filmagem permitida sem uso comercial. D13 pode divulgar trechos, salvo pedido de sigilo.</li>
            <li><strong>⏰ Pontualidade:</strong> equipe chega com antecedência; contratante garante estrutura pronta.</li>
          </ol>

          <div style={{ marginTop: '2rem' }}>
            <label>
              <input type="checkbox" onChange={handleChange} /> Li e aceito os termos para agendar o show.
            </label>
          </div>
        </>
      ) : (
        <div className={styles.container}>
          <h1 className={styles.titulo}>🎤 Agendamento de Shows</h1>
          <p className={styles.subtitulo}>
            Preencha o formulário abaixo para solicitar um show ou evento com a Dia Treze.
          </p>
          <div style={{ width: '100%', maxWidth: '800px', marginTop: '2rem' }}>
            <iframe
              src="https://docs.google.com/forms/d/e/1FAIpQLSeQdyiD4jwnz9fFkyaS1O4d1-YziFSD315e8aymOYflFGUVBw/viewform?embedded=true"
              width="100%"
              height="900"
              frameBorder="0"
              marginHeight="0"
              marginWidth="0"
              title="Agendamento de Shows"
            >
              Carregando…
            </iframe>
          </div>
        </div>
      )}
    </div>
  );
}
