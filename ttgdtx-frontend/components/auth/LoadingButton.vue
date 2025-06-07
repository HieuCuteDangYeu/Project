<template>
  <Button
    :type="type"
    :disabled="disabled || loading"
    v-bind="$attrs"
  >
    <Loader
      v-if="loading"
      class="h-4 w-4 mr-2 animate-spin"
    />
    {{ loading ? loadingText : text }}
  </button>
</template>

<script setup lang="ts">
import { Loader } from 'lucide-vue-next'

interface Props {
  text: string
  loadingText?: string
  loading?: boolean
  disabled?: boolean
  type?: 'button' | 'submit'
}

withDefaults(defineProps<Props>(), {
  loadingText: 'Loading...',
  loading: false,
  disabled: false,
  type: 'button',
})
</script>
