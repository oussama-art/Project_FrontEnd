<template>
  <div class="min-h-screen bg-white from-emerald-50 to-teal-100 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- Card Container -->
      <div class="bg-emerald-50 rounded-2xl shadow-xl overflow-hidden">
        <!-- Header -->
        <div class="px-8 pt-8 pb-6 text-center">
          <h1 class="text-2xl font-bold text-gray-800 mb-2">Gestion de Projets</h1>
          <p class="text-gray-600">Connectez-vous pour accéder à vos projets</p>
        </div>

        <!-- Tab Navigation -->
        <div class="px-8 mb-6">
          <div class="flex rounded-lg p-1">
            <button
              @click="activeTab = 'login'"
              :class="{
                'bg-white shadow-sm text-emerald-600': activeTab === 'login',
                'text-gray-600 hover:text-gray-800': activeTab !== 'login'
              }"
              class="flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200"
            >
              Connexion
            </button>
            <button
              @click="activeTab = 'register'"
              :class="{
                'bg-white shadow-sm text-emerald-600': activeTab === 'register',
                'hover:text-gray-800': activeTab !== 'register'
              }"
              class="flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200"
            >
              Inscription
            </button>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="mx-8 mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-red-600 text-sm">{{ errorMessage }}</p>
        </div>

        <!-- Login Form -->
        <form v-if="activeTab === 'login'" @submit.prevent="handleLogin" class="px-8 pb-8">
          <div class="space-y-4">
            <!-- Email Field -->
            <div>
              <label for="login-email" class="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  id="login-email"
                  v-model="loginForm.email"
                  type="email"
                  required
                  placeholder="votre@email.com"
                  class="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            <!-- Password Field -->
            <div>
              <label for="login-password" class="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  id="login-password"
                  v-model="loginForm.password"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  placeholder="••••••"
                  class="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <svg v-if="showPassword" class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <svg v-else class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Login Button -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
          >
            <svg v-if="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isLoading ? 'Connexion...' : 'Se connecter' }}
          </button>
        </form>

        <!-- Register Form -->
        <form v-if="activeTab === 'register'" @submit.prevent="handleRegister" class="px-8 pb-8">
          <div class="space-y-4">
            <!-- Name Field -->
            <div>
              <label for="register-name" class="block text-sm font-medium text-gray-700 mb-2">
                Nom complet
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  id="register-name"
                  v-model="registerForm.name"
                  type="text"
                  required
                  placeholder="Votre nom complet"
                  class="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            <!-- Email Field -->
            <div>
              <label for="register-email" class="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  id="register-email"
                  v-model="registerForm.email"
                  type="email"
                  required
                  placeholder="votre@email.com"
                  class="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            <!-- Password Field -->
            <div>
              <label for="register-password" class="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  id="register-password"
                  v-model="registerForm.password"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  placeholder="••••••"
                  class="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <svg v-if="showPassword" class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <svg v-else class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Password Confirmation Field -->
            <div>
              <label for="register-password-confirmation" class="block text-sm font-medium text-gray-700 mb-2">
                Confirmer le mot de passe
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  id="register-password-confirmation"
                  v-model="registerForm.passwordConfirmation"
                  :type="showPasswordConfirmation ? 'text' : 'password'"
                  required
                  placeholder="••••••"
                  class="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                />
                <button
                  type="button"
                  @click="showPasswordConfirmation = !showPasswordConfirmation"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <svg v-if="showPasswordConfirmation" class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <svg v-else class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Register Button -->
          <button
            type="submit"
            :disabled="isLoading || !passwordsMatch"
            class="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
          >
            <svg v-if="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isLoading ? 'Inscription...' : 'S\'inscrire' }}
          </button>

          <!-- Password Match Warning -->
          <p v-if="registerForm.passwordConfirmation && !passwordsMatch" class="mt-2 text-sm text-red-600">
            Les mots de passe ne correspondent pas
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

// Store instance
const authStore = useAuthStore()

// Reactive state
const activeTab = ref<'login' | 'register'>('login')
const isLoading = ref(false)
const errorMessage = ref('')
const showPassword = ref(false)
const showPasswordConfirmation = ref(false)

// Form data
const loginForm = ref({
  email: '',
  password: ''
})

const registerForm = ref({
  name: '',
  email: '',
  password: '',
  passwordConfirmation: ''
})

// Computed properties
const passwordsMatch = computed(() => {
  return registerForm.value.password === registerForm.value.passwordConfirmation
})

// Methods
const handleLogin = async (): Promise<void> => {
  if (isLoading.value) return

  try {
    isLoading.value = true
    errorMessage.value = ''

    await authStore.login(loginForm.value.email, loginForm.value.password)

    // Reset form on success
    resetLoginForm()
  } catch (error: any) {
    console.error('Login error:', error)
    errorMessage.value = error.response?.data?.message || 'Erreur de connexion. Veuillez vérifier vos identifiants.'
  } finally {
    isLoading.value = false
  }
}

const handleRegister = async (): Promise<void> => {
  if (isLoading.value || !passwordsMatch.value) return

  try {
    isLoading.value = true
    errorMessage.value = ''

    await authStore.register(
      registerForm.value.name,
      registerForm.value.email,
      registerForm.value.password,
      registerForm.value.passwordConfirmation
    )

    // Reset form on success
    resetRegisterForm()
  } catch (error: any) {
    console.error('Registration error:', error)
    errorMessage.value = error.response?.data?.message || 'Erreur lors de l\'inscription. Veuillez réessayer.'
  } finally {
    isLoading.value = false
  }
}

const resetLoginForm = (): void => {
  loginForm.value = {
    email: '',
    password: ''
  }
}

const resetRegisterForm = (): void => {
  registerForm.value = {
    name: '',
    email: '',
    password: '',
    passwordConfirmation: ''
  }
}

const clearError = (): void => {
  errorMessage.value = ''
}

// Watch for tab changes to clear errors
const switchTab = (tab: 'login' | 'register'): void => {
  activeTab.value = tab
  clearError()
}

// Lifecycle hooks
onMounted(() => {
  // Clear any existing errors on component mount
  clearError()

  // If user is already authenticated, redirect to dashboard
  if (authStore.isAuthenticated) {
    // This would typically be handled by route guards, but adding as fallback
    console.log('User already authenticated, consider redirecting to dashboard')
  }
})
</script>

<style scoped>
/* Custom styles if needed - Tailwind handles most styling */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
