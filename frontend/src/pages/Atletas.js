import React, { useState, useEffect } from 'react';

function Atletas() {
  const [atletas, setAtletas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ nome: '', esporte: '', posicao: '', idade: '', altura: '', peso: '' });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => { fetchAtletas(); }, []);

  const fetchAtletas = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/atletas');
      if (!response.ok) throw new Error('Failed to fetch atletas');
      const data = await response.json();
      setAtletas(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteAtleta = async (id) => {
    if (!window.confirm('Tem certeza que deseja deletar este atleta?')) return;
    try {
      const response = await fetch(`http://localhost:5000/api/atletas/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete atleta');
      setAtletas(atletas.filter(atleta => atleta.id !== id));
    } catch (err) {
      alert('Erro ao deletar atleta: ' + err.message);
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch('http://localhost:5000/api/atletas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: form.nome,
          esporte: form.esporte,
          posicao: form.posicao,
          idade: form.idade ? parseInt(form.idade, 10) : null,
          altura: form.altura ? parseFloat(form.altura) : null,
          peso: form.peso ? parseFloat(form.peso) : null
        })
      });
      if (!res.ok) throw new Error('Erro ao cadastrar atleta');
      const saved = await res.json();
      setAtletas([saved, ...atletas]);
      setMessage({ type: 'success', text: 'Atleta cadastrado' });
      setForm({ nome: '', esporte: '', posicao: '', idade: '', altura: '', peso: '' });
    } catch (err) {
      setMessage({ type: 'danger', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-4 text-gold">Carregando...</div>;
  if (error) return <div className="text-center py-4 text-danger">Erro: {error}</div>;

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
