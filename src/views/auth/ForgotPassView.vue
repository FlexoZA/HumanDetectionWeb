<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth/authStore'
import ForgotPass from '@/components/auth/ForgotPass.vue'

const authStore = useAuthStore()
const isLoading = ref(false)
const error = ref('')
const success = ref(false)

const handleForgotPassword = async (credentials) => {
  console.log('DEBUG::ForgotPassView', 'Starting password reset process', credentials)

  isLoading.value = true
  error.value = ''
  success.value = false

  try {
    const { data, error: authError } = await authStore.resetPassword(credentials.email)

    if (authError) {
      error.value = authError.message
      console.log('DEBUG::ForgotPassView', 'Password reset error', authError)
    } else {
      console.log('DEBUG::ForgotPassView', 'Password reset email sent', data)
      success.value = true
    }
  } catch (err) {
    error.value = 'An unexpected error occurred'
    console.log('DEBUG::ForgotPassView', 'Unexpected error', err)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <ForgotPass
    :loading="isLoading"
    :error="error"
    :success="success"
    @submit="handleForgotPassword"
  />
</template>
