# Guia de Execução - Athlete Manager

Este guia descreve como executar o backend (FastAPI) e o frontend (Vite + Vue) localmente.

## Requisitos
- Python 3.11+ (ou 3.10+)
- Node.js 18+
- npm
- `pip` para instalar dependências Python

## Backend (FastAPI)

1. Instale dependências Python (virtualenv recomendado):

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt
```

2. Variáveis de ambiente úteis (opcionais):
- `DATABASE_URL` - URL do banco (padrão: `sqlite:///./athlete_manager.db`)
- `SECRET_KEY` - chave para JWT (substitua em produção)
- `SUPERADMIN_USERNAME`, `SUPERADMIN_EMAIL`, `SUPERADMIN_PASSWORD` - credenciais do superadmin criado no startup
- `SUPERADMIN_FORCE_UPDATE` - (não configurado por padrão) controla se a senha do superadmin é sobrescrita

3. Rodar o servidor:

```bash
# iniciado pelo script
./INICIAR_APP.sh
# ou manualmente
uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
```

4. Endpoints úteis:
- Swagger UI: `http://127.0.0.1:8000/docs`
- OpenAPI JSON: `http://127.0.0.1:8000/openapi.json`
- Token (login): `POST /auth/token` (form data `username`, `password`)

## Frontend (Vite + Vue)

1. Instale dependências:

```bash
cd frontend
npm install
```

2. Configurar backend URL (dev):
- Crie `.env` ou use variável de ambiente `VITE_API_URL`.
Exemplo `.env` (no diretório `frontend`):

```
VITE_API_URL=http://127.0.0.1:8000
```

3. Rodar em desenvolvimento (usa proxy configurado em `vite.config.js`):

```bash
npm run dev
```

4. Build para produção:

```bash
npm run build
```

## Script prático: `INICIAR_APP.sh`
O script `INICIAR_APP.sh` no root:
- mata processos nas portas 8000 e 5173
- inicia o backend (uvicorn) em background e salva `backend.log`
- aceita argumento `--frontend` para também iniciar o frontend (`npm run dev`)

Exemplo:

```bash
# apenas backend
./INICIAR_APP.sh

# backend + frontend
./INICIAR_APP.sh --frontend
```

## Notas
- O seed de `superadmin` é executado no startup do backend. Use as variáveis `SUPERADMIN_USERNAME`, `SUPERADMIN_EMAIL`, `SUPERADMIN_PASSWORD` para customizar.
- CORS está configurado para permitir todas as origens (modo desenvolvimento). Ajuste `allow_origins` em `backend/app/main.py` para produção.

## Arquivos movidos para `archive/legacy`
Arquivos legados foram movidos para `archive/legacy/` para limpar a raiz do projeto (testes e assets antigos). Se precisar restaurá-los, consulte essa pasta.

--
Guia gerado automaticamente.
