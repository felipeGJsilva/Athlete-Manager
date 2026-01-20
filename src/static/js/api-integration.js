// Exemplos de Integração Frontend com API
// Use estes exemplos em seus arquivos JavaScript

const API_URL = 'http://localhost:5000/api';

// ============== UTILIDADES ==============

async function fetchAPI(endpoint, method = 'GET', data = null) {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' }
  };

  if (data && (method === 'POST' || method === 'PUT')) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, options);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `HTTP ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Erro na requisição ${endpoint}:`, error);
    throw error;
  }
}

// ============== ATLETAS ==============

// Obter todos os atletas
async function getAtletas() {
  return await fetchAPI('/atletas');
}

// Obter um atleta específico
async function getAtleta(id) {
  return await fetchAPI(`/atletas/${id}`);
}

// Criar novo atleta
async function criarAtleta(dados) {
  return await fetchAPI('/atletas', 'POST', dados);
}

// Atualizar atleta
async function atualizarAtleta(id, dados) {
  return await fetchAPI(`/atletas/${id}`, 'PUT', dados);
}

// Deletar atleta
async function deletarAtleta(id) {
  return await fetchAPI(`/atletas/${id}`, 'DELETE');
}

// ============== TREINOS ==============

// Obter treinos de um atleta
async function getTreinosPorAtleta(atletaId) {
  return await fetchAPI(`/treinos?atleta_id=${atletaId}`);
}

// Criar novo treino
async function criarTreino(dados) {
  return await fetchAPI('/treinos', 'POST', dados);
}

// Atualizar treino
async function atualizarTreino(id, dados) {
  return await fetchAPI(`/treinos/${id}`, 'PUT', dados);
}

// Deletar treino
async function deletarTreino(id) {
  return await fetchAPI(`/treinos/${id}`, 'DELETE');
}

// ============== AVALIAÇÕES ==============

// Obter avaliações de um atleta
async function getAvaliacoesPorAtleta(atletaId) {
  return await fetchAPI(`/avaliacoes?atleta_id=${atletaId}`);
}

// Criar nova avaliação
async function criarAvaliacao(dados) {
  return await fetchAPI('/avaliacoes', 'POST', dados);
}

// Atualizar avaliação
async function atualizarAvaliacao(id, dados) {
  return await fetchAPI(`/avaliacoes/${id}`, 'PUT', dados);
}

// ============== EVOLUÇÕES ==============

// Obter evoluções de um atleta
async function getEvolucoesPorAtleta(atletaId) {
  return await fetchAPI(`/evolucao?atleta_id=${atletaId}`);
}

// Criar nova evolução
async function criarEvolucao(dados) {
  return await fetchAPI('/evolucao', 'POST', dados);
}

// ============== COMPETIÇÕES ==============

// Obter todas as competições
async function getCompeticoes() {
  return await fetchAPI('/competicoes');
}

// Criar competição
async function criarCompeticao(dados) {
  return await fetchAPI('/competicoes', 'POST', dados);
}

// ============== METAS ==============

// Obter metas de um atleta
async function getMetasPorAtleta(atletaId) {
  return await fetchAPI(`/metas?atleta_id=${atletaId}`);
}

// Obter metas ativas
async function getMetasAtivas(atletaId) {
  return await fetchAPI(`/metas?atleta_id=${atletaId}&status=ativa`);
}

// Criar meta
async function criarMeta(dados) {
  return await fetchAPI('/metas', 'POST', dados);
}

// Atualizar meta (incluindo progresso)
async function atualizarMeta(id, dados) {
  return await fetchAPI(`/metas/${id}`, 'PUT', dados);
}

// ============== NOTIFICAÇÕES ==============

// Obter notificações de um atleta
async function getNotificacoesPorAtleta(atletaId) {
  return await fetchAPI(`/notificacoes?atleta_id=${atletaId}`);
}

// Obter notificações não lidas
async function getNotificacoesNaoLidas(atletaId) {
  return await fetchAPI(`/notificacoes/atleta/${atletaId}/nao-lidas`);
}

// Criar notificação
async function criarNotificacao(dados) {
  return await fetchAPI('/notificacoes', 'POST', dados);
}

// Marcar notificação como lida
async function marcarNotificacaoComoLida(id) {
  return await fetchAPI(`/notificacoes/${id}`, 'PUT', { lida: true });
}

// ============== RELATÓRIOS ==============

// Obter resumo completo de um atleta
async function getResumoAtleta(atletaId) {
  return await fetchAPI(`/atletas/${atletaId}/resumo`);
}

// ============== EXEMPLOS DE USO ==============

