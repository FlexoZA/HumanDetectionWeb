<script setup>
import { EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline'
import { ref, computed } from 'vue'
import { validateEmail, validatePassword } from '@/utils/authFormValidation'

// Props from parent
defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: '',
  },
})

// Events to parent
const emit = defineEmits(['submit'])

// Local form state
const email = ref('')
const password = ref('')
const showPassword = ref(false)

// Validation state
const showValidation = ref(false)

// Computed validation errors
const emailError = computed(() => {
  if (!showValidation.value && !email.value) return ''
  if (!email.value.trim()) return 'Email is required'
  return validateEmail(email.value)
})
const passwordError = computed(() => {
  if (!showValidation.value && !password.value) return ''
  if (!password.value) return 'Password is required'
  return validatePassword(password.value)
})

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const handleSubmit = (event) => {
  // Prevent default form submission
  if (event) {
    event.preventDefault()
  }

  // Show validation errors
  showValidation.value = true

  // Check if there are any validation errors
  if (emailError.value || passwordError.value) {
    console.log('DEBUG::Login.vue', 'Form validation failed', {
      emailError: emailError.value,
      passwordError: passwordError.value,
    })
    return
  }

  console.log('DEBUG::Login.vue', 'Form submitted', {
    email: email.value,
    password: password.value,
  })
  emit('submit', {
    email: email.value,
    password: password.value,
  })
}
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-b from-white to-gray-100 flex items-center justify-center px-4"
  >
    <div class="w-full max-w-sm">
      <div class="text-center mb-8">
        <h1 class="mt-3 text-xl font-semibold text-gray-900">Sign in</h1>
        <p class="mt-1 text-sm text-gray-600">Welcome back. Please enter your details.</p>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="mb-4 p-3 rounded-md bg-red-50 border border-red-200">
        <p class="text-sm text-red-600">{{ error }}</p>
      </div>

      <form class="space-y-4" @submit.prevent="handleSubmit">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <div class="mt-1 relative">
            <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <EnvelopeIcon
                :class="emailError ? 'h-5 w-5 text-red-400' : 'h-5 w-5 text-gray-400'"
              />
            </div>
            <input
              id="email"
              type="email"
              v-model="email"
              :disabled="loading"
              autocomplete="email"
              required
              :class="[
                'block w-full rounded-md pl-10 pr-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
                emailError
                  ? 'border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
              ]"
              placeholder="you@example.com"
            />
          </div>
          <p v-if="emailError" class="mt-1 text-sm text-red-600">{{ emailError }}</p>
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
          <div class="mt-1 relative">
            <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <LockClosedIcon
                :class="passwordError ? 'h-5 w-5 text-red-400' : 'h-5 w-5 text-gray-400'"
              />
            </div>
            <input
              id="password"
              :type="showPassword ? 'text' : 'password'"
              v-model="password"
              :disabled="loading"
              autocomplete="current-password"
              required
              :class="[
                'block w-full rounded-md pl-10 pr-10 py-2 text-gray-900 placeholder-gray-400 focus:outline-none disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
                passwordError
                  ? 'border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
              ]"
              placeholder="••••••••"
            />
            <button
              type="button"
              @click="togglePasswordVisibility"
              :disabled="loading"
              class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed"
            >
              <EyeIcon v-if="!showPassword" class="h-5 w-5" />
              <EyeSlashIcon v-else class="h-5 w-5" />
            </button>
          </div>
          <p v-if="passwordError" class="mt-1 text-sm text-red-600">{{ passwordError }}</p>
        </div>

        <button
          type="button"
          :disabled="loading"
          @click="handleSubmit"
          class="w-full inline-flex justify-center items-center rounded-md bg-blue-600 px-4 py-2.5 text-white font-medium hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
        >
          <span v-if="loading" class="flex items-center">
            <svg
              class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
            Signing in...
          </span>
          <span v-else>Sign in</span>
        </button>
      </form>

      <p class="mt-6 text-center text-sm text-gray-600">
        Don't have an account?
        <a href="#" class="font-medium text-blue-600 hover:text-blue-700">Create one</a>
      </p>
    </div>
  </div>
</template>
