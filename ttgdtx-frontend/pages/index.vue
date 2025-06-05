<template>
  <div class="p-8">
    <div class="space-y-4">
      <div
        v-if="isAuthenticated()"
        class="flex justify-between items-center"
      >
        <h1 class="text-2xl font-bold">
          Welcome, User!
        </h1>
        <Button
          variant="outline"
          @click="logout"
        >
          Logout
        </Button>
      </div>
      <h1
        v-else
        class="text-2xl font-bold"
      >
        Product Fetcher
      </h1>

      <div class="flex gap-4">
        <Button
          :disabled="loading"
          @click="fetchProducts"
        >
          {{ loading ? 'Loading...' : 'Fetch Products' }}
        </Button>
        <Button
          v-if="products.length > 0"
          variant="outline"
          @click="clearProducts"
        >
          Clear
        </Button>
      </div>

      <div
        v-if="error"
        class="text-red-500 p-4 border border-red-200 rounded"
      >
        <strong>Error:</strong> {{ error }}
      </div>

      <div
        v-if="products.length > 0"
        class="space-y-2"
      >
        <h2 class="text-lg font-semibold">
          Products ({{ products.length }}):
        </h2>
        <div class="bg-gray-50 p-4 rounded border max-h-96 overflow-y-auto">
          <pre class="text-sm">{{ JSON.stringify(products, null, 2) }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, type Ref } from 'vue'
import { useCookie, useNuxtApp, useRouter } from 'nuxt/app'
import type { AxiosResponse, AxiosInstance } from 'axios'

interface Product {
  id: number
  name: string
  price: number
}

export default defineComponent({
  name: 'App',
  setup() {
    const nuxtApp = useNuxtApp()
    const $api = nuxtApp.$api as AxiosInstance
    const router = useRouter()

    const products: Ref<Product[]> = ref([])
    const loading: Ref<boolean> = ref(false)
    const error: Ref<string> = ref('')

    const isAuthenticated = () => !!useCookie('accessToken').value

    const logout = async () => {
      // Clear cookies
      useCookie('accessToken', { secure: true }).value = null
      useCookie('refreshToken', { secure: true }).value = null
      useCookie('userId', { secure: true }).value = null

      await router.push('/login')
    }

    const fetchProducts = async (): Promise<void> => {
      loading.value = true
      error.value = ''

      try {
        const response: AxiosResponse<Product[]> = await $api.get('/products')
        products.value = response.data
      }
      catch (err: unknown) {
        console.log(err)
      }
      finally {
        loading.value = false
      }
    }

    const clearProducts = (): void => {
      products.value = []
      error.value = ''
    }

    return {
      products,
      loading,
      error,
      fetchProducts,
      clearProducts,
      isAuthenticated,
      logout,
    }
  },
})
</script>
