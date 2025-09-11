<script setup>
import { Bars3Icon } from '@heroicons/vue/24/outline'
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth/authStore'
import HeaderDialog from '@/components/header/HeaderDialog.vue'

const authStore = useAuthStore()
const isMenuOpen = ref(false)

const openMenu = () => {
  isMenuOpen.value = true
}

const closeMenu = () => {
  isMenuOpen.value = false
}
</script>

<template>
  <div class="w-full bg-white shadow-sm border-b border-gray-200">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Username on the left -->
        <div class="flex items-center">
          <span class="text-lg font-medium text-gray-900">
            {{ authStore.user?.email || 'User' }}
          </span>
        </div>

        <!-- Hamburger menu on the right -->
        <button
          @click="openMenu"
          class="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Open menu"
        >
          <Bars3Icon class="w-6 h-6" />
        </button>
      </div>
    </div>

    <!-- Header Dialog -->
    <HeaderDialog :is-open="isMenuOpen" @close="closeMenu" />
  </div>
</template>
