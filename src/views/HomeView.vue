<script setup>
import { UserIcon } from '@heroicons/vue/24/outline'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth/authStore'

const router = useRouter()
const authStore = useAuthStore()
const isLoggingOut = ref(false)

const handleLogout = async () => {
  console.log('DEBUG::HomeView', 'Starting logout process')

  isLoggingOut.value = true

  try {
    const { error } = await authStore.signOut()

    if (error) {
      console.log('DEBUG::HomeView', 'Logout error', error)
    } else {
      console.log('DEBUG::HomeView', 'Logout successful')
      router.push('/login')
    }
  } catch (err) {
    console.log('DEBUG::HomeView', 'Unexpected error during logout', err)
  } finally {
    isLoggingOut.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center">
    <div class="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
      <!-- User Info -->
      <div class="mb-6">
        <UserIcon class="w-12 h-12 mx-auto mb-4 text-blue-600" />
        <h1 class="text-3xl font-bold text-gray-800 mb-2">Welcome!</h1>
        <p class="text-gray-600 mb-2">{{ authStore.user?.email || 'User' }}</p>
        <p class="text-sm text-gray-500">Human Detection Web App</p>
      </div>

      <!-- App Info -->
      <div class="mb-6">
        <p class="text-gray-600 mb-4">Vue 3 + Tailwind CSS + Pinia + Supabase PWA Ready!</p>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-col space-y-3">
        <button
          class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Get Started
        </button>
        <button
          class="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors"
        >
          Learn More
        </button>

        <!-- Logout Button -->
        <button
          @click="handleLogout"
          :disabled="isLoggingOut"
          class="inline-flex justify-center items-center bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="isLoggingOut" class="flex items-center">
            <svg
              class="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Signing out...
          </span>
          <span v-else>Sign out</span>
        </button>
      </div>
    </div>
  </div>
</template>
