<template>
  <NuxtLayout name="auth">
    <!-- Password Reset Modal -->
    <AuthPasswordResetModal
      v-if="showPasswordResetModal"
      :open="showPasswordResetModal"
      @update:open="handleUpdateOpen"
    />
    <div v-else>
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
        <AuthLoadingButton
          :text="'Sign in'"
          :loading-text="'Signing in...'"
          :loading="isLoading"
          class="w-full h-12 bg-black hover:bg-gray-800 text-white font-medium"
          type="submit"
        />
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
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { useRouter } from 'nuxt/app'
import { useAuth } from '../composables/useAuth'

definePageMeta({
  middleware: 'guest',
})

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
const showPasswordResetModal = ref(false)

const router = useRouter()

const onSubmit = handleSubmit(async (values: LoginFormData) => {
  isLoading.value = true

  try {
    const { login } = useAuth()
    await login({ email: values.email, password: values.password })
    await router.push('/')
  }
  catch (error: unknown) {
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
  showPasswordResetModal.value = true
}

const handleUpdateOpen = (open: boolean): void => {
  showPasswordResetModal.value = open
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
