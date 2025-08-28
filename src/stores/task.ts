import { defineStore } from 'pinia'
import axios from '@/api/config'
import type { Task } from '@/types/Task'

export const useTaskStore = defineStore('task', {
  state: () => ({
    tasks: [] as Task[],
    currentTask: null as Task | null,
    loading: false,
    error: null as string | null,
  }),

  actions: {
    // 🔹 Récupérer toutes les tâches d’un projet
    async fetchTasks(projectId: number) {
      this.loading = true
      this.error = null
      try {
        const response = await axios.get(`/projects/${projectId}/tasks`)
        this.tasks = response.data.data
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Erreur lors du chargement des tâches'
      } finally {
        this.loading = false
      }
    },

    // 🔹 Récupérer une tâche spécifique
    async fetchTask(taskId: number) {
    this.loading = true
    this.error = null
    try {
      const response = await axios.get(`/tasks/${taskId}`)
      this.currentTask = response.data
      return this.currentTask
    } catch (err: any) {
      this.error = err.response?.data?.message || 'Erreur lors du chargement de la tâche'
      throw err
    } finally {
      this.loading = false
    }
  },

    // Créer une nouvelle tâche
    async createTask(
  projectId: number,
  payload: { title: string; description?: string; status: string; assigned_to?: number | null }
) {
  this.loading = true
  this.error = null
  try {
    const response = await axios.post(`/projects/${projectId}/tasks`, payload)
    const task = response.data.data

    // 🔄 recharge toutes les tâches depuis l’API
    await this.fetchTasks(projectId)

    return task
  } catch (err: any) {
    this.error = err.response?.data?.message || 'Erreur lors de la création de la tâche'
    throw err
  } finally {
    this.loading = false
  }
},



    // Mettre à jour une tâche
   async updateTask(
  taskId: number,
  payload: { title?: string; description?: string; status?: Task['status']; assigned_to?: number | null }
) {
  this.loading = true
  this.error = null
  try {
    const response = await axios.put(`/tasks/${taskId}`, payload)

    const updated: Task = response.data


    this.tasks = (this.tasks || []).map(t => (t.id === taskId ? updated : t))

    if (this.currentTask?.id === taskId) {
      this.currentTask = updated
    }

    return updated
  } catch (err: any) {
    console.error("Erreur updateTask:", err)
    this.error = err.response?.data?.message || 'Erreur lors de la mise à jour'
    return null
  } finally {
    this.loading = false
  }
},




    //  Supprimer une tâche
    async deleteTask(taskId: number) {
      this.loading = true
      this.error = null
      try {
        await axios.delete(`/tasks/${taskId}`)
        this.tasks = (this.tasks || []).filter(t => t.id !== taskId)
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Erreur lors de la suppression de la tâche'
        throw err
      } finally {
        this.loading = false
      }
    },

    //  Mettre à jour uniquement le statut

   async updateStatus(projectId: number, taskId: number, status: Task['status']) {
  try {
    const response = await axios.patch(`/tasks/${taskId}/status`, { status })

    const updated: Task = response.data

    if (Array.isArray(this.tasks)) {
      this.tasks = this.tasks.map(t => (t.id === taskId ? updated : t))
    } else {
      this.tasks = [updated] // fallback si jamais tasks était vide
    }

    return updated
  } catch (err: any) {
    this.error = err.response?.data?.message || 'Erreur lors du changement de statut'
    throw err
  }
}



  },
})
