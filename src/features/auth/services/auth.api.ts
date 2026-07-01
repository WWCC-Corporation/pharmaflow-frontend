import { postJson } from '../../../services/api'
import type { AuthSession, AuthUser } from '../types/auth.types'

export const AUTH_STORAGE_KEY = 'pharmaflow.auth'

type LoginPayload = {
  correo: string
  password: string
}

export async function login(payload: LoginPayload) {
  const session = await postJson<AuthSession>('/api/auth/login', payload)
  saveSession(session)

  return session
}

export async function logout() {
  const session = getStoredSession()

  if (session?.refreshToken) {
    try {
      await postJson<void>('/api/auth/logout', { refreshToken: session.refreshToken })
    } catch {
      // Local session is cleared even when server logout is unavailable.
    }
  }

  clearSession()
}

export function saveSession(session: AuthSession) {
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session))
}

export function clearSession() {
  window.localStorage.removeItem(AUTH_STORAGE_KEY)
}

export function getStoredSession() {
  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY)

    return raw ? (JSON.parse(raw) as AuthSession) : null
  } catch {
    clearSession()

    return null
  }
}

export function mapSessionToUser(session: AuthSession): AuthUser {
  const name = session.correo.split('@')[0].replace(/[._-]+/g, ' ')
  const displayName = toTitleCase(name || 'Usuario')
  const roleKey = normalizeRole(session.rol)

  return {
    correo: session.correo,
    id: session.usuarioId,
    initials: getInitials(displayName),
    name: displayName,
    role: getRoleLabel(roleKey),
    roleKey,
  }
}

export function normalizeRole(role: string) {
  return role.trim().toLowerCase()
}

export function getRoleLabel(role: string) {
  const labels: Record<string, string> = {
    administrador: 'Administrador',
    operador: 'Operador',
    super_admin: 'Super Admin',
  }

  return labels[role] ?? 'Usuario'
}

function toTitleCase(value: string) {
  return value.replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function getInitials(value: string) {
  const parts = value.trim().split(/\s+/).filter(Boolean)

  return `${parts[0]?.[0] ?? 'U'}${parts[1]?.[0] ?? ''}`.toUpperCase()
}
