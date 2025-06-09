import { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc
} from 'firebase/firestore';
import styles from '../styles/Home.module.css';

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
  const [ids, setIds] = useState([]);

  useEffect(() => {
    const carregarSenhas = async () => {
      const querySnapshot = await getDocs(collection(db, 'senhas'));
      const data = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setSenhas(data);
    };

    const carregarInfo = async () => {
      const querySnapshot = await getDocs(collection(db, 'informacoes'));
      querySnapshot.forEach(doc => setInformacoes({ ...doc.data(), id: doc.id }));
    };

    carregarSenhas();
    carregarInfo();
  }, []);

  const entrarPainel = (e) => {
    e.preventDefault();
    if (senhaEntrada === senhaPainel) setAcessoLiberado(true);
    else alert('Senha do painel incorreta.');
  };

  const adicionarSenha = async () => {
    const docRef = await addDoc(collection(db, 'senhas'), {
      senha: novaSenha,
      conteudo: '🎧 Bem-vindo ao conteúdo privado!\nVocê acessou com sucesso.'
    });
    setSenhas([...senhas, { senha: novaSenha, conteudo: '🎧 Bem-vindo ao conteúdo privado!\nVocê acessou com sucesso.', id: docRef.id }]);
    setNovaSenha('');
  };

  const removerSenha = async (id) => {
    await deleteDoc(doc(db, 'senhas', id));
    setSenhas(senhas.filter(s => s.id !== id));
  };

  const iniciarEdicaoSenha = (index) => {
    setEditandoIndex(index);
    setNovaSenha(senhas[index].senha);
    setNovoConteudo(senhas[index].conteudo);
  };

  const salvarEdicao = async () => {
    const id = senhas[editandoIndex].id;
    await updateDoc(doc(db, 'senhas', id), {
      senha: novaSenha,
      conteudo: novoConteudo
    });
    const novas = [...senhas];
    novas[editandoIndex] = { senha: novaSenha, conteudo: novoConteudo, id };
    setSenhas(novas);
    setEditandoIndex(null);
    setNovaSenha('');
    setNovoConteudo('');
  };

  const salvarInformacoes = async () => {
    await updateDoc(doc(db, 'informacoes', informacoes.id), informacoes);
    setEditandoInfo(false);
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

      {editandoIndex !== null && (
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
          <button
            className={styles.botao}
            style={{ backgroundColor: '#f44336', marginLeft: '1rem' }}
            onClick={() => setEditandoIndex(null)}
          >Cancelar</button>
        </div>
      )}

      <div className={styles.subtitulo}>
        <h3>Senhas cadastradas:</h3>
        {senhas.map((s, i) => (
          <p key={s.id}><strong>{s.senha}</strong>
            <button onClick={() => iniciarEdicaoSenha(i)}>✏️</button>
            <button onClick={() => removerSenha(s.id)} style={{ marginLeft: 10 }}>❌</button>
          </p>
        ))}
      </div>

      <div className={styles.subtitulo} style={{ marginTop: '2rem' }}>
        <h3>Painel de Informações:</h3>
        {editandoInfo ? (
          <div>
            <input name="showsEfetuados" value={informacoes.showsEfetuados} onChange={(e) => setInformacoes({ ...informacoes, showsEfetuados: e.target.value })} className={styles.input} />
            <input name="showsPendentes" value={informacoes.showsPendentes} onChange={(e) => setInformacoes({ ...informacoes, showsPendentes: e.target.value })} className={styles.input} />
            <input name="dinheiroTotal" value={informacoes.dinheiroTotal} onChange={(e) => setInformacoes({ ...informacoes, dinheiroTotal: e.target.value })} className={styles.input} />
            <input name="dinheiroGanho" value={informacoes.dinheiroGanho} onChange={(e) => setInformacoes({ ...informacoes, dinheiroGanho: e.target.value })} className={styles.input} />
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
