<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-col-gutter-md q-mb-md">
      <div class="col">
        <h1 class="text-h5">Treinos</h1>
        <p class="text-subtitle2">Gerencie treinos, cargas e programas de treinamento.</p>
      </div>
      <div class="col-auto">
        <q-btn label="+ Novo Treino" color="warning" @click="showAdd = true" />
      </div>
    </div>

    <div>
      <q-list>
        <q-item v-for="t in treinos" :key="t.id">
          <q-item-section>
            <div class="text-subtitle1">{{ t.tipo }}</div>
            <div class="text-caption">{{ t.descricao }}</div>
          </q-item-section>
          <q-item-section side>
            <div class="text-caption">{{ t.data_treino }}</div>
          </q-item-section>
        </q-item>
      </q-list>
    </div>

    <q-dialog v-model="showAdd">
      <q-card style="min-width: 500px;">
        <q-card-section>
          <div class="text-h6">Novo Treino</div>
        </q-card-section>
        <q-card-section>
          <q-input v-model="form.atleta_id" label="Atleta ID" dense />
          <q-input v-model="form.tipo" label="Tipo de Treino" dense />
          <q-input v-model="form.descricao" type="textarea" label="Descrição" dense />
          <div class="row q-col-gutter-md">
            <div class="col-4"><q-input v-model.number="form.duracao_minutos" label="Duração (min)" type="number" dense /></div>
            <div class="col-4"><q-input v-model="form.data_treino" label="Data do Treino" type="datetime-local" dense /></div>
            <div class="col-4"><q-select v-model="form.intensidade" :options="['baixa','media','alta']" label="Intensidade" dense /></div>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" v-close-popup @click="showAdd = false" />
          <q-btn color="positive" label="Salvar" @click="createTreino" />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  setup () {
    const treinos = ref([])
    const showAdd = ref(false)
    const form = ref({ atleta_id: '', tipo: '', descricao: '', duracao_minutos: null, data_treino: '', intensidade: '' })

    async function fetchTreinos () {
      try {
        const res = await fetch('http://127.0.0.1:8000/api/treinos')
        if (res.ok) treinos.value = await res.json()
      } catch (e) { console.error(e) }
    }

    async function createTreino () {
      try {
        const res = await fetch('http://127.0.0.1:8000/api/treinos', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form.value)
        })
        if (res.ok) { showAdd.value = false; fetchTreinos() }
      } catch (e) { console.error(e) }
    }

    onMounted(fetchTreinos)
    return { treinos, showAdd, form, createTreino }
  }
}
</script>
