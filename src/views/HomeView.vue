<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth/authStore'
import { useDeviceStore } from '@/stores/device/deviceStore'
import DeviceList from '@/components/devices/DeviceList.vue'

const router = useRouter()
const authStore = useAuthStore()
const deviceStore = useDeviceStore()

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
