import React, { useState, useEffect } from "react";
import { criarNotificacao } from "../utils/notificacao";

const STORAGE_KEY = "treinosData";

function Treinos() {

  const [treinos, setTreinos] = useState([]);

  const [form, setForm] = useState({
    atleta_id: "",
    tipo: "",
    duracao: "",
    intensidade: "Média",
    descricao: "",
    data: ""
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  /* CARREGAR DO LOCALSTORAGE */

  useEffect(() => {

    const stored = localStorage.getItem(STORAGE_KEY);

    if (stored) {
      setTreinos(JSON.parse(stored));
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

    const novoTreino = {
      id: Date.now(),
      atleta_id: form.atleta_id || null,
      tipo: form.tipo,
      duracao: form.duracao,
      intensidade: form.intensidade,
      descricao: form.descricao,
      data: form.data || new Date().toISOString()
    };

    const updated = [novoTreino, ...treinos];

    setTreinos(updated);
    salvarStorage(updated);

    /* NOTIFICAÇÃO AUTOMÁTICA */

    criarNotificacao(
      `Novo treino registrado: ${form.tipo}`,
      novoTreino.data
    );

    setMessage({
      type: "success",
      text: "Treino cadastrado com sucesso!"
    });

    setForm({
      atleta_id: "",
      tipo: "",
      duracao: "",
      intensidade: "Média",
      descricao: "",
      data: ""
    });

    setLoading(false);

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
        <div className={`alert alert-${message.type}`}>
          {message.text}
        </div>
      )}

      {/* FORM */}

      <div className="card bg-dark border-warning mb-4">

        <div className="card-header bg-warning text-dark fw-bold">
          Registrar Novo Treino
        </div>

        <div className="card-body">

          <form onSubmit={handleSubmit}>

            <div className="row g-3">

              <div className="col-md-2">
                <input
                  name="atleta_id"
                  value={form.atleta_id}
                  onChange={handleChange}
                  className="form-control bg-dark text-light border-warning"
                  placeholder="Atleta ID"
                />
              </div>

              <div className="col-md-4">
                <input
                  name="tipo"
                  value={form.tipo}
                  onChange={handleChange}
                  className="form-control bg-dark text-light border-warning"
                  placeholder="Tipo de treino"
                  required
                />
              </div>

              <div className="col-md-2">
                <input
                  name="duracao"
                  value={form.duracao}
                  onChange={handleChange}
                  className="form-control bg-dark text-light border-warning"
                  placeholder="Duração (min)"
                />
              </div>

              <div className="col-md-2">

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

                <input
                  type="datetime-local"
                  name="data"
                  value={form.data}
                  onChange={handleChange}
                  className="form-control bg-dark text-light border-warning"
                />

              </div>

              <div className="col-12">

                <textarea
                  name="descricao"
                  value={form.descricao}
                  onChange={handleChange}
                  className="form-control bg-dark text-light border-warning"
                  placeholder="Descrição"
                />

              </div>

              <div className="col-md-4">

                <button
                  className="btn btn-warning w-100"
                  disabled={loading}
                >

                  {loading ? "Salvando..." : "Salvar Treino"}

                </button>

              </div>

            </div>

          </form>

        </div>

      </div>

      {/* LISTA */}

      <div className="card bg-dark border-warning">

        <div className="card-header text-warning fw-bold">
          Últimos Treinos
        </div>

        <div className="card-body p-0">

          <div className="table-responsive">

            <table className="table table-dark table-hover mb-0">

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
                    <td colSpan="6" className="text-center py-4 text-secondary">
                      Nenhum treino registrado
                    </td>
                  </tr>

                )}

                {treinos.map((t, index) => (

                  <tr key={t.id}>

                    <td className="text-warning fw-bold">
                      {index + 1}
                    </td>

                    <td>{t.atleta_id || "-"}</td>

                    <td>{t.tipo}</td>

                    <td>{t.duracao || "-"}</td>

                    <td>
                      <span className="badge bg-warning text-dark">
                        {t.intensidade}
                      </span>
                    </td>

                    <td>
                      {new Date(t.data).toLocaleString()}
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