<script setup lang="ts">
import { onMounted } from 'vue'
import { useProjectStore } from '@/stores/project'

const projectStore = useProjectStore()

onMounted(() => {
  projectStore.fetchProjects()
})
</script>

<template>
  <div>
    <h2>Mes projets</h2>
    <p v-if="projectStore.loading">Chargement...</p>
    <p v-if="projectStore.error">{{ projectStore.error }}</p>
    <ul>
      <li v-for="project in projectStore.projects" :key="project.id">
        <RouterLink :to="`/projects/${project.id}`">
          {{ project.title }}
        </RouterLink>
      </li>
    </ul>

  </div>
</template>
