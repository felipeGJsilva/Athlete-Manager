import { createRouter, createWebHistory } from 'vue-router'
import Atletas from '../pages/Atletas.vue'
import AtletaPerfil from '../pages/AtletaPerfil.vue'
import Treinos from '../pages/Treinos.vue'

const routes = [
  { path: '/', name: 'Atletas', component: Atletas },
  { path: '/', name: 'Atletas', component: Atletas, meta: { requiresAuth: true } },
  { path: '/perfil', name: 'Perfil', component: AtletaPerfil, meta: { requiresAuth: true } },
  { path: '/competicoes', component: () => import('../pages/Competicoes.vue'), meta: { requiresAuth: true } },
  { path: '/evolucao', component: () => import('../pages/Evolucao.vue'), meta: { requiresAuth: true } },
  { path: '/metas', component: () => import('../pages/Metas.vue'), meta: { requiresAuth: true } },
  { path: '/avaliacoes', component: () => import('../pages/Avaliacoes.vue'), meta: { requiresAuth: true } },
  { path: '/notificacoes', component: () => import('../pages/Notificacoes.vue'), meta: { requiresAuth: true } },
  { path: '/treinos', name: 'Treinos', component: Treinos, meta: { requiresAuth: true } },
  { path: '/login', component: () => import('../pages/Login.vue') },
  { path: '/register', component: () => import('../pages/Register.vue') },
  { path: '/sobre', component: () => import('../pages/Sobre.vue') },
  { path: '/meu-perfil', component: () => import('../pages/Perfil.vue'), meta: { requiresAuth: true } },
  { path: '/admin', component: () => import('../pages/Admin.vue'), meta: { requiresAuth: true } }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Global navigation guard: redirect to login if route requires auth and no token present
router.beforeEach((to, from, next) => {
  const requires = to.meta && to.meta.requiresAuth
  const token = localStorage.getItem('token')
  if (requires && !token) {
    next({ path: '/login', query: { redirect: to.fullPath } })
  } else {
    next()
  }
})

export default router
