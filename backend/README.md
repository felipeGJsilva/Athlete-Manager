Backend FastAPI para Athlete Manager

Como rodar em desenvolvimento:

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Variáveis de ambiente:
- `DATABASE_URL` (opcional)
- `SECRET_KEY` (opcional)
