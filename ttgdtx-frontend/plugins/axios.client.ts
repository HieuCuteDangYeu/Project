import axios from 'axios'
import { useAuth } from '~/composables/useAuth'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const { session, logout } = useAuth()

  // Create axios instance
  const api = axios.create({
    baseURL: config.public.authBaseURL as string,
  })

  // Request interceptor to add auth token
  api.interceptors.request.use(
    (config) => {
      const token = session.value?.accessToken
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    error => Promise.reject(error),
  )

  // Response interceptor to handle token refresh
  api.interceptors.response.use(
    response => response,
    async (error) => {
      const originalRequest = error.config

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true

        try {
          await $fetch('/api/auth/refresh', { method: 'POST' })
          // Get the updated token after refresh
          const token = session.value?.accessToken
          if (token) {
            originalRequest.headers.Authorization = `Bearer ${token}`
            return api(originalRequest)
          }
        }
        catch (refreshError) {
          await logout()
          return Promise.reject(refreshError)
        }
      }

      return Promise.reject(error)
    },
  )

  return {
    provide: {
      api,
    },
  }
})
