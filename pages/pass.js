import { useState, useEffect } from 'react';
import styles from '../styles/Home.module.css';

export default function Pass() {
  const [senha, setSenha] = useState('');
  const [acesso, setAcesso] = useState(false);
  const [conteudo, setConteudo] = useState('');

  const verificarSenha = () => {
    const senhas = JSON.parse(localStorage.getItem('senhas')) || [];
    const conteudoPorSenha = JSON.parse(localStorage.getItem('conteudoPorSenha')) || {};

    if (senhas.includes(senha)) {
      setAcesso(true);
      setConteudo(conteudoPorSenha[senha] || '🎧 Bem-vindo ao conteúdo privado!\nVocê acessou com sucesso.');
    } else {
      alert('Senha inválida.');
    }
  };

  return (
    <div className={styles.container}>
      {!acesso ? (
        <div className={styles.formulario}>
          <h1 className={styles.titulo}>🔒 Área Restrita</h1>
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
