# Athlete Manager

Sistema completo de gestão e acompanhamento de atletas desenvolvido em Flask e JavaScript. A plataforma oferece funcionalidades avançadas para monitoramento de treinos, avaliações de desempenho, evolução corporal, competições  e metas.

## Visão Geral

**Athlete Manager** é uma aplicação web que centraliza a gestão de dados de atletas através de uma API RESTful robusta e uma interface intuitiva. O sistema permite acompanhar métricas de desempenho, evoluções físicas e facilita a comunicação através de um sistema de notificações.

---

## Funcionalidades Implementadas

### ✅ Backend Flask Completo
- Aplicação Flask com SQLAlchemy ORM
- Banco de dados SQLite com relacionamentos
- CORS habilitado para comunicação frontend-backend
- Tratamento robusto de erros
- Validações de entrada de dados

### ✅ 7 Modelos de Dados com CRUD Completo
1. **Atletas** - Cadastro e gerenciamento de informações pessoais e esportivas
2. **Treinos** - Registro de treinos com tipo, intensidade e duração
3. **Avaliações** - Métricas de desempenho (força, resistência, velocidade, flexibilidade)
4. **Evoluções Físicas** - Acompanhamento corporal (peso, altura, IMC, gordura)
5. **Competições** - Gestão de participações em eventos
6. **Metas** - Definição de objetivos com rastreamento de progresso
7. **Notificações** - Sistema de alertas e comunicações

### ✅ 70+ Endpoints RESTful
Todos os modelos possuem operações CRUD completas com:
- Filtros avançados (por atleta_id, status, etc)
- Paginação de resultados
- Endpoints de relatório resumido
- Contadores específicos

### ✅ Interface Web Responsiva
- Dashboard principal com navegação intuitiva
- Telas dedicadas para cada funcionalidade
- Design moderno com tema escuro e paleta dourada
- Layout totalmente responsivo para dispositivos móveis

---

## Tecnologias Utilizadas

### Backend
- **Flask** 2.3.0+ - Framework web Python
- **SQLAlchemy** 2.0+ - ORM para banco de dados
- **Flask-CORS** 4.0+ - Habilitação de CORS

### Frontend
- **HTML5** - Estrutura semântica
- **CSS3** - Estilização responsiva com Bootstrap 5
- **JavaScript (Vanilla)** - Lógica frontend sem dependências externas

### Banco de Dados
- **SQLite** - Persistência de dados local
- Relacionamentos muitos-para-muitos para competições

---

## Instalação e Execução

### Pré-requisitos
- Python 3.8+
- pip (gerenciador de pacotes Python)

### Setup Inicial

1. Clone o repositório:
```bash
cd /workspaces/Atlhete-Manager
```

2. Instale as dependências:
```bash
pip install -r requirements.txt
```

3. Inicie o servidor Flask:
```bash
cd src
python app.py
```

O servidor estará disponível em: `http://localhost:5000`

### Testando a API

Execute o script de testes automatizados:
```bash
python test_api.py
```

---

## Estrutura do Projeto

```
Athlete-Manager/
├── src/
│   ├── app.py                      # Aplicação Flask principal com modelos e endpoints
│   ├── athlete_manager.db          # Banco de dados SQLite (criado automaticamente)
│   ├── static/
│   │   ├── css/
│   │   │   └── style.css           # Estilos globais
│   │   ├── img/                    # Imagens e assets
│   │   └── js/
│   │       ├── api-integration.js  # Integração com API
│   │       ├── main.js             # Script principal
│   │       ├── atletas.js          # Gerenciamento de atletas
│   │       ├── treinos.js          # Gerenciamento de treinos
│   │       ├── avaliacoes.js       # Gerenciamento de avaliações
│   │       ├── evolucao.js         # Acompanhamento de evolução
│   │       ├── competicoes.js      # Gerenciamento de competições
│   │       ├── metas.js            # Rastreamento de metas
│   │       ├── atleta_perfil.js    # Perfil do atleta
│   │       └── router.js           # Roteamento frontend
│   └── views/
│       ├── base.html               # Template base
│       ├── auth/
│       │   ├── login.html
│       │   └── register.html
│       └── base/
│           ├── admin.html
│           ├── atletas.html
│           ├── atleta_perfil.html
│           ├── treinos.html
│           ├── avaliacoes.html
│           ├── evoluçao.html
│           ├── competicoes.html
│           ├── metas.html
│           ├── perfil.html
│           └── sobre.html
├── API_DOCUMENTATION.md            # Documentação completa da API
├── IMPLEMENTACAO.md                # Guia de implementação
├── STATUS_FINAL.md                 # Resumo das implementações
├── requirements.txt                # Dependências Python
├── test_api.py                     # Script de testes
├── init_db.py                      # Inicializador do banco de dados
├── migrate_db.py                   # Ferramenta de migração
└── README.md                       # Este arquivo
```

