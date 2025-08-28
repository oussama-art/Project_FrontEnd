<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProjectStore } from '@/stores/project'
import TaskCard from '@/components/TaskCard.vue'
import { useToast } from 'vue-toastification'
import type { Task } from '@/types/Task'
import { useTaskStore } from '@/stores/task'

const projectStore = useProjectStore()
const taskStore = useTaskStore()
const toast = useToast()

const route = useRoute()
const router = useRouter()
const projectId = Number(route.params.id)

onMounted(async () => {
  await projectStore.fetchProject(projectId)
  await taskStore.fetchTasks(projectId)
})

// Navigation vers TaskEditor
function openCreateTask() {
  router.push(`/projects/${projectId}/tasks/new`)
}

function openEditTask(task: Task) {
  router.push({ name: 'task-edit', params: { taskId: task.id } })
}




// Supprimer une tâche via API + synchro des stores
  async function deleteTask(task: Task) {
    try {
      await taskStore.deleteTask(task.id)
      if (projectStore.currentProject) {
        projectStore.currentProject.tasks = projectStore.currentProject.tasks.filter(
          t => t.id !== task.id
        )
      }

      toast.success(`Tâche "${task.title}" supprimée`)
    } catch (err) {
      console.error(err)
      toast.error("Erreur lors de la suppression")
    }
  }

//  Changer le statut via API + synchro
async function changeStatus(task: Task, status: Task['status']) {
  try {
    const updated = await taskStore.updateStatus(projectId, task.id, status)

    if (projectStore.currentProject) {
      projectStore.currentProject.tasks = projectStore.currentProject.tasks.map(t =>
        t.id === task.id ? updated : t
      )
    }

    toast.success(`Statut changé en ${status}`)
  } catch (err) {
    console.error(err)
    toast.error("Erreur lors du changement de statut")
  }
}

</script>

<template>
  <div class="px-6 py-6 max-w-4xl mx-auto">
    <h2 class="text-2xl font-semibold mb-4">Détail du projet</h2>
    <p v-if="projectStore.loading || taskStore.loading">Chargement...</p>
    <p v-else-if="projectStore.error" class="text-red-600">{{ projectStore.error }}</p>
    <p v-else-if="taskStore.error" class="text-red-600">{{ taskStore.error }}</p>

    <div v-else-if="projectStore.currentProject" class="bg-white p-6 rounded-xl shadow">
      <h3 class="text-xl font-semibold text-gray-900">
        {{ projectStore.currentProject.title }}
      </h3>
      <p class="text-gray-600 mt-1">{{ projectStore.currentProject.description }}</p>

      <!-- Bouton pour créer une tâche -->
      <div class="mt-4">
        <button
          @click="openCreateTask"
          class="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
        >
          + Nouvelle tâche
        </button>
      </div>

      <h4 class="mt-6 text-lg font-medium">Tâches :</h4>

      <!-- Si aucune tâche -->
      <p v-if="!projectStore.currentProject.tasks || projectStore.currentProject.tasks.length === 0"
         class="text-gray-500 mt-2">
        Ce projet n’a pas encore de tâches.
      </p>

      <!-- Liste des tâches -->
      <div v-else class="mt-2 space-y-3">
        <TaskCard
          v-for="task in projectStore.currentProject.tasks"
          :key="task.id"
          :task="task"
          @edit="openEditTask(task)"
          @delete="deleteTask(task)"
          @status="changeStatus"
        />
      </div>
    </div>
  </div>
</template>
