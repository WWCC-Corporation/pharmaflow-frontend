import { CreditCard, FileText, ShoppingCart, Trash2 } from 'lucide-react'
import { getJson, postJson } from '../../../services/api'
import type { QuickSaleItem, SaleRow, SalesMetric } from '../types/sales.types'

type VentaResponse = {
  id: string
  estado?: number | string | null
  metodo?: number | string | null
  idCliente?: string | null
  fecha?: string | null
  montoTotal: number
  detalles?: Array<{
    idProducto?: string | null
    cantidad: number
    precioUnitario?: number | null
  }>
}

export type CreateSalePayload = {
  idCliente?: string
  idProducto: string
  idSucursal: string
  idTurnoCaja?: string
  idUsuario?: string
  metodo: number
  moneda: number
  montoRecibido: number
  precioUnitario: number
  cantidad: number
  tipoCambio: number
}

const money = new Intl.NumberFormat('es-PE', { currency: 'PEN', style: 'currency' })
const dateTime = new Intl.DateTimeFormat('es-PE', {
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  month: '2-digit',
  year: 'numeric',
})

export async function fetchSalesData() {
  const ventas = await getJson<VentaResponse[]>('/api/ventas')
  const completed = ventas.filter((sale) => normalizeStatus(sale.estado) === 'Completada')
  const cancelled = ventas.filter((sale) => normalizeStatus(sale.estado) === 'Anulada')
  const total = completed.reduce((sum, sale) => sum + Number(sale.montoTotal ?? 0), 0)
  const average = completed.length === 0 ? 0 : total / completed.length

  return {
    metrics: buildMetrics(ventas.length, total, average, cancelled.length),
    quickSaleItems: buildQuickItems(),
    sales: ventas.map(mapSaleRow),
  }
}

export function getEmptySalesData() {
  return {
    metrics: buildMetrics(0, 0, 0, 0),
    quickSaleItems: [],
    sales: [],
  }
}

export async function createSale(payload: CreateSalePayload) {
  const montoTotal = Number(payload.cantidad) * Number(payload.precioUnitario)

  return postJson('/api/ventas', {
    detalles: [
      {
        cantidad: Number(payload.cantidad),
        idProducto: payload.idProducto,
        precioUnitario: Number(payload.precioUnitario),
      },
    ],
    idCliente: payload.idCliente || null,
    idSucursal: payload.idSucursal,
    idTurnoCaja: payload.idTurnoCaja || null,
    idUsuario: payload.idUsuario || null,
    metodo: Number(payload.metodo),
    moneda: Number(payload.moneda),
    montoRecibido: Number(payload.montoRecibido),
    montoTotal,
    tipoCambio: Number(payload.tipoCambio || 1),
    vuelto: Number(payload.montoRecibido) - montoTotal,
  })
}

function buildMetrics(totalSales: number, totalAmount: number, average: number, cancelled: number): SalesMetric[] {
  return [
    {
      label: 'Ventas realizadas',
      value: String(totalSales),
      detail: 'Historial real del API',
      icon: ShoppingCart,
      bubble: 'bg-purple-100 text-[#AE19C2]',
    },
    {
      label: 'Total vendido',
      value: money.format(totalAmount),
      detail: 'Ventas completadas',
      icon: CreditCard,
      bubble: 'bg-purple-100 text-[#AE19C2]',
    },
    {
      label: 'Ticket promedio',
      value: money.format(average),
      detail: 'Por venta completada',
      icon: FileText,
      bubble: 'bg-sky-100 text-sky-500',
    },
    {
      label: 'Ventas anuladas',
      value: String(cancelled),
      detail: 'Segun estado del backend',
      icon: Trash2,
      bubble: 'bg-rose-100 text-rose-500',
    },
  ]
}

function mapSaleRow(sale: VentaResponse): SaleRow {
  return {
    code: shortCode(sale.id),
    customer: sale.idCliente ? `Cliente ${sale.idCliente.slice(-6)}` : 'Cliente general',
    date: sale.fecha ? dateTime.format(new Date(sale.fecha)) : '-',
    id: sale.id,
    paymentMethod: normalizePayment(sale.metodo),
    products: describeProducts(sale),
    status: normalizeStatus(sale.estado),
    total: money.format(Number(sale.montoTotal ?? 0)),
  }
}

function buildQuickItems(): QuickSaleItem[] {
  return []
}

function describeProducts(sale: VentaResponse) {
  const details = sale.detalles ?? []

  if (details.length === 0) {
    return 'Sin detalle'
  }

  return details
    .map((detail) => `${detail.cantidad} x ${detail.idProducto ? `Producto ${detail.idProducto.slice(-6)}` : 'producto'}`)
    .join(', ')
}

function normalizePayment(value: VentaResponse['metodo']) {
  const labels = ['Efectivo', 'Tarjeta', 'Yape', 'Plin'] as const

  if (typeof value === 'number') {
    return labels[value] ?? 'Efectivo'
  }

  const normalized = String(value ?? 'Efectivo').toLowerCase()
  if (normalized.includes('tarjeta')) return 'Tarjeta'
  if (normalized.includes('yape')) return 'Yape'
  if (normalized.includes('plin')) return 'Plin'
  return 'Efectivo'
}

function normalizeStatus(value: VentaResponse['estado']) {
  if (typeof value === 'number') {
    return value === 1 ? 'Anulada' : 'Completada'
  }

  return String(value ?? 'completada').toLowerCase().includes('anulada') ? 'Anulada' : 'Completada'
}

function shortCode(id: string) {
  return `VNT-${id.slice(-4).toUpperCase()}`
}
