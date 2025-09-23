<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDeviceStore } from '@/stores/device/deviceStore'
import { useNotificationStore } from '@/stores/notification/notificationStore'

const route = useRoute()
const router = useRouter()
const deviceStore = useDeviceStore()
const notificationStore = useNotificationStore()

const deviceId = route.params.id

const isLoading = ref(false)
const saving = ref(false)
const error = ref('')
const success = ref('')

// Local form state
const autoArmEnable = ref(true)
const autoArmDelayMs = ref(0)

const device = computed(() => deviceStore.currentDevice)

const load = async () => {
  isLoading.value = true
  error.value = ''
  try {
    const { data, error: fetchError } = await deviceStore.fetchDevice(deviceId)
    if (fetchError) throw fetchError
    autoArmEnable.value = data?.auto_arm_enable ?? true
    autoArmDelayMs.value = data?.auto_arm_delay_ms ?? 0
    console.log('DEBUG::DeviceSettingsView', { autoArmEnable: autoArmEnable.value, autoArmDelayMs: autoArmDelayMs.value })
  } catch (err) {
    error.value = err.message || 'Failed to load device'
    console.log('DEBUG::DeviceSettingsView', 'Load error', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(load)

watch(
  () => route.params.id,
  async (newId) => {
    if (newId && newId !== deviceId) {
      await load()
    }
  },
)

const delayOptions = [
  { label: '1 minute', value: 60_000 },
  { label: '2 minutes', value: 120_000 },
  { label: '5 minutes', value: 300_000 },
  { label: '10 minutes', value: 600_000 },
  { label: '15 minutes', value: 900_000 },
  { label: '20 minutes', value: 1_200_000 },
  { label: '25 minutes', value: 1_500_000 },
  { label: '30 minutes', value: 1_800_000 },
  { label: '1 hour', value: 3_600_000 },
  { label: '12 hours', value: 43_200_000 },
  { label: '24 hours', value: 86_400_000 },
]

const handleBack = () => {
  router.push({ name: 'device-detail', params: { id: deviceId } })
}

const handleSave = async () => {
  success.value = ''
  error.value = ''

  const delay = Number(autoArmDelayMs.value)
  if (Number.isNaN(delay)) {
    error.value = 'Delay must be a number'
    return
  }
  if (delay < 0 || delay > 86_400_000) {
    error.value = 'Delay must be between 0 and 86,400,000 ms'
    return
  }

  try {
    saving.value = true
    const { success: ok, error: updateErr } = await deviceStore.updateDeviceSettings(deviceId, {
      auto_arm_enable: autoArmEnable.value,
      auto_arm_delay_ms: delay,
    })
    if (!ok) throw updateErr
    success.value = 'Settings saved'
    console.log('DEBUG::DeviceSettingsView', 'Saved settings')
    notificationStore.trigger('Device settings updated successfully.', 'success', 'Settings Saved')
  } catch (err) {
    error.value = err.message || 'Failed to save settings'
    console.log('DEBUG::DeviceSettingsView', 'Save error', err)
    notificationStore.trigger(error.value, 'error', 'Save Failed')
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-6">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between mb-4">
        <button @click="handleBack" class="inline-flex items-center text-gray-600 hover:text-gray-900">
          <svg class="w-5 h-5 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <div class="flex items-center space-x-3">
          <span v-if="device?.config_version !== undefined" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
            Config v{{ device?.config_version ?? 0 }}
          </span>
          <h1 class="text-xl font-semibold text-gray-900">Device Settings</h1>
        </div>
      </div>

      <div class="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
        <div>
          <h2 class="text-lg font-medium text-gray-900">Auto Arm</h2>
          <p class="mt-1 text-sm text-gray-500">Configure automatic arming behavior</p>
        </div>

        <div class="space-y-4">
          <div class="flex items-center">
            <button
              type="button"
              @click="autoArmEnable = !autoArmEnable"
              :class="autoArmEnable ? 'bg-blue-600' : 'bg-gray-200'"
              class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
              role="switch"
              aria-checked="autoArmEnable"
            >
              <span
                :class="autoArmEnable ? 'translate-x-5' : 'translate-x-0'"
                class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
              />
            </button>
            <span class="ml-3 text-sm text-gray-700">Enable Auto Arm</span>
          </div>

          <div>
            <label for="delay" class="block text-sm font-medium text-gray-700 mb-1">Auto Arm Delay</label>
            <div class="mt-1 relative rounded-md shadow-sm">
              <select
                id="delay"
                v-model.number="autoArmDelayMs"
                :disabled="!autoArmEnable"
                class="block w-full appearance-none rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500 sm:text-sm"
              >
                <option v-for="opt in delayOptions" :key="opt.value" :value="opt.value">
                  {{ opt.label }}
                </option>
              </select>
              <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" class="pointer-events-none absolute inset-y-0 right-0 my-auto mr-3 h-5 w-5 text-gray-400">
                <path d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" fill-rule="evenodd" />
              </svg>
            </div>
            <p class="mt-1 text-xs text-gray-500">0 - 86,400,000 ms</p>
          </div>
        </div>

        <div class="flex justify-end space-x-3">
          <button
            type="button"
            @click="handleBack"
            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            @click="handleSave"
            :disabled="saving || isLoading"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            {{ saving ? 'Saving...' : 'Save Settings' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>


