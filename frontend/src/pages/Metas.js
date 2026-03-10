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

  const deleteMeta = (id) => {
    if (!window.confirm('Excluir esta meta?')) return;
    const updated = metas.filter(m => m.id !== id);
    setMetas(updated);
    saveToStorage(updated);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {

    e.preventDefault();
    setSaving(true);

    const prog = form.progresso ? parseInt(form.progresso) : 0;

    const payload = {
      atleta_id: form.atleta_id || null,
      titulo: form.titulo,
      descricao: form.descricao,
      status: prog === 100 ? 'concluida' : form.status,
      data_conclusao_esperada: form.data_conclusao_esperada,
      progresso: prog
    };

    const saved = { id: Date.now(), ...payload };

    const updated = [saved, ...metas];

    setMetas(updated);
    saveToStorage(updated);

    setMessage({ type: 'success', text: 'Meta adicionada' });

    setForm({
      atleta_id: '',
      titulo: '',
      descricao: '',
      data_conclusao_esperada: '',
      progresso: '',
      status: 'ativa'
    });

    setSaving(false);
  };

  const getStatusBadge = (status) => {

    if (status === 'ativa') return 'bg-primary';
    if (status === 'concluida') return 'bg-success';
    if (status === 'cancelada') return 'bg-danger';

    return 'bg-secondary';
  };

  return (

    <div className="container-fluid bg-black text-light min-vh-100 p-4">

      <h1 className="text-warning mb-4">Metas</h1>

      {message && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
        </div>
      )}

      {/* CARD FORM */}
      <div className="card bg-dark border-warning mb-4">
        <div className="card-body">

          <h5 className="card-title text-warning mb-3">
            Nova Meta
          </h5>

          <form onSubmit={handleSubmit}>

            <div className="row g-2">

              <div className="col-md-2">
                <input
                  name="atleta_id"
                  value={form.atleta_id}
                  onChange={handleChange}
                  className="form-control bg-black text-light border-warning"
                  placeholder="Atleta ID"
                />
              </div>

              <div className="col-md-3">
                <input
                  name="titulo"
                  value={form.titulo}
                  onChange={handleChange}
                  className="form-control bg-black text-light border-warning"
                  placeholder="Título"
                  required
                />
              </div>

              <div className="col-md-3">
                <input
                  type="date"
                  name="data_conclusao_esperada"
                  value={form.data_conclusao_esperada}
                  onChange={handleChange}
                  className="form-control bg-black text-light border-warning"
                />
              </div>

              <div className="col-md-2">
                <input
                  type="number"
                  min="0"
                  max="100"
                  name="progresso"
                  value={form.progresso}
                  onChange={handleChange}
                  className="form-control bg-black text-light border-warning"
                  placeholder="Progresso"
                />
              </div>

              <div className="col-md-2">
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="form-control bg-black text-light border-warning"
                >
                  <option value="ativa">Ativa</option>
                  <option value="concluida">Concluída</option>
                  <option value="cancelada">Cancelada</option>
                </select>
              </div>

            </div>

            <div className="mt-3">

              <textarea
                name="descricao"
                value={form.descricao}
                onChange={handleChange}
                className="form-control bg-black text-light border-warning"
                placeholder="Descrição da meta"
              />

            </div>

            <button
              className="btn btn-warning mt-3"
              disabled={saving}
            >
              {saving ? 'Salvando...' : 'Adicionar Meta'}
            </button>

          </form>

        </div>
      </div>

      {/* LISTA */}

      <div className="table-responsive">

        <table className="table table-dark table-hover align-middle">

          <thead className="table-warning text-dark">

            <tr>
              <th>ID</th>
              <th>Atleta</th>
              <th>Título</th>
              <th>Status</th>
              <th>Progresso</th>
              <th>Prazo</th>
              <th>Ações</th>
            </tr>

          </thead>

          <tbody>

            {metas.map(m => (

              <tr key={m.id}>

                <td>{m.id}</td>

                <td>{m.atleta_id}</td>

                <td>{m.titulo}</td>

                <td>
                  <span className={`badge ${getStatusBadge(m.status)}`}>
                    {m.status}
                  </span>
                </td>

                <td style={{width:'200px'}}>

                  <div className="progress">

                    <div
                      className="progress-bar bg-warning"
                      style={{ width: `${m.progresso}%` }}
                    >
                      {m.progresso}%
                    </div>

                  </div>

                </td>

                <td>
                  {m.data_conclusao_esperada || '-'}
                </td>

                <td>

                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => deleteMeta(m.id)}
                  >
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