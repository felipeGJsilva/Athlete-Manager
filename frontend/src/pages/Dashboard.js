import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const iconMap = {
  atletas: "fa-user",
  treinos: "fa-dumbbell",
  avaliacoes: "fa-chart-line",
  competicoes: "fa-trophy",
  metas: "fa-bullseye",
  notificacoes: "fa-bell"
};

function Dashboard() {

  const navigate = useNavigate();

  const [stats, setStats] = useState({
    atletas: 0,
    treinos: 0,
    avaliacoes: 0,
    competicoes: 0,
    metas: 0,
    notificacoes: 0
  });

  useEffect(() => {

    const carregarStats = () => {

      const atletas = JSON.parse(localStorage.getItem("atletasData")) || [];
      const treinos = JSON.parse(localStorage.getItem("treinosData")) || [];
      const avaliacoes = JSON.parse(localStorage.getItem("avaliacoesData")) || [];
      const competicoes = JSON.parse(localStorage.getItem("competicoesData")) || [];
      const metas = JSON.parse(localStorage.getItem("metasData")) || [];
      const notificacoes = JSON.parse(localStorage.getItem("notificacoes")) || [];

      setStats({
        atletas: atletas.length,
        treinos: treinos.length,
        avaliacoes: avaliacoes.length,
        competicoes: competicoes.length,
        metas: metas.length,
        notificacoes: notificacoes.length
      });

    };

    carregarStats();

    /* Atualiza automaticamente se o localStorage mudar */

    window.addEventListener("storage", carregarStats);

    return () => {
      window.removeEventListener("storage", carregarStats);
    };

  }, []);

  const handleNavigate = (key) => {
    navigate(`/${key}`);
  };

  return (

    <div className="container-fluid bg-black text-light min-vh-100 dashboard-container">

      <h1 className="dashboard-title">
        Dashboard
      </h1>

      <div className="dashboard-grid">

        {Object.entries(stats).map(([key, value]) => (

          <div
            key={key}
            className="dashboard-card"
            onClick={() => handleNavigate(key)}
            style={{ cursor: "pointer" }}
          >

            <i className={`fas ${iconMap[key]} dashboard-icon`}></i>

            <h5 className="dashboard-card-title">
              {key}
            </h5>

            <p className="dashboard-number">
              {value}
            </p>

            <small style={{ opacity: 0.7 }}>
              Ver detalhes →
            </small>

          </div>

        ))}

      </div>

    </div>

  );

}

export default Dashboard;