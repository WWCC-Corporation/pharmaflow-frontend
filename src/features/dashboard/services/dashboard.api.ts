import { CalendarDays, CreditCard, FileText, PackageCheck, ShoppingCart } from 'lucide-react'
import { getJson } from '../../../services/api'
import type {
  CashMovement,
  DashboardInventorySummary,
  DashboardMetric,
  DashboardTableRow,
  SalesChartPoint,
  TopProduct,
} from '../types/dashboard.types'

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

type ResumenVentasResponse = {
  desde: string | null
  hasta: string | null
  idSucursal: string | null
  totalVentas: number
  totalVendido: number
  promedioVenta: number
  ventasAnuladas: number
  ventasPorDia: VentaPorDiaResponse[]
}

type VentaPorDiaResponse = {
  fecha: string
  cantidadVentas: number
  totalVendido: number
}

type ResumenInventarioResponse = {
  idSucursal: string | null
  productosStockBajo: number
  totalProductosPorVencer: number
  productosVencidos: number
  stockBajo: StockBajoResponse[]
  productosPorVencer: ProductoPorVencerResponse[]
}

type StockBajoResponse = {
  sucursal: string
  producto: string
  codigoBarra?: string | null
  stockMinimo: number
  stockTotal: number
  estado?: string | null
}

type ProductoPorVencerResponse = {
  sucursal: string
  producto: string
  numeroLote: string
  fechaVencimiento: string
  stockActual: number
  estado?: string | null
}

export type DashboardApiData = {
  cashMovements: CashMovement[]
  inventory: DashboardInventorySummary
  metrics: DashboardMetric[]
  recentPurchases: DashboardTableRow[]
  recentSales: DashboardTableRow[]
  salesSeries: SalesChartPoint[]
  topProducts: TopProduct[]
}

export async function fetchDashboardResumen(filters: DashboardFilters = {}) {
  const data = await getJson<DashboardResumenResponse>('/api/dashboard/resumen', {
    Fecha: filters.fecha,
    IdSucursal: filters.idSucursal,
  })

  return mapDashboardResumen(data)
}

export async function fetchDashboardSalesSeries(filters: DashboardFilters = {}) {
  const endDate = filters.fecha ?? getLocalDate()
  const startDate = addDays(endDate, -6)
  const data = await getJson<ResumenVentasResponse>('/api/reportes/ventas/resumen', {
    Desde: startDate,
    Hasta: endDate,
    IdSucursal: filters.idSucursal,
  })

  return mapSalesSeries(data.ventasPorDia, startDate, endDate)
}

export async function fetchDashboardInventory(filters: DashboardFilters = {}) {
  const data = await getJson<ResumenInventarioResponse>('/api/reportes/inventario/resumen', {
    IdSucursal: filters.idSucursal,
    DiasVencimiento: 30,
  })

  return mapInventory(data)
}

export function getEmptyDashboardData(): DashboardApiData {
  return {
    cashMovements: [],
    inventory: getEmptyInventory(),
    metrics: buildMetrics({
      alertasNoLeidas: 0,
      comprasHoy: 0,
      montoVendidoHoy: 0,
      productosPorVencer: 0,
      productosStockBajo: 0,
      ventasHoy: 0,
    }),
    recentPurchases: [],
    recentSales: [],
    salesSeries: mapSalesSeries([], addDays(getLocalDate(), -6), getLocalDate()),
    topProducts: [],
  }
}

function mapDashboardResumen(data: DashboardResumenResponse): DashboardApiData {
  return {
    cashMovements: data.movimientosCajaRecientes.map((movement) => ({
      amount: formatMoney(movement.monto ?? 0),
      date: formatDateTime(movement.fecha),
      type: isCashOut(movement.descripcion) ? 'Egreso' : 'Ingreso',
    })),
    metrics: buildMetrics(data),
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
    salesSeries: mapSalesSeries([], addDays(data.fechaConsulta.slice(0, 10), -6), data.fechaConsulta.slice(0, 10)),
    inventory: getEmptyInventory(),
    topProducts: [],
  }
}

