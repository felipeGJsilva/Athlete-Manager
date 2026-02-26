<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat round dense icon="menu" @click="toggleDrawer" aria-label="menu" />
        <q-toolbar-title>Athlete Manager</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="drawer" show-if-above bordered>
      <q-list>
        <template v-if="isLogged">
          <q-item clickable v-ripple to="/">
            <q-item-section>Atletas</q-item-section>
          </q-item>
          <q-item clickable v-ripple to="/treinos">
            <q-item-section>Treinos</q-item-section>
          </q-item>
          <q-item clickable v-ripple to="/competicoes">
            <q-item-section>Competições</q-item-section>
          </q-item>
          <q-item clickable v-ripple to="/evolucao">
            <q-item-section>Evolução</q-item-section>
          </q-item>
          <q-item clickable v-ripple to="/metas">
            <q-item-section>Metas</q-item-section>
          </q-item>
          <q-item clickable v-ripple to="/avaliacoes">
            <q-item-section>Avaliações</q-item-section>
          </q-item>
          <q-item clickable v-ripple to="/notificacoes">
            <q-item-section>Notificações</q-item-section>
          </q-item>
          <q-separator />
          <q-item clickable v-ripple to="/meu-perfil">
            <q-item-section>Perfil</q-item-section>
          </q-item>
          <q-item clickable v-ripple @click="logout">
            <q-item-section>Sair</q-item-section>
          </q-item>
        </template>
        <template v-else>
          <q-item clickable v-ripple to="/login">
            <q-item-section>Entrar</q-item-section>
          </q-item>
          <q-item clickable v-ripple to="/register">
            <q-item-section>Registrar</q-item-section>
          </q-item>
          <q-item clickable v-ripple to="/sobre">
            <q-item-section>Sobre</q-item-section>
          </q-item>
        </template>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'

export default {
  setup () {
    const drawer = ref(false)
    const isLogged = ref(!!localStorage.getItem('token'))
    const router = useRouter()

    function toggleDrawer () { drawer.value = !drawer.value }
    function logout () {
      localStorage.removeItem('token')
      isLogged.value = false
      router.push('/login')
    }

    function onStorage (e) {
      if (e.key === 'token') isLogged.value = !!e.newValue
    }

    onMounted(() => window.addEventListener('storage', onStorage))
    onBeforeUnmount(() => window.removeEventListener('storage', onStorage))

    return { drawer, toggleDrawer, isLogged, logout }
  }
}
</script>
