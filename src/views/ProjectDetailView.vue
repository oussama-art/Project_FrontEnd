<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useProjectStore } from '@/stores/project'

const projectStore = useProjectStore()
const route = useRoute()

onMounted(() => {
  const id = Number(route.params.id)
  projectStore.fetchProject(id)
})
</script>

<template>
  <div>
    <h2>Détail du projet</h2>
    <p v-if="projectStore.loading">Chargement...</p>
    <p v-if="projectStore.error">{{ projectStore.error }}</p>

    <div v-if="projectStore.currentProject">
      <h3>{{ projectStore.currentProject.title }}</h3>
      <p>{{ projectStore.currentProject.description }}</p>

      <h4>Tâches :</h4>
      <ul>
        <li v-for="task in projectStore.currentProject.tasks" :key="task.id">
          {{ task.title }} - {{ task.status }}
        </li>
      </ul>
    </div>
  </div>
</template>
