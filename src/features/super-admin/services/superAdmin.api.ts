import {
  AlertTriangle,
  Boxes,
  Briefcase,
  Building2,
  CreditCard,
  FileText,
  PackageCheck,
  Pill,
  Plus,
  ReceiptText,
  ShieldCheck,
  Store,
  Truck,
  UserCog,
  Users,
  WalletCards,
} from 'lucide-react'
import { getJson, postJson } from '../../../services/api'
import { getSuperAdminModule } from './superAdmin.mock'
import type { ModuleFormField, ModuleMetric, ModulePageConfig } from '../types/module.types'

type ApiRecord = Record<string, unknown>

const money = new Intl.NumberFormat('es-PE', { currency: 'PEN', style: 'currency' })
const dateTime = new Intl.DateTimeFormat('es-PE', {
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  month: '2-digit',
  year: 'numeric',
})

const fallbackMetricTone = 'bg-purple-100 text-[#AE19C2]'

export async function fetchSuperAdminModule(path: string): Promise<ModulePageConfig | undefined> {
  const base = getSuperAdminModule(path)

  if (!base) {
    return undefined
  }

  try {
    switch (path) {
      case '/compras':
        return withData(base, await buildCompras())
      case '/inventario':
        return withData(base, await buildInventario())
      case '/productos':
        return withData(base, await buildProductos())
      case '/clientes':
        return withData(base, await buildClientes())
      case '/proveedores':
        return withData(base, await buildProveedores())
      case '/caja':
        return withData(base, await buildCaja())
      case '/reportes':
        return withData(base, await buildReportes())
      case '/usuarios':
        return withData(base, await buildUsuarios())
      case '/sucursales':
        return withData(base, await buildSucursales())
      case '/configuracion':
        return {
          ...base,
          tableDescription: 'Parametros visibles del frontend conectado al backend',
          rows: [
            ['API base', import.meta.env.VITE_API_URL ?? 'https://pharmaflow-backend-if9y.onrender.com', 'Sistema', 'Activo', 'Frontend', today()],
            ['Modo datos', 'API real con respaldo visual', 'General', 'Activo', 'Frontend', today()],
            ['Monedas', 'PEN / USD', 'Ventas', 'Activo', 'Backend', today()],
            ['Metodos de pago', 'Efectivo / Tarjeta / Yape / Plin', 'Ventas', 'Activo', 'Backend', today()],
          ],
        }
      default:
        return base
    }
  } catch (error) {
    return {
      ...emptyModuleData(base),
      error: error instanceof Error ? error.message : 'No se pudo conectar con el backend.',
    }
  }
}

export function getModuleFormFields(path: string): ModuleFormField[] {
  const commonSucursal = { key: 'idSucursal', label: 'Sucursal ID', required: true }
  const commonUsuario = { key: 'idUsuario', label: 'Usuario ID' }

  const fields: Record<string, ModuleFormField[]> = {
    '/productos': [
      { key: 'nombre', label: 'Nombre', required: true },
      { key: 'principioActivo', label: 'Principio activo' },
      { key: 'laboratorio', label: 'Laboratorio' },
      { key: 'formaFarmaceutica', label: 'Forma farmaceutica' },
      { key: 'concentracion', label: 'Concentracion' },
      { key: 'codigoBarra', label: 'Codigo de barra' },
      { key: 'stockMinimo', label: 'Stock minimo', type: 'number' },
      { key: 'requiereReceta', label: 'Requiere receta', type: 'checkbox' },
    ],
    '/clientes': [
      { key: 'dni', label: 'DNI' },
      { key: 'nombres', label: 'Nombres', required: true },
      { key: 'apellidos', label: 'Apellidos' },
      { key: 'telefono', label: 'Telefono' },
      { key: 'correo', label: 'Correo', type: 'email' },
    ],
    '/proveedores': [
      { key: 'nombre', label: 'Nombre', required: true },
      { key: 'ruc', label: 'RUC' },
      { key: 'telefono', label: 'Telefono' },
      { key: 'correo', label: 'Correo', type: 'email' },
    ],
    '/sucursales': [
      { key: 'codigo', label: 'Codigo', required: true },
      { key: 'nombre', label: 'Nombre', required: true },
      { key: 'direccion', label: 'Direccion' },
      { key: 'telefono', label: 'Telefono' },
    ],
    '/usuarios': [
      { key: 'correo', label: 'Correo', required: true, type: 'email' },
      { key: 'password', label: 'Password', required: true },
      { key: 'nombres', label: 'Nombres', required: true },
      { key: 'apellidos', label: 'Apellidos', required: true },
      { key: 'idRol', label: 'Rol ID', placeholder: '3', type: 'number' },
      { key: 'idSucursales', label: 'Sucursales ID separadas por coma' },
    ],
    '/compras': [
      commonSucursal,
      { key: 'idProveedor', label: 'Proveedor ID' },
      commonUsuario,
      { key: 'moneda', label: 'Moneda', options: enumOptions(['PEN', 'USD']), type: 'select' },
      { key: 'tipoCambio', label: 'Tipo cambio', placeholder: '1', type: 'number' },
      { key: 'idProducto', label: 'Producto ID', required: true },
      { key: 'cantidad', label: 'Cantidad', placeholder: '1', type: 'number' },
      { key: 'precioUnitario', label: 'Precio unitario', type: 'number' },
    ],
    '/inventario': [
      commonSucursal,
      { key: 'idLote', label: 'Lote ID', required: true },
      { key: 'usuarioId', label: 'Usuario ID', required: true },
      { key: 'nuevaCantidadFisica', label: 'Nueva cantidad fisica', type: 'number' },
    ],
    '/caja': [
      commonSucursal,
      { key: 'idUsuario', label: 'Usuario ID', required: true },
      { key: 'montoApertura', label: 'Monto apertura', type: 'number' },
    ],
  }

  return fields[path] ?? []
}

