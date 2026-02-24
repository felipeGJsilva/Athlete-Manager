import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Dashboard from './pages/Dashboard';
import Atletas from './pages/Atletas';
import Treinos from './pages/Treinos';
import Avaliacoes from './pages/Avaliacoes';
import Evolucoes from './pages/Evolucoes';
import Competicoes from './pages/Competicoes';
import Metas from './pages/Metas';
import Notificacoes from './pages/Notificacoes';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/atletas" element={<Atletas />} />
            <Route path="/treinos" element={<Treinos />} />
            <Route path="/avaliacoes" element={<Avaliacoes />} />
            <Route path="/evolucoes" element={<Evolucoes />} />
            <Route path="/competicoes" element={<Competicoes />} />
            <Route path="/metas" element={<Metas />} />
            <Route path="/notificacoes" element={<Notificacoes />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;