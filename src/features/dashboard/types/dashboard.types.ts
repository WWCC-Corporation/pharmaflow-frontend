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
