import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { guestOnly: true }, // si déjà logué → on redirige vers Dashboard
    },
    {
      path: '/Dashboard',
      name: 'Dashboard',
      component: () => import('../views/DashboardView.vue'),
      meta: { requiresAuth: true }, // protégé
    },
    {
      path: '/projects/:id',
      name: 'project-detail',
      component: () => import('../views/ProjectDetailView.vue'),
      props: true,
      meta: { requiresAuth: true }, // protégé
    },
  ],
})

// Guard global
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token') // ou récupère depuis ton store

  // routes protégées → besoin d'être connecté
  if (to.meta.requiresAuth && !token) {
    return next({ name: 'login' })
  }

  // page login/inscription → si déjà connecté on va au Dashboard
  if (to.meta.guestOnly && token) {
    return next({ name: 'Dashboard' })
  }

  next()
})

export default router
