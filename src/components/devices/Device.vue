<script setup>
import {
  ComputerDesktopIcon,
  WifiIcon,
  ClockIcon,
  SignalIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon,
  ShieldExclamationIcon,
  BellIcon,
  CogIcon,
} from '@heroicons/vue/24/outline'
import { CheckCircleIcon, XCircleIcon, ArrowPathIcon } from '@heroicons/vue/24/solid'
import { useDeviceStore } from '@/stores/device/deviceStore'

// Props from parent
const props = defineProps({
  device: {
    type: Object,
    default: null,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: '',
  },
})

// Events to parent
const emit = defineEmits([
  'refresh',
  'arm-device',
  'disarm-device',
  'toggle-notifications',
  'configure-device',
])

// Device store
const deviceStore = useDeviceStore()


// Handle refresh
const handleRefresh = () => {
  emit('refresh')
}

// Handle arm/disarm
const handleArmDevice = async () => {
  if (!props.device?.device_id) {
    console.error('DEBUG::Device.vue', 'No device ID available')
    return
  }

  const result = await deviceStore.armDevice(props.device.device_id)
  if (result.success) {
    emit('arm-device')
  }
}

const handleDisarmDevice = async () => {
  if (!props.device?.device_id) {
    console.error('DEBUG::Device.vue', 'No device ID available')
    return
  }

  const result = await deviceStore.disarmDevice(props.device.device_id)
  if (result.success) {
    emit('disarm-device')
  }
}

// Handle notifications toggle
const handleToggleNotifications = () => {
  // Intentionally left empty for now
}

// Handle device configuration
const handleConfigureDevice = () => {
  emit('configure-device')
}

// Format timestamp
const formatTimestamp = (timestamp) => {
  if (!timestamp) return 'N/A'
  return new Date(timestamp).toLocaleString()
}

