import { useEffect, useState } from 'react'
import { fetchSalesData, getEmptySalesData } from '../services/sales.api'
import type { QuickSaleItem, SaleRow, SalesMetric } from '../types/sales.types'

export function useSales() {
  const initialData = getEmptySalesData()
  const [metrics, setMetrics] = useState<SalesMetric[]>(initialData.metrics)
  const [quickItems, setQuickItems] = useState<QuickSaleItem[]>(initialData.quickSaleItems)
  const [sales, setSales] = useState<SaleRow[]>(initialData.sales)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const reload = async () => {
    setIsLoading(true)
    try {
      const data = await fetchSalesData()
      setMetrics(data.metrics)
      setQuickItems(data.quickSaleItems)
      setSales(data.sales)
      setError(null)
    } catch (err) {
      const emptyData = getEmptySalesData()
      setMetrics(emptyData.metrics)
      setQuickItems(emptyData.quickSaleItems)
      setSales(emptyData.sales)
      setError(err instanceof Error ? err.message : 'No se pudo cargar ventas.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void reload()
    }, 0)

    return () => {
      window.clearTimeout(timer)
    }
  }, [])

  return {
    error,
    isLoading,
    metrics,
    quickSaleItems: quickItems,
    reload,
    sales,
  }
}
