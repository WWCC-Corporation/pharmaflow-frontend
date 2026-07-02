const DEFAULT_API_URL = 'https://pharmaflow-backend-if9y.onrender.com'
const AUTH_STORAGE_KEY = 'pharmaflow.auth'

export const apiBaseUrl = import.meta.env.VITE_API_URL ?? DEFAULT_API_URL

type QueryValue = string | number | boolean | null | undefined

type ApiOptions = {
  body?: unknown
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  params?: Record<string, QueryValue>
}

export async function apiRequest<T>(path: string, options: ApiOptions = {}) {
  const url = new URL(path, apiBaseUrl)

  Object.entries(options.params ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value))
    }
  })

  const response = await fetch(url, {
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
    headers: {
      Accept: 'application/json',
      ...authHeader(),
      ...(options.body === undefined ? {} : { 'Content-Type': 'application/json' }),
    },
    method: options.method ?? 'GET',
  })

  if (!response.ok) {
    let message = `Error ${response.status} al consultar ${url.pathname}`

    try {
      const payload = (await response.json()) as { mensaje?: string; message?: string; Message?: string }
      message = payload.mensaje ?? payload.message ?? payload.Message ?? message
    } catch {
      // Keep the HTTP level message when the backend returns no JSON body.
    }

    throw new Error(message)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}

export function getJson<T>(path: string, params?: Record<string, QueryValue>) {
  return apiRequest<T>(path, { params })
}

export function postJson<T>(path: string, body: unknown) {
  return apiRequest<T>(path, { body, method: 'POST' })
}

export function putJson<T>(path: string, body: unknown) {
  return apiRequest<T>(path, { body, method: 'PUT' })
}

export function deleteJson<T>(path: string) {
  return apiRequest<T>(path, { method: 'DELETE' })
}

function authHeader(): Record<string, string> {
  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY)

    if (!raw) {
      return {}
    }

    const session = JSON.parse(raw) as { token?: string }

    return session.token ? { Authorization: `Bearer ${session.token}` } : {}
  } catch {
    return {}
  }
}
