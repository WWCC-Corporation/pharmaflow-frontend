import { CalendarDays, CreditCard, FileText, PackageCheck, ShoppingCart } from 'lucide-react'
import { getJson } from '../../../services/api'
import type { CashMovement, DashboardMetric, DashboardTableRow } from '../types/dashboard.types'

const DEFAULT_DATE = '2026-06-22'

export type DashboardFilters = {
  fecha?: string
  idSucursal?: string
}

type DashboardResumenResponse = {
  fechaConsulta: string
  idSucursal: string | null
  ventasHoy: number
  montoVendidoHoy: number
  comprasHoy: number
  alertasNoLeidas: number
  productosStockBajo: number
  productosPorVencer: number
  ventasRecientes: ActividadReciente[]
  comprasRecientes: ActividadReciente[]
  movimientosCajaRecientes: ActividadReciente[]
}

type ActividadReciente = {
  id: string
  tipo: string
  descripcion: string
  monto: number | null
  fecha: string
}

export type DashboardApiData = {
  cashMovements: CashMovement[]
  metrics: DashboardMetric[]
  recentPurchases: DashboardTableRow[]
  recentSales: DashboardTableRow[]
}

export async function fetchDashboardResumen(filters: DashboardFilters = {}) {
  const data = await getJson<DashboardResumenResponse>('/api/dashboard/resumen', {
    Fecha: filters.fecha ?? DEFAULT_DATE,
    IdSucursal: filters.idSucursal,
  })

  return mapDashboardResumen(data)
}

function mapDashboardResumen(data: DashboardResumenResponse): DashboardApiData {
  return {
    cashMovements: data.movimientosCajaRecientes.map((movement) => ({
      amount: formatMoney(movement.monto ?? 0),
      date: formatDateTime(movement.fecha),
      type: isCashOut(movement.descripcion) ? 'Egreso' : 'Ingreso',
    })),
    metrics: [
      {
        label: 'Ventas de hoy',
        value: String(data.ventasHoy),
        detail: 'Datos reales del API',
        icon: FileText,
        bubble: 'bg-purple-100 text-[#AE19C2]',
        footer: 'trend',
      },
      {
        label: 'Total vendido hoy',
        value: formatMoney(data.montoVendidoHoy),
        detail: `${data.alertasNoLeidas} alertas sin leer`,
        icon: CreditCard,
        bubble: 'bg-purple-100 text-[#AE19C2]',
        footer: 'progress',
      },
      {
        label: 'Compras de hoy',
        value: String(data.comprasHoy),
        detail: 'Recepciones y compras del dia',
        icon: ShoppingCart,
        bubble: 'bg-sky-100 text-sky-500',
        footer: 'spark',
      },
      {
        label: 'Productos con stock bajo',
        value: String(data.productosStockBajo),
        detail: 'Requieren reposicion',
        icon: PackageCheck,
        bubble: 'bg-orange-100 text-orange-500',
        footer: 'warning',
      },
      {
        label: 'Productos por vencer',
        value: String(data.productosPorVencer),
        detail: 'Proximos 30 dias',
        icon: CalendarDays,
        bubble: 'bg-rose-100 text-rose-500',
        footer: 'danger',
      },
    ],
    recentPurchases: data.comprasRecientes.map((purchase) => [
      shortCode(purchase.id, 'CMP'),
      purchase.descripcion,
      purchase.monto === null ? 'Sin monto' : formatMoney(purchase.monto),
      formatDateTime(purchase.fecha),
    ]),
    recentSales: data.ventasRecientes.map((sale) => [
      shortCode(sale.id, 'VNT'),
      sale.descripcion,
      'Registrado',
      formatMoney(sale.monto ?? 0),
      formatDateTime(sale.fecha),
    ]),
  }
}

function formatMoney(value: number) {
  return new Intl.NumberFormat('es-PE', {
    currency: 'PEN',
    style: 'currency',
  }).format(value)
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('es-PE', {
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(value))
}

function shortCode(id: string, prefix: string) {
  return `${prefix}-${id.slice(-4).toUpperCase()}`
}

function isCashOut(value: string) {
  return value.includes('SALIDA') || value.includes('EGRESO')
}
