import { useMemo, useState } from 'react'
import { getStoredSession, login, logout, mapSessionToUser } from '../services/auth.api'
import type { AuthSession } from '../types/auth.types'

export function useAuth() {
  const [session, setSession] = useState<AuthSession | null>(() => getStoredSession())
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)

  const user = useMemo(() => (session ? mapSessionToUser(session) : null), [session])

  const signIn = async (correo: string, password: string) => {
    setIsAuthenticating(true)
    setAuthError(null)

    try {
      const nextSession = await login({ correo, password })
      setSession(nextSession)

      return nextSession
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo iniciar sesion.'
      setAuthError(message)
      throw error
    } finally {
      setIsAuthenticating(false)
    }
  }

  const signOut = async () => {
    await logout()
    setSession(null)
  }

  return {
    authError,
    isAuthenticating,
    session,
    signIn,
    signOut,
    user,
  }
}
