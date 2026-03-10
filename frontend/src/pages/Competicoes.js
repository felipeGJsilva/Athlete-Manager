import React, { useState, useEffect } from 'react';

const STORAGE_KEY_COMP = 'competicoesData';

function Competicoes() {

  const [competicoes, setCompeticoes] = useState([]);

  const [form, setForm] = useState({
    tipo: 'futura',
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

    if (stored) {
      setCompeticoes(JSON.parse(stored));
    }

  }, []);

  const saveStore = (list) => {
    localStorage.setItem(STORAGE_KEY_COMP, JSON.stringify(list));
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {

    e.preventDefault();

    const entry = {
      id: Date.now(),
      ...form
    };

    const updated = [entry, ...competicoes];

    setCompeticoes(updated);
    saveStore(updated);

    setForm({
      tipo: 'futura',
      nome: '',
      data: '',
      hora: '',
      local: '',
      resultado: '',
      posicao: '',
      pontos: ''
    });

  };

  const deleteComp = (id) => {

    if (!window.confirm('Remover esta competição?')) return;

    const updated = competicoes.filter(c => c.id !== id);

    setCompeticoes(updated);
    saveStore(updated);

  };

  return (

    <div className="container page py-5">

      {/* HEADER */}

      <div className="d-flex justify-content-between align-items-center mb-4">

        <h1 className="text-gold">
          <i className="fas fa-trophy me-2"></i>
          Competições
        </h1>

        <span className="badge bg-warning text-dark fs-6">
          {competicoes.length} registradas
        </span>

      </div>

      {/* FORM */}

      <div className="card bg-dark border-warning shadow mb-4">

        <div className="card-header bg-warning text-dark fw-bold">

          <i className="fas fa-plus-circle me-2"></i>

          Registrar Competição

        </div>

        <div className="card-body">

          <form onSubmit={handleSubmit}>

            <div className="row g-3">

              <div className="col-md-2">

                <label className="form-label text-light">
                  Tipo
                </label>

                <select
                  name="tipo"
                  value={form.tipo}
                  onChange={handleChange}
                  className="form-select bg-dark text-light border-warning"
                >

                  <option value="futura">Futura</option>
                  <option value="realizada">Realizada</option>

                </select>

              </div>

              <div className="col-md-4">

                <label className="form-label text-light">
                  Nome
                </label>

                <input
                  name="nome"
                  value={form.nome}
                  onChange={handleChange}
                  placeholder="Nome da competição"
                  className="form-control bg-transparent text-light border-warning"
                  required
                />

              </div>

              <div className="col-md-2">

                <label className="form-label text-light">
                  Data
                </label>

                <input
                  name="data"
                  type="date"
                  value={form.data}
                  onChange={handleChange}
                  className="form-control bg-transparent text-light border-warning"
                  required
                />

              </div>

              <div className="col-md-2">

                <label className="form-label text-light">
                  Hora
                </label>

                <input
                  name="hora"
                  type="time"
                  value={form.hora}
                  onChange={handleChange}
                  className="form-control bg-transparent text-light border-warning"
                  required
                />

              </div>

              <div className="col-md-2">

                <label className="form-label text-light">
                  Local
                </label>

                <input
                  name="local"
                  value={form.local}
                  onChange={handleChange}
                  placeholder="Cidade / Arena"
                  className="form-control bg-transparent text-light border-warning"
                />

              </div>

            </div>

            {form.tipo === 'realizada' && (

              <div className="row g-3 mt-2">

                <div className="col-md-3">

                  <label className="form-label text-light">
                    Resultado
                  </label>

                  <input
                    name="resultado"
                    value={form.resultado}
                    onChange={handleChange}
                    placeholder="Ex: Vitória"
                    className="form-control bg-transparent text-light border-warning"
                  />

                </div>

                <div className="col-md-2">

                  <label className="form-label text-light">
                    Posição
                  </label>

                  <input
                    name="posicao"
                    value={form.posicao}
                    onChange={handleChange}
                    placeholder="1º"
                    className="form-control bg-transparent text-light border-warning"
                  />

                </div>

                <div className="col-md-2">

                  <label className="form-label text-light">
                    Pontos
                  </label>

                  <input
                    name="pontos"
                    value={form.pontos}
                    onChange={handleChange}
                    placeholder="10"
                    className="form-control bg-transparent text-light border-warning"
                  />

                </div>

              </div>

            )}

            <div className="mt-4">

              <button className="btn btn-warning fw-bold">

                <i className="fas fa-save me-2"></i>

                Adicionar Competição

              </button>

            </div>

          </form>

        </div>

      </div>

      {/* LISTA */}

      <div className="card bg-dark border-warning shadow">

        <div className="card-header bg-dark text-warning fw-bold">

          <i className="fas fa-list me-2"></i>

          Competições Registradas

        </div>

        <div className="card-body p-0">

          <div className="table-responsive">

            <table className="table table-dark table-hover align-middle mb-0">

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

                {competicoes.length === 0 && (

                  <tr>

                    <td colSpan="9" className="text-center text-secondary py-4">
                      Nenhuma competição cadastrada
                    </td>

                  </tr>

                )}

                {competicoes.map(c => (

                  <tr key={c.id}>

                    <td>

                      <span className={`badge ${c.tipo === 'futura' ? 'bg-primary' : 'bg-success'}`}>

                        {c.tipo}

                      </span>

                    </td>

                    <td>{c.nome}</td>

                    <td>{c.data}</td>

                    <td>{c.hora}</td>

                    <td>{c.local || '-'}</td>

                    <td>{c.resultado || '-'}</td>

                    <td>{c.posicao || '-'}</td>

                    <td>{c.pontos || '-'}</td>

                    <td>

                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => deleteComp(c.id)}
                      >

                        <i className="fas fa-trash"></i>

                      </button>

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

export default Competicoes;