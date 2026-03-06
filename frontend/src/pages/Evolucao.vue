<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-col-gutter-md q-mb-md">
      <div class="col">
        <h1 class="text-h5">Evolução</h1>
      </div>
      <div class="col-auto">
        <q-btn label="Adicionar" color="primary" @click="showAdd=true" />
      </div>
    </div>

    <q-list>
      <q-item v-for="e in evolucao" :key="e.id">
        <q-item-section>
          <div class="text-subtitle2">{{ e.titulo }}</div>
          <div class="text-caption">{{ e.data }} — {{ e.obs }}</div>
        </q-item-section>
      </q-item>
    </q-list>

    <q-dialog v-model="showAdd">
      <q-card style="min-width:420px;">
        <q-card-section>
          <div class="text-h6">Nova Observação</div>
        </q-card-section>
        <q-card-section>
          <q-input v-model="form.titulo" label="Título" dense />
          <q-input v-model="form.obs" label="Observação" type="textarea" dense />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" v-close-popup @click="showAdd=false" />
          <q-btn color="primary" label="Salvar" @click="create" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  setup(){
    const evolucao = ref([])
    const showAdd = ref(false)
    const form = ref({ titulo:'', obs:'' })
    async function fetch(){ try{ const r=await fetch('http://127.0.0.1:8000/api/evolucao'); if(r.ok) evolucao.value=await r.json() }catch(e){} }
    async function create(){ try{ const r=await fetch('http://127.0.0.1:8000/api/evolucao',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form.value)}); if(r.ok){ showAdd.value=false; fetch() } }catch(e){} }
    onMounted(fetch)
    return { evolucao, showAdd, form, create }
  }
}
</script>
