import { CreditCard, FileText, ShoppingCart, Trash2 } from 'lucide-react'
import type { QuickSaleItem, SaleRow, SalesMetric } from '../types/sales.types'

export const salesMetrics: SalesMetric[] = [
  {
    label: 'Ventas realizadas',
    value: '145',
    detail: '12% respecto ayer',
    icon: ShoppingCart,
    bubble: 'bg-purple-100 text-[#AE19C2]',
  },
  {
    label: 'Total vendido',
    value: 'S/ 12,540',
    detail: 'Meta diaria 83%',
    icon: CreditCard,
    bubble: 'bg-purple-100 text-[#AE19C2]',
  },
  {
    label: 'Ticket promedio',
    value: 'S/ 86.48',
    detail: 'Por venta completada',
    icon: FileText,
    bubble: 'bg-sky-100 text-sky-500',
  },
  {
    label: 'Ventas anuladas',
    value: '3',
    detail: 'Revisar motivos',
    icon: Trash2,
    bubble: 'bg-rose-100 text-rose-500',
  },
]

export const salesRows: SaleRow[] = [
  {
    code: 'VNT-2045',
    customer: 'Juan Perez',
    products: 'Paracetamol 500mg, Vitamina C',
    paymentMethod: 'Yape',
    status: 'Completada',
    total: 'S/ 85.00',
    date: '16/06/2026 10:45',
  },
  {
    code: 'VNT-2044',
    customer: 'Maria Torres',
    products: 'Ibuprofeno 400mg',
    paymentMethod: 'Efectivo',
    status: 'Completada',
    total: 'S/ 42.50',
    date: '16/06/2026 10:15',
  },
  {
    code: 'VNT-2043',
    customer: 'Luis Gomez',
    products: 'Amoxicilina 500mg',
    paymentMethod: 'Tarjeta',
    status: 'Completada',
    total: 'S/ 135.00',
    date: '16/06/2026 09:50',
  },
  {
    code: 'VNT-2042',
    customer: 'Ana Martinez',
    products: 'Omeprazol 20mg',
    paymentMethod: 'Yape',
    status: 'Completada',
    total: 'S/ 62.00',
    date: '16/06/2026 09:20',
  },
  {
    code: 'VNT-2041',
    customer: 'Carlos Diaz',
    products: 'Loratadina 10mg',
    paymentMethod: 'Efectivo',
    status: 'Anulada',
    total: 'S/ 28.90',
    date: '16/06/2026 09:05',
  },
]

export const quickSaleItems: QuickSaleItem[] = [
  { product: 'Paracetamol 500mg', batch: 'LT-2034', quantity: 2, price: 'S/ 8.50', total: 'S/ 17.00' },
  { product: 'Vitamina C 1000mg', batch: 'LT-1180', quantity: 1, price: 'S/ 18.00', total: 'S/ 18.00' },
  { product: 'Ibuprofeno 400mg', batch: 'LT-9812', quantity: 1, price: 'S/ 12.50', total: 'S/ 12.50' },
]