export async function createSuperAdminRecord(path: string, values: Record<string, string | boolean>) {
  switch (path) {
    case '/productos':
      return postJson('/api/productos', {
        ...values,
        requiereReceta: Boolean(values.requiereReceta),
        stockMinimo: numberOr(values.stockMinimo, 5),
      })
    case '/clientes':
      return postJson('/api/clientes', emptyToNull(values))
    case '/proveedores':
      return postJson('/api/proveedores', emptyToNull(values))
    case '/sucursales':
      return postJson('/api/sucursales', emptyToNull(values))
    case '/usuarios':
      return postJson('/api/usuarios', {
        ...emptyToNull(values),
        idRol: numberOr(values.idRol, 3),
        idSucursales: String(values.idSucursales ?? '')
          .split(',')
          .map((id) => id.trim())
          .filter(Boolean),
      })
    case '/compras':
      return postJson('/api/compras', {
        idSucursal: values.idSucursal,
        idProveedor: values.idProveedor || null,
        idUsuario: values.idUsuario || null,
        moneda: numberOr(values.moneda, 0),
        tipoCambio: numberOr(values.tipoCambio, 1),
        detalles: [
          {
            idProducto: values.idProducto,
            cantidad: numberOr(values.cantidad, 1),
            precioUnitario: numberOr(values.precioUnitario, 0),
          },
        ],
      })
    case '/inventario':
      return postJson('/api/inventario/ajustar', {
        idSucursal: values.idSucursal,
        idLote: values.idLote,
        usuarioId: values.usuarioId,
        nuevaCantidadFisica: numberOr(values.nuevaCantidadFisica, 0),
      })
    case '/caja':
      return postJson('/api/caja/abrir', {
        idSucursal: values.idSucursal,
        idUsuario: values.idUsuario,
        montoApertura: numberOr(values.montoApertura, 0),
      })
    default:
      throw new Error('Este modulo no tiene una accion principal conectada al API.')
  }
}

async function buildProductos() {
  const productos = await getJson<ApiRecord[]>('/api/productos')
  const activos = productos.filter((item) => item.activo !== false)
  const conReceta = productos.filter((item) => item.requiereReceta === true)

  return {
    metrics: [
      metric('Total productos', productos.length, 'Registrados en API', Pill),
      metric('Con receta', conReceta.length, 'Requieren validacion', ShieldCheck, 'bg-sky-100 text-sky-500'),
      metric('Inactivos', productos.length - activos.length, 'Fuera de venta', AlertTriangle, 'bg-rose-100 text-rose-600'),
    ],
    rows: productos.map((item) => [
      text(item.codigoBarra, '-'),
      text(item.nombre),
      text(item.laboratorio, '-'),
      item.requiereReceta ? 'Si' : 'No',
      text(item.stockMinimo, '0'),
      item.activo === false ? 'Inactivo' : 'Activo',
    ]),
  }
}

async function buildClientes() {
  const clientes = await getJson<ApiRecord[]>('/api/clientes')

  return {
    metrics: [
      metric('Clientes registrados', clientes.length, 'Base real del API', Users),
      metric('Activos', clientes.filter((item) => item.activo !== false).length, 'Disponibles para ventas', Plus, 'bg-emerald-100 text-emerald-600'),
      metric('Con correo', clientes.filter((item) => Boolean(item.correo)).length, 'Contacto digital', ReceiptText, 'bg-sky-100 text-sky-500'),
    ],
    rows: clientes.map((item) => [
      text(item.dni, '-'),
      `${text(item.nombres)} ${text(item.apellidos)}`.trim(),
      text(item.telefono, '-'),
      text(item.correo, '-'),
      item.activo === false ? 'Inactivo' : 'Activo',
      '-',
    ]),
  }
}

