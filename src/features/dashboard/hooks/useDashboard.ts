import { useEffect, useState } from 'react'
import {
  fetchDashboardInventory,
  fetchDashboardResumen,
  fetchDashboardSalesSeries,
  getEmptyDashboardData,
  type DashboardApiData,
  type DashboardFilters,
} from '../services/dashboard.api'

const getToday = () => new Date().toISOString().slice(0, 10)
const initialDashboard: DashboardApiData = getEmptyDashboardData()

export function useDashboard() {
  const [dashboard, setDashboard] = useState<DashboardApiData>(initialDashboard)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState<DashboardFilters>({ fecha: getToday() })

  useEffect(() => {
    let isMounted = true
    const timer = window.setTimeout(() => {
      if (isMounted) {
        setIsLoading(true)
      }
    }, 0)

    Promise.allSettled([fetchDashboardResumen(filters), fetchDashboardSalesSeries(filters), fetchDashboardInventory(filters)])
      .then(([summaryResult, salesSeriesResult, inventoryResult]) => {
        if (isMounted) {
          const summary = summaryResult.status === 'fulfilled' ? summaryResult.value : getEmptyDashboardData()
          const salesSeries = salesSeriesResult.status === 'fulfilled' ? salesSeriesResult.value : summary.salesSeries
          const inventory = inventoryResult.status === 'fulfilled' ? inventoryResult.value : summary.inventory

          setDashboard({
            ...summary,
            inventory,
            salesSeries,
          })
          setError(summaryResult.status === 'fulfilled' ? null : 'No se pudo actualizar el resumen. Intenta nuevamente en unos minutos.')
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false)
        }
      })

    return () => {
      isMounted = false
      window.clearTimeout(timer)
    }
  }, [filters])

  return {
    cashMovements: dashboard.cashMovements,
    error,
    filters,
    inventory: dashboard.inventory,
    isLoading,
    metrics: dashboard.metrics,
    recentPurchases: dashboard.recentPurchases,
    recentSales: dashboard.recentSales,
    salesSeries: dashboard.salesSeries,
    setFilters,
    topProducts: dashboard.topProducts,
  }
}
