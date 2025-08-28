import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
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
    {
      path: '/projects/:projectId/tasks/new',
      name: 'task-create',
      component: () => import('@/views/TaskEditor.vue')
    },
    {
      path: '/tasks/:taskId/edit',
      name: 'task-edit',
      component: () => import('@/views/TaskEditor.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
      meta: { requiresAuth: true }, // accessible seulement si connecté
    }



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
  if (to.path === '/' && token) {
    return next({ name: 'Dashboard' })
  }

  if (to.path === '/' && !token) {
    return next({ name: 'login' })
  }

  next()
})

export default router
