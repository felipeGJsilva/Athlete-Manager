import React, { useState, useEffect } from 'react';
import './Atletas.css';

function Atletas() {
  const [atletas, setAtletas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAtletas();
  }, []);

  const fetchAtletas = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/atletas');
      if (!response.ok) throw new Error('Failed to fetch atletas');
      const data = await response.json();
      setAtletas(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteAtleta = async (id) => {
    if (!window.confirm('Tem certeza que deseja deletar este atleta?')) return;
    try {
      const response = await fetch(`http://localhost:5000/api/atletas/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete atleta');
      setAtletas(atletas.filter(atleta => atleta.id !== id));
    } catch (err) {
      alert('Erro ao deletar atleta: ' + err.message);
    }
  };

  if (loading) return <div className="loading">Carregando...</div>;
  if (error) return <div className="error">Erro: {error}</div>;

  return (
    <div className="atletas">
      <h1>Atletas</h1>
      <button className="add-btn">Adicionar Atleta</button>
      <table className="atletas-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Esporte</th>
            <th>Posição</th>
            <th>Idade</th>
            <th>Altura</th>
            <th>Peso</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {atletas.map(atleta => (
            <tr key={atleta.id}>
              <td>{atleta.id}</td>
              <td>{atleta.nome}</td>
              <td>{atleta.esporte}</td>
              <td>{atleta.posicao}</td>
              <td>{atleta.idade}</td>
              <td>{atleta.altura}</td>
              <td>{atleta.peso}</td>
              <td>
                <button className="edit-btn">Editar</button>
                <button className="delete-btn" onClick={() => deleteAtleta(atleta.id)}>Deletar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Atletas;