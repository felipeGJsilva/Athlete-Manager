import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const iconMap = {
  atletas: 'fa-user',
  treinos: 'fa-dumbbell',
  avaliacoes: 'fa-chart-line',
  evolucoes: 'fa-running',
  competicoes: 'fa-trophy',
  metas: 'fa-bullseye',
  notificacoes: 'fa-bell'
};

function Dashboard() {

  const navigate = useNavigate();

  const [stats, setStats] = useState({
    atletas: 0,
    treinos: 0,
    avaliacoes: 0,
    evolucoes: 0,
    competicoes: 0,
    metas: 0,
    notificacoes: 0
  });

  useEffect(() => {

    const fetchStats = async () => {

      try {

        const endpoints = [
          'atletas',
          'treinos',
          'avaliacoes',
          'evolucoes',
          'competicoes',
          'metas',
          'notificacoes'
        ];

        const responses = await Promise.all(
          endpoints.map(endpoint =>
            fetch(`http://localhost:5000/api/${endpoint}`)
          )
        );

        const data = await Promise.all(
          responses.map(res => res.json())
        );

        setStats({
          atletas: data[0].length,
          treinos: data[1].length,
          avaliacoes: data[2].length,
          evolucoes: data[3].length,
          competicoes: data[4].length,
          metas: data[5].length,
          notificacoes: data[6].length
        });

      } catch (error) {

        console.error('Error fetching stats:', error);

      }

    };

    fetchStats();

  }, []);

  const handleNavigate = (key) => {
    navigate(`/${key}`);
  };

  return (

    <div className="container-fluid bg-black text-light min-vh-100 dashboard-container">

      <h1 className="dashboard-title">Dashboard</h1>

      <div className="dashboard-grid">

        {Object.entries(stats).map(([key, value]) => (

          <div
            key={key}
            className="dashboard-card"
            onClick={() => handleNavigate(key)}
            style={{ cursor: 'pointer' }}
          >

            <i className={`fas ${iconMap[key] || 'fa-chart-pie'} dashboard-icon`}></i>

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