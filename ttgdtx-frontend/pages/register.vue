<template>
  <NuxtLayout name="auth">
    <!-- Header -->
    <AuthHeader
      title="Sign up for your CNN account"
      description="Already have an account?"
      link-text="Sign in"
      @link-click="handleSignIn"
    />

    <!-- Signup Form -->
    <form
      class="space-y-4"
      @submit="onSubmit"
    >
      <!-- Name Input -->
      <AuthInput
        id="name"
        v-model="name"
        label="Username"
        placeholder="Username"
        :error="errors.name"
      />
      <!-- Email Input -->
      <AuthInput
        id="email"
        v-model="email"
        label="Email address"
        placeholder="Email address"
        type="email"
        :error="errors.email"
      />

      <!-- Password Input -->
      <AuthInput
        id="password"
        v-model="password"
        label="Password"
        placeholder="Password"
        type="password"
        :error="errors.password"
      />

      <!-- Confirm Password Input -->
      <AuthInput
        id="confirmPassword"
        v-model="confirmPassword"
        label="Confirm Password"
        placeholder="Confirm Password"
        type="password"
        :error="errors.confirmPassword"
      />

      <!-- Terms Checkbox -->
      <div class="space-y-2">
        <div class="flex items-start space-x-3">
          <div class="mr-2">
            <input
              id="agreeToTerms"
              v-model="agreeToTerms"
              type="checkbox"
              class="h-5 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              :class="{ 'border-red-500': errors.agreeToTerms }"
            >
          </div>

          <label
            for="agreeToTerms"
            class="text-xs text-gray-700 leading-relaxed"
          >
            I understand CNN and its
            <Button
              type="button"
              variant="link"
              class="p-0 h-auto text-xs underline text-blue-600 hover:text-blue-800"
              @click="handleAffiliatesClick"
            >
              affiliates
            </Button>
            may use my email address to provide updates, ads, and offers. I can opt out via the
            <Button
              type="button"
              variant="link"
              class="p-0 h-auto text-xs underline text-blue-600 hover:text-blue-800"
              @click="handlePrivacyClick"
            >
              Privacy Policy
            </Button>
            .
          </label>
        </div>
        <p
          v-if="errors.agreeToTerms"
          class="text-red-500 text-xs"
        >
          {{ errors.agreeToTerms }}
        </p>
      </div>

      <!-- Sign Up Button -->
      <Button
        type="submit"
        class="w-full h-12 bg-black hover:bg-gray-800 text-white font-medium"
        :disabled="isLoading"
      >
        <Loader
          v-if="isLoading"
          class="h-4 w-4 mr-2 animate-spin"
        />
        {{ isLoading ? 'Creating account...' : 'Sign up' }}
      </Button>
    </form>

    <!-- Divider -->
    <AuthDivider />

    <!-- Social Login Buttons -->
    <AuthSocialLoginButtons
      @google-login="handleGoogleLogin"
      @apple-login="handleAppleLogin"
    />
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'guest',
})

import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { Loader } from 'lucide-vue-next'
import { useNuxtApp, useRouter } from 'nuxt/app'
import type { AxiosInstance } from 'axios'
import { ref } from 'vue'

interface SignupRequest {
  name: string
  email: string
  password: string
}

// Validation schema
const signupSchema = z.object({
  name: z
    .string({ required_error: 'Username is required' })
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must not exceed 20 characters'),
  email: z
    .string({ required_error: 'Email is required' })
    .email('Please enter a valid email address'),
  password: z
    .string({ required_error: 'Password is required' })
    .min(6, 'Password must be at least 6 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number',
    ),
  confirmPassword: z
    .string({ required_error: 'Please confirm your password' }),
  agreeToTerms: z
    .boolean()
    .refine(val => val === true, 'You must agree to the terms to continue'),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords don\'t match',
  path: ['confirmPassword'],
})

type SignupFormData = z.infer<typeof signupSchema>

// Form setup with VeeValidate and Zod
const { handleSubmit, errors, defineField } = useForm({
  validationSchema: toTypedSchema(signupSchema),
  initialValues: {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  },
})

// Form fields
const [name] = defineField('name')
const [email] = defineField('email')
const [password] = defineField('password')
const [confirmPassword] = defineField('confirmPassword')
const [agreeToTerms] = defineField('agreeToTerms')

// UI state
const isLoading = ref(false)
const router = useRouter()

// Form handlers
const onSubmit = handleSubmit(async (values: SignupFormData) => {
  isLoading.value = true

  try {
    const $api = useNuxtApp().$api as AxiosInstance

    const signupData: SignupRequest = {
      name: values.name,
      email: values.email,
      password: values.password,
    }

    await $api.post('/auth/signup', signupData)
    router.push('/login')
  }
  catch (error: unknown) {
    console.log(error)
  }
  finally {
    isLoading.value = false
  }
})

// Navigation handlers
const handleSignIn = (): void => {
  router.push('/login')
}

// Social login handlers
const handleGoogleLogin = async (): Promise<void> => {
  try {
    console.log('Google login initiated')
    alert('Google login initiated (demo)')
  }
  catch (error: unknown) {
    console.error('Google login error:', error)
    alert('Google login failed')
  }
}

const handleAppleLogin = async (): Promise<void> => {
  try {
    console.log('Apple login initiated')
    alert('Apple login initiated (demo)')
  }
  catch (error: unknown) {
    console.error('Apple login error:', error)
    alert('Apple login failed')
  }
}

// Link handlers
const handlePrivacyClick = (): void => {
  window.open('https://cnn.com/privacy', '_blank')
}

const handleAffiliatesClick = (): void => {
  window.open('https://cnn.com/affiliates', '_blank')
}
</script>
