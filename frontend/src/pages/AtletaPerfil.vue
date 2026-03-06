<template>
  <q-page class="q-pa-md">
    <div class="q-mb-md">
      <q-card class="perfil-header">
        <q-card-section class="row items-center">
          <div class="col-auto">
            <q-avatar size="96px" class="perfil-avatar bg-white text-primary">
              <div class="text-h5">{{ inicial }}</div>
            </q-avatar>
          </div>
          <div class="col">
            <div class="text-h5">{{ atleta.nome || 'Carregando...' }}</div>
            <div class="text-subtitle2">{{ atleta.esporte || 'Atleta' }} {{ atleta.posicao ? '— ' + atleta.posicao : '' }}</div>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-12 col-md-8">
        <q-card>
          <q-card-section>
            <div class="text-h6">Acessar Perfil</div>
          </q-card-section>
          <q-card-section>
            <div class="row q-col-gutter-md">
              <div class="col-6"><strong>Idade:</strong> {{ atleta.idade || '--' }}</div>
              <div class="col-6"><strong>Altura:</strong> {{ atleta.altura || '--' }} m</div>
              <div class="col-6"><strong>Peso:</strong> {{ atleta.peso || '--' }} kg</div>
              <div class="col-6"><strong>Email:</strong> {{ atleta.email || '--' }}</div>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-md-4">
        <q-card>
          <q-card-section>
            <div class="text-h6">Próximo Treino</div>
          </q-card-section>
          <q-card-section class="text-center">
            <div class="text-h6">{{ proximoTreino?.tipo || '--' }}</div>
            <div class="text-caption">{{ proximoTreino?.data_treino || 'Sem treinos agendados' }}</div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <q-card>
      <q-card-section>
        <div class="text-h6">Atividades Recentes</div>
      </q-card-section>
      <q-card-section>
        <div v-if="atividades.length === 0" class="text-caption">Sem atividades</div>
        <div v-for="(it, idx) in atividades" :key="idx" class="timeline-item q-mb-sm">
          <div class="text-subtitle2">{{ it.titulo || it.tipo || 'Atividade' }}</div>
          <div class="text-caption">{{ it.descricao || '' }}</div>
        </div>
      </q-card-section>
    </q-card>

  </q-page>
</template>

<script>
import { ref, onMounted, computed } from 'vue'

export default {
  setup () {
    const atleta = ref({})
    const atividades = ref([])
    const proximoTreino = ref(null)

    const inicial = computed(() => (atleta.value.nome ? atleta.value.nome.charAt(0).toUpperCase() : 'A'))

    async function fetchPerfil () {
      try {
        const res = await fetch('http://127.0.0.1:8000/api/atletas/me')
        if (res.ok) {
          const data = await res.json()
          atleta.value = data
        }
      } catch (e) { console.error(e) }

      try {
        const r2 = await fetch('http://127.0.0.1:8000/api/treinos?atleta_id=' + (atleta.value.id || ''))
        if (r2.ok) {
          const treinos = await r2.json()
          atividades.value = treinos.slice(0,5)
          proximoTreino.value = treinos.find(t => true) || null
        }
      } catch (e) { /* ignore */ }
    }

    onMounted(fetchPerfil)
    return { atleta, atividades, proximoTreino, inicial }
  }
}
</script>

<style scoped>
.perfil-header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px; border-radius: 8px; }
.perfil-avatar { box-shadow: 0 5px 15px rgba(0,0,0,0.2); }
.timeline-item { background: white; padding: 8px; border-left: 4px solid #667eea; border-radius: 6px; }
</style>
