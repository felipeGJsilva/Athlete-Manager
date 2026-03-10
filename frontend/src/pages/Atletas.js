import React, { useState, useEffect } from 'react';

const STORAGE_KEY = 'atletasData';

function Atletas() {

  const [atletas, setAtletas] = useState([]);

  const [form, setForm] = useState({
    nome: '',
    esporte: '',
    posicao: '',
    idade: '',
    altura: '',
    peso: ''
  });

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

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {

    e.preventDefault();

    setSaving(true);
    setMessage(null);

    const newAtleta = {
      id: Date.now(),
      ...form
    };

    const updated = [newAtleta, ...atletas];

    setAtletas(updated);
    saveToStorage(updated);

    setMessage({ type: 'success', text: 'Atleta cadastrado com sucesso!' });

    setForm({
      nome: '',
      esporte: '',
      posicao: '',
      idade: '',
      altura: '',
      peso: ''
    });

    setSaving(false);
  };

  return (

    <div className="container page py-5">

      {/* Header */}

      <div className="d-flex justify-content-between align-items-center mb-4">

        <h1 className="text-gold">
          <i className="fas fa-user me-2"></i>
          Atletas
        </h1>

        <span className="badge bg-warning text-dark fs-6">
          {atletas.length} cadastrados
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
          <i className="fas fa-user-plus me-2"></i>
          Cadastrar Novo Atleta
        </div>

        <div className="card-body">

          <form onSubmit={handleSubmit}>

            <div className="row g-3">

              <div className="col-md-4">
                <label className="form-label text-light">Nome</label>
                <input
                  name="nome"
                  value={form.nome}
                  onChange={handleChange}
                  className="form-control bg-transparent text-light border-warning"
                  placeholder="Nome do atleta"
                  required
                />
              </div>

              <div className="col-md-3">
                <label className="form-label text-light">Esporte</label>
                <input
                  name="esporte"
                  value={form.esporte}
                  onChange={handleChange}
                  className="form-control bg-transparent text-light border-warning"
                  placeholder="Ex: Futebol"
                />
              </div>

              <div className="col-md-3">
                <label className="form-label text-light">Posição</label>
                <input
                  name="posicao"
                  value={form.posicao}
                  onChange={handleChange}
                  className="form-control bg-transparent text-light border-warning"
                  placeholder="Ex: Atacante"
                />
              </div>

              <div className="col-md-2">
                <label className="form-label text-light">Idade</label>
                <input
                  name="idade"
                  value={form.idade}
                  onChange={handleChange}
                  className="form-control bg-transparent text-light border-warning"
                />
              </div>

              <div className="col-md-3">
                <label className="form-label text-light">Altura</label>
                <input
                  name="altura"
                  value={form.altura}
                  onChange={handleChange}
                  className="form-control bg-transparent text-light border-warning"
                  placeholder="1.80"
                />
              </div>

              <div className="col-md-3">
                <label className="form-label text-light">Peso</label>
                <input
                  name="peso"
                  value={form.peso}
                  onChange={handleChange}
                  className="form-control bg-transparent text-light border-warning"
                  placeholder="80kg"
                />
              </div>

              <div className="col-md-6 d-flex align-items-end">

                <button
                  className="btn btn-warning w-100 fw-bold"
                  disabled={saving}
                >

                  {saving
                    ? 'Salvando...'
                    : (
                      <>
                        <i className="fas fa-save me-2"></i>
                        Cadastrar Atleta
                      </>
                    )
                  }

                </button>

              </div>

            </div>

          </form>

        </div>

      </div>

      {/* TABELA */}

      <div className="card bg-dark border-warning shadow">

        <div className="card-header bg-dark text-warning fw-bold">
          <i className="fas fa-list me-2"></i>
          Lista de Atletas
        </div>

        <div className="card-body p-0">

          <div className="table-responsive">

            <table className="table table-dark table-hover align-middle mb-0">

              <thead className="table-warning text-dark">

                <tr>
                  <th>#</th>
                  <th>Nome</th>
                  <th>Esporte</th>
                  <th>Posição</th>
                  <th>Idade</th>
                  <th>Altura</th>
                  <th>Peso</th>
                  <th className="text-center">Ações</th>
                </tr>

              </thead>

              <tbody>

                {atletas.length === 0 && (
                  <tr>
                    <td colSpan="8" className="text-center text-secondary py-4">
                      Nenhum atleta cadastrado
                    </td>
                  </tr>
                )}

                {atletas.map((atleta, index) => (

                  <tr key={atleta.id}>

                    <td className="text-warning fw-bold">
                      {index + 1}
                    </td>

                    <td>{atleta.nome}</td>
                    <td>{atleta.esporte}</td>
                    <td>{atleta.posicao}</td>
                    <td>{atleta.idade}</td>
                    <td>{atleta.altura}</td>
                    <td>{atleta.peso}</td>

                    <td className="text-center">

                      <button className="btn btn-outline-warning btn-sm me-2">
                        <i className="fas fa-edit"></i>
                      </button>

                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => deleteAtleta(atleta.id)}
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

export default Atletas;