<template>
  <div class="space-y-2">
    <Label :for="id" class="sr-only">{{ label }}</Label>
    <div class="relative">
      <Input
        :id="id"
        :model-value="modelValue"
        @update:model-value="$emit('update:modelValue', String($event))"
        :type="inputType"
        :placeholder="placeholder"
        class="h-12 text-base"
        :class="[
          { 'border-red-500 focus:border-red-500': error },
          { 'pr-12': type === 'password' }
        ]"
      />
      <Button
        v-if="type === 'password'"
        type="button"
        variant="ghost"
        size="sm"
        class="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
        @click="togglePassword"
      >
        <Eye v-if="!showPassword" class="h-4 w-4 text-gray-500" />
        <EyeOff v-else class="h-4 w-4 text-gray-500" />
      </Button>
    </div>
    <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Eye, EyeOff } from 'lucide-vue-next'

interface Props {
  id: string
  label: string
  placeholder: string
  modelValue: string | undefined
  type?: 'email' | 'password' | 'text'
  error?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text'
})

defineEmits<{
  'update:modelValue': [value: string]
}>()

const showPassword = ref(false)

const inputType = computed(() => {
  if (props.type === 'password') {
    return showPassword.value ? 'text' : 'password'
  }
  return props.type
})

const togglePassword = (): void => {
  showPassword.value = !showPassword.value
}
</script>