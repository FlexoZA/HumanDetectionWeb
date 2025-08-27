<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth/authStore'
import Register from '@/components/auth/Register.vue'

const router = useRouter()
const authStore = useAuthStore()
const isLoading = ref(false)
const error = ref('')

const handleRegister = async (credentials) => {
  console.log('DEBUG::RegisterView', 'Starting registration process', credentials)

  // Basic validation
  if (credentials.password !== credentials.confirmPassword) {
    error.value = 'Passwords do not match'
    return
  }

  if (credentials.password.length < 6) {
    error.value = 'Password must be at least 6 characters long'
    return
  }

  isLoading.value = true
  error.value = ''

  try {
    const { data, error: authError } = await authStore.signUp(
      credentials.email,
      credentials.password,
    )

    if (authError) {
      error.value = authError.message
      console.log('DEBUG::RegisterView', 'Registration error', authError)
    } else {
      console.log('DEBUG::RegisterView', 'Registration successful', data)
      // Check if email confirmation is required
      if (data.user && !data.session) {
        error.value = 'Please check your email to confirm your account'
      } else {
        router.push('/')
      }
    }
  } catch (err) {
    error.value = 'An unexpected error occurred'
    console.log('DEBUG::RegisterView', 'Unexpected error', err)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <Register :loading="isLoading" :error="error" @submit="handleRegister" />
</template>
