<template>
  <NuxtLayout name="auth">
    <!-- Header -->
    <AuthHeader
      title="Sign in to your CNN account"
      description="Don't have an account?"
      link-text="Sign up"
      @link-click="handleSignUp"
    />

    <!-- Login Form -->
    <form
      class="space-y-4"
      @submit="onSubmit"
    >
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

      <!-- Forgot Password -->
      <div class="text-left">
        <Button
          type="button"
          variant="link"
          class="p-0 h-auto font-normal text-blue-600 hover:text-blue-800 underline"
          @click="handleForgotPassword"
        >
          Forgot password?
        </Button>
      </div>

      <!-- Sign In Button -->
      <Button
        type="submit"
        class="w-full h-12 bg-black hover:bg-gray-800 text-white font-medium"
        :disabled="isLoading"
      >
        <Loader
          v-if="isLoading"
          class="h-4 w-4 mr-2 animate-spin"
        />
        {{ isLoading ? 'Signing in...' : 'Sign In' }}
      </Button>
    </form>

    <!-- Divider -->
    <AuthDivider />

    <!-- Social Login Buttons -->
    <AuthSocialLoginButtons
      @google-login="handleGoogleLogin"
      @apple-login="handleAppleLogin"
    />

    <!-- Terms and Privacy -->
    <div class="mt-6 text-xs text-gray-500 text-center leading-relaxed">
      By signing up or signing in, you agree to our
      <Button
        variant="link"
        class="p-0 h-auto text-xs underline text-blue-600 hover:text-blue-800"
        @click="handleTermsClick"
      >
        Terms of Use
      </Button>
      and have read our
      <Button
        variant="link"
        class="p-0 h-auto text-xs underline text-blue-600 hover:text-blue-800"
        @click="handlePrivacyClick"
      >
        Privacy Policy
      </Button>
      . CNN and its
      <Button
        variant="link"
        class="p-0 h-auto text-xs underline text-blue-600 hover:text-blue-800"
        @click="handleAffiliatesClick"
      >
        affiliates
      </Button>
      may use your email address to send updates, ads, and offers. Opt out via
      <Button
        variant="link"
        class="p-0 h-auto text-xs underline text-blue-600 hover:text-blue-800"
        @click="handlePrivacyClick"
      >
        Privacy Policy
      </Button>
      .
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { Loader } from 'lucide-vue-next'
import { useNuxtApp, useRouter } from 'nuxt/app'
import type { AxiosInstance, AxiosResponse } from 'axios'

// Types
interface AuthResponse {
  accessToken: string
  refreshToken: string
  userId: string
}

// Validation schema
const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email('Please enter a valid email address'),
  password: z
    .string({ required_error: 'Password is required' })
    .min(6, 'Password must be at least 6 characters'),
})

type LoginFormData = z.infer<typeof loginSchema>

// Form setup with VeeValidate and Zod
const { handleSubmit, errors, defineField } = useForm({
  validationSchema: toTypedSchema(loginSchema),
  initialValues: {
    email: '',
    password: '',
  },
})

// Form fields
const [email] = defineField('email')
const [password] = defineField('password')

// UI state
const isLoading = ref(false)

const router = useRouter()

const onSubmit = handleSubmit(async (values: LoginFormData) => {
  isLoading.value = true

  try {
    const $api = useNuxtApp().$api as AxiosInstance

    // Call authentication API
    const response: AxiosResponse<AuthResponse> = await $api.post('/auth/login', {
      email: values.email,
      password: values.password,
    })

    // Handle successful login
    if (response.data) {
      // Store authentication data if needed
      // Example: await $auth.setUser(response.data.user)
      // Example: await $auth.setToken(response.data.token)
      router.push('/')
    }
  }
  catch (error: any) {
    console.log(error)
  }
  finally {
    isLoading.value = false
  }
})

// Navigation handlers
const handleSignUp = (): void => {
  router.push('/register')
}

const handleForgotPassword = (): void => {
  console.log('Navigate to forgot password')
  alert('Navigate to forgot password page')
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
const handleTermsClick = (): void => {
  console.log('Open Terms of Use')
  window.open('https://cnn.com/terms', '_blank')
}

const handlePrivacyClick = (): void => {
  console.log('Open Privacy Policy')
  window.open('https://cnn.com/privacy', '_blank')
}

const handleAffiliatesClick = (): void => {
  console.log('Open Affiliates page')
  alert('Navigate to affiliates information')
}
</script>
