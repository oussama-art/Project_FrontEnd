import { defineStore } from 'pinia'
import type { Project } from '@/types/project'
import axios from '@/api/config'

export const useProjectStore = defineStore('project', {
  state: () => ({
    projects: [] as Project[],
    currentProject: null as Project | null,
    loading: false,
    error: null as string | null,
    meta: null as any,
    links: null as any,
  }),

  actions: {
    // Récupérer tous les projets
    async fetchProjects(page = 1) {
      this.loading = true
      this.error = null
      try {
        const response = await axios.get(`/projects?page=${page}`)
        this.projects = response.data.data
        this.meta = response.data.meta
        this.links = response.data.links
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
        const response = await axios.get(`/projects/${id}`)
        this.currentProject = response.data   // ✅ prendre le vrai projet
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
        await axios.post('/projects', payload)
        // 🔥 Après création, recharge la 1ère page (ou la page courante si tu veux)
        await this.fetchProjects(this.meta?.current_page || 1)
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
        const response = await axios.put(`/projects/${id}`, payload)
        const updated: Project = response.data.data // ✅ récupérer le vrai projet
        // mettre à jour localement
        this.projects = this.projects.map(p => (p.id === id ? updated : p))
        if (this.currentProject?.id === id) {
          this.currentProject = updated
        }
        return updated
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
