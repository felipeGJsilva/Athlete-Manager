<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-col-gutter-md q-mb-md">
      <div class="col">
        <h1 class="text-h5">Atletas</h1>
        <p class="text-subtitle2">Gerencie atletas cadastrados, informações físicas e evolução.</p>
      </div>
      <div class="col-auto">
        <q-btn label="+ Novo Atleta" color="warning" class="q-mr-sm" @click="showAdd = true" />
        <q-btn outline label="Vincular Atleta" color="warning" @click="showVincular = true" />
      </div>
    </div>

    <div class="row q-col-gutter-md">
      <div class="col-12">
        <q-list>
          <q-item v-for="a in atletas" :key="a.id" clickable v-ripple @click="openAtleta(a)">
            <q-item-section avatar>
              <q-avatar square size="56px">
                <img :src="a.foto || '/static/img/logo.svg'" alt="foto" />
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <div class="text-subtitle1">{{ a.nome }}</div>
              <div class="text-caption">{{ a.esporte }} — {{ a.posicao || '' }}</div>
            </q-item-section>
            <q-item-section side>
              <q-btn flat round dense icon="edit" @click.stop="editAtleta(a)" />
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>

    <!-- ADD DIALOG -->
    <q-dialog v-model="showAdd">
      <q-card style="min-width: 350px;">
        <q-card-section>
          <div class="text-h6">Novo Atleta</div>
        </q-card-section>
        <q-card-section>
          <q-form @submit.prevent="createAtleta">
            <q-input v-model="newAtleta.nome" label="Nome" dense required />
            <q-input v-model="newAtleta.email" label="Email" dense type="email" />
            <q-input v-model="newAtleta.esporte" label="Esporte" dense />
            <q-input v-model="newAtleta.posicao" label="Posição / Prova" dense />
            <div class="row q-col-gutter-md">
              <div class="col">
                <q-input v-model.number="newAtleta.idade" label="Idade" type="number" dense />
              </div>
              <div class="col">
                <q-input v-model.number="newAtleta.altura" label="Altura (m)" type="number" dense />
              </div>
            </div>
            <q-input v-model.number="newAtleta.peso" label="Peso (kg)" type="number" dense />
            <q-uploader ref="uploader" label="Foto" accept="image/*" :hide-upload-btn="true" />
          </q-form>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" v-close-popup @click="showAdd = false" />
          <q-btn color="positive" label="Salvar" @click="createAtleta" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- VINCULAR DIALOG -->
    <q-dialog v-model="showVincular">
      <q-card style="min-width: 300px;">
        <q-card-section>
          <div class="text-h6">Vincular Atleta</div>
          <p class="text-caption">Digite o email do atleta para vinculá-lo à sua conta.</p>
          <q-input v-model="vincularEmail" label="Email do Atleta" dense type="email" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" v-close-popup @click="showVincular = false" />
          <q-btn color="positive" label="Vincular" @click="vincularAtleta" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- EDIT DIALOG -->
    <q-dialog v-model="showEdit">
      <q-card style="min-width: 350px;">
        <q-card-section>
          <div class="text-h6">Editar Atleta</div>
        </q-card-section>
        <q-card-section>
          <q-input v-model="editModel.nome" label="Nome" dense />
          <q-input v-model="editModel.email" label="Email" dense type="email" />
          <q-input v-model="editModel.esporte" label="Esporte" dense />
          <q-input v-model="editModel.posicao" label="Posição / Prova" dense />
          <div class="row q-col-gutter-md">
            <div class="col">
              <q-input v-model.number="editModel.idade" label="Idade" type="number" dense />
            </div>
            <div class="col">
              <q-input v-model.number="editModel.altura" label="Altura (m)" type="number" dense />
            </div>
          </div>
          <q-input v-model.number="editModel.peso" label="Peso (kg)" type="number" dense />
          <q-uploader ref="uploaderEdit" label="Trocar foto" accept="image/*" :hide-upload-btn="true" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" v-close-popup @click="showEdit = false" />
          <q-btn color="primary" label="Salvar Alterações" @click="saveEdit" />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  setup () {
    const atletas = ref([])
    const newAtleta = ref({ nome: '', esporte: '', email: '', posicao: '', idade: null, altura: null, peso: null })
    const showAdd = ref(false)
    const showVincular = ref(false)
    const showEdit = ref(false)
    const editModel = ref({})
    const vincularEmail = ref('')

    async function fetchAtletas () {
      try {
        const res = await fetch('http://127.0.0.1:8000/api/atletas')
        if (res.ok) atletas.value = await res.json()
      } catch (e) { console.error(e) }
    }

    async function createAtleta () {
      try {
        const payload = { ...newAtleta.value }
        const res = await fetch('http://127.0.0.1:8000/api/atletas', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
        if (res.ok) {
          newAtleta.value = { nome: '', esporte: '', email: '', posicao: '', idade: null, altura: null, peso: null }
          showAdd.value = false
          fetchAtletas()
        } else {
          console.error('Erro ao criar')
        }
      } catch (e) { console.error(e) }
    }

    function openAtleta (a) {
      // navegar para perfil (placeholder)
      // router.push({ name: 'AtletaDetail', params: { id: a.id } })
      console.log('open', a.id)
    }

    function editAtleta (a) {
      editModel.value = { ...a }
      showEdit.value = true
    }

    async function saveEdit () {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/atletas/${editModel.value.id}`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editModel.value)
        })
        if (res.ok) {
          showEdit.value = false
          fetchAtletas()
        } else console.error('Erro ao salvar')
      } catch (e) { console.error(e) }
    }

    async function vincularAtleta () {
      try {
        const res = await fetch('http://127.0.0.1:8000/api/atletas/vincular', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: vincularEmail.value })
        })
        if (res.ok) {
          showVincular.value = false
          vincularEmail.value = ''
          fetchAtletas()
        } else console.error('Erro ao vincular')
      } catch (e) { console.error(e) }
    }

    onMounted(fetchAtletas)
    return { atletas, newAtleta, createAtleta, showAdd, showVincular, showEdit, editModel, vincularEmail, openAtleta, editAtleta, saveEdit, vincularAtleta }
  }
}
</script>
