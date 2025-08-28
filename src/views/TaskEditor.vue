<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import TaskForm from '@/components/TaskForm.vue'
import { useTaskStore } from '@/stores/task'
import { useUserStore } from '@/stores/userStore'
import type { Task } from '@/types/Task'
import { useToast } from 'vue-toastification'

const taskStore = useTaskStore()
const userStore = useUserStore()
const toast = useToast()

const route = useRoute()
const router = useRouter()

// ⚠️ plus de projectId ici
const taskId = route.params.taskId ? Number(route.params.taskId) : null
const projectId = route.params.projectId ? Number(route.params.projectId) : null


const loading = ref(true)
const editingTask = ref<Task | null>(null)

onMounted(async () => {
  await userStore.fetchUsers()

  if (taskId) {
    editingTask.value = await taskStore.fetchTask(taskId)
    console.log("📝 Tâche récupérée :", editingTask.value)
  }

  loading.value = false
})

async function handleSubmit(payload: { title: string; description?: string; status: Task['status']; assigned_to?: number | null }) {
  try {
    let redirectProjectId: number | null = null

    if (taskId) {
      const updated = await taskStore.updateTask(taskId, payload)
      if (updated) {
        toast.success("Tâche mise à jour avec succès")
        redirectProjectId = updated.project_id
      }
    } else if (projectId) {
      const created = await taskStore.createTask(projectId, payload)
      if (created) {
        toast.success("Tâche créée avec succès")
        redirectProjectId = created.project_id
      }
    } else {
      toast.error("Impossible de créer une tâche sans projectId")
      return
    }

    // ✅ Toujours rediriger avec le vrai project_id
    if (redirectProjectId) {
      router.push(`/projects/${redirectProjectId}`)
    } else {
      router.push('/projects')
    }
  } catch (err) {
    console.error(err)
    toast.error("Erreur lors de l'enregistrement de la tâche")
  }
}




function handleCancel() {
  if (editingTask.value?.project_id) {
    router.push(`/projects/${editingTask.value.project_id}`)
  } else {
    router.push('/projects')
  }
}
</script>


<template>
  <div class="px-6 py-6 max-w-3xl mx-auto">
    <h2 class="text-2xl font-semibold mb-6">
      {{ taskId ? 'Modifier la tâche' : 'Créer une tâche' }}
    </h2>

    <p v-if="loading">Chargement...</p>

    <TaskForm
      v-else
      :task="editingTask"
      :users="userStore.users"
      @submit="handleSubmit"
      @cancel="handleCancel"
    />
  </div>
</template>
