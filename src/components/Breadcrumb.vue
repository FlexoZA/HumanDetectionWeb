<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ChevronRightIcon, HomeIcon } from '@heroicons/vue/24/outline'

const route = useRoute()
const router = useRouter()

// Define breadcrumb labels for each route
const routeLabels = {
  home: 'Dashboard',
  devices: 'Devices',
  'device-detail': 'Device Details',
  login: 'Login',
  register: 'Register',
  'forgot-password': 'Forgot Password',
}

// Generate breadcrumbs based on current route
const breadcrumbs = computed(() => {
  const crumbs = []

  // Handle auth routes (login, register, forgot-password)
  const authRoutes = ['login', 'register', 'forgot-password']
  if (authRoutes.includes(route.name)) {
    crumbs.push({
      name: route.name,
      label: routeLabels[route.name],
      path: route.path,
      isLast: true,
    })
    return crumbs
  }

  // For main app routes, start with home
  crumbs.push({
    name: 'home',
    label: routeLabels.home,
    path: '/',
    isLast: route.name === 'home',
  })

  // Add intermediate breadcrumbs based on route
  if (route.name === 'devices' || route.name === 'device-detail') {
    crumbs.push({
      name: 'devices',
      label: routeLabels.devices,
      path: '/devices',
      isLast: route.name === 'devices',
    })
  }

  // Add device detail if on device detail page
  if (route.name === 'device-detail') {
    crumbs.push({
      name: 'device-detail',
      label: routeLabels['device-detail'],
      path: route.path,
      isLast: true,
    })
  }

  return crumbs
})

// Navigate to breadcrumb
const navigateTo = (path) => {
  console.log('DEBUG::Breadcrumb', 'Navigating to', path)
  router.push(path)
}
</script>

<template>
  <nav v-if="breadcrumbs.length > 0" class="flex items-center space-x-2 text-sm text-gray-500">
    <div v-for="(crumb, index) in breadcrumbs" :key="crumb.name" class="flex items-center">
      <!-- Separator (except for first item) -->
      <ChevronRightIcon v-if="index > 0" class="w-4 h-4 mx-2 text-gray-400" />

      <!-- Breadcrumb item -->
      <button
        v-if="!crumb.isLast"
        @click="navigateTo(crumb.path)"
        class="flex items-center space-x-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-2 py-1 rounded-md transition-colors duration-200"
      >
        <HomeIcon v-if="crumb.name === 'home'" class="w-4 h-4" />
        <span>{{ crumb.label }}</span>
      </button>

      <!-- Current page (last item) -->
      <span v-else class="flex items-center space-x-1 text-gray-900 font-medium px-2 py-1">
        <HomeIcon v-if="crumb.name === 'home'" class="w-4 h-4" />
        <span>{{ crumb.label }}</span>
      </span>
    </div>
  </nav>
</template>
