import { CalendarDays, CreditCard, FileText, PackageCheck, ShoppingCart } from 'lucide-react'
import type { CashMovement, DashboardMetric, DashboardTableRow, TopProduct } from '../types/dashboard.types'

export const dashboardMetrics: DashboardMetric[] = [
  {
    label: 'Ventas de hoy',
    value: '145',
    detail: '12% respecto ayer',
    icon: FileText,
    bubble: 'bg-purple-100 text-[#AE19C2]',
    footer: 'trend',
  },
  {
    label: 'Total vendido hoy',
    value: 'S/ 12,540',
    detail: 'Meta diaria 83%',
    icon: CreditCard,
    bubble: 'bg-purple-100 text-[#AE19C2]',
    footer: 'progress',
  },
  {
    label: 'Compras de hoy',
    value: '23',
    detail: '5 pendientes',
    icon: ShoppingCart,
    bubble: 'bg-sky-100 text-sky-500',
    footer: 'spark',
  },
  {
    label: 'Productos con stock bajo',
    value: '18',
    detail: 'Requieren reposicion',
    icon: PackageCheck,
    bubble: 'bg-orange-100 text-orange-500',
    footer: 'warning',
  },
  {
    label: 'Productos por vencer',
    value: '7',
    detail: 'Proximos 30 dias',
    icon: CalendarDays,
    bubble: 'bg-rose-100 text-rose-500',
    footer: 'danger',
  },
]

export const topProducts: TopProduct[] = [
  { name: 'Paracetamol 500mg', units: '1,245 uds.', percent: 78, color: 'bg-[#AE19C2]' },
  { name: 'Ibuprofeno 400mg', units: '980 uds.', percent: 66, color: 'bg-[#AE19C2]' },
  { name: 'Amoxicilina 500mg', units: '765 uds.', percent: 54, color: 'bg-[#AE19C2]' },
  { name: 'Omeprazol 20mg', units: '620 uds.', percent: 42, color: 'bg-sky-400' },
  { name: 'Vitamina C 1000mg', units: '540 uds.', percent: 36, color: 'bg-sky-400' },
]

export const recentSales: DashboardTableRow[] = [
  ['VNT-2045', 'Juan Perez', 'Yape', 'S/ 85.00', '16/06/2026 10:45'],
  ['VNT-2044', 'Maria Torres', 'Efectivo', 'S/ 42.50', '16/06/2026 10:15'],
  ['VNT-2043', 'Luis Gomez', 'Tarjeta', 'S/ 135.00', '16/06/2026 09:50'],
  ['VNT-2042', 'Ana Martinez', 'Yape', 'S/ 62.00', '16/06/2026 09:20'],
  ['VNT-2041', 'Carlos Diaz', 'Efectivo', 'S/ 28.90', '16/06/2026 09:05'],
]

export const recentPurchases: DashboardTableRow[] = [
  ['Pharma Salud S.A.C.', 'Completada', 'S/ 3,250.00', '16/06/2026 09:30'],
  ['Distribuidora Medica', 'Pendiente', 'S/ 1,850.00', '16/06/2026 09:15'],
  ['Laboratorios Andinos', 'Completada', 'S/ 2,450.50', '16/06/2026 08:45'],
  ['Importaciones Farma', 'Pendiente', 'S/ 980.00', '16/06/2026 08:20'],
  ['BioPharma S.A.', 'Anulada', 'S/ 560.00', '15/06/2026 17:30'],
]

export const cashMovements: CashMovement[] = [
  { type: 'Ingreso', amount: 'S/ 500.00', date: '16/06/2026 10:40' },
  { type: 'Egreso', amount: 'S/ 120.00', date: '16/06/2026 10:20' },
  { type: 'Ingreso', amount: 'S/ 1,250.00', date: '16/06/2026 09:50' },
  { type: 'Egreso', amount: 'S/ 80.00', date: '16/06/2026 09:30' },
  { type: 'Ingreso', amount: 'S/ 300.00', date: '16/06/2026 09:10' },
]
