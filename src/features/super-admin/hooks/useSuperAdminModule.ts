import { useEffect, useState } from 'react'
import { fetchSuperAdminModule } from '../services/superAdmin.api'
import { getSuperAdminModule } from '../services/superAdmin.mock'
import type { ModulePageConfig } from '../types/module.types'

export function useSuperAdminModule(path: string) {
  const [module, setModule] = useState<ModulePageConfig | undefined>(() => toApiPendingModule(getSuperAdminModule(path)))

  useEffect(() => {
    let isMounted = true
    setModule(toApiPendingModule(getSuperAdminModule(path)))

    fetchSuperAdminModule(path).then((data) => {
      if (isMounted) {
        setModule(data ? { ...data, isLoading: false } : undefined)
      }
    })

    return () => {
      isMounted = false
    }
  }, [path])

  return module
}

function toApiPendingModule(module: ModulePageConfig | undefined): ModulePageConfig | undefined {
  if (!module) {
    return undefined
  }

  return {
    ...module,
    error: null,
    isLoading: true,
    metrics: module.metrics.map((metric) => ({ ...metric, detail: 'Consultando backend', value: '0' })),
    rows: [],
  }
}
