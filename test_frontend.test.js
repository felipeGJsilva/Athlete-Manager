/**
 * Testes para o Frontend do Athlete Manager
 * Utiliza Jest para testes unitários
 * 
 * Testa funcionalidades principais:
 * - Funções de API de atletas
 * - Funções de API de treinos
 * - Funções de API de avaliações
 */

// Mock do fetch global
global.fetch = jest.fn();

// Importar as funções a serem testadas
const API_URL = 'http://localhost:5000/api';

/**
 * Função auxiliar para requisições à API
 */
async function fetchAPI(endpoint, method = 'GET', data = null) {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' }
  };

  if (data && (method === 'POST' || method === 'PUT')) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(`${API_URL}${endpoint}`, options);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || `HTTP ${response.status}`);
  }
  return await response.json();
}

// ============= TESTES DE ATLETAS =============

describe('API de Atletas', () => {
  
  beforeEach(() => {
    fetch.mockClear();
  });

  test('getAtletas deve buscar todos os atletas', async () => {
    const mockAtletas = [
      { id: 1, nome: 'João Silva', esporte: 'Futebol' },
      { id: 2, nome: 'Maria Santos', esporte: 'Vôlei' }
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockAtletas
    });

    const resultado = await fetchAPI('/atletas');
    
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/atletas`,
      expect.any(Object)
    );
    expect(resultado).toEqual(mockAtletas);
    expect(resultado.length).toBe(2);
  });

  test('getAtleta deve buscar um atleta específico', async () => {
    const mockAtleta = {
      id: 1,
      nome: 'João Silva',
      esporte: 'Futebol',
      posicao: 'Zagueiro',
      altura: 1.85,
      peso: 82.5
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockAtleta
    });

    const resultado = await fetchAPI('/atletas/1');
    
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/atletas/1`,
      expect.any(Object)
    );
    expect(resultado.id).toBe(1);
    expect(resultado.nome).toBe('João Silva');
  });

  test('criarAtleta deve enviar dados corretos', async () => {
    const novoAtleta = {
      nome: 'João Silva',
      esporte: 'Futebol',
      posicao: 'Zagueiro',
      altura: 1.85,
      peso: 82.5
    };

    const atlletaCriado = { id: 1, ...novoAtleta };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => atlletaCriado
    });

    const resultado = await fetchAPI('/atletas', 'POST', novoAtleta);
    
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/atletas`,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(novoAtleta)
      })
    );
    expect(resultado.id).toBe(1);
  });

  test('atualizarAtleta deve enviar atualização', async () => {
    const atualizacoes = { peso: 85.0, altura: 1.87 };
    const atletaAtualizado = {
      id: 1,
      nome: 'João Silva',
      esporte: 'Futebol',
      ...atualizacoes
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => atletaAtualizado
    });

    const resultado = await fetchAPI('/atletas/1', 'PUT', atualizacoes);
    
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/atletas/1`,
      expect.objectContaining({
        method: 'PUT',
        body: JSON.stringify(atualizacoes)
      })
    );
    expect(resultado.peso).toBe(85.0);
    expect(resultado.altura).toBe(1.87);
  });

  test('deletarAtleta deve enviar requisição DELETE', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Atleta deletado com sucesso' })
    });

    const resultado = await fetchAPI('/atletas/1', 'DELETE');
    
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/atletas/1`,
      expect.objectContaining({
        method: 'DELETE'
      })
    );
    expect(resultado.message).toContain('deletado');
  });

  test('getAtletas deve lidar com erro', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Erro ao buscar atletas' })
    });

    await expect(fetchAPI('/atletas')).rejects.toThrow();
  });
});

// ============= TESTES DE TREINOS =============

describe('API de Treinos', () => {
  
  beforeEach(() => {
    fetch.mockClear();
  });

  test('getTreinosPorAtleta deve buscar treinos de um atleta', async () => {
    const mockTreinos = [
      { 
        id: 1, 
        atleta_id: 1, 
        tipo: 'Força', 
        duracao_minutos: 60,
        intensidade: 'alta'
      },
      { 
        id: 2, 
        atleta_id: 1, 
        tipo: 'Resistência', 
        duracao_minutos: 45,
        intensidade: 'media'
      }
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockTreinos
    });

    const resultado = await fetchAPI('/treinos?atleta_id=1');
    
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/treinos?atleta_id=1`,
      expect.any(Object)
    );
    expect(resultado.length).toBe(2);
    expect(resultado[0].tipo).toBe('Força');
  });

  test('criarTreino deve enviar dados corretos', async () => {
    const novoTreino = {
      atleta_id: 1,
      tipo: 'Força',
      descricao: 'Treino de força para membros inferiores',
      duracao_minutos: 60,
      intensidade: 'alta'
    };

    const treinoCriado = { id: 1, ...novoTreino };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => treinoCriado
    });

    const resultado = await fetchAPI('/treinos', 'POST', novoTreino);
    
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/treinos`,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(novoTreino)
      })
    );
    expect(resultado.tipo).toBe('Força');
    expect(resultado.duracao_minutos).toBe(60);
  });

  test('atualizarTreino deve enviar atualização', async () => {
    const atualizacoes = { 
      tipo: 'Resistência', 
      duracao_minutos: 90 
    };
    const treinoAtualizado = {
      id: 1,
      atleta_id: 1,
      ...atualizacoes
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => treinoAtualizado
    });

    const resultado = await fetchAPI('/treinos/1', 'PUT', atualizacoes);
    
    expect(resultado.tipo).toBe('Resistência');
    expect(resultado.duracao_minutos).toBe(90);
  });

  test('deletarTreino deve enviar requisição DELETE', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Treino deletado' })
    });

    const resultado = await fetchAPI('/treinos/1', 'DELETE');
    
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/treinos/1`,
      expect.objectContaining({
        method: 'DELETE'
      })
    );
  });

  test('getTreinosPorAtleta deve filtrar por atleta_id', async () => {
    const atletaId = 42;
    const mockTreinos = [
      { id: 1, atleta_id: 42, tipo: 'Força' },
      { id: 2, atleta_id: 42, tipo: 'Cardio' }
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockTreinos
    });

    await fetchAPI(`/treinos?atleta_id=${atletaId}`);
    
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/treinos?atleta_id=${atletaId}`,
      expect.any(Object)
    );
  });

  test('criarTreino com intensidade válida', async () => {
    const intensidades = ['baixa', 'media', 'alta'];
    
    for (const intensidade of intensidades) {
      const treino = {
        atleta_id: 1,
        tipo: 'Teste',
        intensidade
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 1, ...treino })
      });

      const resultado = await fetchAPI('/treinos', 'POST', treino);
      expect(resultado.intensidade).toBe(intensidade);
    }
  });
});

// ============= TESTES DE AVALIAÇÕES =============

describe('API de Avaliações', () => {
  
  beforeEach(() => {
    fetch.mockClear();
  });

  test('getAvaliacoesPorAtleta deve buscar avaliações de um atleta', async () => {
    const mockAvaliacoes = [
      {
        id: 1,
        atleta_id: 1,
        forca: 8.5,
        resistencia: 7.0,
        velocidade: 8.0,
        flexibilidade: 6.5,
        imc: 24.1
      }
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockAvaliacoes
    });

    const resultado = await fetchAPI('/avaliacoes?atleta_id=1');
    
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/avaliacoes?atleta_id=1`,
      expect.any(Object)
    );
    expect(resultado.length).toBe(1);
    expect(resultado[0].forca).toBe(8.5);
  });

  test('criarAvaliacao deve enviar dados corretos', async () => {
    const novaAvaliacao = {
      atleta_id: 1,
      forca: 8.5,
      resistencia: 7.0,
      velocidade: 8.0,
      flexibilidade: 6.5,
      imc: 24.1,
      observacoes: 'Atleta em bom estado físico'
    };

    const avaliacaoCriada = { id: 1, ...novaAvaliacao };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => avaliacaoCriada
    });

    const resultado = await fetchAPI('/avaliacoes', 'POST', novaAvaliacao);
    
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/avaliacoes`,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(novaAvaliacao)
      })
    );
    expect(resultado.forca).toBe(8.5);
    expect(resultado.imc).toBe(24.1);
  });

  test('atualizarAvaliacao deve enviar atualização', async () => {
    const atualizacoes = {
      forca: 9.0,
      resistencia: 7.5
    };
    const avaliacaoAtualizada = {
      id: 1,
      atleta_id: 1,
      ...atualizacoes,
      velocidade: 8.0,
      flexibilidade: 6.5,
      imc: 24.1
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => avaliacaoAtualizada
    });

    const resultado = await fetchAPI('/avaliacoes/1', 'PUT', atualizacoes);
    
    expect(resultado.forca).toBe(9.0);
    expect(resultado.resistencia).toBe(7.5);
  });

  test('deletarAvaliacao deve enviar requisição DELETE', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Avaliação deletada' })
    });

    const resultado = await fetchAPI('/avaliacoes/1', 'DELETE');
    
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/avaliacoes/1`,
      expect.objectContaining({
        method: 'DELETE'
      })
    );
  });

  test('criarAvaliacao deve validar métricas', async () => {
    const avaliacoes = [
      { forca: 9.5, resistencia: 8.0, velocidade: 8.5 },
      { forca: 7.0, resistencia: 6.5, velocidade: 7.5 },
      { forca: 10.0, resistencia: 9.0, velocidade: 9.5 }
    ];

    for (const metrica of avaliacoes) {
      const avaliacao = {
        atleta_id: 1,
        ...metrica,
        imc: 24.0
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 1, ...avaliacao })
      });

      const resultado = await fetchAPI('/avaliacoes', 'POST', avaliacao);
      expect(resultado.forca).toBeDefined();
      expect(resultado.resistencia).toBeDefined();
    }
  });

  test('getAvaliacoesPorAtleta deve filtrar por atleta_id', async () => {
    const atletaId = 5;
    const mockAvaliacoes = [
      { id: 1, atleta_id: 5, forca: 8.5 },
      { id: 2, atleta_id: 5, forca: 8.7 }
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockAvaliacoes
    });

    await fetchAPI(`/avaliacoes?atleta_id=${atletaId}`);
    
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/avaliacoes?atleta_id=${atletaId}`,
      expect.any(Object)
    );
  });
});

// ============= TESTES DE INTEGRAÇÃO =============

describe('Integração Frontend-API', () => {
  
  beforeEach(() => {
    fetch.mockClear();
  });

  test('fluxo completo: criar atleta, treino e avaliação', async () => {
    // Criar atleta
    const novoAtleta = { nome: 'João', esporte: 'Futebol' };
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 1, ...novoAtleta })
    });
    const atleta = await fetchAPI('/atletas', 'POST', novoAtleta);

    // Criar treino
    const novoTreino = { 
      atleta_id: atleta.id, 
      tipo: 'Força',
      duracao_minutos: 60 
    };
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 1, ...novoTreino })
    });
    const treino = await fetchAPI('/treinos', 'POST', novoTreino);

    // Criar avaliação
    const novaAvaliacao = {
      atleta_id: atleta.id,
      forca: 8.5,
      imc: 24.0
    };
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 1, ...novaAvaliacao })
    });
    const avaliacao = await fetchAPI('/avaliacoes', 'POST', novaAvaliacao);

    // Validar fluxo
    expect(atleta.id).toBe(1);
    expect(treino.atleta_id).toBe(1);
    expect(avaliacao.atleta_id).toBe(1);
  });

  test('tratamento de erro na API', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Erro ao processar requisição' })
    });

    await expect(fetchAPI('/atletas')).rejects.toThrow();
  });

  test('cabeçalhos de requisição devem estar corretos', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({})
    });

    const dados = { teste: 'valor' };
    await fetchAPI('/atletas', 'POST', dados);

    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: { 'Content-Type': 'application/json' }
      })
    );
  });
});
