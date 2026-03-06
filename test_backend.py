"""
Testes para o backend do Athlete Manager
Cobre funcionalidades principais:
- Cadastro de atletas
- Registro de treinos
- Avaliações
"""

import pytest
import json
import sys
import os
from datetime import datetime
from pathlib import Path

# Adicionar o caminho src ao sys.path para importar o app
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

from app import app, db, Atleta, Treino, Avaliacao, Evolucao, Meta, Notificacao, User


@pytest.fixture
def client():
    """Configuração do cliente de teste e banco de dados em memória"""
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    # Disable login restrictions during tests
    app.config['LOGIN_DISABLED'] = True
    
    with app.app_context():
        db.create_all()
        # create dummy trainer user and log in via session
        trainer = User(username='trainer', email='trainer@example.com', password_hash='x', role='treinador')
        db.session.add(trainer)
        db.session.commit()
        client_instance = app.test_client()
        # set session _user_id to simulate login
        with client_instance.session_transaction() as sess:
            sess['_user_id'] = str(trainer.id)
        yield client_instance
        db.session.remove()
        db.drop_all()


@pytest.fixture
def atleta_padrao():
    """Cria um atleta padrão para testes"""
    return {
        'nome': 'João Silva',
        'esporte': 'Futebol',
        'posicao': 'Zagueiro',
        'idade': 25,
        'altura': 1.85,
        'peso': 82.5,
        'email': 'joao@example.com',
        'data_nascimento': '1998-06-15'
    }


@pytest.fixture
def treino_padrao():
    """Cria um treino padrão para testes"""
    return {
        'tipo': 'Força',
        'descricao': 'Treino de força para membros inferiores',
        'duracao_minutos': 60,
        'intensidade': 'alta',
        'data_treino': '2024-01-20T14:00:00'
    }


@pytest.fixture
def avaliacao_padrao():
    """Cria uma avaliação padrão para testes"""
    return {
        'forca': 8.5,
        'resistencia': 7.0,
        'velocidade': 8.0,
        'flexibilidade': 6.5,
        'imc': 24.1,
        'observacoes': 'Atleta em bom estado físico'
    }


# ============= TESTES DE ATLETAS =============

class TestAtletas:
    """Testes para funcionalidades de atletas"""
    
    def test_criar_atleta(self, client, atleta_padrao):
        """Testa a criação de um novo atleta"""
        response = client.post(
            '/api/atletas',
            data=json.dumps(atleta_padrao),
            content_type='application/json'
        )
        
        assert response.status_code == 201
        data = json.loads(response.data)
        assert data['nome'] == 'João Silva'
        assert data['esporte'] == 'Futebol'
        assert 'id' in data
    
    def test_criar_atleta_campos_obrigatorios(self, client):
        """Testa validação de campos obrigatórios"""
        atleta_incompleto = {
            'nome': 'João Silva'
            # Falta 'esporte'
        }
        
        response = client.post(
            '/api/atletas',
            data=json.dumps(atleta_incompleto),
            content_type='application/json'
        )
        
        assert response.status_code == 400
    
    def test_listar_atletas(self, client, atleta_padrao):
        """Testa a listagem de todos os atletas"""
        # Criar alguns atletas
        client.post(
            '/api/atletas',
            data=json.dumps(atleta_padrao),
            content_type='application/json'
        )
        
        atleta_padrao['nome'] = 'Maria Santos'
        atleta_padrao['email'] = 'maria@example.com'
        client.post(
            '/api/atletas',
            data=json.dumps(atleta_padrao),
            content_type='application/json'
        )
        
        response = client.get('/api/atletas')
        assert response.status_code == 200
        data = json.loads(response.data)
        assert len(data) == 2
    
    def test_obter_atleta_especifico(self, client, atleta_padrao):
        """Testa a obtenção de um atleta específico"""
        # Criar atleta
        create_response = client.post(
            '/api/atletas',
            data=json.dumps(atleta_padrao),
            content_type='application/json'
        )
        atleta_id = json.loads(create_response.data)['id']
        
        # Obter atleta
        response = client.get(f'/api/atletas/{atleta_id}')
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['nome'] == 'João Silva'
        assert data['id'] == atleta_id
    
    def test_atualizar_atleta(self, client, atleta_padrao):
        """Testa a atualização de dados de um atleta"""
        # Criar atleta
        create_response = client.post(
            '/api/atletas',
            data=json.dumps(atleta_padrao),
            content_type='application/json'
        )
        atleta_id = json.loads(create_response.data)['id']
        
        # Atualizar atleta
        atualizacoes = {
            'peso': 85.0,
            'altura': 1.87
        }
        response = client.put(
            f'/api/atletas/{atleta_id}',
            data=json.dumps(atualizacoes),
            content_type='application/json'
        )
        
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['peso'] == 85.0
        assert data['altura'] == 1.87
    
    def test_deletar_atleta(self, client, atleta_padrao):
        """Testa a deleção de um atleta"""
        # Criar atleta
        create_response = client.post(
            '/api/atletas',
            data=json.dumps(atleta_padrao),
            content_type='application/json'
        )
        atleta_id = json.loads(create_response.data)['id']
        
        # Deletar atleta
        response = client.delete(f'/api/atletas/{atleta_id}')
        assert response.status_code == 200
        
        # Verificar que foi deletado
        response = client.get(f'/api/atletas/{atleta_id}')
        assert response.status_code == 404
    
    def test_atleta_nao_encontrado(self, client):
        """Testa requisição de atleta inexistente"""
        response = client.get('/api/atletas/9999')
        assert response.status_code == 404
    
    def test_email_unico(self, client, atleta_padrao):
        """Testa validação de email único"""
        # Criar primeiro atleta
        client.post(
            '/api/atletas',
            data=json.dumps(atleta_padrao),
            content_type='application/json'
        )
        
        # Tentar criar segundo com mesmo email
        atleta_padrao['nome'] = 'Outro Nome'
        response = client.post(
            '/api/atletas',
            data=json.dumps(atleta_padrao),
            content_type='application/json'
        )
        
        assert response.status_code == 400


