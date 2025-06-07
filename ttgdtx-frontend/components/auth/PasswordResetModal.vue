<template>
  <div>
    <!-- Header -->
    <AuthHeader
      title="Reset your password"
      :description="isSuccess
        ? 'If an account exists for that email address, we have sent you an email with a link to reset your password.'
        : 'Can’t remember your password? Enter your email address and we will send you an email to create a new password.'"
    />

    <!-- Success State -->
    <div
      v-if="isSuccess"
      class="space-y-6"
    >
      <div class="text-center space-y-4">
        <div class="space-y-2">
          <p class="text-sm text-gray-500">
            Didn't receive an email?
          </p>
          <Button
            variant="link"
            class="text-sm text-blue-600 hover:text-blue-700 underline"
            :disabled="isLoading"
            @click="onSubmitResend"
          >
            That's okay, we can {{ isLoading ? 'resending...' : 'resend the email' }}
          </Button>
        </div>

        <!-- Success Message -->
        <div
          v-if="resent"
          class="flex items-center justify-center space-x-2 text-green-600 bg-green-50 p-3 rounded-lg"
        >
          <CheckCircle class="h-5 w-5" />
          <span class="text-sm font-medium">Password reset email has been resent</span>
        </div>
      </div>
    </div>
    <!-- Reset Form -->
    <form
      v-else
      class="space-y-4"
      @submit="onSubmit"
    >
      <!-- Email Input -->
      <AuthInput
        id="reset-email"
        v-model="email"
        label="Email address"
        placeholder="Email address"
        type="email"
        :error="errors.email"
      />

      <!-- Action Buttons -->
      <div class="flex flex-col space-y-3 pt-2">
        <!-- Send Reset Link Button -->
        <AuthLoadingButton
          type="submit"
          class="w-full h-12 bg-black hover:bg-gray-800 text-white font-medium"
          :loading="isLoading"
          :loading-text="'Sending reset link...'"
          :text="'Send Reset Link'"
        />

        <!-- Cancel Button -->
        <Button
          type="button"
          variant="outline"
          class="w-full h-12 font-medium"
          :disabled="isLoading"
          @click="handleCancel"
        >
          Cancel
        </Button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { useNuxtApp } from 'nuxt/app'
import { CheckCircle } from 'lucide-vue-next'
import type { AxiosInstance } from 'axios'

// Props & Emits
interface Props {
  open?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  open: false,
})

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

// Validation schema
const resetSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email('Please enter a valid email address'),
})

type ResetFormData = z.infer<typeof resetSchema>

// Form setup
const { handleSubmit, errors, defineField, resetForm } = useForm({
  validationSchema: toTypedSchema(resetSchema),
  initialValues: {
    email: '',
  },
})

const [email] = defineField('email')

// State
const isOpen = ref(props.open)
const isLoading = ref(false)
const isSuccess = ref(false)
const resent = ref(false)

// Watch for prop changes
watch(() => props.open, (newValue) => {
  isOpen.value = newValue
  if (newValue) {
    // Reset form and state when modal opens
    resetForm()
    isSuccess.value = false
  }
})

// Watch internal state and emit changes
watch(isOpen, (newValue) => {
  emit('update:open', newValue)
})

// Form submission
const onSubmit = handleSubmit(async (values: ResetFormData) => {
  isLoading.value = true

  try {
    const $api = useNuxtApp().$api as AxiosInstance

    await $api.post('/auth/forgot-password', {
      email: values.email,
    })

    isSuccess.value = true
  }
  catch (error: unknown) {
    console.error('Password reset error:', error)
  }
  finally {
    isLoading.value = false
  }
})

const onSubmitResend = async (): Promise<void> => {
  await onSubmit()
  resent.value = true
}

const handleCancel = (): void => {
  isOpen.value = false
}
</script>
