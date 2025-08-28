import { defineStore } from 'pinia'
import type { Project } from '@/types/project'
import axios from '@/api/config'

export const useProjectStore = defineStore('project', {
  state: () => ({
    projects: [] as Project[],       // tous les projets de l’utilisateur
    currentProject: null as Project | null, // projet sélectionné
    loading: false,
    error: null as string | null,
  }),

  actions: {
    // Récupérer tous les projets
    async fetchProjects() {
      this.loading = true
      this.error = null
      try {
        const response = await axios.get<Project[]>('/projects')
        this.projects = response.data
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Erreur lors du chargement des projets'
      } finally {
        this.loading = false
      }
    },

    // Récupérer un projet spécifique
    async fetchProject(id: number) {
      this.loading = true
      this.error = null
      try {
        const response = await axios.get<Project>(`/projects/${id}`)
        this.currentProject = response.data
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Erreur lors du chargement du projet'
      } finally {
        this.loading = false
      }
    },

    // Créer un projet
    async createProject(payload: { title: string; description?: string }) {
      this.loading = true
      this.error = null
      try {
        const response = await axios.post<Project>('/projects', payload)
        this.projects.push(response.data) // on ajoute à la liste
        return response.data
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Erreur lors de la création du projet'
        throw err
      } finally {
        this.loading = false
      }
    },

    // Mettre à jour un projet
    async updateProject(id: number, payload: { title?: string; description?: string }) {
      this.loading = true
      this.error = null
      try {
        const response = await axios.put<Project>(`/projects/${id}`, payload)
        // mettre à jour localement
        this.projects = this.projects.map(p => (p.id === id ? response.data : p))
        if (this.currentProject?.id === id) {
          this.currentProject = response.data
        }
        return response.data
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Erreur lors de la mise à jour du projet'
        throw err
      } finally {
        this.loading = false
      }
    },

    // Supprimer un projet
    async deleteProject(id: number) {
      this.loading = true
      this.error = null
      try {
        await axios.delete(`/projects/${id}`)
        this.projects = this.projects.filter(p => p.id !== id)
        if (this.currentProject?.id === id) {
          this.currentProject = null
        }
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Erreur lors de la suppression du projet'
        throw err
      } finally {
        this.loading = false
      }
    },
  },
})
