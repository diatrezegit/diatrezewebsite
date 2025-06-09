import { useState, useEffect } from 'react';
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

  useEffect(() => {
    const armazenadas = JSON.parse(localStorage.getItem('senhas')) || [];
    setSenhas(armazenadas);

    const infoSalva = JSON.parse(localStorage.getItem('informacoes'));
    if (infoSalva) setInformacoes(infoSalva);
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
    if (novaSenha.trim() === '') return;
    if (senhas.some((s) => s.senha === novaSenha.trim())) {
      alert('Essa senha já existe.');
      return;
    }
    const atualizadas = [...senhas, { senha: novaSenha.trim(), conteudo: '🎧 Bem-vindo ao conteúdo privado!\nVocê acessou com sucesso.' }];
    localStorage.setItem('senhas', JSON.stringify(atualizadas));
    setSenhas(atualizadas);
    setNovaSenha('');
  };

  const removerSenha = (index) => {
    const atualizadas = [...senhas];
    atualizadas.splice(index, 1);
    localStorage.setItem('senhas', JSON.stringify(atualizadas));
    setSenhas(atualizadas);
  };

  const iniciarEdicaoSenha = (index) => {
    setEditandoIndex(index);
    setNovaSenha(senhas[index].senha);
    setNovoConteudo(senhas[index].conteudo);
  };

  const salvarEdicao = () => {
    if (novaSenha.trim() === '') {
      alert('Senha não pode estar vazia.');
      return;
    }
    const atualizadas = [...senhas];
    atualizadas[editandoIndex] = { senha: novaSenha.trim(), conteudo: novoConteudo };
    localStorage.setItem('senhas', JSON.stringify(atualizadas));
    setSenhas(atualizadas);
    setEditandoIndex(null);
    setNovaSenha('');
    setNovoConteudo('');
  };

  const salvarInformacoes = () => {
    localStorage.setItem('informacoes', JSON.stringify(informacoes));
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
                    <button
                      style={{ marginLeft: 10 }}
                      onClick={() => iniciarEdicaoSenha(index)}
                      aria-label={`Editar senha e conteúdo da senha ${senha}`}
                    >
                      ✏️
                    </button>
                    <button
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#f44336',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        marginLeft: 10,
                      }}
                      onClick={() => removerSenha(index)}
                      aria-label={`Remover senha ${senha}`}
                    >
                      ✖
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}

      {/* Painel de Informações abaixo das senhas */}
      <div className={styles.subtitulo} style={{ marginTop: '3rem' }}>
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