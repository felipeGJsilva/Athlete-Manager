"""Smoke test script for backend endpoints referenced by frontend.
Run with: python tools/smoke_test_backend.py
Requires the API server running at http://127.0.0.1:8000
"""
import requests
import sys

BASE = 'http://127.0.0.1:8000'

def register_and_login():
    reg = requests.post(f"{BASE}/auth/register", json={
        'username': 'smoketest',
        'email': 'smoketest@example.com',
        'password': 'smoke1234',
        'role': 'treinador'
    })
    print('register', reg.status_code)
    tok = requests.post(f"{BASE}/auth/token", data={'username': 'smoketest', 'password': 'smoke1234'})
    print('token', tok.status_code)
    if tok.status_code != 200:
        print(tok.text)
        sys.exit(1)
    token = tok.json().get('access_token')
    return token


def call_endpoints(token):
    headers = {'Authorization': f'Bearer {token}'}
    results = []

    # Atletas
    r = requests.get(f"{BASE}/api/atletas", headers=headers)
    results.append(('GET /api/atletas', r.status_code))
    r = requests.post(f"{BASE}/api/atletas", json={'nome':'ST Atleta','esporte':'Corrida','email':'st@example.com'}, headers=headers)
    results.append(('POST /api/atletas', r.status_code))
    if r.status_code in (200,201):
        atleta = r.json()
        atleta_id = atleta.get('id')
    else:
        atleta_id = None

    # Treinos
    r = requests.get(f"{BASE}/api/treinos", headers=headers)
    results.append(('GET /api/treinos', r.status_code))
    treino_payload = {'atleta_id': atleta_id if atleta_id else 1, 'tipo':'Corrida'}
    r = requests.post(f"{BASE}/api/treinos", json=treino_payload, headers=headers)
    results.append(('POST /api/treinos', r.status_code))

    # Avaliacoes
    r = requests.get(f"{BASE}/api/avaliacoes", headers=headers)
    results.append(('GET /api/avaliacoes', r.status_code))
    aval_payload = {'atleta_id': atleta_id if atleta_id else 1, 'forca':8.0}
    r = requests.post(f"{BASE}/api/avaliacoes", json=aval_payload, headers=headers)
    results.append(('POST /api/avaliacoes', r.status_code))

    # Evolucao
    r = requests.get(f"{BASE}/api/evolucao", headers=headers)
    results.append(('GET /api/evolucao', r.status_code))
    evo_payload = {'atleta_id': atleta_id if atleta_id else 1, 'peso':75.0}
    r = requests.post(f"{BASE}/api/evolucao", json=evo_payload, headers=headers)
    results.append(('POST /api/evolucao', r.status_code))

    # Competicoes
    r = requests.get(f"{BASE}/api/competicoes", headers=headers)
    results.append(('GET /api/competicoes', r.status_code))
    comp_payload = {'nome':'Corrida X','evento':'Local','data':'2026-03-10T10:00:00'}
    r = requests.post(f"{BASE}/api/competicoes", json=comp_payload, headers=headers)
    results.append(('POST /api/competicoes', r.status_code))

    # Metas
    r = requests.get(f"{BASE}/api/metas", headers=headers)
    results.append(('GET /api/metas', r.status_code))
    meta_payload = {'atleta_id': atleta_id if atleta_id else 1, 'titulo':'Meta 1'}
    r = requests.post(f"{BASE}/api/metas", json=meta_payload, headers=headers)
    results.append(('POST /api/metas', r.status_code))

    # Notificacoes
    r = requests.get(f"{BASE}/api/notificacoes", headers=headers)
    results.append(('GET /api/notificacoes', r.status_code))
    note_payload = {'atleta_id': atleta_id if atleta_id else 1, 'titulo':'Oi','mensagem':'Teste'}
    r = requests.post(f"{BASE}/api/notificacoes", json=note_payload, headers=headers)
    results.append(('POST /api/notificacoes', r.status_code))

    # Users (admin-only)
    r = requests.get(f"{BASE}/api/users", headers=headers)
    results.append(('GET /api/users', r.status_code))

    # Vincular
    r = requests.post(f"{BASE}/api/atletas/vincular", json={'email':'st@example.com'}, headers=headers)
    results.append(('POST /api/atletas/vincular', r.status_code))

    for name, code in results:
        print(name, code)

    return results


if __name__ == '__main__':
    token = register_and_login()
    call_endpoints(token)
