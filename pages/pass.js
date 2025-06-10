import { useState, useEffect } from 'react';
import styles from '../styles/Home.module.css';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function Pass() {
  const [senha, setSenha] = useState('');
  const [acesso, setAcesso] = useState(false);
  const [conteudo, setConteudo] = useState('');
  const [senhasMap, setSenhasMap] = useState({});

  useEffect(() => {
    const fetchSenhas = async () => {
      const querySnapshot = await getDocs(collection(db, "senhas"));
      const map = {};
      querySnapshot.forEach(doc => {
        map[doc.id] = doc.data().conteudo;
      });
      setSenhasMap(map);
    };
    fetchSenhas();
  }, []);

  const verificarSenha = () => {
    if (senha in senhasMap) {
      setAcesso(true);
      setConteudo(senhasMap[senha]);
    } else {
      alert('Senha inválida.');
    }
  };

  return (
    <div className={styles.container}>
      {!acesso ? (
        <div className={styles.formulario}>
          <h1 className={styles.titulo}>🔐 Conteúdo Protegido</h1>
          <input
            className={styles.input}
            type="password"
            placeholder="Digite a senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
          <button className={styles.botao} onClick={verificarSenha}>
            Acessar
          </button>
        </div>
      ) : (
        <div className={styles.resultado}>
          <h2>🔓 Acesso Liberado</h2>
          <p style={{ whiteSpace: 'pre-wrap' }}>{conteudo}</p>
        </div>
      )}
    </div>
  );
}
