import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import './App.css';
import Dashboard from './pages/Dashboard';
import Atletas from './pages/Atletas';
import Treinos from './pages/Treinos';
import Avaliacoes from './pages/Avaliacoes';
import Evolucoes from './pages/Evolucoes';
import Competicoes from './pages/Competicoes';
import Metas from './pages/Metas';
import Notificacoes from './pages/Notificacoes';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/Navbar';
import { clearAuthUser, isAuthenticated } from './utils/auth';

function AppContent() {
  const auth = isAuthenticated();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuthUser();
    navigate('/login', { replace: true });
  };

  const ProtectedRoute = ({ children }) => {
    return isAuthenticated() ? children : <Navigate to="/login" replace />;
  };

  return (
    <div className="App">
      {auth && <Navbar isAuthenticated={auth} onLogout={handleLogout} />}
      <main>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/atletas"
            element={
              <ProtectedRoute>
                <Atletas />
              </ProtectedRoute>
            }
          />
          <Route
            path="/treinos"
            element={
              <ProtectedRoute>
                <Treinos />
              </ProtectedRoute>
            }
          />
          <Route
            path="/avaliacoes"
            element={
              <ProtectedRoute>
                <Avaliacoes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/evolucoes"
            element={
              <ProtectedRoute>
                <Evolucoes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/competicoes"
            element={
              <ProtectedRoute>
                <Competicoes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/metas"
            element={
              <ProtectedRoute>
                <Metas />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notificacoes"
            element={
              <ProtectedRoute>
                <Notificacoes />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to={auth ? '/dashboard' : '/login'} replace />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
