import React, { useState, useEffect } from 'react';

const STORAGE_KEY_COMP = 'competicoesData';

function Competicoes() {
  const [competicoes, setCompeticoes] = useState([]);
  const [form, setForm] = useState({
    tipo: 'futura', // futura ou realizada
    nome: '',
    data: '',
    hora: '',
    local: '',
    resultado: '',
    posicao: '',
    pontos: ''
  });

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY_COMP);
    if (stored) setCompeticoes(JSON.parse(stored));
  }, []);

  const saveStore = (list) => {
    localStorage.setItem(STORAGE_KEY_COMP, JSON.stringify(list));
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const entry = { id: Date.now(), ...form };
    const updated = [entry, ...competicoes];
    setCompeticoes(updated);
    saveStore(updated);
    setForm({ tipo: 'futura', nome: '', data: '', hora: '', local: '', resultado: '', posicao: '', pontos: '' });
  };

  const deleteComp = (id) => {
    if (!window.confirm('Remover esta competição?')) return;
    const updated = competicoes.filter(c => c.id !== id);
    setCompeticoes(updated);
    saveStore(updated);
  };

  return (
    <div className="container page py-4">
      <h1 className="text-gold mb-4">Competições</h1>

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="row g-2">
          <div className="col-md-2">
            <select name="tipo" value={form.tipo} onChange={handleChange} className="form-control">
              <option value="futura">Futura</option>
              <option value="realizada">Realizada</option>
            </select>
          </div>
          <div className="col-md-3"><input name="nome" value={form.nome} onChange={handleChange} placeholder="Nome" className="form-control" required/></div>
          <div className="col-md-2"><input name="data" type="date" value={form.data} onChange={handleChange} className="form-control" required/></div>
          <div className="col-md-1"><input name="hora" type="time" value={form.hora} onChange={handleChange} className="form-control" required/></div>
          <div className="col-md-3"><input name="local" value={form.local} onChange={handleChange} placeholder="Local" className="form-control"/></div>
        </div>
        {form.tipo === 'realizada' && (
          <div className="row g-2 mt-2">
            <div className="col-md-2"><input name="resultado" value={form.resultado} onChange={handleChange} placeholder="Resultado" className="form-control"/></div>
            <div className="col-md-2"><input name="posicao" value={form.posicao} onChange={handleChange} placeholder="Posição" className="form-control"/></div>
            <div className="col-md-2"><input name="pontos" value={form.pontos} onChange={handleChange} placeholder="Pontos" className="form-control"/></div>
          </div>
        )}
        <div className="mt-3">
          <button className="btn btn-warning">Adicionar Competição</button>
        </div>
      </form>

      <div className="table-responsive">
        <table className="table table-dark table-hover">
          <thead className="table-warning text-dark">
            <tr>
              <th>Tipo</th>
              <th>Nome</th>
              <th>Data</th>
              <th>Hora</th>
              <th>Local</th>
              <th>Resultado</th>
              <th>Posição</th>
              <th>Pontos</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {competicoes.map(c => (
              <tr key={c.id}>
                <td>{c.tipo}</td>
                <td>{c.nome}</td>
                <td>{c.data}</td>
                <td>{c.hora}</td>
                <td>{c.local}</td>
                <td>{c.resultado}</td>
                <td>{c.posicao}</td>
                <td>{c.pontos}</td>
                <td><button className="btn btn-outline-danger btn-sm" onClick={() => deleteComp(c.id)}>Deletar</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Competicoes;
