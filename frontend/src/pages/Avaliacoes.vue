<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-col-gutter-md q-mb-md">
      <div class="col">
        <h1 class="text-h5">Avaliações</h1>
        <p class="text-subtitle2">Registre e visualize avaliações físicas.</p>
      </div>
      <div class="col-auto">
        <q-btn label="+ Nova Avaliação" color="warning" @click="showAdd = true" />
      </div>
    </div>

    <q-list>
      <q-item v-for="av in avaliacoes" :key="av.id">
        <q-item-section>
          <div class="text-subtitle1">{{ av.atleta_nome || av.atleta_id }}</div>
          <div class="text-caption">IMC: {{ av.imc }} — Força: {{ av.forca }}</div>
        </q-item-section>
      </q-item>
    </q-list>

    <q-dialog v-model="showAdd">
      <q-card style="min-width:420px;">
        <q-card-section>
          <div class="text-h6">Nova Avaliação</div>
        </q-card-section>
        <q-card-section>
          <q-input v-model.number="form.forca" label="Força" type="number" dense />
          <q-input v-model.number="form.resistencia" label="Resistência" type="number" dense />
          <q-input v-model.number="form.velocidade" label="Velocidade" type="number" dense />
          <q-input v-model.number="form.imc" label="IMC" type="number" dense />
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
  setup () {
    const avaliacoes = ref([])
    const showAdd = ref(false)
    const form = ref({ atleta_id: null, forca: null, resistencia: null, velocidade: null, imc: null })

    async function fetch() {
      try { const r = await fetch('http://127.0.0.1:8000/api/avaliacoes'); if (r.ok) avaliacoes.value = await r.json() } catch(e){}
    }
    async function create(){ try{ const r=await fetch('http://127.0.0.1:8000/api/avaliacoes',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form.value)}); if(r.ok){ showAdd.value=false; fetch() } }catch(e){} }
    onMounted(fetch)
    return { avaliacoes, showAdd, form, create }
  }
}
</script>
