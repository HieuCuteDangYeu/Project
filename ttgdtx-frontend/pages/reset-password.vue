<template>
  <NuxtLayout name="auth">
    <AuthHeader
      title="Reset your password"
      description="Create a new password for your CNN Account."
    />
    <form
      class="space-y-4"
      @submit="onSubmit"
    >
      <AuthInput
        id="password"
        v-model="password"
        label="Password"
        placeholder="Password"
        type="password"
        :error="errors.password"
      />
      <AuthInput
        id="confirmPassword"
        v-model="confirmPassword"
        label="Confirm Password"
        placeholder="Confirm Password"
        type="password"
        :error="errors.confirmPassword"
      />
      <AuthLoadingButton
        :text="'Reset Password'"
        :loading-text="'Resetting...'"
        :loading="isLoading"
        class="w-full h-12 bg-black hover:bg-gray-800 text-white font-medium"
        type="submit"
      />
    </form>
  </Nuxtlayout>
</template>

<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import type { AxiosInstance } from 'axios'
import { useNuxtApp, useRoute, useRouter } from 'nuxt/app'
import { useForm } from 'vee-validate'
import { ref } from 'vue'
import z from 'zod'

definePageMeta({
  middleware: 'guest',
})

interface ResetRequest {
  newPassword: string
  resetToken: string
}

const resetPasswordSchema = z.object({
  password: z.string({ required_error: 'Password is required' })
    .min(6, 'Password must be at least 6 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number',
    ),
  confirmPassword: z.string({ required_error: 'Please confirm your password' }),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords don\'t match',
  path: ['confirmPassword'],
})

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

const { handleSubmit, errors, defineField } = useForm({
  validationSchema: toTypedSchema(resetPasswordSchema),
  initialValues: {
    password: '',
    confirmPassword: '',
  },
})

const [password] = defineField('password')
const [confirmPassword] = defineField('confirmPassword')
const isLoading = ref(false)
const token = useRoute().query.token as string
const router = useRouter()

const onSubmit = handleSubmit(async (values: ResetPasswordFormData) => {
  isLoading.value = true
  try {
    const $api = useNuxtApp().$api as AxiosInstance
    const resetData: ResetRequest = {
      newPassword: values.password,
      resetToken: token,
    }

    await $api.put('/auth/reset-password', resetData)
    router.push('/login')
  }
  catch (error: unknown) {
    console.error('Error resetting password:', error)
  }
  finally {
    isLoading.value = false
  }
})
</script>
