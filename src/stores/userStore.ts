import { defineStore } from 'pinia'
import axios from '@/api/config'
import type { User } from '@/types/User'

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [] as User[],
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchUsers() {
      this.loading = true
      this.error = null
      try {
        const response = await axios.get('/users')
        this.users = response.data
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Erreur lors du chargement des utilisateurs'
      } finally {
        this.loading = false
      }
    }
  }
})