# ============= TESTES DE METAS =============

class TestMetas:
    """Testes para funcionalidades de metas"""

    def test_criar_listar_deletar_meta(self, client, atleta_padrao):
        # criar atleta primeiro
        create_at = client.post(
            '/api/atletas',
            data=json.dumps(atleta_padrao),
            content_type='application/json'
        )
        atleta_id = json.loads(create_at.data)['id']

        # criar meta
        meta_data = {
            'atleta_id': atleta_id,
            'titulo': 'Perder peso',
            'descricao': 'Chegar a 75kg',
            'data_conclusao_esperada': datetime.utcnow().isoformat()
        }
        resp = client.post('/api/metas', data=json.dumps(meta_data), content_type='application/json')
        assert resp.status_code == 201
        meta = json.loads(resp.data)
        assert meta['titulo'] == 'Perder peso'
        mid = meta['id']

        # listar metas do atleta
        resp = client.get(f'/api/metas?atleta_id={atleta_id}')
        assert resp.status_code == 200
        lista = json.loads(resp.data)
        assert any(m['id'] == mid for m in lista)

        # atualizar progresso e status
        update = {'progresso': 50}
        resp = client.put(f'/api/metas/{mid}', data=json.dumps(update), content_type='application/json')
        assert resp.status_code == 200
        updated = json.loads(resp.data)
        assert updated['progresso'] == 50

        # marcar concluída
        resp = client.put(f'/api/metas/{mid}', data=json.dumps({'status': 'concluida'}), content_type='application/json')
        assert resp.status_code == 200
        updated = json.loads(resp.data)
        assert updated['status'] == 'concluida'
        assert updated['data_conclusao_real'] is not None

        # deletar
        resp = client.delete(f'/api/metas/{mid}')
        assert resp.status_code == 200
        resp = client.get(f'/api/metas/{mid}')
        assert resp.status_code == 404


# ============= TESTES DE TREINOS =============

