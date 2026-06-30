import { useEffect, useState } from 'react'
import { cashMovements, dashboardMetrics, recentPurchases, recentSales, topProducts } from '../services/dashboard.mock'
import { fetchDashboardResumen, type DashboardApiData, type DashboardFilters } from '../services/dashboard.api'

const initialDashboard: DashboardApiData = {
  cashMovements,
  metrics: dashboardMetrics,
  recentPurchases,
  recentSales,
}

export function useDashboard() {
  const [dashboard, setDashboard] = useState<DashboardApiData>(initialDashboard)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState<DashboardFilters>({ fecha: '2026-06-22' })

  useEffect(() => {
    let isMounted = true

    setIsLoading(true)
    fetchDashboardResumen(filters)
      .then((data) => {
        if (isMounted) {
          setDashboard(data)
          setError(null)
        }
      })
      .catch(() => {
        if (isMounted) {
          setDashboard(initialDashboard)
          setError('No se pudo conectar con el API. Mostrando datos de respaldo.')
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [filters])

  return {
    cashMovements: dashboard.cashMovements,
    error,
    filters,
    isLoading,
    metrics: dashboard.metrics,
    recentPurchases: dashboard.recentPurchases,
    recentSales: dashboard.recentSales,
    setFilters,
    topProducts,
  }
}
