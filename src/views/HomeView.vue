<script setup>
import { UserIcon } from '@heroicons/vue/24/outline'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth/authStore'
import { useDeviceStore } from '@/stores/device/deviceStore'
import DeviceList from '@/components/devices/DeviceList.vue'

const router = useRouter()
const authStore = useAuthStore()
const deviceStore = useDeviceStore()

const isLoggingOut = ref(false)
const devicesLoading = ref(false)

// Load devices on mount
onMounted(async () => {
  await loadDevices()
})

// Load devices
const loadDevices = async () => {
  console.log('DEBUG::HomeView', 'Loading devices for dashboard')

  devicesLoading.value = true

  try {
    const { data, error } = await deviceStore.fetchDevices()

    if (error) {
      console.log('DEBUG::HomeView', 'Error loading devices', error)
    } else {
      console.log('DEBUG::HomeView', 'Devices loaded successfully', data?.length || 0)
    }
  } catch (err) {
    console.log('DEBUG::HomeView', 'Unexpected error loading devices', err)
  } finally {
    devicesLoading.value = false
  }
}

const handleLogout = async () => {
  console.log('DEBUG::HomeView', 'Starting logout process')

  isLoggingOut.value = true

  try {
    const { error } = await authStore.signOut()

    if (error) {
      console.log('DEBUG::HomeView', 'Logout error', error)
    } else {
      console.log('DEBUG::HomeView', 'Logout successful')
      router.push('/login')
    }
  } catch (err) {
    console.log('DEBUG::HomeView', 'Unexpected error during logout', err)
  } finally {
    isLoggingOut.value = false
  }
}

// Handle device click - navigate to device details
const handleDeviceClick = (device) => {
  console.log('DEBUG::HomeView', 'Navigating to device', device.device_id)
  router.push(`/devices/${device.device_id}`)
}

// Handle device refresh
const handleDeviceRefresh = () => {
  loadDevices()
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header Section -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <!-- User Info -->
          <div class="flex items-center mb-4 sm:mb-0">
            <UserIcon class="w-10 h-10 text-blue-600 mr-4" />
            <div>
              <h1 class="text-2xl font-bold text-gray-900">Welcome back!</h1>
              <p class="text-gray-600">{{ authStore.user?.email || 'User' }}</p>
              <p class="text-sm text-gray-500">Human Detection Web App Dashboard</p>
            </div>
          </div>

          <!-- Logout Button -->
          <button
            @click="handleLogout"
            :disabled="isLoggingOut"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isLoggingOut" class="flex items-center">
              <svg
                class="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
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
            <span v-else>Sign out</span>
          </button>
        </div>
      </div>

      <!-- Devices Section -->
      <div>
        <DeviceList
          :devices="deviceStore.devices"
          :loading="devicesLoading"
          :error="''"
          @device-click="handleDeviceClick"
          @refresh="handleDeviceRefresh"
        />
      </div>
    </div>
  </div>
</template>
