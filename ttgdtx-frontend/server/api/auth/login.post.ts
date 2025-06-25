export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const config = useRuntimeConfig()

  try {
    interface LoginResponse {
      user: {
        id: string
        email: string
        name: string
      }
      accessToken: string
      refreshToken: string
    }
    const response = await $fetch<LoginResponse>(`${config.public.authBaseURL}/auth/login`, {
      method: 'POST',
      body: body,
    })

    // Set user session using nuxt-auth-utils
    await setUserSession(event, {
      user: response.user,
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
      loggedInAt: new Date(),
    })

    console.log(response)

    return { success: true, data: response }
  }
  catch (error: unknown) {
    if (error && typeof error === 'object' && 'statusCode' in error && 'message' in error) {
      const err = error as { statusCode?: number, message?: string }
      throw createError({
        statusCode: err.statusCode || 500,
        statusMessage: err.message || 'Authentication failed',
      })
    }
    else {
      throw createError({
        statusCode: 500,
        statusMessage: 'Authentication failed',
      })
    }
  }
})
