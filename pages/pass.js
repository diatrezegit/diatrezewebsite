// pass.js
import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import styles from '../styles/Home.module.css';

export default function ConteudoPrivado() {
  const [senhaDigitada, setSenhaDigitada] = useState('');
  const [acessoPermitido, setAcessoPermitido] = useState(false);
  const [conteudo, setConteudo] = useState('');
  const [senhas, setSenhas] = useState([]);

  useEffect(() => {
    const carregarSenhas = async () => {
      const querySnapshot = await getDocs(collection(db, 'senhas'));
      const data = querySnapshot.docs.map(doc => doc.data());
      setSenhas(data);
    };

    carregarSenhas();
  }, []);

  const verificarSenha = (e) => {
    e.preventDefault();
    const encontrada = senhas.find((s) => s.senha === senhaDigitada);
    if (encontrada) {
      setAcessoPermitido(true);
      setConteudo(encontrada.conteudo);
    } else {
      alert('Senha inválida.');
    }
  };

  if (!acessoPermitido) {
    return (
      <div className={styles.container}>
        <form onSubmit={verificarSenha} className={styles.formulario}>
          <h1 className={styles.titulo}>🔒 Conteúdo Privado</h1>
          <input
            className={styles.input}
            type="password"
            placeholder="Digite a senha"
            value={senhaDigitada}
            onChange={(e) => setSenhaDigitada(e.target.value)}
          />
          <button type="submit" className={styles.botao}>Acessar</button>
        </form>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.titulo}>🎧 Conteúdo Privado</h1>
      <pre className={styles.conteudoPrivado}>{conteudo}</pre>
    </div>
  );
}
