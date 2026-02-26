<template>
  <q-page class="q-pa-md">
    <div class="row">
      <div class="col-12 col-md-6">
        <q-card>
          <q-card-section>
            <div class="text-h6">Meu Perfil</div>
            <div class="text-subtitle2">Dados do usuário</div>
          </q-card-section>
          <q-card-section>
            <div><strong>Usuário:</strong> {{ user.username }}</div>
            <div><strong>Email:</strong> {{ user.email }}</div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  setup(){
    const user = ref({ username:'', email:'' })
    async function fetchUser(){ try{ const r = await fetch('http://127.0.0.1:8000/api/users/me',{ headers:{ 'Authorization': 'Bearer '+(localStorage.getItem('token')||'') } }); if(r.ok) user.value = await r.json() }catch(e){} }
    onMounted(fetchUser)
    return { user }
  }
}
</script>
