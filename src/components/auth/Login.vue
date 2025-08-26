<script setup>
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/vue/24/outline'
import { ref } from 'vue'

const email = ref('')
const password = ref('')
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-b from-white to-gray-100 flex items-center justify-center px-4"
  >
    <div class="w-full max-w-sm">
      <div class="text-center mb-8">
        <h1 class="mt-3 text-xl font-semibold text-gray-900">Sign in</h1>
        <p class="mt-1 text-sm text-gray-600">Welcome back. Please enter your details.</p>
      </div>

      <form
        class="space-y-4"
        @submit.prevent="console.log('DEBUG::Login.vue', { email: email, password: password })"
      >
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <div class="mt-1 relative">
            <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <EnvelopeIcon class="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="email"
              type="email"
              v-model="email"
              autocomplete="email"
              required
              class="block w-full rounded-md border border-gray-300 pl-10 pr-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="you@example.com"
            />
          </div>
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
          <div class="mt-1 relative">
            <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <LockClosedIcon class="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="password"
              type="password"
              v-model="password"
              autocomplete="current-password"
              required
              class="block w-full rounded-md border border-gray-300 pl-10 pr-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="••••••••"
            />
          </div>
        </div>

        <button
          type="submit"
          class="w-full inline-flex justify-center items-center rounded-md bg-blue-600 px-4 py-2.5 text-white font-medium hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Sign in
        </button>
      </form>

      <p class="mt-6 text-center text-sm text-gray-600">
        Don't have an account?
        <a href="#" class="font-medium text-blue-600 hover:text-blue-700">Create one</a>
      </p>
    </div>
  </div>
</template>
