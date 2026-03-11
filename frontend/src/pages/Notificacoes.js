import React, { useState, useEffect } from "react";

const STORAGE_KEY = "notificacoes";

function Notificacoes() {

  const [notificacoes, setNotificacoes] = useState([]);

  const carregar = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setNotificacoes(JSON.parse(stored));
  };

  useEffect(() => {

    carregar();

    const interval = setInterval(() => {
      carregar();
    }, 1000);

    return () => clearInterval(interval);

  }, []);

  const remover = (id) => {

    const lista = notificacoes.filter(n => n.id !== id);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));

    setNotificacoes(lista);

  };

  const limpar = () => {

    if (!window.confirm("Limpar todas notificações?")) return;

    localStorage.removeItem(STORAGE_KEY);

    setNotificacoes([]);

  };

  return (

    <div className="container page py-5">

      <div className="d-flex justify-content-between mb-4">

        <h1 className="text-gold">Notificações</h1>

        <button className="btn btn-danger" onClick={limpar}>
          Limpar
        </button>

      </div>

      {notificacoes.length === 0 ? (

        <p>Nenhuma notificação.</p>

      ) : (

        <div className="list-group">

          {notificacoes.map(n => (

            <div
              key={n.id}
              className="list-group-item bg-dark text-light border-warning d-flex justify-content-between"
            >

              <div>

                <strong>{n.mensagem}</strong>

                <br/>

                <small style={{opacity:0.7}}>
                  {n.data}
                </small>

              </div>

              <button
                className="btn btn-sm btn-danger"
                onClick={() => remover(n.id)}
              >
                Remover
              </button>

            </div>

          ))}

        </div>

      )}

    </div>

  );

}

export default Notificacoes;