// Exemplo 1: Listar todos os atletas e exibir em uma tabela
async function carregarAtletasHTML() {
  try {
    const atletas = await getAtletas();
    const tbody = document.querySelector('table tbody');
    
    tbody.innerHTML = '';
    atletas.forEach(atleta => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${atleta.id}</td>
        <td>${atleta.nome}</td>
        <td>${atleta.esporte}</td>
        <td>${atleta.peso} kg</td>
        <td>
          <button onclick="editarAtleta(${atleta.id})">Editar</button>
          <button onclick="deletarAtletaBtn(${atleta.id})">Deletar</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (error) {
    alert('Erro ao carregar atletas: ' + error.message);
  }
}

// Exemplo 2: Criar novo atleta via formulário
async function handleCriarAtletaFormulario(event) {
  event.preventDefault();
  
  const formData = new FormData(event.target);
  const dados = {
    nome: formData.get('nome'),
    esporte: formData.get('esporte'),
    posicao: formData.get('posicao'),
    idade: parseInt(formData.get('idade')),
    altura: parseFloat(formData.get('altura')),
    peso: parseFloat(formData.get('peso'))
  };

  try {
    const resultado = await criarAtleta(dados);
    alert(`Atleta criado com ID: ${resultado.id}`);
    event.target.reset();
    carregarAtletasHTML(); // Recarregar lista
  } catch (error) {
    alert('Erro ao criar atleta: ' + error.message);
  }
}

// Exemplo 3: Exibir resumo completo de um atleta
async function exibirResumoAtleta(atletaId) {
  try {
    const resumo = await getResumoAtleta(atletaId);
    
    console.log('Atleta:', resumo.atleta);
    console.log('Treinos:', resumo.treinos);
    console.log('Avaliações:', resumo.avaliacoes);
    console.log('Evoluções:', resumo.evolucoes);
    console.log('Metas:', resumo.metas);
    console.log('Notificações:', resumo.notificacoes);
    
    // Exemplo de exibição em HTML
    const html = `
      <h2>${resumo.atleta.nome}</h2>
      <p>Esporte: ${resumo.atleta.esporte}</p>
      <p>Peso: ${resumo.atleta.peso} kg</p>
      <h3>Treinos: ${resumo.treinos.length}</h3>
      <h3>Metas: ${resumo.metas.length}</h3>
      <h3>Notificações: ${resumo.notificacoes.length}</h3>
    `;
    
    document.getElementById('resumo-container').innerHTML = html;
  } catch (error) {
    alert('Erro ao carregar resumo: ' + error.message);
  }
}

// Exemplo 4: Adicionar treino para um atleta
async function adicionarTreino(atletaId, event) {
  event.preventDefault();
  
  const formData = new FormData(event.target);
  const dados = {
    atleta_id: atletaId,
    tipo: formData.get('tipo'),
    descricao: formData.get('descricao'),
    duracao_minutos: parseInt(formData.get('duracao')),
    intensidade: formData.get('intensidade')
  };

  try {
    const resultado = await criarTreino(dados);
    alert(`Treino criado com ID: ${resultado.id}`);
    event.target.reset();
  } catch (error) {
    alert('Erro ao criar treino: ' + error.message);
  }
}

// Exemplo 5: Atualizar progresso de uma meta
async function atualizarProgressoMeta(metaId, novoProgresso) {
  try {
    const resultado = await atualizarMeta(metaId, { progresso: novoProgresso });
    console.log('Meta atualizada:', resultado);
    alert(`Progresso atualizado para ${novoProgresso}%`);
  } catch (error) {
    alert('Erro ao atualizar meta: ' + error.message);
  }
}

// Exemplo 6: Verificar notificações não lidas
async function verificarNotificacoesNaoLidas(atletaId) {
  try {
    const resultado = await getNotificacoesNaoLidas(atletaId);
    console.log(`Notificações não lidas: ${resultado.nao_lidas}`);
    
    // Exibir badge de notificações
    const badge = document.getElementById('notification-badge');
    if (badge) {
      badge.textContent = resultado.nao_lidas;
      badge.style.display = resultado.nao_lidas > 0 ? 'block' : 'none';
    }
  } catch (error) {
    console.error('Erro ao verificar notificações:', error);
  }
}

// Exemplo 7: Atualizar dados de um atleta
async function handleAtualizarAtleta(atletaId, event) {
  event.preventDefault();
  
  const formData = new FormData(event.target);
  const dados = {
    peso: parseFloat(formData.get('peso')),
    altura: parseFloat(formData.get('altura'))
  };

  try {
    const resultado = await atualizarAtleta(atletaId, dados);
    alert('Atleta atualizado com sucesso!');
    console.log('Novo dados:', resultado);
  } catch (error) {
    alert('Erro ao atualizar atleta: ' + error.message);
  }
}

// ============== INICIALIZAÇÃO ==============

// Executar ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
  console.log('API integrada com sucesso!');
  console.log('URL da API:', API_URL);
  
  // Carregar atletas
  carregarAtletasHTML();
  
  // Verificar notificações a cada 30 segundos
  setInterval(() => {
    const atletaId = localStorage.getItem('atletaId');
    if (atletaId) {
      verificarNotificacoesNaoLidas(atletaId);
    }
  }, 30000);
});
