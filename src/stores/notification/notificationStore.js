import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabase'

const EVENT_TYPES = {
  HUMAN_DETECTION: 'human_detection',
  COMMAND_DISARMED: 'command-DISARMED',
  COMMAND_ARMED: 'command-ARMED',
}

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    show: false,
    type: 'info', // success | info | error | attention
    title: 'Event',
    message: '',
    _channel: null,
    _subscribed: false,
    _hideTimer: null,
  }),
  actions: {
    async subscribeToEvents() {
      if (this._subscribed) return

      const channel = supabase
        .channel('realtime:human_detection:events')
        .on(
          'postgres_changes',
          { event: '*', schema: 'human_detection', table: 'events' },
          (payload) => {
            const record = payload?.new || payload?.record || {}
            const eventType = String(record?.event_type || '').trim()

            // Map event types to notification variants
            if (eventType === EVENT_TYPES.HUMAN_DETECTION) {
              this.title = 'Human detected'
              this.message = 'A human detection event was received.'
              this.type = 'critical'
            } else if (eventType === EVENT_TYPES.COMMAND_DISARMED) {
              this.title = 'Device disarmed'
              this.message = 'The device state changed to DISARMED.'
              this.type = 'info'
            } else if (eventType === EVENT_TYPES.COMMAND_ARMED) {
              this.title = 'Device armed'
              this.message = 'The device state changed to ARMED.'
              this.type = 'success'
            } else {
              this.title = 'New Event'
              this.message = eventType || 'Event received'
              this.type = 'info'
            }

            this.show = true
            console.log('DEBUG::notificationStore.js', { payload, eventType })

            if (this._hideTimer) clearTimeout(this._hideTimer)
            this._hideTimer = setTimeout(() => {
              this.hide()
            }, 5000)
          }
        )
        .subscribe((status) => {
          console.log('DEBUG::notificationStore.js', { status })
        })

      this._channel = channel
      this._subscribed = true
    },
    hide() {
      if (this._hideTimer) {
        clearTimeout(this._hideTimer)
        this._hideTimer = null
      }
      this.show = false
    },
    // Optional manual trigger for testing from UI
    trigger(message, type = 'info', title = 'Notice') {
      this.message = message
      this.type = type
      this.title = title
      this.show = true
      console.log('DEBUG::notificationStore.js', { message, type, title })

      if (this._hideTimer) clearTimeout(this._hideTimer)
      this._hideTimer = setTimeout(() => {
        this.hide()
      }, 5000)
    },
    cleanup() {
      if (this._channel) {
        try {
          supabase.removeChannel(this._channel)
        } catch (e) {
          console.error('DEBUG::notificationStore.js', e)
        }
        this._channel = null
        this._subscribed = false
      }
    },
  },
})


