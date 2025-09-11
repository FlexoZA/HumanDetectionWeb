<script setup>
import { XMarkIcon, ArrowRightOnRectangleIcon } from '@heroicons/vue/24/outline'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth/authStore'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['close'])

const router = useRouter()
const authStore = useAuthStore()
const isLoggingOut = ref(false)

const closeDialog = () => {
  emit('close')
}

const handleLogout = async () => {
  console.log('DEBUG::HeaderDialog', 'Starting logout process')

  isLoggingOut.value = true

  try {
    const { error } = await authStore.signOut()

    if (error) {
      console.log('DEBUG::HeaderDialog', 'Logout error', error)
    } else {
      console.log('DEBUG::HeaderDialog', 'Logout successful')
      closeDialog()
      router.push('/login')
    }
  } catch (err) {
    console.log('DEBUG::HeaderDialog', 'Unexpected error during logout', err)
  } finally {
    isLoggingOut.value = false
  }
}
</script>

<template>
  <!-- Dialog overlay -->
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 overflow-y-auto"
    aria-labelledby="modal-title"
    role="dialog"
    aria-modal="true"
  >
    <!-- Background overlay -->
    <div
      class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
      @click="closeDialog"
    ></div>

    <!-- Dialog panel -->
    <div class="flex min-h-full items-start justify-center p-4 pt-20">
      <div
        class="relative transform overflow-hidden rounded-lg bg-white shadow-xl transition-all w-full max-w-sm"
      >
        <!-- Header -->
        <div class="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">Menu</h3>
          <button
            @click="closeDialog"
            class="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-1"
            aria-label="Close menu"
          >
            <XMarkIcon class="w-6 h-6" />
          </button>
        </div>

        <!-- Menu items -->
        <div class="px-4 py-4">
          <button
            @click="handleLogout"
            :disabled="isLoggingOut"
            class="w-full flex items-center px-4 py-3 text-left text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isLoggingOut" class="flex items-center">
              <svg
                class="animate-spin -ml-1 mr-3 h-4 w-4 text-gray-700"
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
            <span v-else class="flex items-center">
              <ArrowRightOnRectangleIcon class="w-5 h-5 mr-3" />
              Sign out
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
