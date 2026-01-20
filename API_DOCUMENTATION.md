# Documentação da API - Athlete Manager

## 📋 Visão Geral

A API do Athlete Manager fornece um conjunto completo de endpoints RESTful para gerenciar atletas, treinos, avaliações, evoluções físicas, competições, metas e notificações.

**URL Base**: `http://localhost:5000/api`

---

## 🔑 Autenticação

Atualmente, a API não requer autenticação. Em produção, recomenda-se implementar JWT ou OAuth2.

---

## 🏃 ATLETAS

### Obter todos os atletas
```http
GET /api/atletas
```

**Resposta (200)**:
```json
[
  {
    "id": 1,
    "nome": "João Silva",
    "esporte": "Futebol",
    "posicao": "Zagueiro",
    "idade": 25,
    "altura": 1.85,
    "peso": 82.5,
    "foto": "default",
    "data_nascimento": "1998-06-15T00:00:00",
    "criado_em": "2024-01-15T10:30:00",
    "atualizado_em": "2024-01-15T10:30:00"
  }
]
```

### Obter atleta específico
```http
GET /api/atletas/{id}
```

### Criar novo atleta
```http
POST /api/atletas
Content-Type: application/json

{
  "nome": "João Silva",
  "esporte": "Futebol",
  "posicao": "Zagueiro",
  "idade": 25,
  "altura": 1.85,
  "peso": 82.5,
  "foto": "url_foto",
  "data_nascimento": "1998-06-15T00:00:00"
}
```

**Campos obrigatórios**: `nome`, `esporte`
**Resposta (201)**: Objeto atleta criado

### Atualizar atleta
```http
PUT /api/atletas/{id}
Content-Type: application/json

{
  "nome": "João Silva",
  "esporte": "Futebol",
  "posicao": "Lateral Direito",
  "peso": 83.0
}
```

**Resposta (200)**: Objeto atleta atualizado

### Deletar atleta
```http
DELETE /api/atletas/{id}
```

**Resposta (200)**:
```json
{
  "message": "Atleta deletado com sucesso"
}
```

---

## 🏋️ TREINOS

### Obter todos os treinos
```http
GET /api/treinos
GET /api/treinos?atleta_id=1
```

### Obter treino específico
```http
GET /api/treinos/{id}
```

### Criar novo treino
```http
POST /api/treinos
Content-Type: application/json

{
  "atleta_id": 1,
  "tipo": "Força",
  "descricao": "Treino de força para membros inferiores",
  "duracao_minutos": 60,
  "intensidade": "alta",
  "data_treino": "2024-01-20T14:00:00"
}
```

**Campos obrigatórios**: `atleta_id`, `tipo`

### Atualizar treino
```http
PUT /api/treinos/{id}
Content-Type: application/json

{
  "tipo": "Resistência",
  "duracao_minutos": 90,
  "intensidade": "media"
}
```

### Deletar treino
```http
DELETE /api/treinos/{id}
```

---

## 📊 AVALIAÇÕES

### Obter todas as avaliações
```http
GET /api/avaliacoes
GET /api/avaliacoes?atleta_id=1
```

### Obter avaliação específica
```http
GET /api/avaliacoes/{id}
```

### Criar nova avaliação
```http
POST /api/avaliacoes
Content-Type: application/json

{
  "atleta_id": 1,
  "forca": 8.5,
  "resistencia": 7.2,
  "velocidade": 8.1,
  "flexibilidade": 6.9,
  "imc": 24.1,
  "observacoes": "Bom desempenho geral",
  "data_avaliacao": "2024-01-20T10:00:00"
}
```

**Campos obrigatórios**: `atleta_id`

### Atualizar avaliação
```http
PUT /api/avaliacoes/{id}
Content-Type: application/json

{
  "forca": 8.8,
  "resistencia": 7.5
}
```

### Deletar avaliação
```http
DELETE /api/avaliacoes/{id}
```

---

## 📈 EVOLUÇÕES FÍSICAS

### Obter todas as evoluções
```http
GET /api/evolucao
GET /api/evolucao?atleta_id=1
```

### Obter evolução específica
```http
GET /api/evolucao/{id}
```

### Criar nova evolução
```http
POST /api/evolucao
Content-Type: application/json

{
  "atleta_id": 1,
  "peso": 82.5,
  "altura": 1.85,
  "imc": 24.1,
  "massa_muscular": 72.5,
  "gordura_corporal": 12.3,
  "observacoes": "Progresso bom",
  "data_medicao": "2024-01-20T10:00:00"
}
```

**Campos obrigatórios**: `atleta_id`, `peso`

### Atualizar evolução
```http
PUT /api/evolucao/{id}
Content-Type: application/json

{
  "peso": 83.0,
  "imc": 24.3
}
```

### Deletar evolução
```http
DELETE /api/evolucao/{id}
```

