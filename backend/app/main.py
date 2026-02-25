from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from . import models, schemas, auth
from .database import engine, Base, get_db
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta, datetime

Base.metadata.create_all(bind=engine)

app = FastAPI(title='Athlete Manager API')

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

@app.post('/auth/token')
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.username == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.password_hash):
        raise HTTPException(status_code=400, detail='Incorrect username or password')
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(data={'sub': str(user.id), 'role': user.role}, expires_delta=access_token_expires)
    return {'access_token': access_token, 'token_type': 'bearer'}

@app.post('/auth/register', response_model=schemas.UserOut)
def register(user_in: schemas.UserCreate, db: Session = Depends(get_db)):
    if db.query(models.User).filter(models.User.username == user_in.username).first():
        raise HTTPException(status_code=400, detail='Username already registered')
    if db.query(models.User).filter(models.User.email == user_in.email).first():
        raise HTTPException(status_code=400, detail='Email already registered')
    hashed = auth.get_password_hash(user_in.password)
    user = models.User(username=user_in.username, email=user_in.email, password_hash=hashed, role=user_in.role)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

# ========== Atletas ==========
@app.get('/api/atletas', response_model=list[schemas.AtletaOut])
def list_atletas(db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    if current_user.role == 'admin':
        atletas = db.query(models.Atleta).all()
    elif current_user.role == 'treinador':
        atletas = db.query(models.Atleta).filter(models.Atleta.treinador_id == current_user.id).all()
    else:
        atletas = db.query(models.Atleta).filter(models.Atleta.email == current_user.email).all()
    return atletas

@app.post('/api/atletas', response_model=schemas.AtletaOut)
def create_atleta(atleta_in: schemas.AtletaCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.require_role('treinador'))):
    data = atleta_in.dict()
    data.pop('treinador_id', None)
    atleta = models.Atleta(**data, treinador_id=current_user.id)
    db.add(atleta)
    db.commit()
    db.refresh(atleta)
    return atleta


