import React, { useState, useEffect } from "react";
import { criarNotificacao } from "../utils/notificacao";

const STORAGE_KEY = "avaliacoesData";

function Avaliacoes() {

  const [avaliacoes, setAvaliacoes] = useState([]);

  const [form, setForm] = useState({
    atleta_id: "",
    peso: "",
    altura: "",
    gordura: "",
    observacoes: "",
    data: ""
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  /* CARREGAR AVALIAÇÕES */

  useEffect(() => {

    const stored = localStorage.getItem(STORAGE_KEY);

    if (stored) {
      setAvaliacoes(JSON.parse(stored));
    }

  }, []);

  const salvarStorage = (lista) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {

    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const novaAvaliacao = {

      id: Date.now(),

      atleta_id: form.atleta_id || null,

      peso: form.peso || null,

      altura: form.altura || null,

      gordura_percentual: form.gordura || null,

      observacoes: form.observacoes,

      data: form.data || new Date().toISOString()

    };

    const updated = [novaAvaliacao, ...avaliacoes];

    setAvaliacoes(updated);
    salvarStorage(updated);

    /* NOTIFICAÇÃO AUTOMÁTICA */

    criarNotificacao(
      `Nova avaliação física registrada (Atleta ${form.atleta_id || "N/A"})`,
      novaAvaliacao.data
    );

    setMessage({
      type: "success",
      text: "Avaliação salva com sucesso!"
    });

    setForm({
      atleta_id: "",
      peso: "",
      altura: "",
      gordura: "",
      observacoes: "",
      data: ""
    });

    setLoading(false);

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
        <div className={`alert alert-${message.type}`}>
          {message.text}
        </div>
      )}

      {/* FORM */}

      <div className="card bg-dark border-warning mb-4">

        <div className="card-header bg-warning text-dark fw-bold">
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
                  className="form-control bg-dark text-light border-warning"
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
                  className="form-control bg-dark text-light border-warning"
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
                  className="form-control bg-dark text-light border-warning"
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
                  className="form-control bg-dark text-light border-warning"
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
                  className="form-control bg-dark text-light border-warning"
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
                  className="form-control bg-dark text-light border-warning"
                />
              </div>

              <div className="col-md-4">

                <button
                  className="btn btn-warning w-100"
                  disabled={loading}
                >

                  {loading ? "Salvando..." : "Salvar Avaliação"}

                </button>

              </div>

            </div>

          </form>

        </div>

      </div>

      {/* LISTA */}

      <div className="card bg-dark border-warning">

        <div className="card-header text-warning fw-bold">
          Avaliações Recentes
        </div>

        <div className="card-body p-0">

          <div className="table-responsive">

            <table className="table table-dark table-hover mb-0">

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
                    <td colSpan="6" className="text-center py-4 text-secondary">
                      Nenhuma avaliação registrada
                    </td>
                  </tr>

                )}

                {avaliacoes.map((a, index) => (

                  <tr key={a.id}>

                    <td className="text-warning fw-bold">
                      {index + 1}
                    </td>

                    <td>{a.atleta_id || "-"}</td>

                    <td>{a.peso || "-"}</td>

                    <td>{a.altura || "-"}</td>

                    <td>
                      <span className="badge bg-warning text-dark">
                        {a.gordura_percentual || "-"}
                      </span>
                    </td>

                    <td>
                      {new Date(a.data).toLocaleDateString()}
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