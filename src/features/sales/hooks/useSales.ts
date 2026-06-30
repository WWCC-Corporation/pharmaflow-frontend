import { quickSaleItems, salesMetrics, salesRows } from '../services/sales.mock'

export function useSales() {
  return {
    metrics: salesMetrics,
    quickSaleItems,
    sales: salesRows,
  }
}
