import { defineStore } from 'pinia'
import api from '@/api/config'
import router from '@/router'
import type { User } from '@/types/User'

interface AuthState {
  user: User | null
  token: string
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: localStorage.getItem('token') || ''
  }),

  getters: {
    isAuthenticated: (state): boolean => !!state.token,
    getUser: (state): User | null => state.user
  },

  actions: {
    async login(email: string, password: string) {
      const response = await api.post('/login', { email, password })

      this.token = response.data.token
      localStorage.setItem('token', this.token)

      api.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
      this.user = response.data.user

      router.push('/Dashboard')
    },

    async register(name: string, email: string, password: string, passwordConfirmation: string) {
      const response = await api.post('/register', {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation
      })

      // Set authentication state after successful registration
      this.token = response.data.token
      localStorage.setItem('token', this.token)

      api.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
      this.user = response.data.user

      // Redirect to dashboard after successful registration
      router.push('/Dashboard')
    },

    logout() {
      this.token = ''
      this.user = null
      localStorage.removeItem('token')
      delete api.defaults.headers.common['Authorization']
      router.push('/login')
    }
  }
})
