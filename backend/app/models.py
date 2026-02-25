from sqlalchemy import Column, Integer, String, Float, DateTime, Text, Boolean, ForeignKey, Table
from sqlalchemy.orm import relationship
from .database import Base
from datetime import datetime

atleta_competicao = Table('atleta_competicao', Base.metadata,
    Column('atleta_id', Integer, ForeignKey('atletas.id'), primary_key=True),
    Column('competicao_id', Integer, ForeignKey('competicoes.id'), primary_key=True)
)

class Atleta(Base):
    __tablename__ = 'atletas'
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(100), nullable=False)
    esporte = Column(String(50), nullable=False)
    posicao = Column(String(50))
    idade = Column(Integer)
    altura = Column(Float)
    peso = Column(Float)
    foto = Column(Text, default='default')
    email = Column(String(150), unique=True, index=True)
    treinador_id = Column(Integer, ForeignKey('users.id'), nullable=True)
    data_nascimento = Column(DateTime)
    criado_em = Column(DateTime, default=datetime.utcnow)
    atualizado_em = Column(DateTime, default=datetime.utcnow)

    treinos = relationship('Treino', back_populates='atleta', cascade='all, delete-orphan')
    avaliacoes = relationship('Avaliacao', back_populates='atleta', cascade='all, delete-orphan')
    evolucoes = relationship('Evolucao', back_populates='atleta', cascade='all, delete-orphan')
    metas = relationship('Meta', back_populates='atleta', cascade='all, delete-orphan')
    notificacoes = relationship('Notificacao', back_populates='atleta', cascade='all, delete-orphan')
    competicoes = relationship('Competicao', secondary=atleta_competicao, back_populates='atletas')

class Treino(Base):
    __tablename__ = 'treinos'
    id = Column(Integer, primary_key=True, index=True)
    atleta_id = Column(Integer, ForeignKey('atletas.id'), nullable=False)
    tipo = Column(String(100), nullable=False)
    descricao = Column(Text)
    duracao_minutos = Column(Integer)
    data_treino = Column(DateTime, default=datetime.utcnow)
    intensidade = Column(String(20))
    criado_em = Column(DateTime, default=datetime.utcnow)
    atualizado_em = Column(DateTime, default=datetime.utcnow)

    atleta = relationship('Atleta', back_populates='treinos')

class Avaliacao(Base):
    __tablename__ = 'avaliacoes'
    id = Column(Integer, primary_key=True, index=True)
    atleta_id = Column(Integer, ForeignKey('atletas.id'), nullable=False)
    forca = Column(Float)
    resistencia = Column(Float)
    velocidade = Column(Float)
    flexibilidade = Column(Float)
    imc = Column(Float)
    data_avaliacao = Column(DateTime, default=datetime.utcnow)
    observacoes = Column(Text)
    criado_em = Column(DateTime, default=datetime.utcnow)
    atualizado_em = Column(DateTime, default=datetime.utcnow)

    atleta = relationship('Atleta', back_populates='avaliacoes')

class Evolucao(Base):
    __tablename__ = 'evolucoes'
    id = Column(Integer, primary_key=True, index=True)
    atleta_id = Column(Integer, ForeignKey('atletas.id'), nullable=False)
    peso = Column(Float, nullable=False)
    altura = Column(Float)
    imc = Column(Float)
    massa_muscular = Column(Float)
    gordura_corporal = Column(Float)
    data_medicao = Column(DateTime, default=datetime.utcnow)
    observacoes = Column(Text)
    criado_em = Column(DateTime, default=datetime.utcnow)
    atualizado_em = Column(DateTime, default=datetime.utcnow)

    atleta = relationship('Atleta', back_populates='evolucoes')

class Competicao(Base):
    __tablename__ = 'competicoes'
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(150), nullable=False)
    evento = Column(String(100), nullable=False)
    data = Column(DateTime, nullable=False)
    local = Column(String(150))
    descricao = Column(Text)
    resultado = Column(String(100))
    criado_em = Column(DateTime, default=datetime.utcnow)
    atualizado_em = Column(DateTime, default=datetime.utcnow)

    atletas = relationship('Atleta', secondary=atleta_competicao, back_populates='competicoes')

class Meta(Base):
    __tablename__ = 'metas'
    id = Column(Integer, primary_key=True, index=True)
    atleta_id = Column(Integer, ForeignKey('atletas.id'), nullable=False)
    titulo = Column(String(100), nullable=False)
    descricao = Column(Text)
    status = Column(String(20), default='ativa')
    data_inicio = Column(DateTime, default=datetime.utcnow)
    data_conclusao_esperada = Column(DateTime)
    data_conclusao_real = Column(DateTime)
    progresso = Column(Integer, default=0)
    criado_em = Column(DateTime, default=datetime.utcnow)
    atualizado_em = Column(DateTime, default=datetime.utcnow)

    atleta = relationship('Atleta', back_populates='metas')

class Notificacao(Base):
    __tablename__ = 'notificacoes'
    id = Column(Integer, primary_key=True, index=True)
    atleta_id = Column(Integer, ForeignKey('atletas.id'), nullable=False)
    titulo = Column(String(100), nullable=False)
    mensagem = Column(Text, nullable=False)
    tipo = Column(String(50), default='info')
    lida = Column(Boolean, default=False)
    data_criacao = Column(DateTime, default=datetime.utcnow)
    data_leitura = Column(DateTime)

    atleta = relationship('Atleta', back_populates='notificacoes')

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(150), unique=True, nullable=False)
    email = Column(String(150), unique=True, nullable=False)
    password_hash = Column(String(256), nullable=False)
    role = Column(String(50), nullable=False, default='atleta')
    created_at = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Boolean, default=True)