// Format uptime
const formatUptime = (ms) => {
  if (!ms) return 'N/A'

  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) return `${days}d ${hours % 24}h`
  if (hours > 0) return `${hours}h ${minutes % 60}m`
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`
  return `${seconds}s`
}

// Get WiFi signal strength
const getWifiSignalStrength = (signal) => {
  if (!signal) return 'Unknown'
  if (signal >= -50) return 'Excellent'
  if (signal >= -60) return 'Good'
  if (signal >= -70) return 'Fair'
  return 'Poor'
}

// Get event type color
const getEventTypeColor = (eventType) => {
  switch (eventType?.toLowerCase()) {
    case 'motion':
    case 'detection':
      return 'text-blue-600 bg-blue-50 border-blue-200'
    case 'alarm':
    case 'alert':
      return 'text-red-600 bg-red-50 border-red-200'
    case 'heartbeat':
      return 'text-green-600 bg-green-50 border-green-200'
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200'
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-white rounded-lg border border-gray-200 p-6">
      <div class="flex items-center justify-between">
        <h1 class="text-xl font-semibold text-gray-900">
          {{ props.device?.unit_friendly_name || `Device ${props.device?.device_id}` }}
        </h1>
        <div class="text-sm text-gray-900">
          {{ props.device?.events?.[0]?.current_mode || 'Unknown' }}
        </div>
      </div>
    </div>

    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <button
          @click="$emit('back')"
          class="inline-flex items-center text-gray-600 hover:text-gray-900"
        >
          <svg
            class="w-5 h-5 mr-1"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back
        </button>
      </div>
      <button
        @click="handleRefresh"
        :disabled="props.loading"
        class="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ArrowPathIcon :class="props.loading ? 'animate-spin' : ''" class="w-4 h-4 mr-2" />
        Refresh
      </button>
    </div>

    <!-- Error Message -->
    <div v-if="props.error" class="p-4 rounded-md bg-red-50 border border-red-200">
      <div class="flex">
        <ExclamationTriangleIcon class="h-5 w-5 text-red-400" />
        <div class="ml-3">
          <p class="text-sm text-red-700">{{ props.error }}</p>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="props.loading && !props.device" class="space-y-4">
      <div class="animate-pulse">
        <div class="bg-white rounded-lg border border-gray-200 p-6">
          <div class="space-y-4">
            <div class="h-6 bg-gray-200 rounded w-1/4"></div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div v-for="i in 4" :key="i" class="h-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Device Details -->
    <div v-else-if="props.device" class="space-y-6">
      <!-- Status Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Connection Status -->
        <div class="bg-white rounded-lg border border-gray-200 p-4">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <CheckCircleIcon
                v-if="props.device.online_status === 'online'"
                class="h-8 w-8 text-green-600"
              />
              <XCircleIcon v-else class="h-8 w-8 text-red-600" />
            </div>
            <div class="ml-4">
              <h3 class="text-sm font-medium text-gray-900">Status</h3>
              <p class="text-lg font-semibold text-gray-700 capitalize">
                {{ props.device.online_status }}
              </p>
            </div>
          </div>
        </div>

        <!-- WiFi Signal -->
        <div class="bg-white rounded-lg border border-gray-200 p-4">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <SignalIcon class="h-8 w-8 text-blue-600" />
            </div>
            <div class="ml-4">
              <h3 class="text-sm font-medium text-gray-900">WiFi Signal</h3>
              <p class="text-lg font-semibold text-gray-700">
                {{ getWifiSignalStrength(props.device.heartbeat?.device_wifi_signal) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Uptime -->
        <div class="bg-white rounded-lg border border-gray-200 p-4">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <ClockIcon class="h-8 w-8 text-green-600" />
            </div>
            <div class="ml-4">
              <h3 class="text-sm font-medium text-gray-900">Uptime</h3>
              <p class="text-lg font-semibold text-gray-700">
                {{ formatUptime(props.device.heartbeat?.device_uptime_ms) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Last Seen -->
        <div class="bg-white rounded-lg border border-gray-200 p-4">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <WifiIcon class="h-8 w-8 text-gray-600" />
            </div>
            <div class="ml-4">
              <h3 class="text-sm font-medium text-gray-900">Last Seen</h3>
              <p class="text-sm font-semibold text-gray-700">
                {{ formatTimestamp(props.device.last_seen) }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Control Panel -->
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">Device Controls</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Arm/Disarm -->
          <div class="text-center">
            <button
              @click="handleArmDevice"
              :disabled="deviceStore.armingDevice"
              class="w-full inline-flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowPathIcon v-if="deviceStore.armingDevice" class="animate-spin w-5 h-5 mr-2" />
              <ShieldCheckIcon v-else class="w-5 h-5 mr-2" />
              {{ deviceStore.armingDevice ? 'Arming...' : 'Arm Device' }}
            </button>
            <p class="mt-2 text-xs text-gray-500">Enable detection and alerts</p>
          </div>

          <div class="text-center">
            <button
              @click="handleDisarmDevice"
              :disabled="deviceStore.disarmingDevice"
              class="w-full inline-flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowPathIcon v-if="deviceStore.disarmingDevice" class="animate-spin w-5 h-5 mr-2" />
              <ShieldExclamationIcon v-else class="w-5 h-5 mr-2" />
              {{ deviceStore.disarmingDevice ? 'Disarming...' : 'Disarm Device' }}
            </button>
            <p class="mt-2 text-xs text-gray-500">Disable detection</p>
          </div>

          <!-- Notifications (Future) -->
          <div class="text-center">
            <button
              @click="handleToggleNotifications"
              class="w-full inline-flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              <CogIcon class="w-5 h-5 mr-2" />
              Device Settings
            </button>
            <p class="mt-2 text-xs text-gray-500">No action yet</p>
          </div>
        </div>
      </div>

      <!-- Device Information -->
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">Device Information</h2>
        <dl class="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
          <div>
            <dt class="text-sm font-medium text-gray-500">Device ID</dt>
            <dd class="mt-1 text-sm text-gray-900">{{ props.device.device_id }}</dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500">Friendly Name</dt>
            <dd class="mt-1 text-sm text-gray-900">
              {{ props.device.unit_friendly_name || 'Not set' }}
            </dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500">Created</dt>
            <dd class="mt-1 text-sm text-gray-900">
              {{ formatTimestamp(props.device.created_at) }}
            </dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500">Current Mode</dt>
            <dd class="mt-1 text-sm text-gray-900">
              {{ props.device.events?.[0]?.current_mode || 'Unknown' }}
            </dd>
          </div>
        </dl>
      </div>

      <!-- Recent Events -->
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">Recent Events</h2>
        <div
          v-if="!props.device?.events || props.device?.events.length === 0"
          class="text-center py-8"
        >
          <ExclamationTriangleIcon class="mx-auto h-12 w-12 text-gray-400" />
          <h3 class="mt-2 text-sm font-medium text-gray-900">No recent events</h3>
          <p class="mt-1 text-sm text-gray-500">
            Events will appear here when your device detects activity.
          </p>
        </div>
        <div v-else class="space-y-3">
          <div
            v-for="event in (props.device?.events || []).slice(0, 10)"
            :key="event.id"
            class="flex items-center justify-between p-3 rounded-lg border"
            :class="getEventTypeColor(event.event_type)"
          >
            <div class="flex items-center space-x-3">
              <div class="flex-shrink-0">
                <div class="w-2 h-2 bg-current rounded-full"></div>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900">
                  {{ event.event_type || 'Event' }}
                </p>
                <p class="text-xs text-gray-500">Mode: {{ event.current_mode || 'Unknown' }}</p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-sm text-gray-900">
                {{ formatTimestamp(event.created_at) }}
              </p>
              <p class="text-xs text-gray-500">Signal: {{ event.wifi_signal || 'N/A' }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
