<script setup>
import {
  ComputerDesktopIcon,
  WifiIcon,
  ExclamationTriangleIcon,
  ClockIcon,
} from '@heroicons/vue/24/outline'
import { CheckCircleIcon, XCircleIcon } from '@heroicons/vue/24/solid'

// Props from parent
defineProps({
  devices: {
    type: Array,
    default: () => [],
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
const emit = defineEmits(['device-click', 'refresh'])

// Handle device click
const handleDeviceClick = (device) => {
  emit('device-click', device)
}

// Handle refresh
const handleRefresh = () => {
  emit('refresh')
}

// Format last seen time
const formatLastSeen = (timestamp) => {
  if (!timestamp) return 'Never'

  const date = new Date(timestamp)
  const now = new Date()
  const diffInMinutes = Math.floor((now - date) / (1000 * 60))

  if (diffInMinutes < 1) return 'Just now'
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours}h ago`

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `${diffInDays}d ago`

  return date.toLocaleDateString()
}

// Get status color
const getStatusColor = (status) => {
  return status === 'online' ? 'text-green-600' : 'text-red-600'
}

// Get status background color
const getStatusBgColor = (status) => {
  return status === 'online' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header with refresh button -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-lg font-semibold text-gray-900">Your Devices</h2>
      </div>
      <button
        @click="handleRefresh"
        :disabled="loading"
        class="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg
          v-if="loading"
          class="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700"
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
        <svg
          v-else
          class="-ml-1 mr-2 h-4 w-4 text-gray-700"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
        Refresh
      </button>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="p-4 rounded-md bg-red-50 border border-red-200">
      <div class="flex">
        <ExclamationTriangleIcon class="h-5 w-5 text-red-400" />
        <div class="ml-3">
          <p class="text-sm text-red-700">{{ error }}</p>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading && devices.length === 0" class="space-y-4">
      <div v-for="i in 3" :key="i" class="animate-pulse">
        <div class="bg-white rounded-lg border border-gray-200 p-4">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-gray-200 rounded-full"></div>
            <div class="flex-1 space-y-2">
              <div class="h-4 bg-gray-200 rounded w-1/4"></div>
              <div class="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div class="w-16 h-6 bg-gray-200 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="!loading && devices.length === 0"
      class="text-center py-12 bg-white rounded-lg border border-gray-200"
    >
      <ComputerDesktopIcon class="mx-auto h-12 w-12 text-gray-400" />
      <h3 class="mt-2 text-sm font-medium text-gray-900">No devices found</h3>
      <p class="mt-1 text-sm text-gray-500">You haven't registered any ESP32 devices yet.</p>
    </div>

    <!-- Device List -->
    <div v-else class="space-y-3">
      <div
        v-for="device in devices"
        :key="device.id"
        @click="handleDeviceClick(device)"
        class="bg-white rounded-lg border border-gray-200 p-4 cursor-pointer hover:border-gray-300 transition-colors"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3 flex-1 min-w-0">
            <!-- Device Icon -->
            <div class="flex-shrink-0">
              <ComputerDesktopIcon class="h-8 w-8 text-gray-600" />
            </div>

            <!-- Device Info -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center space-x-2">
                <h3 class="text-sm font-medium text-gray-900 truncate">
                  {{ device.unit_friendly_name || `Device ${device.device_id}` }}
                </h3>
                <span
                  :class="[
                    'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
                    getStatusBgColor(device.online_status),
                  ]"
                >
                  <CheckCircleIcon
                    v-if="device.online_status === 'online'"
                    class="w-3 h-3 mr-1 text-green-600"
                  />
                  <XCircleIcon v-else class="w-3 h-3 mr-1 text-red-600" />
                  {{ device.online_status === 'online' ? 'Online' : 'Offline' }}
                </span>
              </div>

              <div class="flex items-center space-x-4 mt-1">
                <div class="flex items-center text-xs text-gray-500">
                  <WifiIcon class="w-3 h-3 mr-1" />
                  {{ device.device_id }}
                </div>
                <div class="flex items-center text-xs text-gray-500">
                  <ClockIcon class="w-3 h-3 mr-1" />
                  {{ formatLastSeen(device.last_seen) }}
                </div>
              </div>
            </div>
          </div>

          <!-- Chevron -->
          <div class="flex-shrink-0 ml-2">
            <svg
              class="w-5 h-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
