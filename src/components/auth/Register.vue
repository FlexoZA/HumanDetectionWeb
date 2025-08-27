<script setup>
import {
  EnvelopeIcon,
  LockClosedIcon,
  UserIcon,
  EyeIcon,
  EyeSlashIcon,
} from '@heroicons/vue/24/outline'
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
const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)

// Validation state
const nameTouched = ref(false)
const emailTouched = ref(false)
const passwordTouched = ref(false)
const confirmPasswordTouched = ref(false)

// Computed validation errors
const nameError = computed(() => {
  if (!nameTouched.value) return ''
  if (!name.value.trim()) return 'Full name is required'
  return ''
})
const emailError = computed(() => {
  if (!emailTouched.value) return ''
  if (!email.value.trim()) return 'Email is required'
  return validateEmail(email.value)
})
const passwordError = computed(() => {
  if (!passwordTouched.value) return ''
  if (!password.value) return 'Password is required'
  return validatePassword(password.value)
})
const confirmPasswordError = computed(() => {
  if (!confirmPasswordTouched.value) return ''
  if (!confirmPassword.value) return 'Please confirm your password'
  if (password.value && confirmPassword.value && password.value !== confirmPassword.value) {
    return 'Passwords do not match'
  }
  return ''
})

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const toggleConfirmPasswordVisibility = () => {
  showConfirmPassword.value = !showConfirmPassword.value
}

const markNameTouched = () => {
  nameTouched.value = true
}

const markEmailTouched = () => {
  emailTouched.value = true
}

const markPasswordTouched = () => {
  passwordTouched.value = true
}

const markConfirmPasswordTouched = () => {
  confirmPasswordTouched.value = true
}

const handleSubmit = () => {
  // Mark all fields as touched to show validation errors
  nameTouched.value = true
  emailTouched.value = true
  passwordTouched.value = true
  confirmPasswordTouched.value = true

  // Check if there are any validation errors
  if (nameError.value || emailError.value || passwordError.value || confirmPasswordError.value) {
    console.log('DEBUG::Register.vue', 'Form validation failed', {
      nameError: nameError.value,
      emailError: emailError.value,
      passwordError: passwordError.value,
      confirmPasswordError: confirmPasswordError.value,
    })
    return
  }

  console.log('DEBUG::Register.vue', 'Form submitted', {
    name: name.value,
    email: email.value,
    password: password.value,
  })
  emit('submit', {
    name: name.value,
    email: email.value,
    password: password.value,
    confirmPassword: confirmPassword.value,
  })
}
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-b from-white to-gray-100 flex items-center justify-center px-4"
  >
    <div class="w-full max-w-sm">
      <div class="text-center mb-8">
        <h1 class="mt-3 text-xl font-semibold text-gray-900">Create account</h1>
        <p class="mt-1 text-sm text-gray-600">Get started with your free account today.</p>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="mb-4 p-3 rounded-md bg-red-50 border border-red-200">
        <p class="text-sm text-red-600">{{ error }}</p>
      </div>

      <form class="space-y-4" @submit.prevent="handleSubmit">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700">Full Name</label>
          <div class="mt-1 relative">
            <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <UserIcon :class="nameError ? 'h-5 w-5 text-red-400' : 'h-5 w-5 text-gray-400'" />
            </div>
            <input
              id="name"
              type="text"
              v-model="name"
              :disabled="loading"
              autocomplete="name"
              required
              @blur="markNameTouched"
              :class="[
                'block w-full rounded-md pl-10 pr-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
                nameError
                  ? 'border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
              ]"
              placeholder="John Doe"
            />
          </div>
          <p v-if="nameError" class="mt-1 text-sm text-red-600">{{ nameError }}</p>
        </div>

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
              autocomplete="new-password"
              required
              @blur="markPasswordTouched"
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

        <div>
          <label for="confirmPassword" class="block text-sm font-medium text-gray-700"
            >Confirm Password</label
          >
          <div class="mt-1 relative">
            <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <LockClosedIcon
                :class="confirmPasswordError ? 'h-5 w-5 text-red-400' : 'h-5 w-5 text-gray-400'"
              />
            </div>
            <input
              id="confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              v-model="confirmPassword"
              :disabled="loading"
              autocomplete="new-password"
              required
              @blur="markConfirmPasswordTouched"
              :class="[
                'block w-full rounded-md pl-10 pr-10 py-2 text-gray-900 placeholder-gray-400 focus:outline-none disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
                confirmPasswordError
                  ? 'border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
              ]"
              placeholder="••••••••"
            />
            <button
              type="button"
              @click="toggleConfirmPasswordVisibility"
              :disabled="loading"
              class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed"
            >
              <EyeIcon v-if="!showConfirmPassword" class="h-5 w-5" />
              <EyeSlashIcon v-else class="h-5 w-5" />
            </button>
          </div>
          <p v-if="confirmPasswordError" class="mt-1 text-sm text-red-600">
            {{ confirmPasswordError }}
          </p>
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
            Creating account...
          </span>
          <span v-else>Create account</span>
        </button>
      </form>

      <p class="mt-6 text-center text-sm text-gray-600">
        Already have an account?
        <a href="#" class="font-medium text-blue-600 hover:text-blue-700">Sign in</a>
      </p>
    </div>
  </div>
</template>
