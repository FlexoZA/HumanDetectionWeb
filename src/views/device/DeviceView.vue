<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDeviceStore } from '@/stores/device/deviceStore'
import Device from '@/components/devices/Device.vue'

const route = useRoute()
const router = useRouter()
const deviceStore = useDeviceStore()

// Get device ID from route params
const deviceId = route.params.id

// Local UI state
const isLoading = ref(false)
const error = ref('')

// Load device on mount and when deviceId changes
onMounted(async () => {
  await loadDevice()
})

watch(
  () => route.params.id,
  async (newId) => {
    if (newId && newId !== deviceId) {
      await loadDevice()
    }
  },
)

// Load device details
const loadDevice = async () => {
  console.log('DEBUG::DeviceView', 'Loading device', deviceId)

  isLoading.value = true
  error.value = ''

  try {
    const { data, error: fetchError } = await deviceStore.fetchDevice(deviceId)

    if (fetchError) {
      error.value = fetchError.message
      console.log('DEBUG::DeviceView', 'Error loading device', fetchError)
    } else {
      console.log('DEBUG::DeviceView', 'Device loaded successfully', data?.device_id)
    }
  } catch (err) {
    error.value = 'An unexpected error occurred'
    console.log('DEBUG::DeviceView', 'Unexpected error loading device', err)
  } finally {
    isLoading.value = false
  }
}

// Handle back navigation
const handleBack = () => {
  router.push('/devices')
}

// Handle refresh
const handleRefresh = () => {
  loadDevice()
}

// Handle device actions (prepared for webhook integration)
const handleArmDevice = () => {
  console.log('DEBUG::DeviceView', 'Arm device requested', deviceId)
  // TODO: Implement webhook call to arm device via N8N
  // This will send a command through MQTT broker to the device
}

const handleDisarmDevice = () => {
  console.log('DEBUG::DeviceView', 'Disarm device requested', deviceId)
  // TODO: Implement webhook call to disarm device via N8N
  // This will send a command through MQTT broker to the device
}

const handleToggleNotifications = () => {
  console.log('DEBUG::DeviceView', 'Toggle notifications requested', deviceId)
  // TODO: Implement notification settings (future feature)
}

const handleConfigureDevice = () => {
  console.log('DEBUG::DeviceView', 'Configure device requested', deviceId)
  // TODO: Implement device configuration (future feature)
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-6">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <Device
        :device="deviceStore.currentDevice"
        :loading="isLoading"
        :error="error"
        @back="handleBack"
        @refresh="handleRefresh"
        @arm-device="handleArmDevice"
        @disarm-device="handleDisarmDevice"
        @toggle-notifications="handleToggleNotifications"
        @configure-device="handleConfigureDevice"
      />
    </div>
  </div>
</template>
