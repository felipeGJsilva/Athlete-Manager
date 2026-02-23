from flask import Flask, render_template, request, jsonify, redirect, url_for, flash, session
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import os

app = Flask(
    __name__,
    template_folder="views",
    static_folder="static"
)

# Configuração do banco de dados
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///athlete_manager.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')
db = SQLAlchemy(app)
CORS(app)

# Configuração do Flask-Login
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'
login_manager.login_message = 'Por favor, faça login para acessar esta página.'
login_manager.login_message_category = 'info'

# ============== MODELOS ==============

class Atleta(db.Model):
    __tablename__ = 'atletas'
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    esporte = db.Column(db.String(50), nullable=False)
    posicao = db.Column(db.String(50))
    idade = db.Column(db.Integer)
    altura = db.Column(db.Float)
    peso = db.Column(db.Float)
    foto = db.Column(db.Text, default="default")
    email = db.Column(db.String(150), unique=True)  # Adicionado para vinculação
    treinador_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)  # Vinculação ao treinador
    data_nascimento = db.Column(db.DateTime)
    criado_em = db.Column(db.DateTime, default=datetime.utcnow)
    atualizado_em = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relacionamentos
    treinador = db.relationship('User', backref='atletas', lazy=True)
    treinos = db.relationship('Treino', backref='atleta', lazy=True, cascade='all, delete-orphan')
    avaliacoes = db.relationship('Avaliacao', backref='atleta', lazy=True, cascade='all, delete-orphan')
    evolucoes = db.relationship('Evolucao', backref='atleta', lazy=True, cascade='all, delete-orphan')
    metas = db.relationship('Meta', backref='atleta', lazy=True, cascade='all, delete-orphan')
    notificacoes = db.relationship('Notificacao', backref='atleta', lazy=True, cascade='all, delete-orphan')
    competicoes = db.relationship('Competicao', secondary='atleta_competicao', backref='atletas')
    
    def to_dict(self):
        return {
            'id': self.id,
            'nome': self.nome,
            'esporte': self.esporte,
            'posicao': self.posicao,
            'idade': self.idade,
            'altura': self.altura,
            'peso': self.peso,
            'foto': self.foto,
            'email': self.email,
            'treinador_id': self.treinador_id,
            'data_nascimento': self.data_nascimento.isoformat() if self.data_nascimento else None,
            'criado_em': self.criado_em.isoformat(),
            'atualizado_em': self.atualizado_em.isoformat()
        }

class Treino(db.Model):
    __tablename__ = 'treinos'
    id = db.Column(db.Integer, primary_key=True)
    atleta_id = db.Column(db.Integer, db.ForeignKey('atletas.id'), nullable=False)
    tipo = db.Column(db.String(100), nullable=False)
    descricao = db.Column(db.Text)
    duracao_minutos = db.Column(db.Integer)
    data_treino = db.Column(db.DateTime, default=datetime.utcnow)
    intensidade = db.Column(db.String(20))  # baixa, media, alta
    criado_em = db.Column(db.DateTime, default=datetime.utcnow)
    atualizado_em = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'atleta_id': self.atleta_id,
            'atleta_nome': self.atleta.nome if self.atleta else None,
            'tipo': self.tipo,
            'descricao': self.descricao,
            'duracao_minutos': self.duracao_minutos,
            'data_treino': self.data_treino.isoformat(),
            'intensidade': self.intensidade,
            'criado_em': self.criado_em.isoformat(),
            'atualizado_em': self.atualizado_em.isoformat()
        }

class Avaliacao(db.Model):
    __tablename__ = 'avaliacoes'
    id = db.Column(db.Integer, primary_key=True)
    atleta_id = db.Column(db.Integer, db.ForeignKey('atletas.id'), nullable=False)
    forca = db.Column(db.Float)
    resistencia = db.Column(db.Float)
    velocidade = db.Column(db.Float)
    flexibilidade = db.Column(db.Float)
    imc = db.Column(db.Float)
    data_avaliacao = db.Column(db.DateTime, default=datetime.utcnow)
    observacoes = db.Column(db.Text)
    criado_em = db.Column(db.DateTime, default=datetime.utcnow)
    atualizado_em = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'atleta_id': self.atleta_id,
            'atleta_nome': self.atleta.nome if self.atleta else None,
            'forca': self.forca,
            'resistencia': self.resistencia,
            'velocidade': self.velocidade,
            'flexibilidade': self.flexibilidade,
            'imc': self.imc,
            'data_avaliacao': self.data_avaliacao.isoformat(),
            'observacoes': self.observacoes,
            'criado_em': self.criado_em.isoformat(),
            'atualizado_em': self.atualizado_em.isoformat()
        }

