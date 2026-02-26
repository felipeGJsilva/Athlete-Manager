<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-col-gutter-md q-mb-md">
      <div class="col">
        <h1 class="text-h5">Competições</h1>
      </div>
      <div class="col-auto">
        <q-btn label="+ Nova Competição" color="warning" @click="showAdd=true" />
      </div>
    </div>

    <q-list>
      <q-item v-for="c in competicoes" :key="c.id">
        <q-item-section>
          <div class="text-subtitle1">{{ c.nome }}</div>
          <div class="text-caption">{{ c.evento }} — {{ c.local }}</div>
        </q-item-section>
      </q-item>
    </q-list>

    <q-dialog v-model="showAdd">
      <q-card style="min-width:420px;">
        <q-card-section>
          <div class="text-h6">Nova Competição</div>
        </q-card-section>
        <q-card-section>
          <q-input v-model="form.nome" label="Nome" dense />
          <q-input v-model="form.evento" label="Evento" dense />
          <q-input v-model="form.local" label="Local" dense />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" v-close-popup @click="showAdd=false" />
          <q-btn color="positive" label="Salvar" @click="create" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  setup(){
    const competicoes = ref([])
    const showAdd = ref(false)
    const form = ref({ nome:'', evento:'', data:'', local:'', descricao:'' })
    async function fetch(){ try{ const r=await fetch('http://127.0.0.1:8000/api/competicoes'); if(r.ok) competicoes.value=await r.json() }catch(e){} }
    async function create(){ try{ const r=await fetch('http://127.0.0.1:8000/api/competicoes',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form.value)}); if(r.ok){ showAdd.value=false; fetch() } }catch(e){} }
    onMounted(fetch)
    return { competicoes, showAdd, form, create }
  }
}
</script>
