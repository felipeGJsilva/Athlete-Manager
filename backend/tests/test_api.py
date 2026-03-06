import pytest
import requests

BASE = 'http://127.0.0.1:8000'


def test_register_and_login_and_create_atleta_live():
    # register (may already exist)
    r = requests.post(f'{BASE}/auth/register', json={
        'username': 'test_live',
        'email': 'test_live@example.com',
        'password': 'secret12',
        'role': 'treinador'
    })
    assert r.status_code in (200, 201, 400)

    # token
    r = requests.post(f'{BASE}/auth/token', data={'username': 'test_live', 'password': 'secret12'})
    assert r.status_code == 200
    token = r.json().get('access_token')
    assert token

    headers = {'Authorization': f'Bearer {token}'}

    # create atleta
    r = requests.post(f'{BASE}/api/atletas', json={'nome': 'Atleta Live', 'esporte': 'Corrida', 'email': 'al@example.com'}, headers=headers)
    assert r.status_code in (200, 201)
    data = r.json()
    assert data.get('nome') in ('Atleta Live', 'Atleta Live')
