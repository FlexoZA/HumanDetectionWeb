<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth/authStore'
import HeaderView from '@/views/header/HeaderView.vue'
import Breadcrumb from '@/components/Breadcrumb.vue'

const route = useRoute()
const authStore = useAuthStore()

// Check if current route requires authentication
const requiresAuth = computed(() => {
  return route.meta.requiresAuth !== false // Default to true unless explicitly set to false
})

// Check if user is authenticated
const isAuthenticated = computed(() => {
  return !!authStore.user
})

// Show header only for authenticated routes where user is logged in
const showHeader = computed(() => {
  return requiresAuth.value && isAuthenticated.value
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header for authenticated routes -->
    <HeaderView v-if="showHeader" />

    <!-- Breadcrumbs - always visible -->
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
      <Breadcrumb />
    </div>

    <!-- Main content -->
    <RouterView />
  </div>
</template>