class TestTreinos:
    """Testes para funcionalidades de treinos"""
    
    def test_criar_treino(self, client, atleta_padrao, treino_padrao):
        """Testa a criação de um novo treino"""
        # Criar atleta primeiro
        atleta_response = client.post(
            '/api/atletas',
            data=json.dumps(atleta_padrao),
            content_type='application/json'
        )
        atleta_id = json.loads(atleta_response.data)['id']
        
        # Criar treino
        treino_padrao['atleta_id'] = atleta_id
        response = client.post(
            '/api/treinos',
            data=json.dumps(treino_padrao),
            content_type='application/json'
        )
        
        assert response.status_code == 201
        data = json.loads(response.data)
        assert data['tipo'] == 'Força'
        assert data['atleta_id'] == atleta_id
        assert 'id' in data
    
    def test_criar_treino_campos_obrigatorios(self, client, atleta_padrao):
        """Testa validação de campos obrigatórios em treino"""
        # Criar atleta
        atleta_response = client.post(
            '/api/atletas',
            data=json.dumps(atleta_padrao),
            content_type='application/json'
        )
        atleta_id = json.loads(atleta_response.data)['id']
        
        # Tentar criar treino incompleto
        treino_incompleto = {
            'atleta_id': atleta_id
            # Falta 'tipo'
        }
        response = client.post(
            '/api/treinos',
            data=json.dumps(treino_incompleto),
            content_type='application/json'
        )
        
        assert response.status_code == 400
    
    def test_listar_treinos(self, client, atleta_padrao, treino_padrao):
        """Testa a listagem de treinos"""
        # Criar atleta
        atleta_response = client.post(
            '/api/atletas',
            data=json.dumps(atleta_padrao),
            content_type='application/json'
        )
        atleta_id = json.loads(atleta_response.data)['id']
        
        # Criar múltiplos treinos
        for i in range(3):
            treino_padrao['atleta_id'] = atleta_id
            treino_padrao['tipo'] = f'Tipo {i}'
            client.post(
                '/api/treinos',
                data=json.dumps(treino_padrao),
                content_type='application/json'
            )
        
        response = client.get('/api/treinos')
        assert response.status_code == 200
        data = json.loads(response.data)
        assert len(data) >= 3
    
    def test_listar_treinos_por_atleta(self, client, atleta_padrao, treino_padrao):
        """Testa a listagem de treinos filtrada por atleta"""
        # Criar dois atletas
        atleta1_response = client.post(
            '/api/atletas',
            data=json.dumps(atleta_padrao),
            content_type='application/json'
        )
        atleta1_id = json.loads(atleta1_response.data)['id']
        
        atleta_padrao['nome'] = 'Outro Atleta'
        atleta_padrao['email'] = 'outro@example.com'
        atleta2_response = client.post(
            '/api/atletas',
            data=json.dumps(atleta_padrao),
            content_type='application/json'
        )
        atleta2_id = json.loads(atleta2_response.data)['id']
        
        # Criar treinos para atleta 1
        treino_padrao['atleta_id'] = atleta1_id
        client.post('/api/treinos', data=json.dumps(treino_padrao), content_type='application/json')
        client.post('/api/treinos', data=json.dumps(treino_padrao), content_type='application/json')
        
        # Criar treino para atleta 2
        treino_padrao['atleta_id'] = atleta2_id
        client.post('/api/treinos', data=json.dumps(treino_padrao), content_type='application/json')
        
        # Listar treinos do atleta 1
        response = client.get(f'/api/treinos?atleta_id={atleta1_id}')
        assert response.status_code == 200
        data = json.loads(response.data)
        assert len(data) == 2
        assert all(t['atleta_id'] == atleta1_id for t in data)
    
    def test_obter_treino_especifico(self, client, atleta_padrao, treino_padrao):
        """Testa a obtenção de um treino específico"""
        # Criar atleta
        atleta_response = client.post(
            '/api/atletas',
            data=json.dumps(atleta_padrao),
            content_type='application/json'
        )
        atleta_id = json.loads(atleta_response.data)['id']
        
        # Criar treino
        treino_padrao['atleta_id'] = atleta_id
        treino_response = client.post(
            '/api/treinos',
            data=json.dumps(treino_padrao),
            content_type='application/json'
        )
        treino_id = json.loads(treino_response.data)['id']
        
        # Obter treino
        response = client.get(f'/api/treinos/{treino_id}')
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['tipo'] == 'Força'
    
    def test_atualizar_treino(self, client, atleta_padrao, treino_padrao):
        """Testa a atualização de um treino"""
        # Criar atleta e treino
        atleta_response = client.post(
            '/api/atletas',
            data=json.dumps(atleta_padrao),
            content_type='application/json'
        )
        atleta_id = json.loads(atleta_response.data)['id']
        
        treino_padrao['atleta_id'] = atleta_id
        treino_response = client.post(
            '/api/treinos',
            data=json.dumps(treino_padrao),
            content_type='application/json'
        )
        treino_id = json.loads(treino_response.data)['id']
        
        # Atualizar treino
        atualizacoes = {
            'tipo': 'Resistência',
            'duracao_minutos': 90
        }
        response = client.put(
            f'/api/treinos/{treino_id}',
            data=json.dumps(atualizacoes),
            content_type='application/json'
        )
        
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['tipo'] == 'Resistência'
        assert data['duracao_minutos'] == 90
    
    def test_deletar_treino(self, client, atleta_padrao, treino_padrao):
        """Testa a deleção de um treino"""
        # Criar atleta e treino
        atleta_response = client.post(
            '/api/atletas',
            data=json.dumps(atleta_padrao),
            content_type='application/json'
        )
        atleta_id = json.loads(atleta_response.data)['id']
        
        treino_padrao['atleta_id'] = atleta_id
        treino_response = client.post(
            '/api/treinos',
            data=json.dumps(treino_padrao),
            content_type='application/json'
        )
        treino_id = json.loads(treino_response.data)['id']
        
        # Deletar treino
        response = client.delete(f'/api/treinos/{treino_id}')
        assert response.status_code == 200
        
        # Verificar que foi deletado
        response = client.get(f'/api/treinos/{treino_id}')
        assert response.status_code == 404
    
    def test_intensidade_valida(self, client, atleta_padrao, treino_padrao):
        """Testa validação de intensidade do treino"""
        # Criar atleta
        atleta_response = client.post(
            '/api/atletas',
            data=json.dumps(atleta_padrao),
            content_type='application/json'
        )
        atleta_id = json.loads(atleta_response.data)['id']
        
        # Criar treino com intensidade válida
        for intensidade in ['baixa', 'media', 'alta']:
            treino_padrao['atleta_id'] = atleta_id
            treino_padrao['intensidade'] = intensidade
            response = client.post(
                '/api/treinos',
                data=json.dumps(treino_padrao),
                content_type='application/json'
            )
            assert response.status_code == 201


