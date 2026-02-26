<template>
  <q-page class="q-pa-md flex flex-center">
    <q-card style="max-width:420px;width:100%">
      <q-card-section>
        <div class="text-h6">Entrar</div>
      </q-card-section>
      <q-card-section>
        <q-form @submit.prevent="login">
          <q-input v-model="form.username" label="Usuário" dense autofocus />
          <q-input v-model="form.password" label="Senha" type="password" dense />
          <div class="row items-center q-mt-md">
            <q-btn label="Entrar" type="submit" color="primary" />
            <q-btn flat label="Registrar" class="q-ml-sm" @click="$router.push('/register')" />
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
    const form = ref({ username:'', password:'' })
    async function login(){
      try{
        const body = new URLSearchParams()
        body.append('grant_type','password')
        body.append('username', form.value.username)
        body.append('password', form.value.password)
        const r = await fetch('/auth/token',{ method:'POST', headers:{'Content-Type':'application/x-www-form-urlencoded'}, body: body.toString() })
        if (r.ok) {
          const data = await r.json()
          localStorage.setItem('token', data.access_token || data.token || '')
          // redirect to previous page if present
          const qs = new URLSearchParams(window.location.search)
          const redirect = qs.get('redirect') || '/'
          window.location.href = redirect
        } else {
          let msg = 'Falha no login'
          try { const j = await r.json(); msg = j.detail || j.error || msg } catch(e){}
          alert(msg)
        }
      }catch(e){ console.error(e) }
    }
    return { form, login }
  }
}
</script>
