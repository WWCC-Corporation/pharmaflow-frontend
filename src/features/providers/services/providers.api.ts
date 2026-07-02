import { apiBaseUrl, getJson } from '../../../services/api'
import type {
    CreateProviderRequest,
    Provider,
    UpdateProviderRequest,
} from '../types/provider.types'

const PROVIDERS_ENDPOINT = '/api/proveedores'

async function sendJson<T>(
    path: string,
    method: 'POST' | 'PUT' | 'DELETE',
    body?: unknown,
) {
    const url = new URL(path, apiBaseUrl)

    const response = await fetch(url, {
        method,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
    })

    if (!response.ok) {
        throw new Error(`Error ${response.status} al consultar ${url.pathname}`)
    }

    if (response.status === 204) {
        return undefined as T
    }

    return response.json() as Promise<T>
}

export function getProviders() {
    return getJson<Provider[]>(PROVIDERS_ENDPOINT)
}

export function createProvider(payload: CreateProviderRequest) {
    return sendJson<Provider>(PROVIDERS_ENDPOINT, 'POST', payload)
}

export function updateProvider(id: string, payload: UpdateProviderRequest) {
    return sendJson<Provider>(`${PROVIDERS_ENDPOINT}/${id}`, 'PUT', payload)
}

export function deleteProvider(id: string) {
    return sendJson<void>(`${PROVIDERS_ENDPOINT}/${id}`, 'DELETE')
}