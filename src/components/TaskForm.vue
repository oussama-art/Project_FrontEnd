<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Task } from '@/types/Task'
import type { User } from '@/types/User'

const props = defineProps<{
  task?: Task | null
  users: User[]
}>()

const emit = defineEmits<{
  (e: 'submit', payload: { title: string; description?: string; status: Task['status']; assigned_to?: number | null }): void
  (e: 'cancel'): void
}>()

const form = ref({
  title: '',
  description: '',
  status: 'todo' as Task['status'],
  assigned_to: null as number | null
})

// ⚡ log quand les props changent
watch(
  () => props.task,
  (newTask) => {
    console.log("📥 props.task reçu dans TaskForm :", newTask)
    if (newTask) {
      form.value = {
        title: newTask.title || '',
        description: newTask.description || '',
        status: newTask.status || 'todo',
        assigned_to: newTask.assigned_to?.id || null
      }
      console.log("📝 form mis à jour :", form.value)
    }
  },
  { immediate: true }
)

function handleSubmit() {
  if (!form.value.title.trim()) return alert('Le titre est obligatoire')
  console.log("🚀 Données envoyées :", form.value)
  emit('submit', { ...form.value })
}
</script>


<template>
  <div class="bg-white rounded-xl shadow p-6 w-full max-w-lg">
    <h3 class="text-lg font-semibold mb-4">
      {{ props.task ? 'Modifier la tâche' : 'Créer une tâche' }}
    </h3>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Titre -->
      <div>
        <label class="block text-sm font-medium text-gray-700">Titre *</label>
        <input
          v-model="form.title"
          type="text"
          required
          class="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring focus:ring-emerald-200"
        />
      </div>

      <!-- Description -->
      <div>
        <label class="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          v-model="form.description"
          rows="3"
          class="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring focus:ring-emerald-200"
        ></textarea>
      </div>

      <!-- Statut -->
      <div>
        <label class="block text-sm font-medium text-gray-700">Statut</label>
        <select
          v-model="form.status"
          class="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring focus:ring-emerald-200"
        >
          <option value="todo">À faire</option>
          <option value="in_progress">En cours</option>
          <option value="done">Terminé</option>
        </select>
      </div>

      <!-- Assigné à -->
      <div>
        <label class="block text-sm font-medium text-gray-700">Assigné à</label>
        <select
          v-model="form.assigned_to"
          class="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring focus:ring-emerald-200"
        >
          <option :value="null">Non assigné</option>
          <option v-for="u in users" :key="u.id" :value="u.id">
            {{ u.name }}
          </option>
        </select>
      </div>

      <!-- Boutons -->
      <div class="flex justify-end gap-3 pt-4">
        <button
          type="button"
          @click="emit('cancel')"
          class="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300"
        >
          Annuler
        </button>
        <button
          type="submit"
          class="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
        >
          {{ props.task ? 'Mettre à jour' : 'Créer' }}
        </button>
      </div>
    </form>
  </div>
</template>
