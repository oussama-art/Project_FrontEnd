<script setup lang="ts">
import type { Task } from '@/types/Task'
import type { User } from '@/types/User'

const props = defineProps<{
  task: Task
  users?: User[]          // liste optionnelle d’utilisateurs (pour affichage assigné)
}>()

const emit = defineEmits<{
  (e: 'edit', task: Task): void
  (e: 'delete', task: Task): void
  (e: 'status', task: Task, status: Task['status']): void
}>()

const statusLabels: Record<Task['status'], string> = {
  todo: 'À faire',
  in_progress: 'En cours',
  done: 'Terminé'
}
</script>

<template>
  <div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow transition">
    <!-- Header -->
    <div class="flex justify-between items-start">
      <h3 class="text-lg font-semibold text-gray-900">{{ task.title }}</h3>
      <span
        :class="[
          'text-xs px-2 py-1 rounded-full font-medium',
          task.status === 'done' ? 'bg-green-100 text-green-700'
          : task.status === 'in_progress' ? 'bg-yellow-100 text-yellow-700'
          : 'bg-gray-100 text-gray-700'
        ]"
      >
        {{ statusLabels[task.status] }}
      </span>
    </div>

    <!-- Description -->
    <p v-if="task.description" class="mt-1 text-sm text-gray-600">
      {{ task.description }}
    </p>

    <!-- Assigné -->
    <div v-if="task.assigned_to" class="mt-2 text-sm text-gray-500 flex items-center gap-1">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67
        0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
      </svg>
      {{ task.assigned_to?.name }}
    </div>

    <!-- Actions -->
    <div class="mt-4 flex gap-2">
      <button
        @click="emit('edit', task)"
        class="px-3 py-1 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700"
      >
        Éditer
      </button>
      <button
        @click="emit('delete', task)"
        class="px-3 py-1 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700"
      >
        Supprimer
      </button>

      <!-- Changer statut -->
      <div class="ml-auto flex gap-1">
        <button
          v-for="s in ['todo','in_progress','done']"
          :key="s"
          @click="emit('status', task, s as Task['status'])"
          :class="[
            'px-2 py-1 text-xs rounded-lg border',
            task.status === s ? 'bg-emerald-600 text-white' : 'bg-white hover:bg-gray-100'
          ]"
        >
          {{ statusLabels[s as Task['status']] }}
        </button>
      </div>
    </div>
  </div>
</template>
