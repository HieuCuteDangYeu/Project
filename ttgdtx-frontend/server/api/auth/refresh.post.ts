export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  const config = useRuntimeConfig()

  if (!session?.refreshToken) {
    throw createError({
      statusCode: 401,
      statusMessage: 'No refresh token available',
    })
  }

  try {
    const response = await $fetch<{ accessToken: string, refreshToken: string }>(`${config.public.authBaseURL}/auth/refresh`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session.refreshToken}`,
      },
    })

    // Update the session with new tokens
    await setUserSession(event, {
      user: session.user,
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
      loggedInAt: session.loggedInAt,
    })

    return { success: true, data: response }
  }
  catch (error: unknown) {
    let statusCode = 401
    type ErrorWithStatusCode = { statusCode: number }
    if (error && typeof error === 'object' && 'statusCode' in error && typeof (error as ErrorWithStatusCode).statusCode === 'number') {
      statusCode = (error as ErrorWithStatusCode).statusCode
    }
    throw createError({
      statusCode,
      statusMessage: 'Token refresh failed',
    })
  }
})
