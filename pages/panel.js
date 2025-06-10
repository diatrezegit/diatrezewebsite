// Atualizado Painel.js e Pass.js com suporte a Firebase, sincronização e correção de eventos

// painel.js
import { useState, useEffect } from 'react';
import styles from '../styles/Home.module.css';
import { db, ref, onValue, set, push, update, remove } from '../lib/firebase';

const senhaPainel = 'diatreze1312';

export default function Painel() {
  const [acessoLiberado, setAcessoLiberado] = useState(false);
  const [senhaEntrada, setSenhaEntrada] = useState('');
  const [senhas, setSenhas] = useState([]);
  const [editandoIndex, setEditandoIndex] = useState(null);
  const [novaSenha, setNovaSenha] = useState('');
  const [novoConteudo, setNovoConteudo] = useState('');
  const [informacoes, setInformacoes] = useState({ showsEfetuados: '', showsPendentes: '', dinheiroTotal: '', dinheiroGanho: '' });
  const [editandoInfo, setEditandoInfo] = useState(false);

  useEffect(() => {
    onValue(ref(db, 'senhas'), (snapshot) => {
      const data = snapshot.val() || {};
      const lista = Object.entries(data).map(([id, val]) => ({ id, ...val }));
      setSenhas(lista);
    });

    onValue(ref(db, 'informacoes'), (snapshot) => {
      setInformacoes(snapshot.val() || {});
    });
  }, []);

  const entrarPainel = (e) => {
    e.preventDefault();
    if (senhaEntrada === senhaPainel) {
      setAcessoLiberado(true);
    } else {
      alert('Senha do painel incorreta.');
    }
  };

  const adicionarSenha = () => {
    if (!novaSenha.trim()) return;
    const novaRef = push(ref(db, 'senhas'));
    set(novaRef, { senha: novaSenha.trim(), conteudo: '🎧 Bem-vindo ao conteúdo privado!\nVocê acessou com sucesso.' });
    setNovaSenha('');
  };

  const removerSenha = (id) => {
    remove(ref(db, 'senhas/' + id));
  };

  const iniciarEdicaoSenha = (index) => {
    setEditandoIndex(index);
    const item = senhas[index];
    setNovaSenha(item.senha);
    setNovoConteudo(item.conteudo);
  };

  const salvarEdicao = () => {
    const item = senhas[editandoIndex];
    update(ref(db, 'senhas/' + item.id), { senha: novaSenha.trim(), conteudo: novoConteudo });
    setEditandoIndex(null);
    setNovaSenha('');
    setNovoConteudo('');
  };

  const salvarInformacoes = () => {
    set(ref(db, 'informacoes'), informacoes);
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
          <input className={styles.input} type="password" placeholder="Senha do painel" value={senhaEntrada} onChange={(e) => setSenhaEntrada(e.target.value)} />
          <button type="submit" className={styles.botao}>Entrar</button>
        </form>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.titulo}>🔐 Painel de Senhas</h1>

      <div className={styles.formulario}>
        <input className={styles.input} type="text" placeholder="Nova senha" value={novaSenha} onChange={(e) => setNovaSenha(e.target.value)} />
        <button className={styles.botao} onClick={adicionarSenha}>➕ Adicionar Senha</button>
      </div>

      <div className={styles.subtitulo}>
        <h3>Senhas cadastradas:</h3>
        <ul>
          {senhas.map((item, index) => (
            <li key={item.id}>
              <strong>{item.senha}</strong>
              <button onClick={() => iniciarEdicaoSenha(index)}>✏️</button>
              <button onClick={() => removerSenha(item.id)}>✖</button>
            </li>
          ))}
        </ul>
      </div>

      {editandoIndex !== null && (
        <div className={styles.formulario}>
          <input className={styles.input} type="text" value={novaSenha} onChange={(e) => setNovaSenha(e.target.value)} />
          <textarea className={styles.input} rows="6" value={novoConteudo} onChange={(e) => setNovoConteudo(e.target.value)} />
          <button className={styles.botao} onClick={salvarEdicao}>💾 Salvar</button>
          <button className={styles.botao} onClick={() => setEditandoIndex(null)}>Cancelar</button>
        </div>
      )}

      <div className={styles.subtitulo} style={{ marginTop: '2rem' }}>
        <h3>Painel de Informações:</h3>
        {editandoInfo ? (
          <div>
            <input name="showsEfetuados" value={informacoes.showsEfetuados} onChange={handleChangeInfo} placeholder="Shows efetuados" className={styles.input} />
            <input name="showsPendentes" value={informacoes.showsPendentes} onChange={handleChangeInfo} placeholder="Shows pendentes" className={styles.input} />
            <input name="dinheiroTotal" value={informacoes.dinheiroTotal} onChange={handleChangeInfo} placeholder="Dinheiro total" className={styles.input} />
            <input name="dinheiroGanho" value={informacoes.dinheiroGanho} onChange={handleChangeInfo} placeholder="Dinheiro ganho" className={styles.input} />
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



// O pass.js virá em seguida com as atualizações semelhantes para funcionar com o Firebase corretamente.
