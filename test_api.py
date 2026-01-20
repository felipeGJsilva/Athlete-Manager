#!/usr/bin/env python3
"""
Script de Teste - Athlete Manager API
Testa todos os endpoints CRUD
"""

import requests
import json
from datetime import datetime, timedelta

BASE_URL = "http://localhost:5000/api"

class bcolors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

def print_header(text):
    print(f"\n{bcolors.BOLD}{bcolors.HEADER}{'='*60}{bcolors.ENDC}")
    print(f"{bcolors.BOLD}{bcolors.HEADER}{text}{bcolors.ENDC}")
    print(f"{bcolors.BOLD}{bcolors.HEADER}{'='*60}{bcolors.ENDC}\n")

def print_success(text):
    print(f"{bcolors.OKGREEN}✓ {text}{bcolors.ENDC}")

def print_error(text):
    print(f"{bcolors.FAIL}✗ {text}{bcolors.ENDC}")

def print_info(text):
    print(f"{bcolors.OKBLUE}ℹ {text}{bcolors.ENDC}")

def test_atletas():
    print_header("TESTANDO ATLETAS")
    
    # GET - listar vazio
    print_info("GET /api/atletas")
    resp = requests.get(f"{BASE_URL}/atletas")
    if resp.status_code == 200:
        print_success(f"Listados {len(resp.json())} atletas")
    else:
        print_error(f"Erro {resp.status_code}")
        return None
    
    # POST - criar atleta
    print_info("POST /api/atletas")
    atleta_data = {
        "nome": "João Silva",
        "esporte": "Futebol",
        "posicao": "Zagueiro",
        "idade": 25,
        "altura": 1.85,
        "peso": 82.5
    }
    resp = requests.post(f"{BASE_URL}/atletas", json=atleta_data)
    if resp.status_code == 201:
        atleta = resp.json()
        atleta_id = atleta['id']
        print_success(f"Atleta criado (ID: {atleta_id})")
        return atleta_id
    else:
        print_error(f"Erro {resp.status_code}: {resp.text}")
        return None

def test_treinos(atleta_id):
    print_header("TESTANDO TREINOS")
    
    # POST - criar treino
    print_info("POST /api/treinos")
    treino_data = {
        "atleta_id": atleta_id,
        "tipo": "Força",
        "descricao": "Treino de força para membros inferiores",
        "duracao_minutos": 60,
        "intensidade": "alta"
    }
    resp = requests.post(f"{BASE_URL}/treinos", json=treino_data)
    if resp.status_code == 201:
        treino = resp.json()
        treino_id = treino['id']
        print_success(f"Treino criado (ID: {treino_id})")
        return treino_id
    else:
        print_error(f"Erro {resp.status_code}: {resp.text}")
        return None

def test_avaliacoes(atleta_id):
    print_header("TESTANDO AVALIAÇÕES")
    
    # POST - criar avaliação
    print_info("POST /api/avaliacoes")
    avaliacao_data = {
        "atleta_id": atleta_id,
        "forca": 8.5,
        "resistencia": 7.2,
        "velocidade": 8.1,
        "flexibilidade": 6.9,
        "imc": 24.1
    }
    resp = requests.post(f"{BASE_URL}/avaliacoes", json=avaliacao_data)
    if resp.status_code == 201:
        avaliacao = resp.json()
        avaliacao_id = avaliacao['id']
        print_success(f"Avaliação criada (ID: {avaliacao_id})")
        return avaliacao_id
    else:
        print_error(f"Erro {resp.status_code}: {resp.text}")
        return None

def test_evolucoes(atleta_id):
    print_header("TESTANDO EVOLUÇÕES FÍSICAS")
    
    # POST - criar evolução
    print_info("POST /api/evolucao")
    evolucao_data = {
        "atleta_id": atleta_id,
        "peso": 82.5,
        "altura": 1.85,
        "imc": 24.1,
        "massa_muscular": 72.5,
        "gordura_corporal": 12.3
    }
    resp = requests.post(f"{BASE_URL}/evolucao", json=evolucao_data)
    if resp.status_code == 201:
        evolucao = resp.json()
        evolucao_id = evolucao['id']
        print_success(f"Evolução criada (ID: {evolucao_id})")
        return evolucao_id
    else:
        print_error(f"Erro {resp.status_code}: {resp.text}")
        return None

def test_competicoes():
    print_header("TESTANDO COMPETIÇÕES")
    
    # POST - criar competição
    print_info("POST /api/competicoes")
    data_futura = (datetime.now() + timedelta(days=30)).isoformat()
    competicao_data = {
        "nome": "Campeonato Estadual 2024",
        "evento": "Futebol",
        "data": data_futura,
        "local": "Estádio Municipal",
        "descricao": "Fase classificatória"
    }
    resp = requests.post(f"{BASE_URL}/competicoes", json=competicao_data)
    if resp.status_code == 201:
        competicao = resp.json()
        competicao_id = competicao['id']
        print_success(f"Competição criada (ID: {competicao_id})")
        return competicao_id
    else:
        print_error(f"Erro {resp.status_code}: {resp.text}")
        return None

