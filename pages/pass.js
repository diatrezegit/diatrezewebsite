import { useState, useEffect } from 'react';
import styles from '../styles/Home.module.css';
import { db } from '../lib/firebase';
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  addDoc,
  query,
  orderBy
} from 'firebase/firestore';

export default function Pass() {
  const [senha, setSenha] = useState('');
  const [acesso, setAcesso] = useState(false);
  const [conteudo, setConteudo] = useState('');
  const [nomeUsuario, setNomeUsuario] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [mensagens, setMensagens] = useState([]);

  const verificarSenha = async () => {
    const ref = doc(db, "senhas", senha.trim());
    const snap = await getDoc(ref);

    if (snap.exists()) {
      const data = snap.data();
      setConteudo(data.conteudo || '');
      setNomeUsuario(data.nome || 'Anônimo');
      setAcesso(true);

      // Conectar ao chat global
      const mensagensRef = collection(db, 'chat', 'global', 'mensagens');
      const q = query(mensagensRef, orderBy('data'));

      onSnapshot(q, (snapshot) => {
        const lista = snapshot.docs.map(doc => doc.data());
        setMensagens(lista);
      });
    } else {
      alert('Senha inválida.');
    }
  };

  const enviarMensagem = async () => {
    if (mensagem.trim() === '') return;

    await addDoc(collection(db, 'chat', 'global', 'mensagens'), {
      nome: nomeUsuario,
      texto: mensagem.trim(),
      data: new Date()
    });

    setMensagem('');
  };

  const formatarData = (date) => {
    const d = date.toDate();
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <div className={styles.container}>
      {!acesso ? (
        <div className={styles.formulario}>
          <h1 className={styles.titulo}>🔒 Conteúdo Protegido</h1>
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

          <div style={{ marginTop: '30px', width: '100%' }}>
            <h3>💬 Bate-papo Global ({nomeUsuario})</h3>
            <div
              style={{
                border: '1px solid #444',
                padding: '10px',
                borderRadius: '10px',
                maxHeight: '300px',
                overflowY: 'auto',
                marginBottom: '10px'
              }}
            >
              {mensagens.map((msg, index) => (
                <div key={index} style={{ marginBottom: '5px' }}>
                  <div><strong>{msg.nome}</strong> <span style={{ color: '#999' }}>{formatarData(msg.data)}</span></div>
                  <div>{msg.texto}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                className={styles.input}
                type="text"
                placeholder="Digite sua mensagem"
                value={mensagem}
                onChange={(e) => setMensagem(e.target.value)}
              />
              <button className={styles.botao} onClick={enviarMensagem}>
                Enviar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}