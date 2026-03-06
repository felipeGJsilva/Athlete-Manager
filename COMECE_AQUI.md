# 🎉 BEM-VINDO AO ATHLETE MANAGER

## 🚀 Começar em 3 Passos

### 1️⃣ Instalar Dependências (backend)
```bash
pip install -r requirements.txt
```

### 2️⃣ Executar o Servidor
```bash
cd src
python app.py
```

*Se quiser usar a interface React:*
```bash
cd frontend
npm install        # instala React + bootstrap
npm start          # executa o frontend em http://localhost:3000
```

### 3️⃣ Testar os Endpoints
```bash
# Em outro terminal
python test_api.py
```

Você verá:
```
 * Running on http://127.0.0.1:5000
```


---

## 📚 Documentação

- **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)** - Guia completo de todos os endpoints
- **[IMPLEMENTACAO.md](IMPLEMENTACAO.md)** - Como usar e troubleshooting
- **[STATUS_FINAL.md](STATUS_FINAL.md)** - Resumo executivo da implementação

---

## 🎯 O Que Foi Implementado

✅ **Backend Flask** com 70+ endpoints  
✅ **7 Modelos de Dados**: Atletas, Treinos, Avaliações, Evoluções, Competições, Metas, Notificações  
✅ **Banco de Dados SQLite** com relacionamentos  
✅ **CRUD Completo** (Create, Read, Update, Delete)  
✅ **Validações** de entrada  
✅ **Tratamento de Erros** HTTP  
✅ **Documentação** completa  
✅ **Testes Automáticos**  
✅ **Exemplos JavaScript** para frontend  

---

## 📋 Exemplos Rápidos

### Criar um Atleta
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

### Listar Atletas
```bash
curl http://localhost:5000/api/atletas
```

### Obter Resumo de um Atleta
```bash
curl http://localhost:5000/api/atletas/1/resumo
```

### Usar no JavaScript
```javascript
// Incluir arquivo de integração
<script src="src/static/js/api-integration.js"></script>

// Usar funções prontas
const atletas = await getAtletas();
console.log(atletas);
```

---

## 🔗 Endpoints Principais

### Atletas (agora apenas front-end)
- A listagem e cadastro de atletas são feitos localmente no navegador; os endpoints da API não são usados.

### Treinos
- `GET /api/treinos?atleta_id=1` - Listar por atleta
- `POST /api/treinos` - Criar novo
- `PUT /api/treinos/{id}` - Atualizar
- `DELETE /api/treinos/{id}` - Deletar

### Metas (apenas front-end)
- O cadastro e acompanhamento de metas são realizados no navegador; não há comunicação com o backend.

### Evoluções (gráficos)
- Página exibe gráfico anual de peso, gordura e massa muscular.
- Permite adicionar medições mensais, filtrando por ano.

### Competições (front-end)
- Cadastro de competições futuras e realizadas com data, hora, local, resultado, posição e pontos.
- Lista armazenada localmente no navegador.

### Notificações
- `GET /api/notificacoes?atleta_id=1` - Listar notificações
- `POST /api/notificacoes` - Criar notificação
- `PUT /api/notificacoes/{id}` - Marcar como lida
- `GET /api/notificacoes/atleta/1/nao-lidas` - Contar não lidas

### Relatórios
- `GET /api/atletas/1/resumo` - Resumo completo com todos os dados

---

## 📁 Estrutura do Projeto

```
Atlhete-Manager/
├── src/
│   ├── app.py                    # ← Backend Flask (875 linhas)
│   ├── views/                    # Templates HTML
│   ├── static/
│   │   ├── js/
│   │   │   ├── api-integration.js   # ← Funções JavaScript
│   │   │   └── ...
│   │   └── css/
│   └── athlete_manager.db        # Banco de dados
├── requirements.txt              # Dependências Python
├── API_DOCUMENTATION.md          # Documentação da API
├── IMPLEMENTACAO.md              # Guia de uso
├── STATUS_FINAL.md               # Resumo executivo
├── test_api.py                   # Testes automáticos
└── COMECE_AQUI.md               # Este arquivo
```

---

## 🧪 Testar Tudo

```bash
# Terminal 1: Iniciar servidor
cd src
python app.py

# Terminal 2: Executar testes
cd /workspaces/Atlhete-Manager
python test_api.py
```

Você verá:
```
✓ Teste 1: GET /api/atletas (200)
✓ Teste 2: POST /api/atletas (201)
✓ Teste 3: POST /api/treinos (201)
... (todos passando)
```

---

## 🆘 Problemas?

### Porta 5000 já em uso
```bash
lsof -i :5000
kill -9 <PID>
```

### Banco de dados corrompido
```bash
rm src/athlete_manager.db
python src/app.py  # Recria automaticamente
```

### Erro de importação
```bash
pip install --upgrade -r requirements.txt
```

---

## 📞 Suporte Rápido

- **API não responde?** Verifique se Flask está rodando (`ps aux | grep app.py`)
- **Erro 404?** Verifique o endpoint em `API_DOCUMENTATION.md`
- **Erro 500?** Veja os logs do Flask (`/tmp/flask.log`)
- **Dúvida sobre formato?** Veja exemplos em `test_api.py` ou `api-integration.js`

---

## 🎓 Próximos Passos

1. **Integrar com Frontend**: Use `src/static/js/api-integration.js`
2. **Ler Documentação**: Abra `API_DOCUMENTATION.md`
3. **Explorar Exemplos**: Veja `test_api.py` e `api-integration.js`
4. **Customizar**: Modifique `src/app.py` conforme necessário

---

## ✨ Recursos Disponíveis

| Recurso | Localização |
|---------|------------|
| Backend Flask | `src/app.py` (875 linhas) |
| Testes | `test_api.py` |
| Documentação API | `API_DOCUMENTATION.md` |
| Guia de Uso | `IMPLEMENTACAO.md` |
| Funções JavaScript | `src/static/js/api-integration.js` |
| Status Final | `STATUS_FINAL.md` |

---

## 🎯 Checklist de Funcionamento

- [ ] Servidor Flask rodando em `localhost:5000`
- [ ] Banco de dados `athlete_manager.db` criado
- [ ] `GET /api/atletas` retornando `[]`
- [ ] `POST /api/atletas` criando novo atleta
- [ ] `GET /api/atletas/1/resumo` retornando dados
- [ ] Testes em `test_api.py` passando 100%

---

**Tudo pronto? Comece a usar agora! 🚀**

Dúvidas? Abra `API_DOCUMENTATION.md` ou `IMPLEMENTACAO.md`
