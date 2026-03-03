import React, { useState, useEffect } from 'react';

function Avaliacoes() {
  const [form, setForm] = useState({ atleta_id: '', peso: '', altura: '', gordura: '', observacoes: '', data: '' });
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchAval = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/avaliacoes');
        if (res.ok) setAvaliacoes(await res.json());
      } catch (err) { console.error(err); }
    };
    fetchAval();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch('http://localhost:5000/api/avaliacoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          atleta_id: form.atleta_id || null,
          peso: parseFloat(form.peso) || null,
          altura: parseFloat(form.altura) || null,
          gordura_percentual: form.gordura || null,
          observacoes: form.observacoes,
          data: form.data || new Date().toISOString()
        })
      });
      if (!res.ok) throw new Error('Erro ao salvar avaliação');
      const saved = await res.json();
      setAvaliacoes([saved, ...avaliacoes]);
      setMessage({ type: 'success', text: 'Avaliação salva' });
      setForm({ atleta_id: '', peso: '', altura: '', gordura: '', observacoes: '', data: '' });
    } catch (err) {
      setMessage({ type: 'danger', text: err.message });
    } finally { setLoading(false); }
  };

  return (
    <div className="container page py-4">
      <h1 className="mb-4 text-gold">Avaliações</h1>

      {message && <div className={`alert alert-${message.type}`}>{message.text}</div>}

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="row g-2">
          <div className="col-md-2">
            <input name="atleta_id" value={form.atleta_id} onChange={handleChange} className="form-control" placeholder="Atleta ID" />
          </div>
          <div className="col-md-2">
            <input name="peso" value={form.peso} onChange={handleChange} className="form-control" placeholder="Peso (kg)" />
          </div>
          <div className="col-md-2">
            <input name="altura" value={form.altura} onChange={handleChange} className="form-control" placeholder="Altura (m)" />
          </div>
          <div className="col-md-2">
            <input name="gordura" value={form.gordura} onChange={handleChange} className="form-control" placeholder="Gordura %" />
          </div>
          <div className="col-md-4">
            <input name="data" type="date" value={form.data} onChange={handleChange} className="form-control" />
          </div>
        </div>
        <div className="mt-2">
          <textarea name="observacoes" value={form.observacoes} onChange={handleChange} className="form-control" placeholder="Observações" />
        </div>
        <div className="mt-3">
          <button className="btn btn-warning" disabled={loading}>{loading ? 'Salvando...' : 'Salvar Avaliação'}</button>
        </div>
      </form>

      <h4 className="text-gold mb-3">Avaliações recentes</h4>
      <div className="table-responsive">
        <table className="table table-dark table-hover">
          <thead className="table-warning text-dark">
            <tr>
              <th>ID</th>
              <th>Atleta</th>
              <th>Peso</th>
              <th>Altura</th>
              <th>Gordura %</th>
              <th>Data</th>
            </tr>
          </thead>
          <tbody>
            {avaliacoes.map(a => (
              <tr key={a.id || Math.random()}>
                <td>{a.id}</td>
                <td>{a.atleta_id}</td>
                <td>{a.peso}</td>
                <td>{a.altura}</td>
                <td>{a.gordura_percentual || a.gordura}</td>
                <td>{a.data}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Avaliacoes;
