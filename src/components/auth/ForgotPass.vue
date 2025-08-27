<script setup>
import { EnvelopeIcon } from '@heroicons/vue/24/outline'
import { ref, computed } from 'vue'
import { validateEmail } from '@/utils/authFormValidation'

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
  success: {
    type: Boolean,
    default: false,
  },
})

// Events to parent
const emit = defineEmits(['submit'])

// Local form state
const email = ref('')

// Validation state
const emailTouched = ref(false)

// Computed validation errors
const emailError = computed(() => {
  if (!emailTouched.value) return ''
  if (!email.value.trim()) return 'Email is required'
  return validateEmail(email.value)
})

const markEmailTouched = () => {
  emailTouched.value = true
}

const handleSubmit = () => {
  // Mark email field as touched to show validation errors
  emailTouched.value = true

  // Check if there are any validation errors
  if (emailError.value) {
    console.log('DEBUG::ForgotPass.vue', 'Form validation failed', {
      emailError: emailError.value,
    })
    return
  }

  console.log('DEBUG::ForgotPass.vue', 'Form submitted', {
    email: email.value,
  })
  emit('submit', {
    email: email.value,
  })
}
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-b from-white to-gray-100 flex items-center justify-center px-4"
  >
    <div class="w-full max-w-sm">
      <div class="text-center mb-8">
        <h1 class="mt-3 text-xl font-semibold text-gray-900">Reset your password</h1>
        <p class="mt-1 text-sm text-gray-600">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      <!-- Success Message -->
      <div v-if="success" class="mb-4 p-3 rounded-md bg-green-50 border border-green-200">
        <p class="text-sm text-green-600">
          Password reset email sent! Please check your inbox and follow the instructions.
        </p>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="mb-4 p-3 rounded-md bg-red-50 border border-red-200">
        <p class="text-sm text-red-600">{{ error }}</p>
      </div>

      <form v-if="!success" class="space-y-4" @submit.prevent="handleSubmit">
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
              @blur="markEmailTouched"
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

        <button
          type="submit"
          :disabled="loading"
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
            Sending reset link...
          </span>
          <span v-else>Send reset link</span>
        </button>
      </form>

      <div class="mt-6 text-center">
        <p class="text-sm text-gray-600">
          Remember your password?
          <a href="#" class="font-medium text-blue-600 hover:text-blue-700">Back to sign in</a>
        </p>
      </div>
    </div>
  </div>
</template>
