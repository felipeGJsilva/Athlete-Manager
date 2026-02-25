from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    username: str
    email: EmailStr
    role: Optional[str] = 'atleta'

class UserCreate(UserBase):
    password: str

class UserOut(UserBase):
    id: int
    created_at: datetime
    is_active: bool

    class Config:
        orm_mode = True

class AtletaBase(BaseModel):
    nome: str
    esporte: str
    posicao: Optional[str]
    idade: Optional[int]
    altura: Optional[float]
    peso: Optional[float]
    foto: Optional[str]
    email: Optional[EmailStr]
    treinador_id: Optional[int]

class AtletaCreate(AtletaBase):
    pass

class AtletaOut(AtletaBase):
    id: int
    data_nascimento: Optional[datetime]
    criado_em: datetime
    atualizado_em: datetime

    class Config:
        orm_mode = True

class TreinoBase(BaseModel):
    atleta_id: int
    tipo: str
    descricao: Optional[str]
    duracao_minutos: Optional[int]
    intensidade: Optional[str]
    data_treino: Optional[datetime]

class TreinoCreate(TreinoBase):
    pass

class TreinoOut(TreinoBase):
    id: int
    criado_em: datetime
    atualizado_em: datetime

    class Config:
        orm_mode = True

class AvaliacaoBase(BaseModel):
    atleta_id: int
    forca: Optional[float]
    resistencia: Optional[float]
    velocidade: Optional[float]
    flexibilidade: Optional[float]
    imc: Optional[float]
    data_avaliacao: Optional[datetime]
    observacoes: Optional[str]

class AvaliacaoCreate(AvaliacaoBase):
    pass

class AvaliacaoOut(AvaliacaoBase):
    id: int
    criado_em: datetime
    atualizado_em: datetime

    class Config:
        orm_mode = True

class EvolucaoBase(BaseModel):
    atleta_id: int
    peso: float
    altura: Optional[float]
    imc: Optional[float]
    massa_muscular: Optional[float]
    gordura_corporal: Optional[float]
    data_medicao: Optional[datetime]
    observacoes: Optional[str]

class EvolucaoCreate(EvolucaoBase):
    pass

class EvolucaoOut(EvolucaoBase):
    id: int
    criado_em: datetime
    atualizado_em: datetime

    class Config:
        orm_mode = True

class CompeticaoBase(BaseModel):
    nome: str
    evento: str
    data: datetime
    local: Optional[str]
    descricao: Optional[str]
    resultado: Optional[str]

class CompeticaoCreate(CompeticaoBase):
    pass

class CompeticaoOut(CompeticaoBase):
    id: int
    criado_em: datetime
    atualizado_em: datetime

    class Config:
        orm_mode = True

class MetaBase(BaseModel):
    atleta_id: int
    titulo: str
    descricao: Optional[str]
    status: Optional[str]
    data_inicio: Optional[datetime]
    data_conclusao_esperada: Optional[datetime]
    data_conclusao_real: Optional[datetime]
    progresso: Optional[int]

class MetaCreate(MetaBase):
    pass

class MetaOut(MetaBase):
    id: int
    criado_em: datetime
    atualizado_em: datetime

    class Config:
        orm_mode = True

class NotificacaoBase(BaseModel):
    atleta_id: int
    titulo: str
    mensagem: str
    tipo: Optional[str]
    lida: Optional[bool]

class NotificacaoCreate(NotificacaoBase):
    pass

class NotificacaoOut(NotificacaoBase):
    id: int
    data_criacao: datetime
    data_leitura: Optional[datetime]

    class Config:
        orm_mode = True