---

## Documentação da API

A documentação completa de todos os endpoints RESTful está disponível em [API_DOCUMENTATION.md](API_DOCUMENTATION.md).

### Exemplos de Uso

**Criar um atleta:**
```bash
curl -X POST http://localhost:5000/api/atletas \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "esporte": "Futebol",
    "posicao": "Zagueiro",
    "altura": 1.85,
    "peso": 82.5,
    "idade": 25
  }'
```

**Listar todos os atletas:**
```bash
curl http://localhost:5000/api/atletas
```

**Obter detalhes de um atleta:**
```bash
curl http://localhost:5000/api/atletas/1
```

---

## Modelos de Dados

### Atleta
- **Campos**: ID, nome, esporte, posição, idade, altura, peso, foto, data_nascimento
- **Timestamps**: criado_em, atualizado_em
- **Relacionamentos**: Múltiplos treinos, avaliações, evoluções, competições e metas

### Treino
- **Campos**: ID, tipo, descrição, duração_minutos, intensidade, data_treino
- **Timestamps**: criado_em, atualizado_em
- **FK**: atleta_id

### Avaliação
- **Campos**: ID, força, resistência, velocidade, flexibilidade, imc, data_avaliacao, observações
- **Timestamps**: criado_em, atualizado_em
- **FK**: atleta_id

### Evolução Física
- **Campos**: ID, peso, altura, imc, massa_muscular, gordura_corporal, data_medicao, observações
- **Timestamps**: criado_em, atualizado_em
- **FK**: atleta_id

### Competição
- **Campos**: ID, nome, data, local, resultado
- **Timestamps**: criado_em, atualizado_em
- **Relacionamento**: Muitos-para-muitos com atletas

### Meta
- **Campos**: ID, descricao, data_inicio, data_fim, progresso, status
- **Timestamps**: criado_em, atualizado_em, data_conclusao_real
- **FK**: atleta_id

### Notificação
- **Campos**: ID, tipo, mensagem, lida, data_leitura
- **Timestamps**: criado_em
- **FK**: atleta_id

---

## Estatísticas do Projeto

| Métrica | Valor |
|---------|-------|
| Linhas de código | 875+ |
| Endpoints implementados | 70+ |
| Modelos de dados | 7 |
| Testes de API | Automatizados |
| Documentação | Completa |

---

## Roadmap Futuro

- [ ] Sistema de autenticação JWT
- [ ] Upload de imagens com persistência
- [ ] Dashboard com gráficos de desempenho
- [ ] Relatórios em PDF
- [ ] Integração com wearables
- [ ] Aplicação mobile nativa
- [ ] Sistema de backup automático
- [ ] Cache com Redis
- [ ] Testes unitários e de integração

---

## Resolução de Problemas

### Porta 5000 já está em uso

Encerre o processo na porta 5000:
```bash
lsof -i :5000
kill -9 <PID>
```

### Erro de importação de módulos

Reinstale as dependências:
```bash
pip install --upgrade -r requirements.txt
```

### Banco de dados corrompido

Reinicialize o banco:
```bash
rm src/athlete_manager.db
python init_db.py
```

---

## Contribuindo

Para contribuir com o projeto:

1. Crie uma nova branch
2. Implemente suas alterações
3. Teste as funcionalidades
4. Envie um pull request com descrição das mudanças

---

## Licença

MIT License - Veja LICENSE para detalhes

---

## Contato e Suporte

Para dúvidas ou sugestões sobre o projeto, consulte a documentação em:
- [API_DOCUMENTATION.md](API_DOCUMENTATION.md) - Especificação de endpoints
- [IMPLEMENTACAO.md](IMPLEMENTACAO.md) - Guia de desenvolvimento
- [STATUS_FINAL.md](STATUS_FINAL.md) - Resumo da implementação

