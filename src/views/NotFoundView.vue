<!-- src/views/NotFoundView.vue -->
<template>
  <div class="h-screen flex flex-col items-center justify-center text-center">
    <h1 class="text-6xl font-bold text-gray-800">404</h1>
    <p class="text-lg text-gray-600 mt-2">Page non trouvée</p>
    <router-link
      to="/Dashboard"
      class="mt-6 px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700"
    >
      Retour au Dashboard
    </router-link>
  </div>
</template>