class Evolucao(db.Model):
    __tablename__ = 'evolucoes'
    id = db.Column(db.Integer, primary_key=True)
    atleta_id = db.Column(db.Integer, db.ForeignKey('atletas.id'), nullable=False)
    peso = db.Column(db.Float, nullable=False)
    altura = db.Column(db.Float)
    imc = db.Column(db.Float)
    massa_muscular = db.Column(db.Float)
    gordura_corporal = db.Column(db.Float)
    data_medicao = db.Column(db.DateTime, default=datetime.utcnow)
    observacoes = db.Column(db.Text)
    criado_em = db.Column(db.DateTime, default=datetime.utcnow)
    atualizado_em = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'atleta_id': self.atleta_id,
            'atleta_nome': self.atleta.nome if self.atleta else None,
            'peso': self.peso,
            'altura': self.altura,
            'imc': self.imc,
            'massa_muscular': self.massa_muscular,
            'gordura_corporal': self.gordura_corporal,
            'data_medicao': self.data_medicao.isoformat(),
            'observacoes': self.observacoes,
            'criado_em': self.criado_em.isoformat(),
            'atualizado_em': self.atualizado_em.isoformat()
        }

class Competicao(db.Model):
    __tablename__ = 'competicoes'
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(150), nullable=False)
    evento = db.Column(db.String(100), nullable=False)
    data = db.Column(db.DateTime, nullable=False)
    local = db.Column(db.String(150))
    descricao = db.Column(db.Text)
    resultado = db.Column(db.String(100))
    criado_em = db.Column(db.DateTime, default=datetime.utcnow)
    atualizado_em = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'nome': self.nome,
            'evento': self.evento,
            'data': self.data.isoformat(),
            'local': self.local,
            'descricao': self.descricao,
            'resultado': self.resultado,
            'criado_em': self.criado_em.isoformat(),
            'atualizado_em': self.atualizado_em.isoformat()
        }

class Meta(db.Model):
    __tablename__ = 'metas'
    id = db.Column(db.Integer, primary_key=True)
    atleta_id = db.Column(db.Integer, db.ForeignKey('atletas.id'), nullable=False)
    titulo = db.Column(db.String(100), nullable=False)
    descricao = db.Column(db.Text)
    status = db.Column(db.String(20), default='ativa')  # ativa, concluida, cancelada
    data_inicio = db.Column(db.DateTime, default=datetime.utcnow)
    data_conclusao_esperada = db.Column(db.DateTime)
    data_conclusao_real = db.Column(db.DateTime)
    progresso = db.Column(db.Integer, default=0)  # 0-100%
    criado_em = db.Column(db.DateTime, default=datetime.utcnow)
    atualizado_em = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'atleta_id': self.atleta_id,
            'titulo': self.titulo,
            'descricao': self.descricao,
            'status': self.status,
            'data_inicio': self.data_inicio.isoformat(),
            'data_conclusao_esperada': self.data_conclusao_esperada.isoformat() if self.data_conclusao_esperada else None,
            'data_conclusao_real': self.data_conclusao_real.isoformat() if self.data_conclusao_real else None,
            'progresso': self.progresso,
            'criado_em': self.criado_em.isoformat(),
            'atualizado_em': self.atualizado_em.isoformat()
        }

class Notificacao(db.Model):
    __tablename__ = 'notificacoes'
    id = db.Column(db.Integer, primary_key=True)
    atleta_id = db.Column(db.Integer, db.ForeignKey('atletas.id'), nullable=False)
    titulo = db.Column(db.String(100), nullable=False)
    mensagem = db.Column(db.Text, nullable=False)
    tipo = db.Column(db.String(50), default='info')  # info, aviso, alerta, sucesso
    lida = db.Column(db.Boolean, default=False)
    data_criacao = db.Column(db.DateTime, default=datetime.utcnow)
    data_leitura = db.Column(db.DateTime)
    
    def to_dict(self):
        return {
            'id': self.id,
            'atleta_id': self.atleta_id,
            'titulo': self.titulo,
            'mensagem': self.mensagem,
            'tipo': self.tipo,
            'lida': self.lida,
            'data_criacao': self.data_criacao.isoformat(),
            'data_leitura': self.data_leitura.isoformat() if self.data_leitura else None
        }

# ============== MODELO USER ==============

class User(UserMixin, db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), unique=True, nullable=False)
    email = db.Column(db.String(150), nullable=False)  # Removido unique=True para permitir múltiplos cadastros com mesmo email
    password_hash = db.Column(db.String(256), nullable=False)
    role = db.Column(db.String(50), nullable=False, default='atleta')  # admin, treinador, atleta
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'role': self.role,
            'created_at': self.created_at.isoformat(),
            'is_active': self.is_active
        }

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# ============== DECORATORS DE AUTORIZAÇÃO ==============

from functools import wraps

from flask import abort

def role_required(role):
    def decorator(f):
        @wraps(f)
        @login_required
        def decorated_function(*args, **kwargs):
            if current_user.role != role and current_user.role != 'admin':
                # Retorna 403 para acesso não autorizado; o handler de erro cuidará do redirecionamento
                abort(403)
            return f(*args, **kwargs)
        return decorated_function
    return decorator

def admin_required(f):
    return role_required('admin')(f)

def treinador_required(f):
    return role_required('treinador')(f)

def atleta_required(f):
    return role_required('atleta')(f)

# Tabela de relacionamento many-to-many
atleta_competicao = db.Table('atleta_competicao',
    db.Column('atleta_id', db.Integer, db.ForeignKey('atletas.id'), primary_key=True),
    db.Column('competicao_id', db.Integer, db.ForeignKey('competicoes.id'), primary_key=True)
)

