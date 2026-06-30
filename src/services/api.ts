const DEFAULT_API_URL = 'https://pharmaflow-backend-if9y.onrender.com'

export const apiBaseUrl = import.meta.env.VITE_API_URL ?? DEFAULT_API_URL

export async function getJson<T>(path: string, params?: Record<string, string | number | boolean | undefined>) {
  const url = new URL(path, apiBaseUrl)

  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      url.searchParams.set(key, String(value))
    }
  })

  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`Error ${response.status} al consultar ${url.pathname}`)
  }

  return response.json() as Promise<T>
}
