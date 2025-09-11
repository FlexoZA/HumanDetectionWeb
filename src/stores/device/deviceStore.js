import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth/authStore'

export const useDeviceStore = defineStore('device', () => {
  const devices = ref([])
  const currentDevice = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const armingDevice = ref(false)
  const disarmingDevice = ref(false)

  const authStore = useAuthStore()

  // Computed property to get current user
  const currentUser = computed(() => authStore.user)

  // Get all devices for the logged-in user
  const fetchDevices = async () => {
    try {
      loading.value = true
      error.value = null

      if (!currentUser.value) {
        console.log('DEBUG::deviceStore', 'No user logged in')
        devices.value = []
        return { data: [], error: null }
      }

      // First get the client for the current user
      const { data: clientData, error: clientError } = await supabase
        .from('client')
        .select('id, client_name, wifi_ssid, created_at')
        .eq('user_id', currentUser.value.id)
        .single()

      if (clientError) {
        if (clientError.code === 'PGRST116') {
          // No rows found
          console.log('DEBUG::deviceStore', 'No client found for user')
          devices.value = []
          return { data: [], error: null }
        }
        throw clientError
      }

      // Get devices for this client
      const { data: deviceData, error: deviceError } = await supabase
        .from('client_devices')
        .select(
          `
          id,
          device_id,
          unit_friendly_name,
          created_at,
          client_id
        `,
        )
        .eq('client_id', clientData.id)
        .order('created_at', { ascending: false })

      if (deviceError) throw deviceError

      // Get online status for each device
      const devicesWithStatus = await Promise.all(
        deviceData.map(async (device) => {
          const { data: statusData } = await supabase
            .from('device_online_status_events')
            .select('device_status, created_at')
            .eq('client_id', clientData.id)
            .eq('device_id', device.device_id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single()

          return {
            ...device,
            online_status: statusData?.device_status || 'offline',
            last_seen: statusData?.created_at || null,
          }
        }),
      )

      devices.value = devicesWithStatus
      console.log('DEBUG::deviceStore', 'Fetched devices:', devicesWithStatus.length)

      return { data: devicesWithStatus, error: null }
    } catch (err) {
      console.error('DEBUG::deviceStore', 'Error fetching devices:', err.message)
      error.value = err.message
      return { data: null, error: err }
    } finally {
      loading.value = false
    }
  }

  // Get a single device with detailed information
  const fetchDevice = async (deviceId) => {
    try {
      loading.value = true
      error.value = null

      if (!currentUser.value) {
        console.log('DEBUG::deviceStore', 'No user logged in')
        return { data: null, error: new Error('No user logged in') }
      }

      // First get the client for the current user
      const { data: clientData, error: clientError } = await supabase
        .from('client')
        .select('id')
        .eq('user_id', currentUser.value.id)
        .single()

      if (clientError) throw clientError

      // Get the device
      const { data: deviceData, error: deviceError } = await supabase
        .from('client_devices')
        .select(
          `
          id,
          device_id,
          unit_friendly_name,
          created_at,
          client_id
        `,
        )
        .eq('client_id', clientData.id)
        .eq('device_id', deviceId)
        .single()

      if (deviceError) throw deviceError

      // Get recent events for this device
      const { data: eventsData } = await supabase
        .from('events')
        .select('event_type, current_mode, timestamp, wifi_signal, created_at')
        .eq('client_id', clientData.id)
        .eq('device_id', deviceId)
        .order('created_at', { ascending: false })
        .limit(10)

      // Get recent heartbeat data
      const { data: heartbeatData } = await supabase
        .from('heartbeat')
        .select('device_uptime_ms, device_wifi_signal, device_timestamp, created_at')
        .eq('client_id', clientData.id)
        .eq('device_id', deviceId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      // Get online status
      const { data: statusData } = await supabase
        .from('device_online_status_events')
        .select('device_status, created_at')
        .eq('client_id', clientData.id)
        .eq('device_id', deviceId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      const deviceDetails = {
        ...deviceData,
        events: eventsData || [],
        heartbeat: heartbeatData || null,
        online_status: statusData?.device_status || 'offline',
        last_seen: statusData?.created_at || null,
      }

      currentDevice.value = deviceDetails
      console.log('DEBUG::deviceStore', 'Fetched device details for:', deviceId)

      return { data: deviceDetails, error: null }
    } catch (err) {
      console.error('DEBUG::deviceStore', 'Error fetching device:', err.message)
      error.value = err.message
      return { data: null, error: err }
    } finally {
      loading.value = false
    }
  }

  // Clear current device
  const clearCurrentDevice = () => {
    currentDevice.value = null
  }

  // Clear error
  const clearError = () => {
    error.value = null
  }

  // Arm device - send webhook request
  const armDevice = async (deviceId) => {
    try {
      armingDevice.value = true
      console.log('DEBUG::deviceStore', `Arming device ${deviceId}`)

      const response = await fetch(
        'https://labsn8n.cwe.cloud/webhook/a96506aa-1c74-472a-b6f8-c5525495f3cf',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            device_id: deviceId,
            action: 'arm',
          }),
        },
      )

      if (!response.ok) {
        throw new Error(`Webhook request failed: ${response.status}`)
      }

      console.log('DEBUG::deviceStore', `Successfully armed device ${deviceId}`)
      return { success: true, error: null }
    } catch (err) {
      console.error('DEBUG::deviceStore', `Error arming device ${deviceId}:`, err.message)
      error.value = `Failed to arm device: ${err.message}`
      return { success: false, error: err }
    } finally {
      armingDevice.value = false
    }
  }

  // Disarm device - send webhook request
  const disarmDevice = async (deviceId) => {
    try {
      disarmingDevice.value = true
      console.log('DEBUG::deviceStore', `Disarming device ${deviceId}`)

      const response = await fetch(
        'https://labsn8n.cwe.cloud/webhook/a96506aa-1c74-472a-b6f8-c5525495f3cf',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            device_id: deviceId,
            action: 'disarm',
          }),
        },
      )

      if (!response.ok) {
        throw new Error(`Webhook request failed: ${response.status}`)
      }

      console.log('DEBUG::deviceStore', `Successfully disarmed device ${deviceId}`)
      return { success: true, error: null }
    } catch (err) {
      console.error('DEBUG::deviceStore', `Error disarming device ${deviceId}:`, err.message)
      error.value = `Failed to disarm device: ${err.message}`
      return { success: false, error: err }
    } finally {
      disarmingDevice.value = false
    }
  }

  return {
    devices,
    currentDevice,
    loading,
    error,
    armingDevice,
    disarmingDevice,
    fetchDevices,
    fetchDevice,
    clearCurrentDevice,
    clearError,
    armDevice,
    disarmDevice,
  }
})
