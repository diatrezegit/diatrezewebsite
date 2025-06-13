import { useState, useEffect } from 'react';
import styles from '../styles/Home.module.css';
import { db } from '../lib/firebase';
import {
  collection, getDocs, setDoc, doc, deleteDoc, getDoc,
  onSnapshot
} from 'firebase/firestore';

const senhaPainel = 'diatreze1312';

export default function Painel() {
  const [acessoLiberado, setAcessoLiberado] = useState(false);
  const [senhaEntrada, setSenhaEntrada] = useState('');
  const [senhas, setSenhas] = useState([]);
  const [editandoIndex, setEditandoIndex] = useState(null);
  const [novaSenha, setNovaSenha] = useState('');
  const [nomeNovo, setNomeNovo] = useState('');
  const [novoConteudo, setNovoConteudo] = useState('');
  const [informacoes, setInformacoes] = useState({
    showsEfetuados: 0,
    showsPendentes: 0,
    dinheiroTotal: 0,
    dinheiroGanho: 0,
    pessoasOnline: 0,
  });
  const [editandoInfo, setEditandoInfo] = useState(false);

  const [abaAtiva, setAbaAtiva] = useState('senhas');

  useEffect(() => {
    const fetchSenhas = async () => {
      const querySnapshot = await getDocs(collection(db, "senhas"));
      const dados = [];
      querySnapshot.forEach(doc => {
        dados.push({ senha: doc.id, conteudo: doc.data().conteudo, nome: doc.data().nome });
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

    const unsubOnline = onSnapshot(doc(db, "config", "informacoes"), (docSnap) => {
      if (docSnap.exists()) {
        setInformacoes(prev => ({ ...prev, pessoasOnline: docSnap.data().pessoasOnline || 0 }));
      }
    });

    const atualizarOnline = async () => {
      const docRef = doc(db, "config", "informacoes");
      const snap = await getDoc(docRef);
      let atual = 0;
      if (snap.exists()) {
        atual = snap.data().pessoasOnline || 0;
      }
      await setDoc(docRef, { ...snap.data(), pessoasOnline: atual + 1 });
    };

    atualizarOnline();

    const antesDeSair = async () => {
      const docRef = doc(db, "config", "informacoes");
      const snap = await getDoc(docRef);
      let atual = 1;
      if (snap.exists()) {
        atual = snap.data().pessoasOnline || 1;
      }
      await setDoc(docRef, { ...snap.data(), pessoasOnline: Math.max(atual - 1, 0) });
    };

    window.addEventListener("beforeunload", antesDeSair);

    return () => {
      window.removeEventListener("beforeunload", antesDeSair);
      unsubOnline();
    };
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
    if (novaSenha.trim() === '' || nomeNovo.trim() === '') return;
    const jaExiste = senhas.some(s => s.senha === novaSenha.trim());
    if (jaExiste) {
      alert('Essa senha já existe.');
      return;
    }

    const novo = {
      senha: novaSenha.trim(),
      conteudo: '🎧 Bem-vindo ao conteúdo privado!\nVocê acessou com sucesso.',
      nome: nomeNovo.trim()
    };

    await setDoc(doc(db, "senhas", novo.senha), { conteudo: novo.conteudo, nome: novo.nome });
    setSenhas([...senhas, novo]);
    setNovaSenha('');
    setNomeNovo('');
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
    setNomeNovo(senhas[index].nome || '');
  };

  const salvarEdicao = async () => {
    if (novaSenha.trim() === '' || nomeNovo.trim() === '') {
      alert('Preencha todos os campos.');
      return;
    }

    const senhaOriginal = senhas[editandoIndex].senha;
    if (senhaOriginal !== novaSenha.trim()) {
      await deleteDoc(doc(db, "senhas", senhaOriginal));
    }

    await setDoc(doc(db, "senhas", novaSenha.trim()), { conteudo: novoConteudo, nome: nomeNovo.trim() });
    const atualizadas = [...senhas];
    atualizadas[editandoIndex] = { senha: novaSenha.trim(), conteudo: novoConteudo, nome: nomeNovo.trim() };
    setSenhas(atualizadas);
    setEditandoIndex(null);
    setNovaSenha('');
    setNovoConteudo('');
    setNomeNovo('');
  };

  const salvarInformacoes = async () => {
    await setDoc(doc(db, "config", "informacoes"), informacoes);
    setEditandoInfo(false);
  };

  const handleChangeInfo = (e) => {
    setInformacoes({ ...informacoes, [e.target.name]: e.target.value });
  };

  if (!acessoLiberado) {
    return (
      <div className={styles.container}>
        <form onSubmit={entrarPainel} className={styles.formulario}>
          <h1 className={styles.titulo}>🔐 Acesso Restrito</h1>
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
      <h1 className={styles.titulo}>⚙️ Painel Administrativo</h1>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <button onClick={() => setAbaAtiva('senhas')} className={styles.botao}>🔑 Senhas</button>
        <button onClick={() => setAbaAtiva('informacoes')} className={styles.botao}>📋 Informações</button>
      </div>

      {abaAtiva === 'senhas' && (
        <>
          {editandoIndex !== null ? (
            <div className={styles.formulario}>
              <input className={styles.input} type="text" placeholder="Editar senha" value={novaSenha} onChange={(e) => setNovaSenha(e.target.value)} />
              <input className={styles.input} type="text" placeholder="Editar nome" value={nomeNovo} onChange={(e) => setNomeNovo(e.target.value)} />
              <textarea className={styles.input} rows="6" placeholder="Editar conteúdo" value={novoConteudo} onChange={(e) => setNovoConteudo(e.target.value)} style={{ resize: 'vertical' }} />
              <button className={styles.botao} onClick={salvarEdicao}>💾 Salvar</button>
              <button className={styles.botao} style={{ backgroundColor: '#f44336', marginLeft: '1rem' }} onClick={() => {
                setEditandoIndex(null);
                setNovaSenha('');
                setNovoConteudo('');
                setNomeNovo('');
              }}>Cancelar</button>
            </div>
          ) : (
            <>
              <div className={styles.formulario}>
                <input className={styles.input} type="text" placeholder="Nova senha" value={novaSenha} onChange={(e) => setNovaSenha(e.target.value)} />
                <input className={styles.input} type="text" placeholder="Nome do usuário" value={nomeNovo} onChange={(e) => setNomeNovo(e.target.value)} />
                <button className={styles.botao} onClick={adicionarSenha}>➕ Adicionar Senha</button>
              </div>
              <div className={styles.subtitulo} style={{ marginTop: '2rem' }}>
                <h3>Senhas cadastradas:</h3>
                {senhas.length === 0 ? (
                  <p>Nenhuma senha cadastrada ainda.</p>
                ) : (
                  <ul>
                    {senhas.map(({ senha, nome }, index) => (
                      <li key={index} style={{ color: '#aaa', marginBottom: '0.5rem' }}>
                        <strong>{senha}</strong> - <em>{nome}</em>
                        <button onClick={() => iniciarEdicaoSenha(index)} style={{ marginLeft: 10 }}>✏️</button>
                        <button onClick={() => removerSenha(index)} style={{ marginLeft: 10, color: '#f44336' }}>✖</button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          )}
        </>
      )}

      {abaAtiva === 'informacoes' && (
        <div className={styles.subtitulo}>
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
              <p>Pessoas online: {informacoes.pessoasOnline}</p>
              <button onClick={() => setEditandoInfo(true)}>✏️</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
