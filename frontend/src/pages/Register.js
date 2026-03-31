import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuthUser, registerUser } from "../utils/auth";

function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (getAuthUser()) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!username || !email || !password || !confirmPassword) {
      setMessage("Preencha todos os campos.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("As senhas não coincidem.");
      return;
    }

    if (password.length < 6) {
      setMessage("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    const result = registerUser({
      username: username.trim(),
      email: email.trim(),
      password,
      role: "atleta",
    });

    if (!result.success) {
      setMessage(result.error);
      return;
    }

    navigate("/login", { replace: true });
  };

  return (
    <div className="auth-page d-flex align-items-center justify-content-center">
      <div className="auth-card w-100" style={{ maxWidth: 560 }}>
        <div className="text-center mb-4">
          <h2 className="text-gold mb-2">Registrar</h2>
          <p className="auth-subtitle mb-0">Crie sua conta para acessar o painel.</p>
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
              placeholder="Escolha um usuário"
            />
          </div>

          <div className="mb-3">
            <label className="form-label text-light">Email</label>
            <input
              type="email"
              className="form-control auth-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
            />
          </div>

          <div className="mb-3">
            <label className="form-label text-light">Senha</label>
            <input
              type="password"
              className="form-control auth-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Crie uma senha"
            />
          </div>

          <div className="mb-3">
            <label className="form-label text-light">Confirmar senha</label>
            <input
              type="password"
              className="form-control auth-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repita a senha"
            />
          </div>

          <button type="submit" className="btn btn-gold w-100 py-2">
            Criar conta
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="mb-0 text-light">
            Já tem conta? <Link className="text-warning" to="/login">Fazer login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
