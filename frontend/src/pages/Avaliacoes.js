import React, { useState, useEffect } from 'react';

function Avaliacoes() {

  const [form, setForm] = useState({
    atleta_id: '',
    peso: '',
    altura: '',
    gordura: '',
    observacoes: '',
    data: ''
  });

  const [avaliacoes, setAvaliacoes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {

    const fetchAval = async () => {

      try {

        const res = await fetch('http://localhost:5000/api/avaliacoes');

        if (res.ok) {

          const data = await res.json();
          setAvaliacoes(data);

        }

      } catch (err) {

        console.error(err);

      }

    };

    fetchAval();

  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

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

      setMessage({
        type: 'success',
        text: 'Avaliação salva com sucesso!'
      });

      setForm({
        atleta_id: '',
        peso: '',
        altura: '',
        gordura: '',
        observacoes: '',
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

          <i className="fas fa-chart-line me-2"></i>

          Avaliações

        </h1>

        <span className="badge bg-warning text-dark fs-6">
          {avaliacoes.length} registradas
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

          Nova Avaliação Física

        </div>

        <div className="card-body">

          <form onSubmit={handleSubmit}>

            <div className="row g-3">

              <div className="col-md-2">

                <label className="form-label text-light">
                  Atleta ID
                </label>

                <input
                  name="atleta_id"
                  value={form.atleta_id}
                  onChange={handleChange}
                  className="form-control bg-transparent text-light border-warning"
                  placeholder="ID"
                />

              </div>

              <div className="col-md-2">

                <label className="form-label text-light">
                  Peso (kg)
                </label>

                <input
                  name="peso"
                  value={form.peso}
                  onChange={handleChange}
                  className="form-control bg-transparent text-light border-warning"
                  placeholder="80"
                />

              </div>

              <div className="col-md-2">

                <label className="form-label text-light">
                  Altura (m)
                </label>

                <input
                  name="altura"
                  value={form.altura}
                  onChange={handleChange}
                  className="form-control bg-transparent text-light border-warning"
                  placeholder="1.80"
                />

              </div>

              <div className="col-md-2">

                <label className="form-label text-light">
                  Gordura %
                </label>

                <input
                  name="gordura"
                  value={form.gordura}
                  onChange={handleChange}
                  className="form-control bg-transparent text-light border-warning"
                  placeholder="15%"
                />

              </div>

              <div className="col-md-4">

                <label className="form-label text-light">
                  Data
                </label>

                <input
                  type="date"
                  name="data"
                  value={form.data}
                  onChange={handleChange}
                  className="form-control bg-transparent text-light border-warning"
                />

              </div>

              <div className="col-12">

                <label className="form-label text-light">
                  Observações
                </label>

                <textarea
                  name="observacoes"
                  value={form.observacoes}
                  onChange={handleChange}
                  className="form-control bg-transparent text-light border-warning"
                  placeholder="Notas sobre avaliação física"
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
                        Salvar Avaliação
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

          Avaliações Recentes

        </div>

        <div className="card-body p-0">

          <div className="table-responsive">

            <table className="table table-dark table-hover align-middle mb-0">

              <thead className="table-warning text-dark">

                <tr>
                  <th>#</th>
                  <th>Atleta</th>
                  <th>Peso</th>
                  <th>Altura</th>
                  <th>Gordura %</th>
                  <th>Data</th>
                </tr>

              </thead>

              <tbody>

                {avaliacoes.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center text-secondary py-4">
                      Nenhuma avaliação registrada
                    </td>
                  </tr>
                )}

                {avaliacoes.map((a, index) => (

                  <tr key={a.id || index}>

                    <td className="text-warning fw-bold">
                      {index + 1}
                    </td>

                    <td>{a.atleta_id || '-'}</td>

                    <td>{a.peso || '-'}</td>

                    <td>{a.altura || '-'}</td>

                    <td>
                      <span className="badge bg-warning text-dark">
                        {a.gordura_percentual || a.gordura || '-'}
                      </span>
                    </td>

                    <td>
                      {a.data
                        ? new Date(a.data).toLocaleDateString()
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

export default Avaliacoes;