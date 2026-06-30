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
