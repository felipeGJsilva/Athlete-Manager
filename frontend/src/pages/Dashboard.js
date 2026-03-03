import React, { useState, useEffect } from 'react';
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
        const endpoints = ['atletas', 'treinos', 'avaliacoes', 'evolucoes', 'competicoes', 'metas', 'notificacoes'];
        const promises = endpoints.map(endpoint => fetch(`http://localhost:5000/api/${endpoint}`));
        const responses = await Promise.all(promises);
        const data = await Promise.all(responses.map(res => res.json()));
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

  return (
    <div className="container page py-5">
      <h1 className="mb-4 text-gold">Dashboard</h1>
      <div className="row g-3">
        {Object.entries(stats).map(([key, value]) => (
          <div key={key} className="col-sm-6 col-md-4 col-lg-3">
            <div className="card h-100 text-center bg-dark border-warning">
              <div className="card-body d-flex flex-column justify-content-center align-items-center">
                <i className={`fas ${iconMap[key] || 'fa-chart-pie'} fa-3x text-warning mb-3`}></i>
                <h5 className="card-title text-warning text-capitalize">{key}</h5>
                <p className="display-4 mb-0 text-light">{value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
