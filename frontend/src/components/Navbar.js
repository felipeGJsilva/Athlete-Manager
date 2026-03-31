import React from 'react';
import { Link } from 'react-router-dom';

function Navbar({ isAuthenticated, onLogout }) {
  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark sticky-top" style={{ backgroundColor: 'var(--theme-black)', borderBottom: '2px solid var(--theme-gold)' }}>
      <div className="container-fluid">
        <Link className="navbar-brand text-warning" to="/dashboard">
          Athlete Manager
        </Link>

        <button
          className="navbar-toggler text-warning"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link text-light" to="/dashboard">Dashboard</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-light" to="/atletas">Atletas</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-light" to="/treinos">Treinos</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-light" to="/avaliacoes">Avaliações</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-light" to="/competicoes">Competições</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-light" to="/metas">Metas</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-light" to="/notificacoes">Notificações</Link>
            </li>
            <li className="nav-item d-flex align-items-center">
              <button className="btn btn-outline-warning ms-3" type="button" onClick={onLogout}>
                Sair
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
