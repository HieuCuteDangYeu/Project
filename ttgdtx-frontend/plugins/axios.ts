import axios, { type InternalAxiosRequestConfig } from 'axios'
import { useRouter } from 'nuxt/app'

export default defineNuxtPlugin(() => {
  const defaultUrl = 'http://localhost:8080'
  const $api = axios.create({
    baseURL: defaultUrl,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  // Request interceptor to add access token
  $api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const accessToken = useCookie('accessToken').value
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  })

  // Response interceptor to handle 401 (or 403) errors and refresh token
  $api.interceptors.response.use(
    response => response,
    async (error) => {
      const originalRequest = error.config
      const router = useRouter()

      // Check for 401 or 403 status codes
      if ([401, 403].includes(error.response?.status) && !originalRequest._retry) {
        originalRequest._retry = true
        const refreshToken = useCookie('refreshToken').value

        if (refreshToken) {
          try {
            const response = await axios.post(`${defaultUrl}/auth/refresh`, {
              refreshToken,
            })

            if (response.data.accessToken && response.data.refreshToken) {
              // Store new access token and refresh token
              useCookie('accessToken', { path: '/', maxAge: 60 * 60 }).value = response.data.accessToken // 1 hour
              useCookie('refreshToken', { path: '/', maxAge: 60 * 60 * 24 * 7 }).value = response.data.refreshToken // 7 days
              // Retry original request with new token
              originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`
              return $api(originalRequest)
            }
            else {
              // No access token or refresh token in response, treat as refresh failure
              throw new Error('No access token or refresh token returned from refresh endpoint')
            }
          }
          catch (refreshError) {
            console.error('Token refresh failed:', refreshError)
            useCookie('accessToken', { path: '/' }).value = null
            useCookie('refreshToken', { path: '/' }).value = null
            useCookie('userId', { path: '/' }).value = null
            await router.push('/login')
            return Promise.reject(refreshError)
          }
        }
        else {
          useCookie('accessToken', { path: '/' }).value = null
          useCookie('refreshToken', { path: '/' }).value = null
          useCookie('userId', { path: '/' }).value = null
          await router.push('/login')
          return Promise.reject(error)
        }
      }

      return Promise.reject(error)
    },
  )

  return {
    provide: {
      api: $api,
    },
  }
})