# ============= TESTES DE AVALIAÇÕES =============

class TestAvaliacoes:
    """Testes para funcionalidades de avaliações"""
    
    def test_criar_avaliacao(self, client, atleta_padrao, avaliacao_padrao):
        """Testa a criação de uma nova avaliação"""
        # Criar atleta
        atleta_response = client.post(
            '/api/atletas',
            data=json.dumps(atleta_padrao),
            content_type='application/json'
        )
        atleta_id = json.loads(atleta_response.data)['id']
        
        # Criar avaliação
        avaliacao_padrao['atleta_id'] = atleta_id
        response = client.post(
            '/api/avaliacoes',
            data=json.dumps(avaliacao_padrao),
            content_type='application/json'
        )
        
        assert response.status_code == 201
        data = json.loads(response.data)
        assert data['forca'] == 8.5
        assert data['atleta_id'] == atleta_id
        assert 'id' in data
    
    def test_listar_avaliacoes(self, client, atleta_padrao, avaliacao_padrao):
        """Testa a listagem de avaliações"""
        # Criar atleta
        atleta_response = client.post(
            '/api/atletas',
            data=json.dumps(atleta_padrao),
            content_type='application/json'
        )
        atleta_id = json.loads(atleta_response.data)['id']
        
        # Criar múltiplas avaliações
        for i in range(3):
            avaliacao_padrao['atleta_id'] = atleta_id
            avaliacao_padrao['forca'] = 7.0 + i
            client.post(
                '/api/avaliacoes',
                data=json.dumps(avaliacao_padrao),
                content_type='application/json'
            )
        
        response = client.get('/api/avaliacoes')
        assert response.status_code == 200
        data = json.loads(response.data)
        assert len(data) >= 3
    
    def test_listar_avaliacoes_por_atleta(self, client, atleta_padrao, avaliacao_padrao):
        """Testa a listagem de avaliações filtrada por atleta"""
        # Criar dois atletas
        atleta1_response = client.post(
            '/api/atletas',
            data=json.dumps(atleta_padrao),
            content_type='application/json'
        )
        atleta1_id = json.loads(atleta1_response.data)['id']
        
        atleta_padrao['nome'] = 'Outro Atleta'
        atleta_padrao['email'] = 'outro@example.com'
        atleta2_response = client.post(
            '/api/atletas',
            data=json.dumps(atleta_padrao),
            content_type='application/json'
        )
        atleta2_id = json.loads(atleta2_response.data)['id']
        
        # Criar avaliações para atleta 1
        avaliacao_padrao['atleta_id'] = atleta1_id
        client.post('/api/avaliacoes', data=json.dumps(avaliacao_padrao), content_type='application/json')
        client.post('/api/avaliacoes', data=json.dumps(avaliacao_padrao), content_type='application/json')
        
        # Criar avaliação para atleta 2
        avaliacao_padrao['atleta_id'] = atleta2_id
        client.post('/api/avaliacoes', data=json.dumps(avaliacao_padrao), content_type='application/json')
        
        # Listar avaliações do atleta 1
        response = client.get(f'/api/avaliacoes?atleta_id={atleta1_id}')
        assert response.status_code == 200
        data = json.loads(response.data)
        assert len(data) == 2
        assert all(a['atleta_id'] == atleta1_id for a in data)
    
    def test_obter_avaliacao_especifica(self, client, atleta_padrao, avaliacao_padrao):
        """Testa a obtenção de uma avaliação específica"""
        # Criar atleta
        atleta_response = client.post(
            '/api/atletas',
            data=json.dumps(atleta_padrao),
            content_type='application/json'
        )
        atleta_id = json.loads(atleta_response.data)['id']
        
        # Criar avaliação
        avaliacao_padrao['atleta_id'] = atleta_id
        avaliacao_response = client.post(
            '/api/avaliacoes',
            data=json.dumps(avaliacao_padrao),
            content_type='application/json'
        )
        avaliacao_id = json.loads(avaliacao_response.data)['id']
        
        # Obter avaliação
        response = client.get(f'/api/avaliacoes/{avaliacao_id}')
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['forca'] == 8.5
    
    def test_atualizar_avaliacao(self, client, atleta_padrao, avaliacao_padrao):
        """Testa a atualização de uma avaliação"""
        # Criar atleta e avaliação
        atleta_response = client.post(
            '/api/atletas',
            data=json.dumps(atleta_padrao),
            content_type='application/json'
        )
        atleta_id = json.loads(atleta_response.data)['id']
        
        avaliacao_padrao['atleta_id'] = atleta_id
        avaliacao_response = client.post(
            '/api/avaliacoes',
            data=json.dumps(avaliacao_padrao),
            content_type='application/json'
        )
        avaliacao_id = json.loads(avaliacao_response.data)['id']
        
        # Atualizar avaliação
        atualizacoes = {
            'forca': 9.0,
            'resistencia': 7.5
        }
        response = client.put(
            f'/api/avaliacoes/{avaliacao_id}',
            data=json.dumps(atualizacoes),
            content_type='application/json'
        )
        
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['forca'] == 9.0
        assert data['resistencia'] == 7.5
    
    def test_deletar_avaliacao(self, client, atleta_padrao, avaliacao_padrao):
        """Testa a deleção de uma avaliação"""
        # Criar atleta e avaliação
        atleta_response = client.post(
            '/api/atletas',
            data=json.dumps(atleta_padrao),
            content_type='application/json'
        )
        atleta_id = json.loads(atleta_response.data)['id']
        
        avaliacao_padrao['atleta_id'] = atleta_id
        avaliacao_response = client.post(
            '/api/avaliacoes',
            data=json.dumps(avaliacao_padrao),
            content_type='application/json'
        )
        avaliacao_id = json.loads(avaliacao_response.data)['id']
        
        # Deletar avaliação
        response = client.delete(f'/api/avaliacoes/{avaliacao_id}')
        assert response.status_code == 200
        
        # Verificar que foi deletado
        response = client.get(f'/api/avaliacoes/{avaliacao_id}')
        assert response.status_code == 404
    
    def test_metricas_validas(self, client, atleta_padrao, avaliacao_padrao):
        """Testa validação de métricas de avaliação"""
        # Criar atleta
        atleta_response = client.post(
            '/api/atletas',
            data=json.dumps(atleta_padrao),
            content_type='application/json'
        )
        atleta_id = json.loads(atleta_response.data)['id']
        
        # Testar com métricas válidas
        avaliacao_padrao['atleta_id'] = atleta_id
        avaliacao_padrao['forca'] = 9.5
        avaliacao_padrao['resistencia'] = 8.0
        avaliacao_padrao['velocidade'] = 8.5
        avaliacao_padrao['flexibilidade'] = 7.0
        avaliacao_padrao['imc'] = 23.5
        
        response = client.post(
            '/api/avaliacoes',
            data=json.dumps(avaliacao_padrao),
            content_type='application/json'
        )
        
        assert response.status_code == 201
        data = json.loads(response.data)
        assert data['forca'] == 9.5
        assert data['imc'] == 23.5


