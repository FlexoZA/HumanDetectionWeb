import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth/authStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/auth/LoginView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/auth/RegisterView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: () => import('@/views/auth/ForgotPassView.vue'),
      meta: { requiresAuth: false },
    },
  ],
})

// Global navigation guard for authentication
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // Initialize auth store if not already done
  if (authStore.loading) {
    await authStore.initialize()
  }

  const requiresAuth = to.meta.requiresAuth !== false // Default to true unless explicitly set to false
  const isAuthenticated = !!authStore.user

  console.log('DEBUG::Router', 'Navigation guard', {
    to: to.name,
    requiresAuth,
    isAuthenticated,
    user: authStore.user?.email || 'none',
  })

  if (requiresAuth && !isAuthenticated) {
    // Redirect to login if route requires auth and user is not authenticated
    console.log('DEBUG::Router', 'Redirecting to login - not authenticated')
    next({ name: 'login' })
  } else if (
    !requiresAuth &&
    isAuthenticated &&
    ['login', 'register', 'forgot-password'].includes(to.name)
  ) {
    // Redirect to home if user is authenticated and trying to access auth pages
    console.log('DEBUG::Router', 'Redirecting to home - already authenticated')
    next({ name: 'home' })
  } else {
    // Allow navigation
    next()
  }
})

export default router
