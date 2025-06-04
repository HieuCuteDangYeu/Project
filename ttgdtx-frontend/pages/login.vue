<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- CNN Logo -->
      <div class="text-center mb-8">
        <div class="inline-block bg-red-600 text-white font-bold text-2xl px-4 py-2 rounded">
          CNN
        </div>
      </div>

      <!-- Main Card -->
      <Card class="shadow-lg border-0">
        <CardContent class="p-8">
          <!-- Header -->
          <div class="text-center mb-6">
            <h1 class="text-2xl font-semibold text-gray-900 mb-2">
              Sign in to your CNN account
            </h1>
            <p class="text-gray-600">
              Don't have an account? 
              <Button 
                variant="link" 
                class="p-0 h-auto font-normal text-blue-600 hover:text-blue-800 underline"
                @click="handleSignUp"
              >
                Sign up
              </Button>
            </p>
          </div>

          <!-- Login Form -->
          <form @submit="onSubmit" class="space-y-4">
            <!-- Email Input -->
            <div class="space-y-2">
              <Label for="email" class="sr-only">Email address</Label>
              <Input
                id="email"
                v-model="email"
                type="email"
                placeholder="Email address"
                class="h-12 text-base"
                :class="{ 'border-red-500 focus:border-red-500': errors.email }"
              />
              <p v-if="errors.email" class="text-red-500 text-sm">{{ errors.email }}</p>
            </div>

            <!-- Password Input -->
            <div class="space-y-2">
              <Label for="password" class="sr-only">Password</Label>
              <div class="relative">
                <Input
                  id="password"
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Password"
                  class="h-12 text-base pr-12"
                  :class="{ 'border-red-500 focus:border-red-500': errors.password }"
                />
                <Button
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
              <p v-if="errors.password" class="text-red-500 text-sm">{{ errors.password }}</p>
            </div>

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
              <Loader v-if="isLoading" class="h-4 w-4 mr-2 animate-spin" />
              {{ isLoading ? 'Signing in...' : 'Sign In' }}
            </Button>
          </form>

          <!-- Divider -->
          <div class="relative my-6">
            <div class="absolute inset-0 flex items-center">
              <Separator class="w-full" />
            </div>
            <div class="relative flex justify-center">
              <span class="bg-white px-4 text-gray-500 text-sm">or</span>
            </div>
          </div>

          <!-- Social Login Buttons -->
          <div class="space-y-3">
            <Button
              variant="outline"
              class="w-full h-12 border-gray-300 hover:bg-gray-50"
              @click="handleGoogleLogin"
            >
              <svg class="h-5 w-5 mr-3" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </Button>

            <Button
              variant="outline"
              class="w-full h-12 border-gray-300 hover:bg-gray-50"
              @click="handleAppleLogin"
            >
              <svg class="h-5 w-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              Continue with Apple
            </Button>
          </div>

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
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { Eye, EyeOff, Loader } from 'lucide-vue-next'
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
    .min(6, 'Password must be at least 6 characters')
})

type LoginFormData = z.infer<typeof loginSchema>

// Form setup with VeeValidate and Zod
const { handleSubmit, errors, defineField } = useForm({
  validationSchema: toTypedSchema(loginSchema),
  initialValues: {
    email: '',
    password: ''
  }
})

// Form fields
const [email] = defineField('email')
const [password] = defineField('password')

// UI state
const showPassword = ref(false)
const isLoading = ref(false)

// Form handlers
const togglePassword = (): void => {
  showPassword.value = !showPassword.value
}

const onSubmit = handleSubmit(async (values: LoginFormData) => {
  isLoading.value = true
  
  try {
    const $api = useNuxtApp().$api as AxiosInstance
    
    // Call authentication API
    const response : AxiosResponse<AuthResponse> = await $api.post('/auth/login', {
      email: values.email,
      password: values.password
    })
    
    // Handle successful login
    if (response.data) {
      // Store authentication data if needed
      // Example: await $auth.setUser(response.data.user)
      // Example: await $auth.setToken(response.data.token)
      
      const router = useRouter()
      router.push('/')
    }
    
  } catch (error: any) {
    console.log(error)
  } finally {
    isLoading.value = false
  }
})

// Navigation handlers
const handleSignUp = (): void => {
  console.log('Navigate to sign up')
  alert('Navigate to sign up page')
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
  } catch (error: unknown) {
    console.error('Google login error:', error)
    alert('Google login failed')
  }
}

const handleAppleLogin = async (): Promise<void> => {
  try {
    console.log('Apple login initiated')
    alert('Apple login initiated (demo)')
  } catch (error: unknown) {
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