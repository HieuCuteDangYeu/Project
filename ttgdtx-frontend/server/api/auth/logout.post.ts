export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  const config = useRuntimeConfig()

  if (session?.refreshToken) {
    try {
      await $fetch(`${config.public.authBaseURL}/auth/logout`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.refreshToken}`,
        },
      })
    }
    catch (error) {
      console.error('Backend logout error:', error)
    }
  }

  await clearUserSession(event)
  return { success: true }
})
