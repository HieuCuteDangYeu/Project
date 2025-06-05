<template>
  <div class="text-center mb-6">
    <h1 class="text-2xl font-semibold text-gray-900 mb-2">
      {{ title }}
    </h1>
    <p class="text-gray-600">
      {{ description }}
      <Button
        variant="link"
        class="p-0 h-auto font-normal text-blue-600 hover:text-blue-800 underline"
        @click="$emit('linkClick')"
      >
        {{ linkText }}
      </Button>
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  description: string
  linkText: string
}

defineProps<Props>()
defineEmits<{
  linkClick: []
}>()
</script>
