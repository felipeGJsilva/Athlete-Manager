import React, { useState, useEffect } from 'react';

// client‑only version: data stored in localStorage
const STORAGE_KEY = 'atletasData';

function Atletas() {
  const [atletas, setAtletas] = useState([]);
  const [form, setForm] = useState({ nome: '', esporte: '', posicao: '', idade: '', altura: '', peso: '' });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setAtletas(JSON.parse(stored));
  }, []);

  const saveToStorage = (list) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  };

  const deleteAtleta = (id) => {
    if (!window.confirm('Tem certeza que deseja deletar este atleta?')) return;
    const updated = atletas.filter(atleta => atleta.id !== id);
    setAtletas(updated);
    saveToStorage(updated);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    const newAtleta = {
      id: Date.now(),
      nome: form.nome,
      esporte: form.esporte,
      posicao: form.posicao,
      idade: form.idade,
      altura: form.altura,
      peso: form.peso
    };
    const updated = [newAtleta, ...atletas];
    setAtletas(updated);
    saveToStorage(updated);
    setMessage({ type: 'success', text: 'Atleta cadastrado' });
    setForm({ nome: '', esporte: '', posicao: '', idade: '', altura: '', peso: '' });
    setSaving(false);
  };

  // No loading or error states now since data is local

  return (
    <div className="container page py-4">
      <h1 className="mb-4 text-gold">Atletas</h1>

      {message && <div className={`alert alert-${message.type}`}>{message.text}</div>}

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="row g-2">
          <div className="col-md-3">
            <input name="nome" value={form.nome} onChange={handleChange} className="form-control bg-transparent text-light border-warning" placeholder="Nome" required />
          </div>
          <div className="col-md-2">
            <input name="esporte" value={form.esporte} onChange={handleChange} className="form-control bg-transparent text-light border-warning" placeholder="Esporte" />
          </div>
          <div className="col-md-2">
            <input name="posicao" value={form.posicao} onChange={handleChange} className="form-control bg-transparent text-light border-warning" placeholder="Posição" />
          </div>
          <div className="col-md-1">
            <input name="idade" value={form.idade} onChange={handleChange} className="form-control bg-transparent text-light border-warning" placeholder="Idade" />
          </div>
          <div className="col-md-2">
            <input name="altura" value={form.altura} onChange={handleChange} className="form-control bg-transparent text-light border-warning" placeholder="Altura (m)" />
          </div>
          <div className="col-md-2">
            <input name="peso" value={form.peso} onChange={handleChange} className="form-control bg-transparent text-light border-warning" placeholder="Peso (kg)" />
          </div>
        </div>
        <div className="mt-3">
          <button className="btn btn-warning" disabled={saving}>{saving ? 'Salvando...' : 'Cadastrar Atleta'}</button>
        </div>
      </form>

      <div className="table-responsive">
        <table className="table table-dark table-bordered table-hover">
          <thead className="table-warning text-dark">
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Esporte</th>
              <th>Posição</th>
              <th>Idade</th>
              <th>Altura</th>
              <th>Peso</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {atletas.map(atleta => (
              <tr key={atleta.id}>
                <td>{atleta.id}</td>
                <td>{atleta.nome}</td>
                <td>{atleta.esporte}</td>
                <td>{atleta.posicao}</td>
                <td>{atleta.idade}</td>
                <td>{atleta.altura}</td>
                <td>{atleta.peso}</td>
                <td>
                  <button className="btn btn-outline-warning btn-sm me-1">Editar</button>
                  <button className="btn btn-outline-danger btn-sm" onClick={() => deleteAtleta(atleta.id)}>Deletar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Atletas;