async function buildProveedores() {
  const proveedores = await getJson<ApiRecord[]>('/api/proveedores')

  return {
    metrics: [
      metric('Proveedores activos', proveedores.filter((item) => item.activo !== false).length, 'Directorio API', Truck),
      metric('Total proveedores', proveedores.length, 'Registrados', Briefcase, 'bg-sky-100 text-sky-500'),
      metric('Inactivos', proveedores.filter((item) => item.activo === false).length, 'Revisar directorio', AlertTriangle, 'bg-orange-100 text-orange-600'),
    ],
    rows: proveedores.map((item) => [
      text(item.ruc, '-'),
      text(item.nombre),
      text(item.telefono, '-'),
      text(item.correo, '-'),
      item.activo === false ? 'Inactivo' : 'Activo',
      '-',
    ]),
  }
}

async function buildSucursales() {
  const sucursales = await getJson<ApiRecord[]>('/api/sucursales')

  return {
    metrics: [
      metric('Sucursales activas', sucursales.filter((item) => item.activo !== false).length, 'Operando actualmente', Store),
      metric('Total sucursales', sucursales.length, 'Sedes registradas', Building2, 'bg-emerald-100 text-emerald-600'),
      metric('Inactivas', sucursales.filter((item) => item.activo === false).length, 'Fuera de operacion', Users, 'bg-sky-100 text-sky-500'),
    ],
    rows: sucursales.map((item) => [
      text(item.codigo),
      text(item.nombre),
      text(item.direccion, '-'),
      text(item.telefono, '-'),
      item.activo === false ? 'Inactiva' : 'Activa',
      '-',
    ]),
  }
}

async function buildUsuarios() {
  const usuarios = await getJson<ApiRecord[]>('/api/usuarios')

  return {
    metrics: [
      metric('Usuarios activos', usuarios.filter((item) => item.activo !== false).length, 'Cuentas habilitadas', Users),
      metric('Administradores', usuarios.filter((item) => text(item.rol).toLowerCase().includes('admin')).length, 'Acceso de gestion', UserCog, 'bg-sky-100 text-sky-500'),
      metric('Inactivos', usuarios.filter((item) => item.activo === false).length, 'Bloqueados', AlertTriangle, 'bg-rose-100 text-rose-600'),
    ],
    rows: usuarios.map((item) => [
      `${text(item.nombres)} ${text(item.apellidos)}`.trim(),
      text(item.correo),
      text(item.rol, text(item.idRol, '-')),
      Array.isArray(item.idSucursales) ? `${item.idSucursales.length} sucursal(es)` : '-',
      item.activo === false ? 'Inactivo' : 'Activo',
      '-',
    ]),
  }
}

async function buildCompras() {
  const compras = await getJson<ApiRecord[]>('/api/compras')
  const pendientes = compras.filter((item) => text(item.estado).toLowerCase() === 'pendiente')

  return {
    metrics: [
      metric('Compras registradas', compras.length, `${pendientes.length} pendientes`, Briefcase),
      metric('Recepcionadas', compras.filter((item) => text(item.estado).toLowerCase() === 'recepcionada').length, 'Mercaderia ingresada', PackageCheck, 'bg-emerald-100 text-emerald-600'),
      metric('Pendientes', pendientes.length, 'Sin recepcionar', AlertTriangle, 'bg-orange-100 text-orange-600'),
    ],
    rows: compras.map((item) => [
      shortCode(text(item.id), 'CMP'),
      text(item.idProveedor, 'Sin proveedor'),
      text(item.idSucursal),
      text(item.estado),
      text(item.moneda),
      formatMaybeDate(item.fecha),
    ]),
  }
}

async function buildInventario() {
  const resumen = await getJson<ApiRecord>('/api/reportes/inventario/resumen')
  const stockBajo = arrayOfRecords(resumen.stockBajo)
  const porVencer = arrayOfRecords(resumen.productosPorVencer)

  return {
    metrics: [
      metric('Stock bajo', text(resumen.productosStockBajo, '0'), 'Productos por debajo del minimo', AlertTriangle, 'bg-orange-100 text-orange-600'),
      metric('Por vencer', text(resumen.totalProductosPorVencer, '0'), 'Proximos vencimientos', PackageCheck, 'bg-rose-100 text-rose-600'),
      metric('Vencidos', text(resumen.productosVencidos, '0'), 'Requieren accion', Boxes, 'bg-purple-100 text-[#AE19C2]'),
    ],
    rows: [...stockBajo, ...porVencer].map((item) => [
      text(item.nombreProducto ?? item.producto ?? item.idProducto, '-'),
      text(item.idSucursal ?? resumen.idSucursal, 'Todas'),
      text(item.stockActual ?? item.cantidad ?? item.stock, '-'),
      text(item.stockMinimo ?? item.minimo, '-'),
      formatMaybeDate(item.fechaVencimiento),
      item.fechaVencimiento ? 'Por vencer' : 'Stock bajo',
    ]),
  }
}

