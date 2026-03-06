<template>
  <q-page class="q-pa-md flex flex-center">
    <q-card style="max-width:520px;width:100%">
      <q-card-section>
        <div class="text-h6">Registrar</div>
      </q-card-section>
      <q-card-section>
        <q-form @submit.prevent="register">
          <q-input v-model="form.username" label="Usuário" dense />
          <q-input v-model="form.email" label="E-mail" dense />
          <q-input v-model="form.password" label="Senha" type="password" dense />
          <div class="row items-center q-mt-md">
            <q-btn label="Criar conta" type="submit" color="primary" />
            <q-btn flat label="Voltar" class="q-ml-sm" @click="$router.push('/login')" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { ref } from 'vue'

export default {
  setup(){
    const form = ref({ username:'', email:'', password:'' })
    async function register(){
      try{
        const r = await fetch('http://127.0.0.1:8000/auth/register',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form.value) })
        if(r.ok){ $router.push('/login') }
      }catch(e){ console.error(e) }
    }
    return { form, register }
  }
}
</script>
