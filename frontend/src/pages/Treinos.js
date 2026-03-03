import React, { useState, useEffect } from 'react';

function Treinos() {
  const [form, setForm] = useState({ atleta_id: '', tipo: '', duracao: '', intensidade: 'Média', descricao: '', data: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [treinos, setTreinos] = useState([]);

  useEffect(() => {
    const fetchTreinos = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/treinos');
        if (res.ok) {
          const data = await res.json();
          setTreinos(data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchTreinos();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch('http://localhost:5000/api/treinos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          atleta_id: form.atleta_id || null,
          tipo: form.tipo,
          duracao: form.duracao,
          intensidade: form.intensidade,
          descricao: form.descricao,
          data: form.data || new Date().toISOString()
        })
      });
      if (!res.ok) throw new Error('Erro ao salvar treino');
      const saved = await res.json();
      setTreinos([saved, ...treinos]);
      setMessage({ type: 'success', text: 'Treino cadastrado com sucesso' });
      setForm({ atleta_id: '', tipo: '', duracao: '', intensidade: 'Média', descricao: '', data: '' });
    } catch (err) {
      setMessage({ type: 'danger', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container page py-4">
      <h1 className="mb-4 text-gold">Treinos</h1>

      {message && (
        <div className={`alert alert-${message.type}`} role="alert">{message.text}</div>
      )}

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="row g-2">
          <div className="col-md-2">
            <input name="atleta_id" value={form.atleta_id} onChange={handleChange} className="form-control" placeholder="Atleta ID" />
          </div>
          <div className="col-md-3">
            <input name="tipo" value={form.tipo} onChange={handleChange} className="form-control" placeholder="Tipo de exercício" required />
          </div>
          <div className="col-md-2">
            <input name="duracao" value={form.duracao} onChange={handleChange} className="form-control" placeholder="Duração (min)" />
          </div>
          <div className="col-md-2">
            <select name="intensidade" value={form.intensidade} onChange={handleChange} className="form-select">
              <option>Média</option>
              <option>Leve</option>
              <option>Alta</option>
            </select>
          </div>
          <div className="col-md-3">
            <input name="data" type="datetime-local" value={form.data} onChange={handleChange} className="form-control" />
          </div>
        </div>
        <div className="mt-2">
          <textarea name="descricao" value={form.descricao} onChange={handleChange} className="form-control" placeholder="Descrição/observações" />
        </div>
        <div className="mt-3">
          <button className="btn btn-gold btn-warning" disabled={loading}>{loading ? 'Salvando...' : 'Salvar Treino'}</button>
        </div>
      </form>

      <h4 className="text-gold mb-3">Últimos treinos</h4>
      <div className="table-responsive">
        <table className="table table-dark table-hover">
          <thead className="table-warning text-dark">
            <tr>
              <th>ID</th>
              <th>Atleta</th>
              <th>Tipo</th>
              <th>Duração</th>
              <th>Intensidade</th>
              <th>Data</th>
            </tr>
          </thead>
          <tbody>
            {treinos.map(t => (
              <tr key={t.id || Math.random()}>
                <td>{t.id}</td>
                <td>{t.atleta_id}</td>
                <td>{t.tipo}</td>
                <td>{t.duracao}</td>
                <td>{t.intensidade}</td>
                <td>{t.data}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Treinos;
