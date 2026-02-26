<template>
  <q-page class="q-pa-md">
    <div>
      <h1 class="text-h6">Admin</h1>
      <q-table :rows="users" :columns="cols" row-key="id" />
    </div>
  </q-page>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  setup(){
    const users = ref([])
    const cols = [{ name:'id', label:'ID', field:'id' },{ name:'username', label:'Usuário', field:'username' },{ name:'email', label:'Email', field:'email' }]
    async function fetchUsers(){ try{ const r = await fetch('http://127.0.0.1:8000/api/users',{ headers:{ 'Authorization': 'Bearer '+(localStorage.getItem('token')||'') } }); if(r.ok) users.value = await r.json() }catch(e){} }
    onMounted(fetchUsers)
    return { users, cols }
  }
}
</script>
