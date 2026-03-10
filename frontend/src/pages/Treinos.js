import React, { useState, useEffect } from 'react';

function Treinos() {

  const [form, setForm] = useState({
    atleta_id: '',
    tipo: '',
    duracao: '',
    intensidade: 'Média',
    descricao: '',
    data: ''
  });

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

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

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

      setMessage({
        type: 'success',
        text: 'Treino cadastrado com sucesso!'
      });

      setForm({
        atleta_id: '',
        tipo: '',
        duracao: '',
        intensidade: 'Média',
        descricao: '',
        data: ''
      });

    } catch (err) {

      setMessage({
        type: 'danger',
        text: err.message
      });

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="container page py-5">

      {/* HEADER */}

      <div className="d-flex justify-content-between align-items-center mb-4">

        <h1 className="text-gold">
          <i className="fas fa-dumbbell me-2"></i>
          Treinos
        </h1>

        <span className="badge bg-warning text-dark fs-6">
          {treinos.length} registrados
        </span>

      </div>

      {/* ALERT */}

      {message && (
        <div className={`alert alert-${message.type} shadow-sm`}>
          {message.text}
        </div>
      )}

      {/* FORM CARD */}

      <div className="card bg-dark border-warning mb-4 shadow">

        <div className="card-header bg-warning text-dark fw-bold">
          <i className="fas fa-plus-circle me-2"></i>
          Registrar Novo Treino
        </div>

        <div className="card-body">

          <form onSubmit={handleSubmit}>

            <div className="row g-3">

              <div className="col-md-2">
                <label className="form-label text-light">Atleta ID</label>
                <input
                  name="atleta_id"
                  value={form.atleta_id}
                  onChange={handleChange}
                  className="form-control bg-transparent text-light border-warning"
                  placeholder="ID"
                />
              </div>

              <div className="col-md-4">
                <label className="form-label text-light">Tipo de treino</label>
                <input
                  name="tipo"
                  value={form.tipo}
                  onChange={handleChange}
                  className="form-control bg-transparent text-light border-warning"
                  placeholder="Ex: Musculação"
                  required
                />
              </div>

              <div className="col-md-2">
                <label className="form-label text-light">Duração</label>
                <input
                  name="duracao"
                  value={form.duracao}
                  onChange={handleChange}
                  className="form-control bg-transparent text-light border-warning"
                  placeholder="Min"
                />
              </div>

              <div className="col-md-2">
                <label className="form-label text-light">Intensidade</label>
                <select
                  name="intensidade"
                  value={form.intensidade}
                  onChange={handleChange}
                  className="form-select bg-dark text-light border-warning"
                >
                  <option>Média</option>
                  <option>Leve</option>
                  <option>Alta</option>
                </select>
              </div>

              <div className="col-md-2">
                <label className="form-label text-light">Data</label>
                <input
                  type="datetime-local"
                  name="data"
                  value={form.data}
                  onChange={handleChange}
                  className="form-control bg-transparent text-light border-warning"
                />
              </div>

              <div className="col-12">
                <label className="form-label text-light">Descrição</label>
                <textarea
                  name="descricao"
                  value={form.descricao}
                  onChange={handleChange}
                  className="form-control bg-transparent text-light border-warning"
                  placeholder="Observações sobre o treino"
                />
              </div>

              <div className="col-md-4">

                <button
                  className="btn btn-warning w-100 fw-bold"
                  disabled={loading}
                >

                  {loading
                    ? 'Salvando...'
                    : (
                      <>
                        <i className="fas fa-save me-2"></i>
                        Salvar Treino
                      </>
                    )
                  }

                </button>

              </div>

            </div>

          </form>

        </div>

      </div>

      {/* LISTA */}

      <div className="card bg-dark border-warning shadow">

        <div className="card-header bg-dark text-warning fw-bold">
          <i className="fas fa-history me-2"></i>
          Últimos Treinos
        </div>

        <div className="card-body p-0">

          <div className="table-responsive">

            <table className="table table-dark table-hover align-middle mb-0">

              <thead className="table-warning text-dark">

                <tr>
                  <th>#</th>
                  <th>Atleta</th>
                  <th>Tipo</th>
                  <th>Duração</th>
                  <th>Intensidade</th>
                  <th>Data</th>
                </tr>

              </thead>

              <tbody>

                {treinos.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center text-secondary py-4">
                      Nenhum treino registrado
                    </td>
                  </tr>
                )}

                {treinos.map((t, index) => (

                  <tr key={t.id || index}>

                    <td className="text-warning fw-bold">
                      {index + 1}
                    </td>

                    <td>{t.atleta_id || '-'}</td>

                    <td>{t.tipo}</td>

                    <td>{t.duracao || '-'}</td>

                    <td>
                      <span className="badge bg-warning text-dark">
                        {t.intensidade}
                      </span>
                    </td>

                    <td>
                      {t.data
                        ? new Date(t.data).toLocaleString()
                        : '-'}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </div>

  );
}

export default Treinos;