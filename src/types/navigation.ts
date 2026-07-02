import type { LucideIcon } from 'lucide-react'

export type NavigationItem = {
  label: string
  icon: LucideIcon
  path: string
  roles?: string[]
}
