from src.app import app, db, User
from werkzeug.security import generate_password_hash

with app.app_context():
    db.create_all()
    
    # Criar usuário admin se não existir
    admin = User.query.filter_by(username='admin').first()
    if not admin:
        admin = User(
            username='admin',
            email='admin@athletemanager.com',
            role='admin'
        )
        admin.set_password('admin123')
        db.session.add(admin)
        db.session.commit()
        print("Usuário admin criado: admin / admin123")
    else:
        print("Usuário admin já existe")
    
    # Criar usuário treinador de exemplo
    treinador = User.query.filter_by(username='treinador').first()
    if not treinador:
        treinador = User(
            username='treinador',
            email='treinador@athletemanager.com',
            role='treinador'
        )
        treinador.set_password('treinador123')
        db.session.add(treinador)
        db.session.commit()
        print("Usuário treinador criado: treinador / treinador123")
    
    # Criar usuário atleta de exemplo
    atleta = User.query.filter_by(username='atleta').first()
    if not atleta:
        atleta = User(
            username='atleta',
            email='atleta@athletemanager.com',
            role='atleta'
        )
        atleta.set_password('atleta123')
        db.session.add(atleta)
        db.session.commit()
        print("Usuário atleta criado: atleta / atleta123")