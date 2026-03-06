const API = 'http://127.0.0.1:8000/api'

async function listAtletas(){
  const res = await fetch(API + '/atletas')
  const el = document.getElementById('lista')
  if(!res.ok){ el.innerHTML = '<div class="card">Erro ao buscar atletas</div>'; return }
  const data = await res.json()
  el.innerHTML = data.map(a=>`<div class="card"><strong>${a.nome}</strong> — ${a.esporte}</div>`).join('')
}

document.getElementById('refresh').addEventListener('click', listAtletas)
document.getElementById('criar').addEventListener('click', async ()=>{
  const nome = document.getElementById('nome').value
  const esporte = document.getElementById('esporte').value
  const res = await fetch(API + '/atletas', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({nome,esporte})})
  if(res.ok){ alert('Atleta criado'); listAtletas() } else { alert('Erro ao criar atleta') }
})

listAtletas()
