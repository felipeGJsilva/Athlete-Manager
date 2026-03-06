<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-col-gutter-md q-mb-md">
      <div class="col">
        <h1 class="text-h5">Notificações</h1>
      </div>
    </div>

    <q-list>
      <q-item v-for="n in notificacoes" :key="n.id">
        <q-item-section>
          <div class="text-subtitle1">{{ n.titulo }}</div>
          <div class="text-caption">{{ n.mensagem }}</div>
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  setup(){
    const notificacoes = ref([])
    async function fetch(){ try{ const r=await fetch('http://127.0.0.1:8000/api/notificacoes'); if(r.ok) notificacoes.value=await r.json() }catch(e){} }
    onMounted(fetch)
    return { notificacoes }
  }
}
</script>
