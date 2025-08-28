<script setup lang="ts">
import { ref, onMounted,computed  } from 'vue'
import { useProjectStore } from '@/stores/project'
import { useAuthStore } from '@/stores/auth'
import ProjectCard from '@/components/ProjectCard.vue'

const projectStore = useProjectStore()
const authStore = useAuthStore()

// Formulaire projet
const showForm = ref(false)
const editingProject = ref<any | null>(null)

const formData = ref({
  title: '',
  description: ''
})

// Charger les projets
onMounted(() => {
  projectStore.fetchProjects()
})

// Ouvrir formulaire création
function openCreateForm() {
  editingProject.value = null
  formData.value = { title: '', description: '' }
  showForm.value = true
}

// Ouvrir formulaire édition
function openEditForm(project: any) {
  editingProject.value = project
  formData.value = { title: project.title, description: project.description || '' }
  showForm.value = true
}

// Soumettre formulaire
async function saveProject() {
  if (editingProject.value) {
    await projectStore.updateProject(editingProject.value.id, formData.value)
  } else {
    await projectStore.createProject(formData.value)
  }
  showForm.value = false
}

const hasProjects = computed(() => (projectStore.projects?.length ?? 0) > 0)
</script>

<template>
  <div class="px-6 py-6 max-w-7xl mx-auto">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-semibold">Mes projets</h2>
      <div class="flex gap-3">
        <button
          @click="openCreateForm"
          class="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-white font-medium shadow hover:bg-emerald-700"
        >
          + Nouveau Projet
        </button>
        <button
          @click="authStore.logout"
          class="inline-flex items-center gap-2 rounded-xl bg-gray-200 px-4 py-2 text-gray-700 font-medium shadow hover:bg-gray-300"
        >
          Déconnexion
        </button>
      </div>
    </div>

    <!-- Liste projets -->
    <!-- Liste projets -->
<p v-if="projectStore.loading">Chargement...</p>
<p v-else-if="projectStore.error" class="text-red-600">{{ projectStore.error }}</p>

<!-- Etat vide -->
<div v-else-if="!hasProjects" class="text-center py-16 border rounded-2xl bg-gray-50">
  <p class="text-lg text-gray-600 mb-4">Aucun projet pour le moment.</p>
  <button
    @click="openCreateForm"
    class="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-white font-medium shadow hover:bg-emerald-700"
  >
    + Créer mon premier projet
  </button>
</div>

<!-- Grille des projets -->
<div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
  <ProjectCard
    v-for="project in projectStore.projects"
    :key="project.id"
    :project="project"
    @edit="openEditForm(project)"
    @delete="projectStore.deleteProject(project.id)"
  />
</div>

<!-- Pagination : seulement si projets ET > 1 page -->
<div
  v-if="hasProjects && projectStore.meta && projectStore.meta.last_page > 1"
  class="flex justify-center items-center gap-2 mt-6"
>
  <button
    :disabled="!projectStore.links?.prev"
    @click="projectStore.fetchProjects(projectStore.meta.current_page - 1)"
    class="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
  >
    Précédent
  </button>

  <span class="px-3 py-1">
    Page {{ projectStore.meta.current_page }} / {{ projectStore.meta.last_page }}
  </span>

  <button
    :disabled="!projectStore.links?.next"
    @click="projectStore.fetchProjects(projectStore.meta.current_page + 1)"
    class="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
  >
    Suivant
  </button>
</div>


    <!-- Formulaire -->
    <div v-if="showForm" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div class="bg-white rounded-2xl shadow-lg p-6 w-full max-w-lg">
        <h3 class="text-xl font-semibold mb-4">
          {{ editingProject ? 'Modifier le projet' : 'Créer un projet' }}
        </h3>

        <form @submit.prevent="saveProject" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Titre</label>
            <input
              v-model="formData.title"
              type="text"
              required
              class="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring focus:ring-emerald-200"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              v-model="formData.description"
              rows="3"
              class="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring focus:ring-emerald-200"
            ></textarea>
          </div>

          <div class="flex justify-end gap-3 pt-4">
            <button
              type="button"
              @click="showForm = false"
              class="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300"
            >
              Annuler
            </button>
            <button
              type="submit"
              class="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
            >
              {{ editingProject ? 'Mettre à jour' : 'Créer' }}
            </button>
          </div>
        </form>
      </div>
    </div>
    <div v-if="projectStore.meta" class="flex justify-center items-center gap-2 mt-6">
      <button
        :disabled="!projectStore.links.prev"
        @click="projectStore.fetchProjects(projectStore.meta.current_page - 1)"
        class="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
      >
        Précédent
      </button>

      <span class="px-3 py-1">
        Page {{ projectStore.meta.current_page }} / {{ projectStore.meta.last_page }}
      </span>

      <button
        :disabled="!projectStore.links.next"
        @click="projectStore.fetchProjects(projectStore.meta.current_page + 1)"
        class="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
      >
        Suivant
      </button>
    </div>
  </div>
</template>
