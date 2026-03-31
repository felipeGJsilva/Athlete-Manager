import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuthUser, loginUser, setAuthUser } from "../utils/auth";

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (getAuthUser()) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!username || !password) {
      setMessage("Preencha usuário e senha.");
      return;
    }

    const user = loginUser(username.trim(), password);
    if (!user) {
      setMessage("Usuário ou senha inválidos.");
      return;
    }

    setAuthUser(user);
    navigate("/dashboard", { replace: true });
  };

  return (
    <div className="auth-page d-flex align-items-center justify-content-center">
      <div className="auth-card w-100" style={{ maxWidth: 520 }}>
        <div className="text-center mb-4">
          <h2 className="text-gold mb-2">Login</h2>
          <p className="auth-subtitle mb-0">Entre com seu usuário e senha para acessar o painel.</p>
        </div>

        {message && (
          <div className="alert alert-warning" role="alert">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label text-light">Usuário</label>
            <input
              type="text"
              className="form-control auth-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Digite seu usuário"
            />
          </div>

          <div className="mb-3">
            <label className="form-label text-light">Senha</label>
            <input
              type="password"
              className="form-control auth-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha"
            />
          </div>

          <button type="submit" className="btn btn-gold w-100 py-2">
            Entrar
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="mb-0 text-light">
            Não tem conta? <Link className="text-warning" to="/register">Registrar-se</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
