from src.app import app, db
from sqlalchemy import text

with app.app_context():
    # Adicionar coluna email se não existir
    try:
        db.session.execute(text("ALTER TABLE atletas ADD COLUMN email VARCHAR(150)"))
        print("Coluna email adicionada à tabela atletas")
    except Exception as e:
        print(f"Coluna email já existe ou erro: {e}")

    # Adicionar coluna treinador_id se não existir
    try:
        db.session.execute(text("ALTER TABLE atletas ADD COLUMN treinador_id INTEGER REFERENCES users(id)"))
        print("Coluna treinador_id adicionada à tabela atletas")
    except Exception as e:
        print(f"Coluna treinador_id já existe ou erro: {e}")

    db.session.commit()
    print("Migração concluída")