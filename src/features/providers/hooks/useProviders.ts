import { useCallback, useEffect, useState } from 'react'
import { getProviders } from '../services/providers.api'
import type { Provider } from '../types/provider.types'

export function useProviders() {
    const [providers, setProviders] = useState<Provider[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const reload = useCallback(async () => {
        setIsLoading(true)
        setError(null)

        try {
            const data = await getProviders()
            setProviders(data)
        } catch (error) {
            setError(error instanceof Error ? error.message : 'No se pudieron cargar los proveedores.')
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        void reload()
    }, [reload])

    return {
        providers,
        isLoading,
        error,
        reload,
    }
}