async function buildCaja() {
  const resumen = await getJson<ApiRecord>('/api/reportes/caja/resumen')
  const movimientos = arrayOfRecords(resumen.movimientos)

  return {
    metrics: [
      metric('Movimientos', text(resumen.totalMovimientos, '0'), 'Periodo consultado', WalletCards),
      metric('Ingresos', money.format(numberOr(resumen.totalIngresos, 0)), 'Ventas y manuales', CreditCard, 'bg-emerald-100 text-emerald-600'),
      metric('Egresos', money.format(numberOr(resumen.totalEgresos, 0)), 'Salidas registradas', ReceiptText, 'bg-rose-100 text-rose-600'),
    ],
    rows: movimientos.map((item) => [
      text(item.tipo),
      text(item.idSucursal ?? resumen.idSucursal, '-'),
      text(item.idUsuario, '-'),
      money.format(numberOr(item.monto, 0)),
      text(item.descripcion, '-'),
      formatMaybeDate(item.fecha ?? item.createdAt),
    ]),
  }
}

async function buildReportes() {
  const [ventas, inventario, caja] = await Promise.all([
    getJson<ApiRecord>('/api/reportes/ventas/resumen'),
    getJson<ApiRecord>('/api/reportes/inventario/resumen'),
    getJson<ApiRecord>('/api/reportes/caja/resumen'),
  ])

  return {
    metrics: [
      metric('Ventas', money.format(numberOr(ventas.totalVendido, 0)), `${text(ventas.totalVentas, '0')} operaciones`, FileText),
      metric('Inventario critico', text(inventario.productosStockBajo, '0'), 'Stock bajo', Boxes, 'bg-orange-100 text-orange-600'),
      metric('Balance caja', money.format(numberOr(caja.balance, 0)), `${text(caja.totalMovimientos, '0')} movimientos`, WalletCards, 'bg-emerald-100 text-emerald-600'),
    ],
    rows: [
      ['Ventas por fecha', `${formatMaybeDate(ventas.desde)} - ${formatMaybeDate(ventas.hasta)}`, text(ventas.idSucursal, 'Todas'), 'API', 'Backend', today()],
      ['Inventario critico', 'Actual', text(inventario.idSucursal, 'Todas'), 'API', 'Backend', today()],
      ['Caja resumida', `${formatMaybeDate(caja.desde)} - ${formatMaybeDate(caja.hasta)}`, text(caja.idSucursal, 'Todas'), 'API', 'Backend', today()],
    ],
  }
}

function withData(base: ModulePageConfig, data: Pick<ModulePageConfig, 'metrics' | 'rows'>): ModulePageConfig {
  return {
    ...base,
    error: null,
    metrics: data.metrics,
    rows: data.rows,
  }
}

function emptyModuleData(base: ModulePageConfig): ModulePageConfig {
  return {
    ...base,
    metrics: base.metrics.map((metric) => ({ ...metric, detail: 'Sin respuesta del API', value: '0' })),
    rows: [],
  }
}

function metric(label: string, value: string | number, detail: string, icon: ModuleMetric['icon'], tone = fallbackMetricTone): ModuleMetric {
  return { detail, icon, label, tone, value: String(value) }
}

function text(value: unknown, fallback = '') {
  if (value === null || value === undefined || value === '') {
    return fallback
  }

  return String(value)
}

function numberOr(value: unknown, fallback: number) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

function emptyToNull(values: Record<string, string | boolean>) {
  return Object.fromEntries(Object.entries(values).map(([key, value]) => [key, value === '' ? null : value]))
}

function enumOptions(values: string[]) {
  return values.map((value, index) => ({ label: value, value: String(index) }))
}

function shortCode(id: string, prefix: string) {
  return id ? `${prefix}-${id.slice(-4).toUpperCase()}` : `${prefix}-----`
}

function formatMaybeDate(value: unknown) {
  if (!value) {
    return '-'
  }

  const date = new Date(String(value))
  return Number.isNaN(date.getTime()) ? String(value) : dateTime.format(date)
}

function today() {
  return new Intl.DateTimeFormat('es-PE').format(new Date())
}

function arrayOfRecords(value: unknown) {
  return Array.isArray(value) ? (value as ApiRecord[]) : []
}
