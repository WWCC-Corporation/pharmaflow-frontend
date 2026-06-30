import type { LucideIcon } from 'lucide-react'

export type SalesMetric = {
  label: string
  value: string
  detail: string
  icon: LucideIcon
  bubble: string
}

export type SaleStatus = 'Completada' | 'Anulada'

export type PaymentMethod = 'Yape' | 'Efectivo' | 'Tarjeta'

export type SaleRow = {
  code: string
  customer: string
  products: string
  paymentMethod: PaymentMethod
  status: SaleStatus
  total: string
  date: string
}

export type QuickSaleItem = {
  product: string
  batch: string
  quantity: number
  price: string
  total: string
}
