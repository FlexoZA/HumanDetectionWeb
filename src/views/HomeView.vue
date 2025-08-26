<script setup>
import { UserIcon } from '@heroicons/vue/24/outline'
</script>

<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center">
    <div class="bg-white p-8 rounded-lg shadow-md text-center">
      <UserIcon class="w-12 h-12 mx-auto mb-4 text-blue-600" />
      <h1 class="text-3xl font-bold text-gray-800 mb-4">Human Detection Web</h1>
      <p class="text-gray-600 mb-6">Vue 3 + Tailwind CSS + Pinia + Supabase PWA Ready!</p>
      <div class="flex space-x-4 justify-center">
        <button
          class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Get Started
        </button>
        <button
          class="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors"
        >
          Learn More
        </button>
      </div>
    </div>
  </div>
</template>
