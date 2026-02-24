import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/dashboard">Athlete Manager</Link>
      </div>
      <ul className="navbar-nav">
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/atletas">Atletas</Link></li>
        <li><Link to="/treinos">Treinos</Link></li>
        <li><Link to="/avaliacoes">Avaliações</Link></li>
        <li><Link to="/evolucoes">Evoluções</Link></li>
        <li><Link to="/competicoes">Competições</Link></li>
        <li><Link to="/metas">Metas</Link></li>
        <li><Link to="/notificacoes">Notificações</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;