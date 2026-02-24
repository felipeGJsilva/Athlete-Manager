import React, { useState, useEffect } from 'react';
import './Dashboard.css';

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
    <div className="dashboard">
      <h1>Dashboard</h1>
      <div className="stats-grid">
        <div className="stat-card">
          <h2>Atletas</h2>
          <p>{stats.atletas}</p>
        </div>
        <div className="stat-card">
          <h2>Treinos</h2>
          <p>{stats.treinos}</p>
        </div>
        <div className="stat-card">
          <h2>Avaliações</h2>
          <p>{stats.avaliacoes}</p>
        </div>
        <div className="stat-card">
          <h2>Evoluções</h2>
          <p>{stats.evolucoes}</p>
        </div>
        <div className="stat-card">
          <h2>Competições</h2>
          <p>{stats.competicoes}</p>
        </div>
        <div className="stat-card">
          <h2>Metas</h2>
          <p>{stats.metas}</p>
        </div>
        <div className="stat-card">
          <h2>Notificações</h2>
          <p>{stats.notificacoes}</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;