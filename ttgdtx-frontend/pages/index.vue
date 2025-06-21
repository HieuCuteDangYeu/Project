<template>
  <NuxtLayout>
    <div class="p-8">
      <div class="space-y-4">
        <div
          class="flex justify-between items-center"
        >
          <h1 class="text-2xl font-bold">
            Welcome, User!
          </h1>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script lang="ts">
definePageMeta({
  middleware: 'auth',
})

import { defineComponent, ref, type Ref } from 'vue'
import { useNuxtApp } from 'nuxt/app'
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

    const products: Ref<Product[]> = ref([])
    const loading: Ref<boolean> = ref(false)
    const error: Ref<string> = ref('')

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
    }
  },
})
</script>