# Criar banco se não existir
with app.app_context():
    db.create_all()

# ============== ENDPOINTS API - ATLETAS ==============

@app.route('/api/atletas', methods=['GET'])
@login_required
@treinador_required
def get_atletas():
    """Obter lista de atletas do treinador logado"""
    try:
        if current_user.role == 'admin':
            atletas = Atleta.query.all()
        else:
            atletas = Atleta.query.filter_by(treinador_id=current_user.id).all()
        return jsonify([a.to_dict() for a in atletas]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/atletas/<int:id>', methods=['GET'])
@login_required
@treinador_required
def get_atleta(id):
    """Obter atleta específico por ID"""
    try:
        atleta = Atleta.query.get_or_404(id)
        return jsonify(atleta.to_dict()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 404

@app.route('/api/atletas/me', methods=['GET'])
@login_required
def get_atleta_me():
    """Obter dados do atleta logado"""
    try:
        if current_user.role != 'atleta':
            return jsonify({'error': 'Acesso negado - apenas atletas'}), 403
        
        atleta = Atleta.query.filter_by(email=current_user.email).first()
        if not atleta:
            return jsonify({'error': 'Atleta não encontrado'}), 404
        
        return jsonify(atleta.to_dict()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/atletas/me/resumo', methods=['GET'])
@login_required
def get_resumo_atleta_me():
    """Obter resumo do atleta logado"""
    try:
        if current_user.role != 'atleta':
            return jsonify({'error': 'Acesso negado - apenas atletas'}), 403
        
        atleta = Atleta.query.filter_by(email=current_user.email).first()
        if not atleta:
            return jsonify({'error': 'Atleta não encontrado'}), 404
        
        # Próximo treino
        proximo_treino = Treino.query.filter_by(atleta_id=atleta.id)\
            .filter(Treino.data_treino >= datetime.utcnow())\
            .order_by(Treino.data_treino.asc()).first()
        
        # Última evolução
        ultima_evolucao = Evolucao.query.filter_by(atleta_id=atleta.id)\
            .order_by(Evolucao.data_medicao.desc()).first()
        
        return jsonify({
            'atleta': atleta.to_dict(),
            'total_treinos': len(atleta.treinos),
            'peso_atual': ultima_evolucao.peso if ultima_evolucao else atleta.peso,
            'imc_atual': ultima_evolucao.imc if ultima_evolucao else None,
            'proximo_treino': proximo_treino.to_dict() if proximo_treino else None
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/atletas', methods=['POST'])
@login_required
@treinador_required
def add_atleta():
    """Criar novo atleta"""
    try:
        data = request.json
        if not data or not data.get('nome') or not data.get('esporte'):
            return jsonify({'error': 'Nome e esporte são obrigatórios'}), 400
        
        atleta = Atleta(
            nome=data['nome'],
            esporte=data['esporte'],
            posicao=data.get('posicao'),
            idade=data.get('idade'),
            altura=data.get('altura'),
            peso=data.get('peso'),
            foto=data.get('foto', 'default'),
            email=data.get('email'),
            treinador_id=current_user.id,  # Vincula ao treinador logado
            data_nascimento=datetime.fromisoformat(data['data_nascimento']) if data.get('data_nascimento') else None
        )
        db.session.add(atleta)
        db.session.commit()
        return jsonify(atleta.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/atletas/<int:id>', methods=['PUT'])
@login_required
@treinador_required
def update_atleta(id):
    """Atualizar atleta existente"""
    try:
        atleta = Atleta.query.get_or_404(id)
        data = request.json
        
        atleta.nome = data.get('nome', atleta.nome)
        atleta.esporte = data.get('esporte', atleta.esporte)
        atleta.posicao = data.get('posicao', atleta.posicao)
        atleta.idade = data.get('idade', atleta.idade)
        atleta.altura = data.get('altura', atleta.altura)
        atleta.peso = data.get('peso', atleta.peso)
        atleta.foto = data.get('foto', atleta.foto)
        if data.get('data_nascimento'):
            atleta.data_nascimento = datetime.fromisoformat(data['data_nascimento'])
        
        db.session.commit()
        return jsonify(atleta.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/atletas/vincular', methods=['POST'])
@login_required
@treinador_required
def vincular_atleta():
    """Vincular atleta existente ao treinador via email"""
    try:
        data = request.json
        email = data.get('email')
        if not email:
            return jsonify({'error': 'Email é obrigatório'}), 400
        
        atleta = Atleta.query.filter_by(email=email).first()
        if not atleta:
            return jsonify({'error': 'Atleta não encontrado com este email'}), 404
        
        if atleta.treinador_id and atleta.treinador_id != current_user.id:
            return jsonify({'error': 'Atleta já vinculado a outro treinador'}), 400
        
        atleta.treinador_id = current_user.id
        db.session.commit()
        return jsonify({'message': 'Atleta vinculado com sucesso', 'atleta': atleta.to_dict()}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/atletas/<int:id>', methods=['DELETE'])
@login_required
@treinador_required
def delete_atleta(id):
    """Deletar atleta"""
    try:
        atleta = Atleta.query.get_or_404(id)
        db.session.delete(atleta)
        db.session.commit()
        return jsonify({'message': 'Atleta deletado com sucesso'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# ============== ENDPOINTS API - TREINOS ==============

@app.route('/api/treinos', methods=['GET'])
@login_required
def get_treinos():
    """Obter lista de treinos"""
    try:
        atleta_id = request.args.get('atleta_id')
        limit = request.args.get('limit', type=int)
        
        query = Treino.query
        
        if atleta_id:
            # Verificar se o atleta pertence ao treinador (ou é admin)
            atleta = Atleta.query.get(int(atleta_id))
            if not atleta or (current_user.role != 'admin' and atleta.treinador_id != current_user.id):
                return jsonify({'error': 'Acesso negado'}), 403
            query = query.filter_by(atleta_id=int(atleta_id))
        else:
            # Se não especificou atleta, mostrar treinos de todos os atletas do treinador
            if current_user.role == 'admin':
                pass  # query já é Treino.query
            elif current_user.role == 'treinador':
                atletas_ids = [a.id for a in Atleta.query.filter_by(treinador_id=current_user.id).all()]
                query = query.filter(Treino.atleta_id.in_(atletas_ids))
            else:  # atleta
                # Atletas veem treinos criados para eles pelos treinadores
                atleta_record = Atleta.query.filter_by(email=current_user.email).first()
                if atleta_record:
                    query = query.filter_by(atleta_id=atleta_record.id)
                else:
                    return jsonify([]), 200
        
        # Ordenar por data decrescente e aplicar limit
        treinos = query.order_by(Treino.data_treino.desc()).limit(limit).all() if limit else query.order_by(Treino.data_treino.desc()).all()
        
        return jsonify([t.to_dict() for t in treinos]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/treinos/<int:id>', methods=['GET'])
def get_treino(id):
    """Obter treino específico por ID"""
    try:
        treino = Treino.query.get_or_404(id)
        return jsonify(treino.to_dict()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 404

@app.route('/api/treinos', methods=['POST'])
@login_required
def add_treino():
    """Criar novo treino"""
    try:
        data = request.json
        if not data or not data.get('atleta_id') or not data.get('tipo'):
            return jsonify({'error': 'atleta_id e tipo são obrigatórios'}), 400
        
        atleta = Atleta.query.get_or_404(data['atleta_id'])
        
        # Verificar permissões
        if current_user.role != 'admin' and atleta.treinador_id != current_user.id:
            return jsonify({'error': 'Acesso negado - atleta não pertence ao treinador'}), 403
        
        treino = Treino(
            atleta_id=data['atleta_id'],
            tipo=data['tipo'],
            descricao=data.get('descricao'),
            duracao_minutos=data.get('duracao_minutos'),
            intensidade=data.get('intensidade'),
            data_treino=datetime.fromisoformat(data['data_treino']) if data.get('data_treino') else datetime.utcnow()
        )
        db.session.add(treino)
        db.session.commit()
        return jsonify(treino.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/treinos/<int:id>', methods=['PUT'])
def update_treino(id):
    """Atualizar treino existente"""
    try:
        treino = Treino.query.get_or_404(id)
        data = request.json
        
        treino.tipo = data.get('tipo', treino.tipo)
        treino.descricao = data.get('descricao', treino.descricao)
        treino.duracao_minutos = data.get('duracao_minutos', treino.duracao_minutos)
        treino.intensidade = data.get('intensidade', treino.intensidade)
        if data.get('data_treino'):
            treino.data_treino = datetime.fromisoformat(data['data_treino'])
        
        db.session.commit()
        return jsonify(treino.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/treinos/<int:id>', methods=['DELETE'])
def delete_treino(id):
    """Deletar treino"""
    try:
        treino = Treino.query.get_or_404(id)
        db.session.delete(treino)
        db.session.commit()
        return jsonify({'message': 'Treino deletado com sucesso'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# ============== ENDPOINTS API - AVALIAÇÕES ==============

@app.route('/api/avaliacoes', methods=['GET'])
def get_avaliacoes():
    """Obter lista de todas as avaliações"""
    try:
        atleta_id = request.args.get('atleta_id')
        if atleta_id:
            avaliacoes = Avaliacao.query.filter_by(atleta_id=int(atleta_id)).all()
        else:
            avaliacoes = Avaliacao.query.all()
        return jsonify([a.to_dict() for a in avaliacoes]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/avaliacoes/<int:id>', methods=['GET'])
def get_avaliacao(id):
    """Obter avaliação específica por ID"""
    try:
        avaliacao = Avaliacao.query.get_or_404(id)
        return jsonify(avaliacao.to_dict()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 404

@app.route('/api/avaliacoes', methods=['POST'])
def add_avaliacao():
    """Criar nova avaliação"""
    try:
        data = request.json
        if not data or not data.get('atleta_id'):
            return jsonify({'error': 'atleta_id é obrigatório'}), 400
        
        atleta = Atleta.query.get_or_404(data['atleta_id'])
        
        avaliacao = Avaliacao(
            atleta_id=data['atleta_id'],
            forca=data.get('forca'),
            resistencia=data.get('resistencia'),
            velocidade=data.get('velocidade'),
            flexibilidade=data.get('flexibilidade'),
            imc=data.get('imc'),
            observacoes=data.get('observacoes'),
            data_avaliacao=datetime.fromisoformat(data['data_avaliacao']) if data.get('data_avaliacao') else datetime.utcnow()
        )
        db.session.add(avaliacao)
        db.session.commit()
        return jsonify(avaliacao.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/avaliacoes/<int:id>', methods=['PUT'])
def update_avaliacao(id):
    """Atualizar avaliação existente"""
    try:
        avaliacao = Avaliacao.query.get_or_404(id)
        data = request.json
        
        avaliacao.forca = data.get('forca', avaliacao.forca)
        avaliacao.resistencia = data.get('resistencia', avaliacao.resistencia)
        avaliacao.velocidade = data.get('velocidade', avaliacao.velocidade)
        avaliacao.flexibilidade = data.get('flexibilidade', avaliacao.flexibilidade)
        avaliacao.imc = data.get('imc', avaliacao.imc)
        avaliacao.observacoes = data.get('observacoes', avaliacao.observacoes)
        if data.get('data_avaliacao'):
            avaliacao.data_avaliacao = datetime.fromisoformat(data['data_avaliacao'])
        
        db.session.commit()
        return jsonify(avaliacao.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/avaliacoes/<int:id>', methods=['DELETE'])
def delete_avaliacao(id):
    """Deletar avaliação"""
    try:
        avaliacao = Avaliacao.query.get_or_404(id)
        db.session.delete(avaliacao)
        db.session.commit()
        return jsonify({'message': 'Avaliação deletada com sucesso'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# ============== ENDPOINTS API - EVOLUÇÕES FÍSICAS ==============

@app.route('/api/evolucao', methods=['GET'])
@login_required
def get_evolucoes():
    """Obter lista de evoluções"""
    try:
        atleta_id = request.args.get('atleta_id')
        limit = request.args.get('limit', type=int)
        
        query = Evolucao.query
        
        if atleta_id:
            # Verificar permissões
            atleta = Atleta.query.get(int(atleta_id))
            if not atleta or (current_user.role != 'admin' and atleta.treinador_id != current_user.id and current_user.email != atleta.email):
                return jsonify({'error': 'Acesso negado'}), 403
            query = query.filter_by(atleta_id=int(atleta_id))
        else:
            # Se não especificou atleta
            if current_user.role == 'admin':
                pass
            elif current_user.role == 'treinador':
                atletas_ids = [a.id for a in Atleta.query.filter_by(treinador_id=current_user.id).all()]
                query = query.filter(Evolucao.atleta_id.in_(atletas_ids))
            else:  # atleta
                atleta_record = Atleta.query.filter_by(email=current_user.email).first()
                if atleta_record:
                    query = query.filter_by(atleta_id=atleta_record.id)
                else:
                    return jsonify([]), 200
        
        # Ordenar por data decrescente e aplicar limit
        evolucoes = query.order_by(Evolucao.data_medicao.desc()).limit(limit).all() if limit else query.order_by(Evolucao.data_medicao.desc()).all()
        
        return jsonify([e.to_dict() for e in evolucoes]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/evolucao/<int:id>', methods=['GET'])
def get_evolucao(id):
    """Obter evolução específica por ID"""
    try:
        evolucao = Evolucao.query.get_or_404(id)
        return jsonify(evolucao.to_dict()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 404

@app.route('/api/evolucao', methods=['POST'])
def add_evolucao():
    """Criar nova evolução"""
    try:
        data = request.json
        if not data or not data.get('atleta_id') or not data.get('peso'):
            return jsonify({'error': 'atleta_id e peso são obrigatórios'}), 400
        
        atleta = Atleta.query.get_or_404(data['atleta_id'])
        
        evolucao = Evolucao(
            atleta_id=data['atleta_id'],
            peso=data['peso'],
            altura=data.get('altura'),
            imc=data.get('imc'),
            massa_muscular=data.get('massa_muscular'),
            gordura_corporal=data.get('gordura_corporal'),
            observacoes=data.get('observacoes'),
            data_medicao=datetime.fromisoformat(data['data_medicao']) if data.get('data_medicao') else datetime.utcnow()
        )
        db.session.add(evolucao)
        db.session.commit()
        return jsonify(evolucao.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/evolucao/<int:id>', methods=['PUT'])
def update_evolucao(id):
    """Atualizar evolução existente"""
    try:
        evolucao = Evolucao.query.get_or_404(id)
        data = request.json
        
        evolucao.peso = data.get('peso', evolucao.peso)
        evolucao.altura = data.get('altura', evolucao.altura)
        evolucao.imc = data.get('imc', evolucao.imc)
        evolucao.massa_muscular = data.get('massa_muscular', evolucao.massa_muscular)
        evolucao.gordura_corporal = data.get('gordura_corporal', evolucao.gordura_corporal)
        evolucao.observacoes = data.get('observacoes', evolucao.observacoes)
        if data.get('data_medicao'):
            evolucao.data_medicao = datetime.fromisoformat(data['data_medicao'])
        
        db.session.commit()
        return jsonify(evolucao.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/evolucao/<int:id>', methods=['DELETE'])
def delete_evolucao(id):
    """Deletar evolução"""
    try:
        evolucao = Evolucao.query.get_or_404(id)
        db.session.delete(evolucao)
        db.session.commit()
        return jsonify({'message': 'Evolução deletada com sucesso'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# ============== ENDPOINTS API - COMPETIÇÕES ==============

@app.route('/api/competicoes', methods=['GET'])
def get_competicoes():
    """Obter lista de todas as competições"""
    try:
        competicoes = Competicao.query.all()
        return jsonify([c.to_dict() for c in competicoes]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/competicoes/<int:id>', methods=['GET'])
def get_competicao(id):
    """Obter competição específica por ID"""
    try:
        competicao = Competicao.query.get_or_404(id)
        return jsonify(competicao.to_dict()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 404

@app.route('/api/competicoes', methods=['POST'])
def add_competicao():
    """Criar nova competição"""
    try:
        data = request.json
        if not data or not data.get('nome') or not data.get('evento') or not data.get('data'):
            return jsonify({'error': 'nome, evento e data são obrigatórios'}), 400
        
        competicao = Competicao(
            nome=data['nome'],
            evento=data['evento'],
            data=datetime.fromisoformat(data['data']),
            local=data.get('local'),
            descricao=data.get('descricao'),
            resultado=data.get('resultado')
        )
        db.session.add(competicao)
        db.session.commit()
        return jsonify(competicao.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/competicoes/<int:id>', methods=['PUT'])
def update_competicao(id):
    """Atualizar competição existente"""
    try:
        competicao = Competicao.query.get_or_404(id)
        data = request.json
        
        competicao.nome = data.get('nome', competicao.nome)
        competicao.evento = data.get('evento', competicao.evento)
        competicao.local = data.get('local', competicao.local)
        competicao.descricao = data.get('descricao', competicao.descricao)
        competicao.resultado = data.get('resultado', competicao.resultado)
        if data.get('data'):
            competicao.data = datetime.fromisoformat(data['data'])
        
        db.session.commit()
        return jsonify(competicao.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/competicoes/<int:id>', methods=['DELETE'])
def delete_competicao(id):
    """Deletar competição"""
    try:
        competicao = Competicao.query.get_or_404(id)
        db.session.delete(competicao)
        db.session.commit()
        return jsonify({'message': 'Competição deletada com sucesso'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# ============== ENDPOINTS API - METAS ==============

@app.route('/api/metas', methods=['GET'])
def get_metas():
    """Obter lista de todas as metas"""
    try:
        atleta_id = request.args.get('atleta_id')
        status = request.args.get('status')
        
        query = Meta.query
        if atleta_id:
            query = query.filter_by(atleta_id=int(atleta_id))
        if status:
            query = query.filter_by(status=status)
        
        metas = query.all()
        return jsonify([m.to_dict() for m in metas]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/metas/<int:id>', methods=['GET'])
def get_meta(id):
    """Obter meta específica por ID"""
    try:
        meta = Meta.query.get_or_404(id)
        return jsonify(meta.to_dict()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 404

@app.route('/api/metas', methods=['POST'])
def add_meta():
    """Criar nova meta"""
    try:
        data = request.json
        if not data or not data.get('atleta_id') or not data.get('titulo'):
            return jsonify({'error': 'atleta_id e titulo são obrigatórios'}), 400
        
        atleta = Atleta.query.get_or_404(data['atleta_id'])
        
        meta = Meta(
            atleta_id=data['atleta_id'],
            titulo=data['titulo'],
            descricao=data.get('descricao'),
            status=data.get('status', 'ativa'),
            progresso=data.get('progresso', 0),
            data_conclusao_esperada=datetime.fromisoformat(data['data_conclusao_esperada']) if data.get('data_conclusao_esperada') else None
        )
        db.session.add(meta)
        db.session.commit()
        return jsonify(meta.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/metas/<int:id>', methods=['PUT'])
def update_meta(id):
    """Atualizar meta existente"""
    try:
        meta = Meta.query.get_or_404(id)
        data = request.json
        
        meta.titulo = data.get('titulo', meta.titulo)
        meta.descricao = data.get('descricao', meta.descricao)
        meta.status = data.get('status', meta.status)
        meta.progresso = data.get('progresso', meta.progresso)
        
        if data.get('data_conclusao_esperada'):
            meta.data_conclusao_esperada = datetime.fromisoformat(data['data_conclusao_esperada'])
        
        if data.get('status') == 'concluida' and not meta.data_conclusao_real:
            meta.data_conclusao_real = datetime.utcnow()
        
        db.session.commit()
        return jsonify(meta.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/metas/<int:id>', methods=['DELETE'])
def delete_meta(id):
    """Deletar meta"""
    try:
        meta = Meta.query.get_or_404(id)
        db.session.delete(meta)
        db.session.commit()
        return jsonify({'message': 'Meta deletada com sucesso'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# ============== ENDPOINTS API - NOTIFICAÇÕES ==============

@app.route('/api/notificacoes', methods=['GET'])
def get_notificacoes():
    """Obter lista de todas as notificações"""
    try:
        atleta_id = request.args.get('atleta_id')
        lida = request.args.get('lida')
        
        query = Notificacao.query
        if atleta_id:
            query = query.filter_by(atleta_id=int(atleta_id))
        if lida is not None:
            query = query.filter_by(lida=lida.lower() == 'true')
        
        notificacoes = query.order_by(Notificacao.data_criacao.desc()).all()
        return jsonify([n.to_dict() for n in notificacoes]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/notificacoes/<int:id>', methods=['GET'])
def get_notificacao(id):
    """Obter notificação específica por ID"""
    try:
        notificacao = Notificacao.query.get_or_404(id)
        return jsonify(notificacao.to_dict()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 404

@app.route('/api/notificacoes', methods=['POST'])
def add_notificacao():
    """Criar nova notificação"""
    try:
        data = request.json
        if not data or not data.get('atleta_id') or not data.get('titulo') or not data.get('mensagem'):
            return jsonify({'error': 'atleta_id, titulo e mensagem são obrigatórios'}), 400
        
        atleta = Atleta.query.get_or_404(data['atleta_id'])
        
        notificacao = Notificacao(
            atleta_id=data['atleta_id'],
            titulo=data['titulo'],
            mensagem=data['mensagem'],
            tipo=data.get('tipo', 'info')
        )
        db.session.add(notificacao)
        db.session.commit()
        return jsonify(notificacao.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/notificacoes/<int:id>', methods=['PUT'])
def update_notificacao(id):
    """Atualizar notificação existente (marcar como lida)"""
    try:
        notificacao = Notificacao.query.get_or_404(id)
        data = request.json
        
        notificacao.titulo = data.get('titulo', notificacao.titulo)
        notificacao.mensagem = data.get('mensagem', notificacao.mensagem)
        notificacao.tipo = data.get('tipo', notificacao.tipo)
        
        if data.get('lida') and not notificacao.lida:
            notificacao.lida = True
            notificacao.data_leitura = datetime.utcnow()
        
        db.session.commit()
        return jsonify(notificacao.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/notificacoes/<int:id>', methods=['DELETE'])
def delete_notificacao(id):
    """Deletar notificação"""
    try:
        notificacao = Notificacao.query.get_or_404(id)
        db.session.delete(notificacao)
        db.session.commit()
        return jsonify({'message': 'Notificação deletada com sucesso'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/notificacoes/atleta/<int:atleta_id>/nao-lidas', methods=['GET'])
def get_notificacoes_nao_lidas(atleta_id):
    """Obter quantidade de notificações não lidas de um atleta"""
    try:
        Atleta.query.get_or_404(atleta_id)
        count = Notificacao.query.filter_by(atleta_id=atleta_id, lida=False).count()
        return jsonify({'atleta_id': atleta_id, 'nao_lidas': count}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 404

# ============== ENDPOINTS API - RELATÓRIOS ==============

@app.route('/api/atletas/<int:atleta_id>/resumo', methods=['GET'])
def get_resumo_atleta(atleta_id):
    """Obter resumo completo de um atleta"""
    try:
        atleta = Atleta.query.get_or_404(atleta_id)
        
        return jsonify({
            'atleta': atleta.to_dict(),
            'treinos': [t.to_dict() for t in atleta.treinos],
            'avaliacoes': [a.to_dict() for a in atleta.avaliacoes],
            'evolucoes': [e.to_dict() for e in atleta.evolucoes],
            'metas': [m.to_dict() for m in atleta.metas],
            'notificacoes': [n.to_dict() for n in atleta.notificacoes],
            'competicoes': [c.to_dict() for c in atleta.competicoes]
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 404

# ============== ENDPOINTS API - USUÁRIOS (ADMIN) ==============

@app.route('/api/users', methods=['GET'])
@login_required
@admin_required
def get_users():
    """Obter lista de usuários"""
    try:
        users = User.query.all()
        return jsonify([u.to_dict() for u in users]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/users/<int:id>', methods=['GET'])
@login_required
@admin_required
def get_user(id):
    """Obter usuário por ID"""
    try:
        user = User.query.get_or_404(id)
        return jsonify(user.to_dict()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 404

@app.route('/api/users/<int:id>', methods=['PUT'])
@login_required
@admin_required
def update_user(id):
    """Atualizar usuário"""
    try:
        user = User.query.get_or_404(id)
        data = request.get_json()
        
        if 'username' in data:
            user.username = data['username']
        if 'email' in data:
            user.email = data['email']
        if 'role' in data:
            user.role = data['role']
        
        db.session.commit()
        return jsonify({'message': 'Usuário atualizado com sucesso', 'user': user.to_dict()}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/users/<int:id>', methods=['DELETE'])
@login_required
@admin_required
def delete_user(id):
    """Deletar usuário"""
    try:
        user = User.query.get_or_404(id)
        if user.id == current_user.id:
            return jsonify({'error': 'Não é possível excluir o próprio usuário'}), 400
        
        db.session.delete(user)
        db.session.commit()
        return jsonify({'message': 'Usuário deletado com sucesso'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# ============== ROTAS DE AUTENTICAÇÃO ==============

@app.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('home'))
    
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        
        if not username or not password:
            flash('Por favor, preencha todos os campos.', 'warning')
            return redirect(url_for('login'))
        
        user = User.query.filter_by(username=username).first()
        if user and user.check_password(password) and user.is_active:
            login_user(user)
            next_page = request.args.get('next')
            flash(f'Bem-vindo, {user.username}!', 'success')
            return redirect(next_page) if next_page else redirect(url_for('home'))
        else:
            flash('Credenciais inválidas ou conta desativada.', 'danger')
    
    return render_template('auth/login.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    # Removido o redirecionamento para permitir registro mesmo quando logado
    # if current_user.is_authenticated:
    #     return redirect(url_for('home'))
    
    print(f"Método: {request.method}")  # Debug
    if request.method == 'POST':
        print("Dados do POST recebidos")  # Debug
        username = request.form.get('username')
        email = request.form.get('email')
        password = request.form.get('password')
        confirm_password = request.form.get('confirm_password')
        role = request.form.get('role', 'atleta')
        
        print(f"Dados: username={username}, email={email}, role={role}")  # Debug
        
        if not all([username, email, password, confirm_password]):
            print("Campos obrigatórios faltando")  # Debug
            flash('Por favor, preencha todos os campos.', 'warning')
            return redirect(url_for('register'))
        
        if password != confirm_password:
            print("Senhas não coincidem")  # Debug
            flash('As senhas não coincidem.', 'danger')
            return redirect(url_for('register'))
        
        if len(password) < 6:
            print("Senha muito curta")  # Debug
            flash('A senha deve ter pelo menos 6 caracteres.', 'warning')
            return redirect(url_for('register'))
        
        if User.query.filter_by(username=username).first():
            print("Username já existe")  # Debug
            flash('Nome de usuário já existe.', 'danger')
            return redirect(url_for('register'))
        
        # Removido: validação de email único para permitir múltiplos cadastros com mesmo email
        # if User.query.filter_by(email=email).first():
        #     print("Email já existe")  # Debug
        #     flash('Email já cadastrado.', 'danger')
        #     return redirect(url_for('register'))
        
        # Validar role
        if role not in ['admin', 'treinador', 'atleta']:
            role = 'atleta'
        
        user = User(username=username, email=email, role=role)
        user.set_password(password)
        
        try:
            db.session.add(user)
            db.session.commit()
            print(f"Usuário {username} criado com sucesso!")  # Debug
            flash('Conta criada com sucesso! Faça login.', 'success')
            return redirect(url_for('login'))
        except Exception as e:
            db.session.rollback()
            print(f"Erro ao criar usuário: {e}")  # Debug
            flash('Erro ao criar conta. Tente novamente.', 'danger')
    
    print("Renderizando template register.html")  # Debug
    return render_template('auth/register.html')

@app.route('/logout')
@login_required
def logout():
    # Faz logout pelo Flask-Login e limpa a sessão para evitar restauração
    logout_user()
    session.clear()
    flash('Você foi desconectado.', 'info')
    return redirect(url_for('login'))

# ============== ROTAS DE TEMPLATES ==============

@app.route("/")
@login_required
def home():
    return render_template("base/base.html")

@app.route("/competicoes")
@login_required
@treinador_required
def competicoes():
    return render_template("base/base.html")

@app.route("/dashboard")
@login_required
def dashboard():
    return render_template("base/base.html")

@app.route("/atletas")
@login_required
def atletas():
    return render_template("base/base.html")

@app.route("/avaliacoes")
@login_required
@treinador_required
def avaliacoes():
    return render_template("base/base.html")

@app.route("/metas")
@login_required
def metas():
    return render_template("base/base.html")

@app.route("/treinos")
@login_required
def treinos():
    return render_template("base/base.html")

@app.route("/sobre")
@login_required
def sobre():
    return render_template("base/base.html")

@app.route("/evolucao")
@login_required
def evolucao():
    return render_template("base/base.html")

@app.route("/perfil")
@login_required
def perfil():
    return render_template("base/base.html")

@app.route("/admin")
@login_required
@admin_required
def admin():
    return render_template("base/base.html")

# Handler para 403 - Acesso negado
@app.errorhandler(403)
def forbidden(e):
    flash('Acesso negado: você não tem permissão para acessar essa página.', 'danger')
    if current_user.is_authenticated:
        if current_user.role == 'atleta':
            return redirect(url_for('atletas'))
        elif current_user.role == 'treinador':
            return redirect(url_for('atletas'))
        elif current_user.role == 'admin':
            return redirect(url_for('admin'))
    return redirect(url_for('login'))

# Evita cache do navegador para prevenir reexibição de páginas autenticadas após logout
@app.after_request
def add_no_cache_headers(response):
    response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, max-age=0'
    response.headers['Pragma'] = 'no-cache'
    response.headers['Expires'] = '0'
    return response

if __name__ == "__main__": 
    app.run(debug=True, port=5001)
