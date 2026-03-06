import React, { useState, useEffect } from 'react';

const STORAGE_KEY_METAS = 'metasData';

function Metas() {
  const [metas, setMetas] = useState([]);
  const [form, setForm] = useState({
    atleta_id: '',
    titulo: '',
    descricao: '',
    data_conclusao_esperada: '',
    progresso: '',
    status: 'ativa'
  });
  // removed loading/error since no fetch
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const [filterAtleta, setFilterAtleta] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY_METAS);
    if (stored) setMetas(JSON.parse(stored));
  }, []);

  const saveToStorage = (list) => {
    localStorage.setItem(STORAGE_KEY_METAS, JSON.stringify(list));
  };

  const fetchMetas = (atletaId) => {
    if (atletaId) {
      const filtered = metas.filter(m => m.atleta_id === atletaId);
      setMetas(filtered);
    }
  };

  const deleteMeta = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir esta meta?')) return;
    try {
      const updated = metas.filter(m => m.id !== id);
      setMetas(updated);
      saveToStorage(updated);
    } catch (err) {
      alert('Erro: ' + err.message);
    }
  };

  const editMeta = async (meta) => {
    // simple prompt-based editor for progress/status
    const newProg = window.prompt('Progresso (%)', meta.progresso);
    if (newProg === null) return; // cancelled
    const progVal = parseInt(newProg, 10);
    let newStatus = meta.status;
    if (progVal === 100) {
      newStatus = 'concluida';
    } else {
      const s = window.prompt('Status (ativa, concluida, cancelada)', meta.status);
      if (s === null) return;
      newStatus = s;
    }
    try {
      const res = await fetch(`http://localhost:5000/api/metas/${meta.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ progresso: progVal, status: newStatus })
      });
      if (!res.ok) throw new Error('Falha ao atualizar meta');
      const updated = await res.json();
      setMetas(metas.map(m => (m.id === updated.id ? updated : m)));
    } catch (err) {
      alert('Erro ao atualizar: ' + err.message);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      // if user filled progress to 100, mark as concluida automatically
      const prog = form.progresso ? parseInt(form.progresso, 10) : 0;
      const payload = {
        atleta_id: form.atleta_id || null,
        titulo: form.titulo,
        descricao: form.descricao,
        status: prog === 100 ? 'concluida' : form.status,
        data_conclusao_esperada: form.data_conclusao_esperada || null,
        progresso: prog
      };
      // save locally
      const saved = { id: Date.now(), ...payload };
      const updated = [saved, ...metas];
      setMetas(updated);
      saveToStorage(updated);
      setMessage({ type: 'success', text: 'Meta adicionada' });
      setForm({ atleta_id: '', titulo: '', descricao: '', data_conclusao_esperada: '', progresso: '', status: 'ativa' });
    } catch (err) {
      setMessage({ type: 'danger', text: err.message });
    } finally {
      setSaving(false);
    }
  };


  return (
    <div className="container page py-4">
      <h1 className="mb-4 text-gold">Metas</h1>

      {message && <div className={`alert alert-${message.type}`}>{message.text}</div>}

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="row g-2">
          <div className="col-md-2">
            <input
              name="atleta_id"
              value={form.atleta_id}
              onChange={handleChange}
              className="form-control bg-transparent text-light border-warning"
              placeholder="Atleta ID"
            />
          </div>
          <div className="col-md-3">
            <input
              name="titulo"
              value={form.titulo}
              onChange={handleChange}
              className="form-control bg-transparent text-light border-warning"
              placeholder="Título da meta"
              required
            />
          </div>
          <div className="col-md-3">
            <input
              name="data_conclusao_esperada"
              type="date"
              value={form.data_conclusao_esperada}
              onChange={handleChange}
              className="form-control bg-transparent text-light border-warning"
              placeholder="Prazo"
            />
          </div>
          <div className="col-md-2">
            <input
              name="progresso"
              type="number"
              min="0"
              max="100"
              value={form.progresso}
              onChange={handleChange}
              className="form-control bg-transparent text-light border-warning"
              placeholder="Progresso %"
            />
          </div>
          <div className="col-md-2">
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="form-control bg-transparent text-light border-warning"
            >
              <option value="ativa">Ativa</option>
              <option value="concluida">Concluída</option>
              <option value="cancelada">Cancelada</option>
            </select>
          </div>
        </div>
        <div className="mt-2">
          <textarea
            name="descricao"
            value={form.descricao}
            onChange={handleChange}
            className="form-control bg-transparent text-light border-warning"
            placeholder="Descrição (ex: meta de peso, campeonatos etc)"
          />
        </div>
        <div className="mt-3">
          <button className="btn btn-warning" disabled={saving}>
            {saving ? 'Salvando...' : 'Adicionar Meta'}
          </button>
        </div>
      </form>

      <div className="mb-3 d-flex align-items-center">
        <h4 className="text-gold me-3 mb-0">Metas cadastradas</h4>
        <input
          type="text"
          placeholder="Filtrar por atleta ID"
          value={filterAtleta}
          onChange={e => setFilterAtleta(e.target.value)}
          className="form-control form-control-sm bg-transparent text-light border-warning me-2"
          style={{width: '120px'}}
        />
        <button
          className="btn btn-sm btn-warning"
          onClick={() => { setLoading(true); fetchMetas(filterAtleta); }}
        >
          Buscar
        </button>
      </div>
      <div className="table-responsive">
        <table className="table table-dark table-bordered table-hover">
          <thead className="table-warning text-dark">
            <tr>
              <th>ID</th>
              <th>Atleta</th>
              <th>Título</th>
              <th>Descrição</th>
              <th>Status</th>
              <th>Progresso</th>
              <th>Prazo</th>
              <th>Conclusão</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {metas.map(m => (
              <tr key={m.id}>
                <td>{m.id}</td>
                <td>{m.atleta_id}</td>
                <td>{m.titulo}</td>
                <td>{m.descricao}</td>
                <td>{m.status}</td>
                <td>{m.progresso}%</td>
                <td>{m.data_conclusao_esperada || '-'}</td>
                <td>{m.data_conclusao_real || '-'}</td>
                <td>
                  <button className="btn btn-outline-secondary btn-sm me-1" onClick={() => editMeta(m)}>
                    Editar
                  </button>
                  <button className="btn btn-outline-danger btn-sm" onClick={() => deleteMeta(m.id)}>
                    Deletar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Metas;