@app.get('/api/atletas/me', response_model=schemas.AtletaOut)
def get_atleta_me(db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    if current_user.role != 'atleta':
        raise HTTPException(status_code=403, detail='Acesso negado - apenas atletas')
    atleta = db.query(models.Atleta).filter(models.Atleta.email == current_user.email).first()
    if not atleta:
        raise HTTPException(status_code=404, detail='Atleta não encontrado')
    return atleta


@app.get('/api/atletas/me/resumo')
def get_resumo_atleta_me(db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    if current_user.role != 'atleta':
        raise HTTPException(status_code=403, detail='Acesso negado - apenas atletas')
    atleta = db.query(models.Atleta).filter(models.Atleta.email == current_user.email).first()
    if not atleta:
        raise HTTPException(status_code=404, detail='Atleta não encontrado')
    proximo_treino = db.query(models.Treino).filter(models.Treino.atleta_id == atleta.id).filter(models.Treino.data_treino >= datetime.utcnow()).order_by(models.Treino.data_treino.asc()).first()
    ultima_evolucao = db.query(models.Evolucao).filter(models.Evolucao.atleta_id == atleta.id).order_by(models.Evolucao.data_medicao.desc()).first()
    return {
        'atleta': schemas.AtletaOut.from_orm(atleta),
        'total_treinos': len(atleta.treinos),
        'peso_atual': ultima_evolucao.peso if ultima_evolucao else atleta.peso,
        'imc_atual': ultima_evolucao.imc if ultima_evolucao else None,
        'proximo_treino': schemas.TreinoOut.from_orm(proximo_treino) if proximo_treino else None
    }

@app.get('/api/atletas/{id}', response_model=schemas.AtletaOut)
def get_atleta(id: int, db: Session = Depends(get_db), current_user: models.User = Depends(auth.require_role('treinador'))):
    atleta = db.query(models.Atleta).filter(models.Atleta.id == id).first()
    if not atleta:
        raise HTTPException(status_code=404, detail='Not found')
    return atleta

# ========== Treinos ==========
@app.get('/api/treinos', response_model=list[schemas.TreinoOut])
def list_treinos(atleta_id: int | None = None, limit: int | None = None, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    query = db.query(models.Treino)
    if atleta_id:
        atleta = db.query(models.Atleta).filter(models.Atleta.id == atleta_id).first()
        if not atleta or (current_user.role != 'admin' and atleta.treinador_id != current_user.id):
            raise HTTPException(status_code=403, detail='Access denied')
        query = query.filter(models.Treino.atleta_id == atleta_id)
    else:
        if current_user.role == 'treinador':
            atletas_ids = [a.id for a in db.query(models.Atleta).filter(models.Atleta.treinador_id == current_user.id).all()]
            query = query.filter(models.Treino.atleta_id.in_(atletas_ids))
        elif current_user.role == 'atleta':
            atleta = db.query(models.Atleta).filter(models.Atleta.email == current_user.email).first()
            if atleta:
                query = query.filter(models.Treino.atleta_id == atleta.id)
            else:
                return []
    query = query.order_by(models.Treino.data_treino.desc())
    if limit:
        query = query.limit(limit)
    return query.all()

@app.post('/api/treinos', response_model=schemas.TreinoOut)
def create_treino(treino_in: schemas.TreinoCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    atleta = db.query(models.Atleta).filter(models.Atleta.id == treino_in.atleta_id).first()
    if not atleta or (current_user.role != 'admin' and atleta.treinador_id != current_user.id):
        raise HTTPException(status_code=403, detail='Access denied')
    treino = models.Treino(**treino_in.dict())
    db.add(treino)
    db.commit()
    db.refresh(treino)
    return treino


@app.get('/api/treinos/{id}', response_model=schemas.TreinoOut)
def get_treino(id: int, db: Session = Depends(get_db)):
    treino = db.query(models.Treino).filter(models.Treino.id == id).first()
    if not treino:
        raise HTTPException(status_code=404, detail='Not found')
    return treino


@app.put('/api/treinos/{id}', response_model=schemas.TreinoOut)
def update_treino(id: int, treino_in: schemas.TreinoCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    treino = db.query(models.Treino).filter(models.Treino.id == id).first()
    if not treino:
        raise HTTPException(status_code=404, detail='Not found')
    for k, v in treino_in.dict().items():
        setattr(treino, k, v)
    db.commit()
    db.refresh(treino)
    return treino


@app.delete('/api/treinos/{id}')
def delete_treino(id: int, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    treino = db.query(models.Treino).filter(models.Treino.id == id).first()
    if not treino:
        raise HTTPException(status_code=404, detail='Not found')
    db.delete(treino)
    db.commit()
    return {'message': 'Treino deletado com sucesso'}


# ========== Avaliacoes ==========
@app.get('/api/avaliacoes', response_model=list[schemas.AvaliacaoOut])
def list_avaliacoes(atleta_id: int | None = None, db: Session = Depends(get_db)):
    query = db.query(models.Avaliacao)
    if atleta_id:
        query = query.filter(models.Avaliacao.atleta_id == atleta_id)
    return query.all()


@app.get('/api/avaliacoes/{id}', response_model=schemas.AvaliacaoOut)
def get_avaliacao(id: int, db: Session = Depends(get_db)):
    a = db.query(models.Avaliacao).filter(models.Avaliacao.id == id).first()
    if not a:
        raise HTTPException(status_code=404, detail='Not found')
    return a


@app.post('/api/avaliacoes', response_model=schemas.AvaliacaoOut)
def create_avaliacao(av_in: schemas.AvaliacaoCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    atleta = db.query(models.Atleta).filter(models.Atleta.id == av_in.atleta_id).first()
    if not atleta:
        raise HTTPException(status_code=404, detail='Atleta not found')
    if current_user.role != 'admin' and current_user.role != 'treinador' and current_user.email != atleta.email:
        raise HTTPException(status_code=403, detail='Access denied')
    a = models.Avaliacao(**av_in.dict())
    db.add(a)
    db.commit()
    db.refresh(a)
    return a


@app.put('/api/avaliacoes/{id}', response_model=schemas.AvaliacaoOut)
def update_avaliacao(id: int, av_in: schemas.AvaliacaoCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    a = db.query(models.Avaliacao).filter(models.Avaliacao.id == id).first()
    if not a:
        raise HTTPException(status_code=404, detail='Not found')
    for k, v in av_in.dict().items():
        setattr(a, k, v)
    db.commit()
    db.refresh(a)
    return a


@app.delete('/api/avaliacoes/{id}')
def delete_avaliacao(id: int, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    a = db.query(models.Avaliacao).filter(models.Avaliacao.id == id).first()
    if not a:
        raise HTTPException(status_code=404, detail='Not found')
    db.delete(a)
    db.commit()
    return {'message': 'Avaliação deletada com sucesso'}


# ========== Evolucao ==========
@app.get('/api/evolucao', response_model=list[schemas.EvolucaoOut])
def list_evolucoes(atleta_id: int | None = None, limit: int | None = None, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    query = db.query(models.Evolucao)
    if atleta_id:
        atleta = db.query(models.Atleta).filter(models.Atleta.id == atleta_id).first()
        if not atleta or (current_user.role != 'admin' and atleta.treinador_id != current_user.id and current_user.email != atleta.email):
            raise HTTPException(status_code=403, detail='Access denied')
        query = query.filter(models.Evolucao.atleta_id == atleta_id)
    else:
        if current_user.role == 'treinador':
            atletas_ids = [a.id for a in db.query(models.Atleta).filter(models.Atleta.treinador_id == current_user.id).all()]
            query = query.filter(models.Evolucao.atleta_id.in_(atletas_ids))
        elif current_user.role == 'atleta':
            atleta = db.query(models.Atleta).filter(models.Atleta.email == current_user.email).first()
            if atleta:
                query = query.filter(models.Evolucao.atleta_id == atleta.id)
            else:
                return []
    query = query.order_by(models.Evolucao.data_medicao.desc())
    if limit:
        query = query.limit(limit)
    return query.all()


@app.get('/api/evolucao/{id}', response_model=schemas.EvolucaoOut)
def get_evolucao(id: int, db: Session = Depends(get_db)):
    e = db.query(models.Evolucao).filter(models.Evolucao.id == id).first()
    if not e:
        raise HTTPException(status_code=404, detail='Not found')
    return e


@app.post('/api/evolucao', response_model=schemas.EvolucaoOut)
def create_evolucao(ev_in: schemas.EvolucaoCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    atleta = db.query(models.Atleta).filter(models.Atleta.id == ev_in.atleta_id).first()
    if not atleta:
        raise HTTPException(status_code=404, detail='Atleta not found')
    if current_user.role != 'admin' and current_user.role != 'treinador' and current_user.email != atleta.email:
        raise HTTPException(status_code=403, detail='Access denied')
    e = models.Evolucao(**ev_in.dict())
    db.add(e)
    db.commit()
    db.refresh(e)
    return e


@app.put('/api/evolucao/{id}', response_model=schemas.EvolucaoOut)
def update_evolucao(id: int, ev_in: schemas.EvolucaoCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    e = db.query(models.Evolucao).filter(models.Evolucao.id == id).first()
    if not e:
        raise HTTPException(status_code=404, detail='Not found')
    for k, v in ev_in.dict().items():
        setattr(e, k, v)
    db.commit()
    db.refresh(e)
    return e


@app.delete('/api/evolucao/{id}')
def delete_evolucao(id: int, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    e = db.query(models.Evolucao).filter(models.Evolucao.id == id).first()
    if not e:
        raise HTTPException(status_code=404, detail='Not found')
    db.delete(e)
    db.commit()
    return {'message': 'Evolução deletada com sucesso'}


# ========== Competicoes ==========
@app.get('/api/competicoes', response_model=list[schemas.CompeticaoOut])
def list_competicoes(db: Session = Depends(get_db)):
    return db.query(models.Competicao).all()


@app.get('/api/competicoes/{id}', response_model=schemas.CompeticaoOut)
def get_competicao(id: int, db: Session = Depends(get_db)):
    c = db.query(models.Competicao).filter(models.Competicao.id == id).first()
    if not c:
        raise HTTPException(status_code=404, detail='Not found')
    return c


@app.post('/api/competicoes', response_model=schemas.CompeticaoOut)
def create_competicao(c_in: schemas.CompeticaoCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.require_role('treinador'))):
    c = models.Competicao(**c_in.dict())
    db.add(c)
    db.commit()
    db.refresh(c)
    return c


@app.put('/api/competicoes/{id}', response_model=schemas.CompeticaoOut)
def update_competicao(id: int, c_in: schemas.CompeticaoCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    c = db.query(models.Competicao).filter(models.Competicao.id == id).first()
    if not c:
        raise HTTPException(status_code=404, detail='Not found')
    for k, v in c_in.dict().items():
        setattr(c, k, v)
    db.commit()
    db.refresh(c)
    return c


@app.delete('/api/competicoes/{id}')
def delete_competicao(id: int, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    c = db.query(models.Competicao).filter(models.Competicao.id == id).first()
    if not c:
        raise HTTPException(status_code=404, detail='Not found')
    db.delete(c)
    db.commit()
    return {'message': 'Competição deletada com sucesso'}


# ========== Metas ==========
@app.get('/api/metas', response_model=list[schemas.MetaOut])
def list_metas(atleta_id: int | None = None, status: str | None = None, db: Session = Depends(get_db)):
    query = db.query(models.Meta)
    if atleta_id:
        query = query.filter(models.Meta.atleta_id == atleta_id)
    if status:
        query = query.filter(models.Meta.status == status)
    return query.all()


@app.get('/api/metas/{id}', response_model=schemas.MetaOut)
def get_meta(id: int, db: Session = Depends(get_db)):
    m = db.query(models.Meta).filter(models.Meta.id == id).first()
    if not m:
        raise HTTPException(status_code=404, detail='Not found')
    return m


@app.post('/api/metas', response_model=schemas.MetaOut)
def create_meta(m_in: schemas.MetaCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    atleta = db.query(models.Atleta).filter(models.Atleta.id == m_in.atleta_id).first()
    if not atleta:
        raise HTTPException(status_code=404, detail='Atleta not found')
    if current_user.role != 'admin' and current_user.role != 'treinador' and current_user.email != atleta.email:
        raise HTTPException(status_code=403, detail='Access denied')
    m = models.Meta(**m_in.dict())
    db.add(m)
    db.commit()
    db.refresh(m)
    return m


@app.put('/api/metas/{id}', response_model=schemas.MetaOut)
def update_meta(id: int, m_in: schemas.MetaCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    m = db.query(models.Meta).filter(models.Meta.id == id).first()
    if not m:
        raise HTTPException(status_code=404, detail='Not found')
    for k, v in m_in.dict().items():
        setattr(m, k, v)
    if m.status == 'concluida' and not m.data_conclusao_real:
        m.data_conclusao_real = datetime.utcnow()
    db.commit()
    db.refresh(m)
    return m


@app.delete('/api/metas/{id}')
def delete_meta(id: int, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    m = db.query(models.Meta).filter(models.Meta.id == id).first()
    if not m:
        raise HTTPException(status_code=404, detail='Not found')
    db.delete(m)
    db.commit()
    return {'message': 'Meta deletada com sucesso'}


# ========== Notificacoes ==========
@app.get('/api/notificacoes', response_model=list[schemas.NotificacaoOut])
def list_notificacoes(atleta_id: int | None = None, lida: str | None = None, db: Session = Depends(get_db)):
    query = db.query(models.Notificacao)
    if atleta_id:
        query = query.filter(models.Notificacao.atleta_id == atleta_id)
    if lida is not None:
        query = query.filter(models.Notificacao.lida == (lida.lower() == 'true'))
    return query.order_by(models.Notificacao.data_criacao.desc()).all()


@app.get('/api/notificacoes/{id}', response_model=schemas.NotificacaoOut)
def get_notificacao(id: int, db: Session = Depends(get_db)):
    n = db.query(models.Notificacao).filter(models.Notificacao.id == id).first()
    if not n:
        raise HTTPException(status_code=404, detail='Not found')
    return n


@app.post('/api/notificacoes', response_model=schemas.NotificacaoOut)
def create_notificacao(n_in: schemas.NotificacaoCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    atleta = db.query(models.Atleta).filter(models.Atleta.id == n_in.atleta_id).first()
    if not atleta:
        raise HTTPException(status_code=404, detail='Atleta not found')
    n = models.Notificacao(**n_in.dict())
    db.add(n)
    db.commit()
    db.refresh(n)
    return n


@app.put('/api/notificacoes/{id}', response_model=schemas.NotificacaoOut)
def update_notificacao(id: int, n_in: schemas.NotificacaoCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    n = db.query(models.Notificacao).filter(models.Notificacao.id == id).first()
    if not n:
        raise HTTPException(status_code=404, detail='Not found')
    for k, v in n_in.dict().items():
        setattr(n, k, v)
    if n_in.lida and not n.data_leitura:
        n.data_leitura = datetime.utcnow()
    db.commit()
    db.refresh(n)
    return n


@app.delete('/api/notificacoes/{id}')
def delete_notificacao(id: int, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    n = db.query(models.Notificacao).filter(models.Notificacao.id == id).first()
    if not n:
        raise HTTPException(status_code=404, detail='Not found')
    db.delete(n)
    db.commit()
    return {'message': 'Notificação deletada com sucesso'}


@app.get('/api/notificacoes/atleta/{atleta_id}/nao-lidas')
def get_notificacoes_nao_lidas(atleta_id: int, db: Session = Depends(get_db)):
    db.query(models.Atleta).filter(models.Atleta.id == atleta_id).first() or HTTPException(status_code=404, detail='Atleta not found')
    count = db.query(models.Notificacao).filter(models.Notificacao.atleta_id == atleta_id, models.Notificacao.lida == False).count()
    return {'atleta_id': atleta_id, 'nao_lidas': count}


# ========== Relatorio completo de atleta ==========
@app.get('/api/atletas/{atleta_id}/resumo')
def get_resumo_atleta(atleta_id: int, db: Session = Depends(get_db)):
    atleta = db.query(models.Atleta).filter(models.Atleta.id == atleta_id).first()
    if not atleta:
        raise HTTPException(status_code=404, detail='Atleta not found')
    return {
        'atleta': schemas.AtletaOut.from_orm(atleta),
        'treinos': [schemas.TreinoOut.from_orm(t) for t in atleta.treinos],
        'avaliacoes': [schemas.AvaliacaoOut.from_orm(a) for a in atleta.avaliacoes],
        'evolucoes': [schemas.EvolucaoOut.from_orm(e) for e in atleta.evolucoes],
        'metas': [schemas.MetaOut.from_orm(m) for m in atleta.metas],
        'notificacoes': [schemas.NotificacaoOut.from_orm(n) for n in atleta.notificacoes],
        'competicoes': [schemas.CompeticaoOut.from_orm(c) for c in atleta.competicoes]
    }


# ========== Users (admin) ==========
@app.get('/api/users', response_model=list[schemas.UserOut])
def get_users(db: Session = Depends(get_db), current_user: models.User = Depends(auth.require_role('admin'))):
    return db.query(models.User).all()


@app.get('/api/users/{id}', response_model=schemas.UserOut)
def get_user(id: int, db: Session = Depends(get_db), current_user: models.User = Depends(auth.require_role('admin'))):
    u = db.query(models.User).filter(models.User.id == id).first()
    if not u:
        raise HTTPException(status_code=404, detail='Not found')
    return u


@app.put('/api/users/{id}')
def update_user(id: int, data: dict, db: Session = Depends(get_db), current_user: models.User = Depends(auth.require_role('admin'))):
    u = db.query(models.User).filter(models.User.id == id).first()
    if not u:
        raise HTTPException(status_code=404, detail='Not found')
    for k, v in data.items():
        if k == 'password':
            setattr(u, 'password_hash', auth.get_password_hash(v))
        else:
            setattr(u, k, v)
    db.commit()
    db.refresh(u)
    return {'message': 'Usuário atualizado com sucesso', 'user': schemas.UserOut.from_orm(u)}


@app.delete('/api/users/{id}')
def delete_user(id: int, db: Session = Depends(get_db), current_user: models.User = Depends(auth.require_role('admin'))):
    u = db.query(models.User).filter(models.User.id == id).first()
    if not u:
        raise HTTPException(status_code=404, detail='Not found')
    if u.id == current_user.id:
        raise HTTPException(status_code=400, detail='Não é possível excluir o próprio usuário')
    db.delete(u)
    db.commit()
    return {'message': 'Usuário deletado com sucesso'}


# ========== Vincular atleta ==========
@app.post('/api/atletas/vincular')
def vincular_atleta(body: dict, db: Session = Depends(get_db), current_user: models.User = Depends(auth.require_role('treinador'))):
    email = body.get('email')
    if not email:
        raise HTTPException(status_code=400, detail='Email é obrigatório')
    atleta = db.query(models.Atleta).filter(models.Atleta.email == email).first()
    if not atleta:
        raise HTTPException(status_code=404, detail='Atleta não encontrado com este email')
    if atleta.treinador_id and atleta.treinador_id != current_user.id:
        raise HTTPException(status_code=400, detail='Atleta já vinculado a outro treinador')
    atleta.treinador_id = current_user.id
    db.commit()
    db.refresh(atleta)
    return {'message': 'Atleta vinculado com sucesso', 'atleta': schemas.AtletaOut.from_orm(atleta)}
