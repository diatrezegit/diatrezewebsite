import { useState, useEffect } from 'react';
import styles from '../styles/Home.module.css';
import { db } from '../lib/firebase';
import {
  collection, getDocs, setDoc, doc, deleteDoc, getDoc
} from 'firebase/firestore';

const senhaPainel = 'diatreze1312';

export default function Painel() {
  const [acessoLiberado, setAcessoLiberado] = useState(false);
  const [senhaEntrada, setSenhaEntrada] = useState('');
  const [senhas, setSenhas] = useState([]);
  const [editandoIndex, setEditandoIndex] = useState(null);
  const [novaSenha, setNovaSenha] = useState('');
  const [novoConteudo, setNovoConteudo] = useState('');

  const [informacoes, setInformacoes] = useState({
    showsEfetuados: 0,
    showsPendentes: 0,
    dinheiroTotal: 0,
    dinheiroGanho: 0,
  });
  const [editandoInfo, setEditandoInfo] = useState(false);

  useEffect(() => {
    const fetchSenhas = async () => {
      const querySnapshot = await getDocs(collection(db, "senhas"));
      const dados = [];
      querySnapshot.forEach(doc => {
        dados.push({ senha: doc.id, conteudo: doc.data().conteudo });
      });
      setSenhas(dados);
    };

    const fetchInformacoes = async () => {
      const docRef = doc(db, "config", "informacoes");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setInformacoes(docSnap.data());
      }
    };

    fetchSenhas();
    fetchInformacoes();
  }, []);

  const entrarPainel = (e) => {
    e.preventDefault();
    if (senhaEntrada === senhaPainel) {
      setAcessoLiberado(true);
    } else {
      alert('Senha do painel incorreta.');
    }
  };

  const adicionarSenha = async () => {
    if (novaSenha.trim() === '') return;
    const jaExiste = senhas.some(s => s.senha === novaSenha.trim());
    if (jaExiste) {
      alert('Essa senha já existe.');
      return;
    }

    const novo = {
      senha: novaSenha.trim(),
      conteudo: '🎧 Bem-vindo ao conteúdo privado!\nVocê acessou com sucesso.'
    };

    await setDoc(doc(db, "senhas", novo.senha), { conteudo: novo.conteudo });
    setSenhas([...senhas, novo]);
    setNovaSenha('');
  };

  const removerSenha = async (index) => {
    const senhaRemover = senhas[index].senha;
    await deleteDoc(doc(db, "senhas", senhaRemover));
    const atualizadas = senhas.filter((_, i) => i !== index);
    setSenhas(atualizadas);
  };

  const iniciarEdicaoSenha = (index) => {
    setEditandoIndex(index);
    setNovaSenha(senhas[index].senha);
    setNovoConteudo(senhas[index].conteudo);
  };

  const salvarEdicao = async () => {
    if (novaSenha.trim() === '') {
      alert('Senha não pode estar vazia.');
      return;
    }

    await setDoc(doc(db, "senhas", novaSenha.trim()), { conteudo: novoConteudo });
    const atualizadas = [...senhas];
    atualizadas[editandoIndex] = { senha: novaSenha.trim(), conteudo: novoConteudo };
    setSenhas(atualizadas);
    setEditandoIndex(null);
    setNovaSenha('');
    setNovoConteudo('');
  };

  const salvarInformacoes = async () => {
    await setDoc(doc(db, "config", "informacoes"), informacoes);
    setEditandoInfo(false);
  };

  const handleChangeInfo = (e) => {
    setInformacoes({ ...informacoes, [e.target.name]: e.target.value });
  };

  const pessoasOnline = Math.floor(Math.random() * 10) + 1;

  if (!acessoLiberado) {
    return (
      <div className={styles.container}>
        <form onSubmit={entrarPainel} className={styles.formulario}>
          <h1 className={styles.titulo}>🔐 Acesso ao Painel</h1>
          <input
            className={styles.input}
            type="password"
            placeholder="Senha do painel"
            value={senhaEntrada}
            onChange={(e) => setSenhaEntrada(e.target.value)}
          />
          <button type="submit" className={styles.botao}>Entrar</button>
        </form>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.titulo}>🔐 Painel de Senhas</h1>

      {editandoIndex !== null ? (
        <div className={styles.formulario}>
          <input
            className={styles.input}
            type="text"
            placeholder="Editar senha"
            value={novaSenha}
            onChange={(e) => setNovaSenha(e.target.value)}
          />
          <textarea
            className={styles.input}
            rows="6"
            placeholder="Editar conteúdo"
            value={novoConteudo}
            onChange={(e) => setNovoConteudo(e.target.value)}
            style={{ resize: 'vertical' }}
          />
          <button className={styles.botao} onClick={salvarEdicao}>💾 Salvar</button>
          <button className={styles.botao} style={{ backgroundColor: '#f44336', marginLeft: '1rem' }} onClick={() => setEditandoIndex(null)}>Cancelar</button>
        </div>
      ) : (
        <>
          <div className={styles.formulario}>
            <input
              className={styles.input}
              type="text"
              placeholder="Nova senha"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
            />
            <button className={styles.botao} onClick={adicionarSenha}>➕ Adicionar Senha</button>
          </div>

          <div className={styles.subtitulo} style={{ marginTop: '2rem' }}>
            <h3>Senhas cadastradas:</h3>
            {senhas.length === 0 ? (
              <p>Nenhuma senha cadastrada ainda.</p>
            ) : (
              <ul>
                {senhas.map(({ senha }, index) => (
                  <li key={index} style={{ color: '#aaa', marginBottom: '0.5rem' }}>
                    <strong>{senha}</strong>
                    <button onClick={() => iniciarEdicaoSenha(index)} style={{ marginLeft: 10 }}>✏️</button>
                    <button onClick={() => removerSenha(index)} style={{ marginLeft: 10, color: '#f44336' }}>✖</button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}

      <div className={styles.subtitulo} style={{ marginTop: '3rem' }}>
        <h3>Painel de Informações:</h3>
        {editandoInfo ? (
          <div>
            {["showsEfetuados", "showsPendentes", "dinheiroTotal", "dinheiroGanho"].map((campo) => (
              <input
                key={campo}
                name={campo}
                value={informacoes[campo]}
                onChange={handleChangeInfo}
                placeholder={campo}
                className={styles.input}
              />
            ))}
            <button onClick={salvarInformacoes} className={styles.botao}>💾 Salvar</button>
          </div>
        ) : (
          <div>
            <p>Shows efetuados: {informacoes.showsEfetuados}</p>
            <p>Shows pendentes: {informacoes.showsPendentes}</p>
            <p>Dinheiro total: R$ {informacoes.dinheiroTotal}</p>
            <p>Dinheiro ganho: R$ {informacoes.dinheiroGanho}</p>
            <p>Pessoas online: {pessoasOnline}</p>
            <button onClick={() => setEditandoInfo(true)}>✏️</button>
          </div>
        )}
      </div>
    </div>
  );
}
