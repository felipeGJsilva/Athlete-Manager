const STORAGE_KEY = "notificacoes";

export function criarNotificacao(mensagem) {

  const stored = localStorage.getItem(STORAGE_KEY);

  const lista = stored ? JSON.parse(stored) : [];

  const nova = {
    id: Date.now(),
    mensagem: mensagem,
    data: new Date().toLocaleString()
  };

  const atualizadas = [nova, ...lista];

  localStorage.setItem(STORAGE_KEY, JSON.stringify(atualizadas));

}