def test_metas(atleta_id):
    print_header("TESTANDO METAS")
    
    # POST - criar meta
    print_info("POST /api/metas")
    data_esperada = (datetime.now() + timedelta(days=90)).isoformat()
    meta_data = {
        "atleta_id": atleta_id,
        "titulo": "Reduzir peso para 80kg",
        "descricao": "Objetivo é atingir 80kg em 3 meses",
        "status": "ativa",
        "progresso": 30,
        "data_conclusao_esperada": data_esperada
    }
    resp = requests.post(f"{BASE_URL}/metas", json=meta_data)
    if resp.status_code == 201:
        meta = resp.json()
        meta_id = meta['id']
        print_success(f"Meta criada (ID: {meta_id})")
        return meta_id
    else:
        print_error(f"Erro {resp.status_code}: {resp.text}")
        return None

def test_notificacoes(atleta_id):
    print_header("TESTANDO NOTIFICAÇÕES")
    
    # POST - criar notificação
    print_info("POST /api/notificacoes")
    notificacao_data = {
        "atleta_id": atleta_id,
        "titulo": "Treino Agendado",
        "mensagem": "Seu treino de força está marcado para amanhã às 10:00",
        "tipo": "info"
    }
    resp = requests.post(f"{BASE_URL}/notificacoes", json=notificacao_data)
    if resp.status_code == 201:
        notificacao = resp.json()
        notificacao_id = notificacao['id']
        print_success(f"Notificação criada (ID: {notificacao_id})")
        
        # Testar marcar como lida
        print_info("PUT /api/notificacoes/{id} (marcar como lida)")
        resp = requests.put(f"{BASE_URL}/notificacoes/{notificacao_id}", json={"lida": True})
        if resp.status_code == 200:
            print_success("Notificação marcada como lida")
        else:
            print_error(f"Erro {resp.status_code}")
        
        return notificacao_id
    else:
        print_error(f"Erro {resp.status_code}: {resp.text}")
        return None

def test_resumo(atleta_id):
    print_header("TESTANDO RELATÓRIO DE RESUMO")
    
    # GET - resumo completo
    print_info(f"GET /api/atletas/{atleta_id}/resumo")
    resp = requests.get(f"{BASE_URL}/atletas/{atleta_id}/resumo")
    if resp.status_code == 200:
        resumo = resp.json()
        print_success("Resumo obtido com sucesso:")
        print(f"  - Atleta: {resumo['atleta']['nome']}")
        print(f"  - Treinos: {len(resumo['treinos'])}")
        print(f"  - Avaliações: {len(resumo['avaliacoes'])}")
        print(f"  - Evoluções: {len(resumo['evolucoes'])}")
        print(f"  - Metas: {len(resumo['metas'])}")
        print(f"  - Notificações: {len(resumo['notificacoes'])}")
    else:
        print_error(f"Erro {resp.status_code}")

if __name__ == "__main__":
    print(f"\n{bcolors.BOLD}{bcolors.OKCYAN}")
    print("╔════════════════════════════════════════════════════════════╗")
    print("║          TESTE DE API - ATHLETE MANAGER                    ║")
    print("║          Testando todos os endpoints CRUD                  ║")
    print("╚════════════════════════════════════════════════════════════╝")
    print(f"{bcolors.ENDC}\n")
    
    try:
        # Testar conexão
        print_info("Conectando ao servidor...")
        resp = requests.get(f"{BASE_URL}/atletas", timeout=2)
        if resp.status_code == 200:
            print_success("Servidor respondendo corretamente")
        else:
            print_error(f"Servidor retornou: {resp.status_code}")
    except Exception as e:
        print_error(f"Não foi possível conectar ao servidor: {e}")
        print_error("Certifique-se de que o Flask está rodando: python app.py")
        exit(1)
    
    # Executar testes
    atleta_id = test_atletas()
    if not atleta_id:
        print_error("Teste de atletas falhou!")
        exit(1)
    
    treino_id = test_treinos(atleta_id)
    avaliacao_id = test_avaliacoes(atleta_id)
    evolucao_id = test_evolucoes(atleta_id)
    competicao_id = test_competicoes()
    meta_id = test_metas(atleta_id)
    notificacao_id = test_notificacoes(atleta_id)
    
    test_resumo(atleta_id)
    
    print_header("RESUMO DOS TESTES")
    print_success("Todos os testes CRUD foram executados com sucesso!")
    print(f"\n{bcolors.OKCYAN}IDs criados durante os testes:{bcolors.ENDC}")
    print(f"  Atleta ID: {atleta_id}")
    print(f"  Treino ID: {treino_id}")
    print(f"  Avaliação ID: {avaliacao_id}")
    print(f"  Evolução ID: {evolucao_id}")
    print(f"  Competição ID: {competicao_id}")
    print(f"  Meta ID: {meta_id}")
    print(f"  Notificação ID: {notificacao_id}")
    print()
