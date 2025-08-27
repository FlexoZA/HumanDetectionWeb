<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/lib/supabase'
import Login from '@/components/auth/Login.vue'

const router = useRouter()
const isLoading = ref(false)
const error = ref('')

const handleLogin = async (credentials) => {
  console.log("DEBUG::loginView", "Starting login process", credentials)
  
  isLoading.value = true
  error.value = ''
  
  try {
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    })
    
    if (authError) {
      error.value = authError.message
      console.log("DEBUG::loginView", "Login error", authError)
    } else {
      console.log("DEBUG::loginView", "Login successful", data)
      router.push('/')
    }
  } catch (err) {
    error.value = 'An unexpected error occurred'
    console.log("DEBUG::loginView", "Unexpected error", err)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <Login 
    :loading="isLoading"
    :error="error"
    @submit="handleLogin"
  />
</template>
