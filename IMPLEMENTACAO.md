# 🏃 Athlete Manager - Backend Funcional

## 📋 Resumo da Implementação

Backend completo implementado em **Flask** com todos os endpoints CRUD funcionais para:

✅ **Atletas** - Criar, ler, atualizar e deletar atletas  
✅ **Treinos** - Gerenciar treinos por atleta  
✅ **Avaliações** - Registrar avaliações físicas  
✅ **Evoluções** - Acompanhar evolução corporal  
✅ **Competições** - Gerenciar participações em competições  
✅ **Metas** - Definir e acompanhar metas de desempenho  
✅ **Notificações** - Sistema de notificações para atletas  

---

## 🚀 Como Executar

### 1. Instalar Dependências

```bash
cd /workspaces/Atlhete-Manager
pip install -r requirements.txt
```

### 2. Iniciar o Servidor Flask

```bash
cd src
python app.py
```

O servidor iniciará em: `http://localhost:5000`

Você verá:
```
 * Running on http://127.0.0.1:5000
 * Debug mode: on
```

### 3. Testar os Endpoints

Você pode testar usando curl, Postman, ou o script de teste incluído:

```bash
python test_api.py
```

---

## 📚 Documentação Completa da API

Veja [API_DOCUMENTATION.md](API_DOCUMENTATION.md) para documentação detalhada de todos os endpoints.

---

## 🏗️ Estrutura da Aplicação

```
src/
├── app.py                 # Aplicação Flask com todos os modelos e endpoints
├── athlete_manager.db     # Banco de dados SQLite (criado automaticamente)
├── views/                 # Templates HTML
├── static/                # Arquivos CSS/JS
└── __pycache__/          # Cache Python

Arquivos principais:
├── requirements.txt       # Dependências Python
├── API_DOCUMENTATION.md   # Documentação da API
├── test_api.py           # Script de teste dos endpoints
└── IMPLEMENTACAO.md      # Este arquivo
```

---

## 💾 Modelos de Dados

### Atleta
- ID, Nome, Esporte, Posição, Idade, Altura, Peso
- Data de Nascimento, Foto
- Timestamps: criado_em, atualizado_em

### Treino
- ID, Atleta (FK), Tipo, Descrição
- Duração (minutos), Intensidade, Data do Treino
- Timestamps

### Avaliação
- ID, Atleta (FK)
- Métricas: Força, Resistência, Velocidade, Flexibilidade, IMC
- Data da Avaliação, Observações
- Timestamps

### Evolução Física
- ID, Atleta (FK)
- Peso, Altura, IMC
- Massa Muscular, Gordura Corporal
- Data da Medição, Observações
- Timestamps

### Competição
- ID, Nome, Evento, Data
- Local, Descrição, Resultado
- Timestamps

### Meta
- ID, Atleta (FK)
- Título, Descrição, Status (ativa/concluída/cancelada)
- Progresso (0-100%), Datas (início, conclusão esperada, real)
- Timestamps

### Notificação
- ID, Atleta (FK)
- Título, Mensagem, Tipo (info/aviso/alerta/sucesso)
- Lida (boolean), Data de Criação, Data de Leitura

---

## 🔌 Endpoints Principais

### ATLETAS
- `GET /api/atletas` - Listar todos
- `GET /api/atletas/{id}` - Obter um
- `POST /api/atletas` - Criar
- `PUT /api/atletas/{id}` - Atualizar
- `DELETE /api/atletas/{id}` - Deletar

### TREINOS
- `GET /api/treinos` - Listar todos (com filtro por atleta)
- `POST /api/treinos` - Criar
- `PUT /api/treinos/{id}` - Atualizar
- `DELETE /api/treinos/{id}` - Deletar

### AVALIAÇÕES
- `GET /api/avaliacoes` - Listar todas (com filtro)
- `POST /api/avaliacoes` - Criar
- `PUT /api/avaliacoes/{id}` - Atualizar
- `DELETE /api/avaliacoes/{id}` - Deletar

### EVOLUÇÕES
- `GET /api/evolucao` - Listar todas (com filtro)
- `POST /api/evolucao` - Criar
- `PUT /api/evolucao/{id}` - Atualizar
- `DELETE /api/evolucao/{id}` - Deletar

### COMPETIÇÕES
- `GET /api/competicoes` - Listar todas
- `POST /api/competicoes` - Criar
- `PUT /api/competicoes/{id}` - Atualizar
- `DELETE /api/competicoes/{id}` - Deletar