# ============= TESTES DE INTEGRAÇÃO =============

class TestIntegracao:
    """Testes de integração de fluxos completos"""
    
    def test_fluxo_completo_atleta(self, client, atleta_padrao, treino_padrao, avaliacao_padrao):
        """Testa um fluxo completo: criar atleta, treino e avaliação"""
        # 1. Criar atleta
        atleta_response = client.post(
            '/api/atletas',
            data=json.dumps(atleta_padrao),
            content_type='application/json'
        )
        assert atleta_response.status_code == 201
        atleta_id = json.loads(atleta_response.data)['id']
        
        # 2. Criar treino para o atleta
        treino_padrao['atleta_id'] = atleta_id
        treino_response = client.post(
            '/api/treinos',
            data=json.dumps(treino_padrao),
            content_type='application/json'
        )
        assert treino_response.status_code == 201
        
        # 3. Criar avaliação para o atleta
        avaliacao_padrao['atleta_id'] = atleta_id
        avaliacao_response = client.post(
            '/api/avaliacoes',
            data=json.dumps(avaliacao_padrao),
            content_type='application/json'
        )
        assert avaliacao_response.status_code == 201
        
        # 4. Verificar que tudo foi criado corretamente
        atleta_get = client.get(f'/api/atletas/{atleta_id}')
        assert atleta_get.status_code == 200
        
        treinos = client.get(f'/api/treinos?atleta_id={atleta_id}')
        assert len(json.loads(treinos.data)) == 1
        
        avaliacoes = client.get(f'/api/avaliacoes?atleta_id={atleta_id}')
        assert len(json.loads(avaliacoes.data)) == 1
    
    def test_relacionamento_atleta_treino(self, client, atleta_padrao, treino_padrao):
        """Testa o relacionamento entre atleta e treino"""
        # Criar atleta
        atleta_response = client.post(
            '/api/atletas',
            data=json.dumps(atleta_padrao),
            content_type='application/json'
        )
        atleta_id = json.loads(atleta_response.data)['id']
        
        # Criar múltiplos treinos
        treino_ids = []
        for i in range(3):
            treino_padrao['atleta_id'] = atleta_id
            treino_padrao['tipo'] = f'Treino {i+1}'
            response = client.post(
                '/api/treinos',
                data=json.dumps(treino_padrao),
                content_type='application/json'
            )
            treino_ids.append(json.loads(response.data)['id'])
        
        # Verificar que todos os treinos estão associados ao atleta
        response = client.get(f'/api/treinos?atleta_id={atleta_id}')
        treinos = json.loads(response.data)
        assert len(treinos) == 3
        assert all(t['atleta_id'] == atleta_id for t in treinos)
    
    def test_cascata_delecao(self, client, atleta_padrao, treino_padrao):
        """Testa se treinos são deletados quando atleta é deletado"""
        # Criar atleta e treino
        atleta_response = client.post(
            '/api/atletas',
            data=json.dumps(atleta_padrao),
            content_type='application/json'
        )
        atleta_id = json.loads(atleta_response.data)['id']
        
        treino_padrao['atleta_id'] = atleta_id
        treino_response = client.post(
            '/api/treinos',
            data=json.dumps(treino_padrao),
            content_type='application/json'
        )
        treino_id = json.loads(treino_response.data)['id']
        
        # Deletar atleta
        client.delete(f'/api/atletas/{atleta_id}')
        
        # Verificar que treino também foi deletado
        response = client.get(f'/api/treinos/{treino_id}')
        assert response.status_code == 404


if __name__ == '__main__':
    pytest.main([__file__, '-v', '--tb=short'])
