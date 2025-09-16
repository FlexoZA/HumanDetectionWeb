<script setup>
import { computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth/authStore'
import { useNotificationStore } from '@/stores/notification/notificationStore'
import HeaderView from '@/views/header/HeaderView.vue'
import Breadcrumb from '@/components/Breadcrumb.vue'
import Notification from '@/components/notification/Notification.vue'

const route = useRoute()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()

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

onMounted(() => {
  notificationStore.subscribeToEvents()
})

onBeforeUnmount(() => {
  notificationStore.cleanup()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <Notification
      :show="notificationStore.show"
      :type="notificationStore.type"
      :title="notificationStore.title"
      :message="notificationStore.message"
      @close="notificationStore.hide()"
    />
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
