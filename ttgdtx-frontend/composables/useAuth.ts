export const useAuth = () => {
  const { loggedIn, user, session, clear, fetch: fetchSession } = useUserSession()

  const login = async (credentials: { email: string, password: string }) => {
    try {
      await $fetch('/api/auth/login', {
        method: 'POST',
        body: credentials,
      })

      // Refresh the session after login
      await fetchSession()

      return { success: true }
    }
    catch (error: unknown) {
      const err = error as { statusCode?: number, message?: string }
      throw createError({
        statusCode: err.statusCode || 401,
        statusMessage: err.message || 'Login failed',
      })
    }
  }

  const logout = async () => {
    try {
      await $fetch('/api/auth/logout', {
        method: 'POST',
      })
    }
    catch (error) {
      console.error('Logout error:', error)
    }
    finally {
      await clear()
      await navigateTo('/login')
    }
  }

  const refreshTokens = async () => {
    try {
      const { data } = await $fetch<{ data: { accessToken: string } }>('/api/auth/refresh', {
        method: 'POST',
      })

      // Refresh the session after token refresh
      await fetchSession()

      return data.accessToken
    }
    catch (error) {
      await logout()
      throw error
    }
  }

  return {
    user: readonly(user),
    loggedIn: readonly(loggedIn),
    session: readonly(session),
    login,
    logout,
    refreshTokens,
    fetchSession,
  }
}
