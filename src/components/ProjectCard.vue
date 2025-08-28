<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import type { Project } from '@/types/project'

const props = defineProps<{
  project: Project
}>()

// Nombre total de tâches et tâches terminées
const tasksTotal = computed(() => props.project.tasks?.length ?? 0)

const tasksDone = computed(() =>
  props.project.tasks?.filter(t => t.status === 'done').length ?? 0
)

const progressPercent = computed(() =>
  tasksTotal.value > 0 ? Math.round((tasksDone.value / tasksTotal.value) * 100) : 0
)


// Statut du projet
const status = computed(() =>
  tasksTotal.value > 0 && tasksDone.value === tasksTotal.value ? 'Terminé' : 'Actif'
)
</script>

<template>
  <div class="rounded-2xl border border-emerald-100 bg-emerald-50 p-5 hover:shadow transition">
    <!-- titre -->
    <h3 class="text-lg font-semibold text-gray-900">{{ project.title }}</h3>
    <p class="text-sm text-gray-600 mt-1 line-clamp-2">{{ project.description || '—' }}</p>

    <!-- progression -->
    <div class="mt-4">
      <div class="flex justify-between text-sm text-gray-700">
        <span>Progression</span>
        <span>{{ tasksDone }}/{{ tasksTotal }} tâches</span>
      </div>
      <div class="mt-2 h-2.5 w-full rounded-full bg-white border border-emerald-100">
        <div class="h-2.5 rounded-full bg-emerald-600" :style="{ width: progressPercent + '%' }" />
      </div>
    </div>

    <!-- boutons -->
    <div class="mt-4 flex gap-3">
      <RouterLink
        :to="`/projects/${project.id}`"
        class="px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-800 hover:bg-gray-50"
      >
        Voir
      </RouterLink>
      <button
        @click="$emit('edit')"
        class="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
      >
        Modifier
      </button>

      <button
        @click="$emit('delete')"
        class="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
      >
        Supprimer
      </button>
    </div>
  </div>
</template>


<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