---

## 🏆 COMPETIÇÕES

### Obter todas as competições
```http
GET /api/competicoes
```

### Obter competição específica
```http
GET /api/competicoes/{id}
```

### Criar nova competição
```http
POST /api/competicoes
Content-Type: application/json

{
  "nome": "Campeonato Estadual 2024",
  "evento": "Futebol",
  "data": "2024-02-15T14:00:00",
  "local": "Estádio Municipal",
  "descricao": "Fase classificatória do campeonato estadual",
  "resultado": "Vitória 2-1"
}
```

**Campos obrigatórios**: `nome`, `evento`, `data`

### Atualizar competição
```http
PUT /api/competicoes/{id}
Content-Type: application/json

{
  "resultado": "Vitória 3-1"
}
```

### Deletar competição
```http
DELETE /api/competicoes/{id}
```

---

## 🎯 METAS

### Obter todas as metas
```http
GET /api/metas
GET /api/metas?atleta_id=1
GET /api/metas?atleta_id=1&status=ativa
```

### Obter meta específica
```http
GET /api/metas/{id}
```

### Criar nova meta
```http
POST /api/metas
Content-Type: application/json

{
  "atleta_id": 1,
  "titulo": "Reduzir peso para 80kg",
  "descricao": "Objetivo é atingir 80kg em 3 meses",
  "status": "ativa",
  "progresso": 30,
  "data_conclusao_esperada": "2024-04-20T00:00:00"
}
```

**Campos obrigatórios**: `atleta_id`, `titulo`

### Atualizar meta
```http
PUT /api/metas/{id}
Content-Type: application/json

{
  "progresso": 60,
  "status": "ativa"
}
```

### Deletar meta
```http
DELETE /api/metas/{id}
```

---

## 📢 NOTIFICAÇÕES

### Obter todas as notificações
```http
GET /api/notificacoes
GET /api/notificacoes?atleta_id=1
GET /api/notificacoes?atleta_id=1&lida=false
```

### Obter notificação específica
```http
GET /api/notificacoes/{id}
```

### Criar nova notificação
```http
POST /api/notificacoes
Content-Type: application/json

{
  "atleta_id": 1,
  "titulo": "Treino Agendado",
  "mensagem": "Seu treino de força está marcado para amanhã às 10:00",
  "tipo": "info"
}
```

**Campos obrigatórios**: `atleta_id`, `titulo`, `mensagem`
**Tipos**: `info`, `aviso`, `alerta`, `sucesso`

### Atualizar notificação (marcar como lida)
```http
PUT /api/notificacoes/{id}
Content-Type: application/json

{
  "lida": true
}
```

### Deletar notificação
```http
DELETE /api/notificacoes/{id}
```

### Obter notificações não lidas
```http
GET /api/notificacoes/atleta/{atleta_id}/nao-lidas
```

**Resposta (200)**:
```json
{
  "atleta_id": 1,
  "nao_lidas": 3
}
```

---

## 📋 RELATÓRIOS

### Obter resumo completo de um atleta
```http
GET /api/atletas/{atleta_id}/resumo
```

**Resposta (200)**:
```json
{
  "atleta": { ... },
  "treinos": [ ... ],
  "avaliacoes": [ ... ],
  "evolucoes": [ ... ],
  "metas": [ ... ],
  "notificacoes": [ ... ],
  "competicoes": [ ... ]
}
```

---

## ⚠️ Códigos de Erro

| Código | Descrição |
|--------|-----------|
| 200 | OK - Requisição bem-sucedida |
| 201 | Created - Recurso criado com sucesso |
| 400 | Bad Request - Parâmetros inválidos |
| 404 | Not Found - Recurso não encontrado |
| 500 | Internal Server Error - Erro do servidor |

---

## 🚀 Exemplos com cURL

### Criar um atleta
```bash
curl -X POST http://localhost:5000/api/atletas \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Maria Santos",
    "esporte": "Natação",
    "idade": 22,
    "altura": 1.70,
    "peso": 65.0
  }'
```

### Criar um treino
```bash
curl -X POST http://localhost:5000/api/treinos \
  -H "Content-Type: application/json" \
  -d '{
    "atleta_id": 1,
    "tipo": "Natação",
    "duracao_minutos": 90,
    "intensidade": "alta"
  }'
```

### Listar todos os atletas
```bash
curl http://localhost:5000/api/atletas
```

### Buscar treinos de um atleta
```bash
curl "http://localhost:5000/api/treinos?atleta_id=1"
```

---

## 📝 Notas

- Todas as datas devem estar no formato ISO 8601: `YYYY-MM-DDTHH:MM:SS`
- A API retorna sempre JSON
- CORS está ativado para aceitar requisições do frontend
- O banco de dados é SQLite e está localizado em `src/athlete_manager.db`