### METAS
- `GET /api/metas` - Listar todas (com filtros)
- `POST /api/metas` - Criar
- `PUT /api/metas/{id}` - Atualizar
- `DELETE /api/metas/{id}` - Deletar

### NOTIFICAÇÕES
- `GET /api/notificacoes` - Listar todas (com filtros)
- `POST /api/notificacoes` - Criar
- `PUT /api/notificacoes/{id}` - Atualizar/Marcar como lida
- `DELETE /api/notificacoes/{id}` - Deletar
- `GET /api/notificacoes/atleta/{atleta_id}/nao-lidas` - Contar não lidas

### RELATÓRIOS
- `GET /api/atletas/{atleta_id}/resumo` - Resumo completo do atleta

---

## 🧪 Exemplos de Uso

### Criar um atleta
```bash
curl -X POST http://localhost:5000/api/atletas \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Maria Silva",
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

### Obter resumo de um atleta
```bash
curl http://localhost:5000/api/atletas/1/resumo
```

---

## ⚙️ Tecnologias Utilizadas

- **Framework**: Flask 2.3+
- **ORM**: SQLAlchemy 2.0+
- **Banco de Dados**: SQLite
- **CORS**: Flask-CORS 4.0+
- **Python**: 3.8+

---

## 📝 Notas Importantes

1. **Banco de Dados**: Utiliza SQLite. O arquivo `athlete_manager.db` é criado automaticamente na primeira execução.

2. **CORS Habilitado**: A API permite requisições de qualquer origem (útil para desenvolvimento com frontend em outro servidor).

3. **Debug Mode**: Ativado por padrão (recarrega automaticamente em caso de alterações no código).

4. **Validações**: Campos obrigatórios são validados nos endpoints POST.

5. **Timestamps**: Todos os recursos têm `criado_em` e `atualizado_em` preenchidos automaticamente.

6. **Relacionamentos**: 
   - Um atleta pode ter múltiplos treinos, avaliações, evoluções, metas e notificações
   - Competições são compartilhadas entre atletas (muitos-para-muitos)

---

## 🔄 Fluxo de Dados

```
Frontend (JavaScript)
         ↓
  API REST (Flask)
         ↓
  Models (SQLAlchemy)
         ↓
  SQLite Database
```

---

## 📊 Status da Implementação

| Funcionalidade | Status | Testes |
|---|---|---|
| Atletas CRUD | ✅ Completo | ✅ Passando |
| Treinos CRUD | ✅ Completo | ✅ Passando |
| Avaliações CRUD | ✅ Completo | ✅ Passando |
| Evoluções CRUD | ✅ Completo | ✅ Passando |
| Competições CRUD | ✅ Completo | ✅ Passando |
| Metas CRUD | ✅ Completo | ✅ Passando |
| Notificações CRUD | ✅ Completo | ✅ Passando |
| Relacionamentos | ✅ Implementados | ✅ Funcional |
| Endpoint de Resumo | ✅ Implementado | ✅ Funcional |
| Validações | ✅ Implementadas | ✅ Funcional |
| Tratamento de Erros | ✅ Implementado | ✅ Funcional |
| Timestamps | ✅ Automáticos | ✅ Funcional |

---

## 🎯 Próximos Passos (Melhorias Futuras)

1. Adicionar autenticação (JWT/OAuth2)
2. Implementar paginação nos endpoints GET
3. Adicionar busca e filtros avançados
4. Implementar logging estruturado
5. Adicionar testes unitários com pytest
6. Migrar para PostgreSQL em produção
7. Implementar rate limiting
8. Adicionar documentação Swagger/OpenAPI

---

## 🐛 Troubleshooting

### Porta 5000 já em uso
```bash
# Liberar a porta
lsof -i :5000
kill -9 <PID>

# Ou usar outra porta modificando app.py
app.run(debug=True, port=5001)
```

### Banco de dados corrompido
```bash
# Remover o banco antigo
rm src/athlete_manager.db

# Reiniciar o servidor (recriará o banco)
python src/app.py
```

### Erro de importação
```bash
# Reinstalar dependências
pip install --upgrade -r requirements.txt
```

---

## 📞 Contato / Suporte

Para questões ou problemas, verifique:
1. [API_DOCUMENTATION.md](API_DOCUMENTATION.md) - Documentação completa
2. Logs do Flask em `/tmp/flask.log`
3. O arquivo [test_api.py](test_api.py) para exemplos de uso

---

**Implementação concluída com sucesso! ✅**

O backend está pronto para integração com o frontend em JavaScript/HTML.
