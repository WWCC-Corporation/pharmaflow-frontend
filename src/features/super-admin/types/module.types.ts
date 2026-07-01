import type { LucideIcon } from 'lucide-react'

export type ModuleMetric = {
  label: string
  value: string
  detail: string
  icon: LucideIcon
  tone: string
}

export type ModuleAction = {
  label: string
  description: string
  icon: LucideIcon
}

export type ModulePageConfig = {
  error?: string | null
  isLoading?: boolean
  path: string
  title: string
  description: string
  primaryAction: string
  searchPlaceholder: string
  metrics: ModuleMetric[]
  tableTitle: string
  tableDescription: string
  columns: string[]
  rows: string[][]
  actionsTitle: string
  actions: ModuleAction[]
}

export type ModuleFormField = {
  key: string
  label: string
  placeholder?: string
  required?: boolean
  type?: 'checkbox' | 'date' | 'email' | 'number' | 'select' | 'text'
  options?: Array<{ label: string; value: string }>
}
