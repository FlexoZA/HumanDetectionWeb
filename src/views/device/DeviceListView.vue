<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useDeviceStore } from '@/stores/device/deviceStore'
import DeviceList from '@/components/devices/DeviceList.vue'

const router = useRouter()
const deviceStore = useDeviceStore()

// Local UI state
const isLoading = ref(false)
const error = ref('')

// Load devices on mount
onMounted(async () => {
  await loadDevices()
})

// Load devices
const loadDevices = async () => {
  console.log('DEBUG::DeviceListView', 'Loading devices')

  isLoading.value = true
  error.value = ''

  try {
    const { data, error: fetchError } = await deviceStore.fetchDevices()

    if (fetchError) {
      error.value = fetchError.message
      console.log('DEBUG::DeviceListView', 'Error loading devices', fetchError)
    } else {
      console.log('DEBUG::DeviceListView', 'Devices loaded successfully', data?.length || 0)
    }
  } catch (err) {
    error.value = 'An unexpected error occurred'
    console.log('DEBUG::DeviceListView', 'Unexpected error loading devices', err)
  } finally {
    isLoading.value = false
  }
}

// Handle device click - navigate to device details
const handleDeviceClick = (device) => {
  console.log('DEBUG::DeviceListView', 'Navigating to device', device.device_id)
  router.push(`/devices/${device.device_id}`)
}

// Handle refresh
const handleRefresh = () => {
  loadDevices()
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-6">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <DeviceList
        :devices="deviceStore.devices"
        :loading="isLoading"
        :error="error"
        @device-click="handleDeviceClick"
        @refresh="handleRefresh"
      />
    </div>
  </div>
</template>
