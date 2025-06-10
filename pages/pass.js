import { useState, useEffect } from 'react';
import { getDatabase, ref, get } from 'firebase/database';
import { app } from '../firebaseConfig'; // ajuste o caminho conforme seu setup
import styles from '../styles/Home.module.css';

export default function Pass({ onAcessoLiberado }) {
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  const db = getDatabase(app);

  const verificarSenha = async (e) => {
    e.preventDefault();
    setErro('');
    try {
      const snapshot = await get(ref(db, 'senhas'));
      const senhasDB = snapshot.val() || [];
      const encontrada = senhasDB.find((s) => s.senha === senha.trim());
      if (encontrada) {
        onAcessoLiberado(encontrada.conteudo);
      } else {
        setErro('Senha inválida.');
      }
    } catch (error) {
      setErro('Erro ao acessar o banco de dados.');
      console.error(error);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={verificarSenha} className={styles.formulario}>
        <h1 className={styles.titulo}>🔐 Acesso Protegido</h1>
        <input
          type="password"
          placeholder="Digite sua senha"
          className={styles.input}
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
        <button type="submit" className={styles.botao}>
          Entrar
        </button>
        {erro && <p style={{ color: 'red' }}>{erro}</p>}
      </form>
    </div>
  );
}
