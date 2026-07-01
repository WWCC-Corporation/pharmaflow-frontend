import type { LucideIcon } from 'lucide-react'

export type DashboardMetric = {
  label: string
  value: string
  detail: string
  icon: LucideIcon
  bubble: string
  footer: 'trend' | 'progress' | 'spark' | 'warning' | 'danger'
}

export type TopProduct = {
  name: string
  units: string
  percent: number
  color: string
}

export type DashboardTableRow = string[]

export type CashMovement = {
  type: 'Ingreso' | 'Egreso'
  amount: string
  date: string
}

export type SalesChartPoint = {
  date: string
  label: string
  total: number
  salesCount: number
}

export type DashboardInventoryItem = {
  product: string
  branch: string
  code?: string
  lot?: string
  currentStock: number
  minimumStock?: number
  expirationDate?: string
  status?: string
}

export type DashboardInventorySummary = {
  lowStockCount: number
  expiringCount: number
  expiredCount: number
  lowStock: DashboardInventoryItem[]
  expiringProducts: DashboardInventoryItem[]
}
