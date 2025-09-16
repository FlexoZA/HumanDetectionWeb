<script setup>
import { computed } from 'vue'
import {
  CheckCircleIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  XMarkIcon,
} from '@heroicons/vue/24/solid'

const props = defineProps({
  type: {
    type: String,
    default: 'info', // success | info | error | attention | critical
    validator: (value) => ['success', 'info', 'error', 'attention', 'critical'].includes(value),
  },
  title: {
    type: String,
    default: '',
  },
  message: {
    type: String,
    default: '',
  },
  show: {
    type: Boolean,
    default: false,
  },
  dismissible: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['close'])

const variantIcon = computed(() => {
  switch (props.type) {
    case 'success':
      return CheckCircleIcon
    case 'info':
      return InformationCircleIcon
    case 'error':
      return XCircleIcon
    case 'attention':
      return ExclamationTriangleIcon
    case 'critical':
      return ExclamationTriangleIcon
    default:
      return InformationCircleIcon
  }
})

const variantClasses = computed(() => {
  switch (props.type) {
    case 'success':
      return {
        container: 'bg-green-50 border-green-200',
        icon: 'text-green-600',
        title: 'text-green-900',
        message: 'text-green-800',
        close: 'text-green-600 hover:text-green-700 focus:ring-green-600/20',
      }
    case 'info':
      return {
        container: 'bg-blue-50 border-blue-200',
        icon: 'text-blue-600',
        title: 'text-blue-900',
        message: 'text-blue-800',
        close: 'text-blue-600 hover:text-blue-700 focus:ring-blue-600/20',
      }
    case 'error':
      return {
        container: 'bg-red-50 border-red-200',
        icon: 'text-red-600',
        title: 'text-red-900',
        message: 'text-red-800',
        close: 'text-red-600 hover:text-red-700 focus:ring-red-600/20',
      }
    case 'attention':
      return {
        container: 'bg-yellow-50 border-yellow-200',
        icon: 'text-yellow-600',
        title: 'text-yellow-900',
        message: 'text-yellow-800',
        close: 'text-yellow-600 hover:text-yellow-700 focus:ring-yellow-600/20',
      }
    case 'critical':
      return {
        container: 'bg-purple-50 border-purple-200',
        icon: 'text-purple-600',
        title: 'text-purple-900',
        message: 'text-purple-800',
        close: 'text-purple-600 hover:text-purple-700 focus:ring-purple-600/20',
      }
    default:
      return {
        container: 'bg-gray-50 border-gray-200',
        icon: 'text-gray-600',
        title: 'text-gray-900',
        message: 'text-gray-800',
        close: 'text-gray-600 hover:text-gray-700 focus:ring-gray-600/20',
      }
  }
})

const handleClose = () => {
  emit('close')
}
</script>

<template>
  <teleport to="body">
    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-2"
    >
      <div v-if="props.show" class="fixed inset-x-0 top-0 p-3 sm:inset-auto sm:right-4 sm:top-4 sm:left-auto z-50 pointer-events-none">
        <div class="pointer-events-auto w-full sm:max-w-sm">
          <div
            class="rounded-md border p-4 shadow-lg w-full"
            :class="variantClasses.container"
            role="alert"
          >
            <div class="flex">
              <div class="flex-shrink-0">
                <component :is="variantIcon" class="h-5 w-5" :class="variantClasses.icon" />
              </div>
              <div class="ml-3 flex-1">
                <h3 v-if="props.title" class="text-sm font-medium" :class="variantClasses.title">
                  {{ props.title }}
                </h3>
                <div v-if="props.message" class="mt-1 text-sm" :class="variantClasses.message">
                  {{ props.message }}
                </div>
                <slot />
              </div>
              <div v-if="props.dismissible" class="ml-3">
                <button
                  type="button"
                  class="inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-transparent"
                  :class="variantClasses.close"
                  @click="handleClose"
                  aria-label="Dismiss"
                >
                  <XMarkIcon class="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>


