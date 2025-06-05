import { defineNuxtRouteMiddleware, navigateTo, useCookie } from 'nuxt/app'

export default defineNuxtRouteMiddleware(async (to) => {
  const accessToken = useCookie('accessToken').value
  const publicRoutes = ['/login', '/register', '/forgot-password']

  // If no access token and trying to access a protected route, redirect to login
  if (!accessToken && !publicRoutes.includes(to.path)) {
    return navigateTo('/login')
  }
})