function buildMetrics(data: Pick<DashboardResumenResponse, 'alertasNoLeidas' | 'comprasHoy' | 'montoVendidoHoy' | 'productosPorVencer' | 'productosStockBajo' | 'ventasHoy'>): DashboardMetric[] {
  return [
      {
        label: 'Ventas del dia',
        value: String(data.ventasHoy),
        detail: data.ventasHoy === 1 ? '1 venta registrada' : `${data.ventasHoy} ventas registradas`,
        icon: FileText,
        bubble: 'bg-purple-100 text-[#AE19C2]',
        footer: 'trend',
      },
      {
        label: 'Total vendido del dia',
        value: formatMoney(data.montoVendidoHoy),
        detail: data.ventasHoy > 0 ? `Promedio ${formatMoney(data.montoVendidoHoy / data.ventasHoy)}` : 'Sin ventas registradas',
        icon: CreditCard,
        bubble: 'bg-purple-100 text-[#AE19C2]',
        footer: 'progress',
      },
      {
        label: 'Compras del dia',
        value: String(data.comprasHoy),
        detail: 'Recepciones y compras',
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
    ]
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

function mapInventory(data: ResumenInventarioResponse): DashboardInventorySummary {
  return {
    expiredCount: data.productosVencidos,
    expiringCount: data.totalProductosPorVencer,
    expiringProducts: data.productosPorVencer.map((item) => ({
      branch: item.sucursal,
      currentStock: item.stockActual,
      expirationDate: item.fechaVencimiento,
      lot: item.numeroLote,
      product: item.producto,
      status: item.estado ?? undefined,
    })),
    lowStock: data.stockBajo.map((item) => ({
      branch: item.sucursal,
      code: item.codigoBarra ?? undefined,
      currentStock: item.stockTotal,
      minimumStock: item.stockMinimo,
      product: item.producto,
      status: item.estado ?? undefined,
    })),
    lowStockCount: data.productosStockBajo,
  }
}

function getEmptyInventory(): DashboardInventorySummary {
  return {
    expiredCount: 0,
    expiringCount: 0,
    expiringProducts: [],
    lowStock: [],
    lowStockCount: 0,
  }
}

function mapSalesSeries(items: VentaPorDiaResponse[], startDate: string, endDate: string): SalesChartPoint[] {
  const totals = new Map(
    items.map((item) => [
      item.fecha.slice(0, 10),
      {
        salesCount: item.cantidadVentas,
        total: item.totalVendido,
      },
    ]),
  )

  return getDateRange(startDate, endDate).map((date) => {
    const value = totals.get(date)

    return {
      date,
      label: formatDayLabel(date),
      salesCount: value?.salesCount ?? 0,
      total: value?.total ?? 0,
    }
  })
}

function getDateRange(startDate: string, endDate: string) {
  const dates: string[] = []
  let cursor = parseLocalDate(startDate)
  const end = parseLocalDate(endDate)

  while (cursor <= end) {
    dates.push(toDateInputValue(cursor))
    cursor = new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate() + 1)
  }

  return dates
}

function addDays(date: string, days: number) {
  const value = parseLocalDate(date)
  value.setDate(value.getDate() + days)

  return toDateInputValue(value)
}

function getLocalDate() {
  return toDateInputValue(new Date())
}

function parseLocalDate(value: string) {
  const [year, month, day] = value.split('-').map(Number)

  return new Date(year, month - 1, day)
}

function toDateInputValue(value: Date) {
  const year = value.getFullYear()
  const month = String(value.getMonth() + 1).padStart(2, '0')
  const day = String(value.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function formatDayLabel(value: string) {
  return new Intl.DateTimeFormat('es-PE', {
    weekday: 'short',
  })
    .format(parseLocalDate(value))
    .replace('.', '')
}
