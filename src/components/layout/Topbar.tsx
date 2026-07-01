import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Bell, ChevronDown, LogOut, Search, Settings, Store, UserRound } from 'lucide-react'
import { Modal } from '../ui/Modal'
import pharmaflowLogo from '../../assets/pharmaflow-logo.png'
import { getJson } from '../../services/api'
import type { CurrentUser } from '../../types/user'

type ApiRecord = Record<string, unknown>
type SearchResult = { title: string; type: string; detail: string }
type Notification = { title: string; detail: string; tone: 'info' | 'success' | 'warning'; kind: 'alerts' | 'expiring' | 'stock' }
type InventoryDetail = {
  lowStock: Array<Record<string, unknown>>
  expiringProducts: Array<Record<string, unknown>>
}

type TopbarProps = {
  currentUser: CurrentUser
  onLogout: () => void
}

const today = () => new Date().toISOString().slice(0, 10)

export function Topbar({ currentUser, onLogout }: TopbarProps) {
  const [branches, setBranches] = useState<string[]>(['Todas las sucursales'])
  const [selectedBranch, setSelectedBranch] = useState('Todas las sucursales')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [notificationCount, setNotificationCount] = useState(0)
  const [inventoryDetail, setInventoryDetail] = useState<InventoryDetail>({ expiringProducts: [], lowStock: [] })
  const [searchTerm, setSearchTerm] = useState('')
  const [openPanel, setOpenPanel] = useState<'search' | 'branches' | 'notifications' | 'profile' | null>(null)
  const [modal, setModal] = useState<{ title: string; description: string; body: ReactNode } | null>(null)

  const closePanel = () => setOpenPanel(null)
  const visibleSearchResults = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()

    if (!term) {
      return searchResults.slice(0, 5)
    }

    return searchResults
      .filter((result) => `${result.title} ${result.detail} ${result.type}`.toLowerCase().includes(term))
      .slice(0, 8)
  }, [searchResults, searchTerm])

  useEffect(() => {
    let isMounted = true

    Promise.allSettled([
      getJson<ApiRecord[]>('/api/sucursales'),
      getJson<ApiRecord[]>('/api/productos'),
      getJson<ApiRecord[]>('/api/clientes'),
      getJson<ApiRecord[]>('/api/ventas'),
      getJson<ApiRecord>('/api/dashboard/resumen', { Fecha: today() }),
      getJson<ApiRecord>('/api/reportes/inventario/resumen', { DiasVencimiento: 30 }),
    ]).then(([sucursales, productos, clientes, ventas, dashboard, inventario]) => {
      if (!isMounted) {
        return
      }

      if (sucursales.status === 'fulfilled') {
        const names = sucursales.value.map((item) => text(item.nombre)).filter(Boolean)
        setBranches(['Todas las sucursales', ...names])
      }

      const results: SearchResult[] = []

      if (productos.status === 'fulfilled') {
        results.push(
          ...productos.value.slice(0, 8).map((item) => ({
            detail: `Codigo: ${text(item.codigoBarra, '-')} - Stock minimo: ${text(item.stockMinimo, '0')}`,
            title: text(item.nombre, 'Producto'),
            type: 'Producto',
          })),
        )
      }

      if (clientes.status === 'fulfilled') {
        results.push(
          ...clientes.value.slice(0, 8).map((item) => ({
            detail: `DNI: ${text(item.dni, '-')} - Telefono: ${text(item.telefono, '-')}`,
            title: `${text(item.nombres)} ${text(item.apellidos)}`.trim() || 'Cliente',
            type: 'Cliente',
          })),
        )
      }

      if (ventas.status === 'fulfilled') {
        results.push(
          ...ventas.value.slice(0, 8).map((item) => ({
            detail: `Total: ${money(item.montoTotal)} - Estado: ${text(item.estado, 'Completada')}`,
            title: shortCode(text(item.id), 'VNT'),
            type: 'Venta',
          })),
        )
      }

      setSearchResults(results)

      if (dashboard.status === 'fulfilled') {
        const data = dashboard.value
        const stockCount = numberValue(data.productosStockBajo)
        const expiringCount = numberValue(data.productosPorVencer)
        const alertsCount = numberValue(data.alertasNoLeidas)

        setNotificationCount(alertsCount)
        const nextNotifications: Notification[] = [
          {
            detail: `${stockCount} productos requieren revision`,
            kind: 'stock',
            title: 'Stock bajo',
            tone: 'warning',
          },
          {
            detail: `${expiringCount} productos en los proximos 30 dias`,
            kind: 'expiring',
            title: 'Productos por vencer',
            tone: 'info',
          },
          {
            detail: `${alertsCount} alertas pendientes`,
            kind: 'alerts',
            title: 'Alertas del sistema',
            tone: 'success',
          },
        ]

        setNotifications(nextNotifications.filter((item) => !item.detail.startsWith('0 ')))
      }

      if (inventario.status === 'fulfilled') {
        setInventoryDetail({
          expiringProducts: Array.isArray(inventario.value.productosPorVencer) ? inventario.value.productosPorVencer as Array<Record<string, unknown>> : [],
          lowStock: Array.isArray(inventario.value.stockBajo) ? inventario.value.stockBajo as Array<Record<string, unknown>> : [],
        })
      }
    })

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <header className="sticky top-0 z-20 border-b border-[#E8EAF3] bg-white px-5 py-5 shadow-sm md:px-11">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#AE19C2]/12 p-1.5 lg:hidden">
            <img alt="PharmaFlow" className="h-full w-full object-contain" src={pharmaflowLogo} />
          </div>
          <div className="relative w-full sm:w-[580px]">
            <label className="flex h-14 w-full items-center gap-4 rounded-lg border border-[#E0E4EF] bg-white px-4 text-[#667197] shadow-sm transition focus-within:border-[#AE19C2] focus-within:ring-4 focus-within:ring-[#AE19C2]/10">
              <Search size={21} />
              <input
                className="w-full bg-transparent text-[15px] outline-none placeholder:text-[#667197]"
                onChange={(event) => {
                  setSearchTerm(event.target.value)
                  setOpenPanel('search')
                }}
                onFocus={() => setOpenPanel('search')}
                placeholder="Buscar productos, ventas o clientes..."
                type="search"
                value={searchTerm}
              />
            </label>
            {openPanel === 'search' && (
              <div className="absolute left-0 right-0 top-16 z-30 rounded-2xl border border-[#E8EAF3] bg-white p-3 shadow-2xl">
                <div className="mb-2 flex items-center justify-between px-2">
                  <p className="text-xs font-bold uppercase tracking-wide text-[#667197]">Busqueda rapida</p>
                  <button className="text-xs font-bold text-[#AE19C2]" onClick={closePanel} type="button">
                    Cerrar
                  </button>
                </div>
                <div className="space-y-2">
                  {visibleSearchResults.length === 0 && (
                    <div className="rounded-xl border border-dashed border-[#DCE1EE] bg-[#F8FAFF] px-4 py-6 text-center">
                      <p className="text-sm font-bold text-[#111A44]">Sin resultados reales</p>
                      <p className="mt-1 text-xs text-[#667197]">No se encontraron productos, clientes o ventas con ese texto.</p>
                    </div>
                  )}

                  {visibleSearchResults.map((result) => (
                    <button
                      className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left transition hover:bg-[#FAF1FC]"
                      key={result.title}
                      onClick={closePanel}
                      type="button"
                    >
                      <span>
                        <span className="block text-sm font-bold text-[#111A44]">{result.title}</span>
                        <span className="block text-xs text-[#667197]">{result.detail}</span>
                      </span>
                      <span className="rounded-full bg-[#F6E8FA] px-3 py-1 text-xs font-bold text-[#AE19C2]">
                        {result.type}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 xl:flex-nowrap">
          <div className="relative">
            <button
              aria-label="Cambiar sucursal"
              className="flex h-14 items-center gap-3 rounded-lg border border-[#E0E4EF] bg-white px-5 font-semibold text-[#111A44] shadow-sm transition hover:border-[#AE19C2]/40 hover:bg-[#FAF1FC]"
              onClick={() => setOpenPanel(openPanel === 'branches' ? null : 'branches')}
              type="button"
            >
              <Store className="text-[#AE19C2]" size={23} />
              <span className="max-w-44 truncate">{selectedBranch}</span>
              <ChevronDown size={18} />
            </button>
            {openPanel === 'branches' && (
              <div className="absolute right-0 top-16 z-30 w-72 rounded-2xl border border-[#E8EAF3] bg-white p-3 shadow-2xl">
                <p className="px-2 pb-2 text-xs font-bold uppercase tracking-wide text-[#667197]">Cambiar sucursal</p>
                {branches.map((branch) => (
                  <button
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-sm font-bold transition ${
                      selectedBranch === branch ? 'bg-[#F6E8FA] text-[#AE19C2]' : 'text-[#111A44] hover:bg-[#FAF1FC]'
                    }`}
                    key={branch}
                    onClick={() => {
                      setSelectedBranch(branch)
                      closePanel()
                    }}
                    type="button"
                  >
                    {branch}
                    {selectedBranch === branch && <span className="h-2 w-2 rounded-full bg-[#AE19C2]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <button
              aria-label="Abrir notificaciones"
              className="relative flex h-14 w-14 items-center justify-center rounded-full border border-[#E0E4EF] bg-white text-[#475174] shadow-sm transition hover:border-[#AE19C2]/40 hover:text-[#AE19C2]"
              onClick={() => setOpenPanel(openPanel === 'notifications' ? null : 'notifications')}
              type="button"
            >
              <Bell size={25} />
              {notificationCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-6 min-w-6 items-center justify-center rounded-full bg-[#AE19C2] px-1 text-xs font-bold text-white">
                  {notificationCount}
                </span>
              )}
            </button>
            {openPanel === 'notifications' && (
              <div className="absolute right-0 top-16 z-30 w-80 rounded-2xl border border-[#E8EAF3] bg-white p-4 shadow-2xl">
                <div className="mb-3 flex items-center justify-between">
                  <p className="font-bold text-[#111A44]">Notificaciones</p>
                  <button
                    className="text-xs font-bold text-[#AE19C2]"
                    onClick={() => {
                      setNotifications([])
                      setNotificationCount(0)
                      closePanel()
                    }}
                    type="button"
                  >
                    Marcar leidas
                  </button>
                </div>
                <div className="space-y-3">
                  {notifications.length === 0 && (
                    <div className="rounded-xl border border-dashed border-[#DCE1EE] bg-[#F8FAFF] px-4 py-6 text-center">
                      <p className="text-sm font-bold text-[#111A44]">Sin notificaciones pendientes</p>
                      <p className="mt-1 text-xs text-[#667197]">No hay avisos importantes para revisar en este momento.</p>
                    </div>
                  )}

                  {notifications.map((notification) => (
                    <button
                      className="w-full rounded-xl border border-[#EEF1F7] p-3 text-left transition hover:border-[#E8C8F0] hover:bg-[#FAF1FC]"
                      key={notification.title}
                      onClick={() => {
                        setModal(getNotificationModal(notification, inventoryDetail))
                        closePanel()
                      }}
                      type="button"
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className={`mt-1 h-2.5 w-2.5 rounded-full ${
                            notification.tone === 'warning'
                              ? 'bg-amber-400'
                              : notification.tone === 'success'
                                ? 'bg-emerald-400'
                                : 'bg-sky-400'
                          }`}
                        />
                        <div>
                          <p className="text-sm font-bold text-[#111A44]">{notification.title}</p>
                          <p className="mt-1 text-xs leading-5 text-[#667197]">{notification.detail}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              aria-label="Abrir perfil"
              className="flex items-center gap-3 rounded-full p-1 pr-2 transition hover:bg-[#FAF1FC]"
              onClick={() => setOpenPanel(openPanel === 'profile' ? null : 'profile')}
              type="button"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#F6E8FA] to-[#AE19C2] text-lg font-bold text-white ring-4 ring-[#F6E8FA]">
                {currentUser.initials}
              </div>
              <div className="hidden text-left sm:block">
                <p className="font-bold text-[#111A44]">{currentUser.name}</p>
                <p className="text-sm text-[#667197]">{currentUser.role}</p>
              </div>
              <ChevronDown size={18} />
            </button>
            {openPanel === 'profile' && (
              <div className="absolute right-0 top-16 z-30 w-72 rounded-2xl border border-[#E8EAF3] bg-white p-3 shadow-2xl">
                <div className="mb-3 rounded-xl bg-[#FAF1FC] p-3">
                  <p className="font-bold text-[#111A44]">{currentUser.name}</p>
                  <p className="text-sm text-[#667197]">{currentUser.role}</p>
                </div>
                <button
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-[#111A44] transition hover:bg-[#FAF1FC]"
                  onClick={() => {
                    setModal({
                      body: (
                        <div className="space-y-3">
                          <NoticeCard label="Nombre" value={currentUser.name} />
                          <NoticeCard label="Rol" value={currentUser.role} />
                          <NoticeCard label="Correo" value={currentUser.correo ?? '-'} />
                        </div>
                      ),
                      description: 'Informacion de la sesion actual.',
                      title: 'Mi perfil',
                    })
                    closePanel()
                  }}
                  type="button"
                >
                  <UserRound size={18} />
                  Mi perfil
                </button>
                <button
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-[#111A44] transition hover:bg-[#FAF1FC]"
                  onClick={() => {
                    setModal({
                      body: 'Preferencias generales, sucursal activa y parametros de trabajo del sistema.',
                      description: 'Configuracion del panel administrativo.',
                      title: 'Configuracion',
                    })
                    closePanel()
                  }}
                  type="button"
                >
                  <Settings size={18} />
                  Configuracion
                </button>
                <button
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-rose-500 transition hover:bg-rose-50"
                  onClick={async () => {
                    closePanel()
                    await onLogout()
                  }}
                  type="button"
                >
                  <LogOut size={18} />
                  Cerrar sesion
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {openPanel && (
        <button
          aria-label="Cerrar panel"
          className="fixed inset-0 z-20 cursor-default bg-transparent"
          onClick={closePanel}
          type="button"
        />
      )}
      <Modal
        description={modal?.description}
        isOpen={modal !== null}
        onClose={() => setModal(null)}
        title={modal?.title ?? ''}
      >
        <div className="rounded-xl bg-[#FAFBFF] p-4 text-sm font-medium leading-6 text-[#475174]">
          {modal?.body}
        </div>
      </Modal>
    </header>
  )
}

function text(value: unknown, fallback = '') {
  if (value === null || value === undefined || value === '') {
    return fallback
  }

  return String(value)
}

function money(value: unknown) {
  const parsed = Number(value)
  return new Intl.NumberFormat('es-PE', { currency: 'PEN', style: 'currency' }).format(Number.isFinite(parsed) ? parsed : 0)
}

function shortCode(id: string, prefix: string) {
  return id ? `${prefix}-${id.slice(-4).toUpperCase()}` : `${prefix}-----`
}

function numberValue(value: unknown) {
  const parsed = Number(value)

  return Number.isFinite(parsed) ? parsed : 0
}

function getNotificationModal(notification: Notification, inventory: InventoryDetail) {
  if (notification.kind === 'stock') {
    return {
      body: <InventoryModalList emptyLabel="No hay productos con stock bajo." items={inventory.lowStock} type="stock" />,
      description: 'Productos que necesitan reposicion o revision de inventario.',
      title: 'Detalle de stock bajo',
    }
  }

  if (notification.kind === 'expiring') {
    return {
      body: <InventoryModalList emptyLabel="No hay productos con vencimiento cercano." items={inventory.expiringProducts} type="expiring" />,
      description: 'Productos que deben revisarse antes de continuar su venta.',
      title: 'Detalle de productos por vencer',
    }
  }

  return {
    body: (
      <div className="space-y-3">
        <NoticeCard label="Stock bajo" value={`${inventory.lowStock.length} productos listados para revisar`} />
        <NoticeCard label="Vencimientos" value={`${inventory.expiringProducts.length} productos con fecha cercana`} />
        <NoticeCard label="Recomendacion" value="Prioriza reposicion, retiro de lotes vencidos y confirmacion de stock fisico." />
      </div>
    ),
    description: 'Resumen de acciones pendientes para la operacion de la farmacia.',
    title: 'Alertas del sistema',
  }
}

function InventoryModalList({ emptyLabel, items, type }: { emptyLabel: string; items: Array<Record<string, unknown>>; type: 'expiring' | 'stock' }) {
  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-[#DCE1EE] bg-[#F8FAFF] px-5 py-8 text-center">
        <p className="text-sm font-bold text-[#111A44]">{emptyLabel}</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <article className="rounded-xl border border-[#EEF1F7] bg-[#FBFCFF] p-4" key={`${text(item.producto)}-${text(item.sucursal)}-${text(item.numeroLote)}`}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="font-black text-[#111A44]">{text(item.producto, 'Producto')}</p>
              <p className="mt-1 text-sm text-[#667197]">{text(item.sucursal, 'Sucursal')}</p>
              {type === 'expiring' && <p className="mt-2 text-xs font-bold text-[#AE19C2]">Lote {text(item.numeroLote, '-')}</p>}
              {type === 'stock' && <p className="mt-2 text-xs font-bold text-[#AE19C2]">Codigo {text(item.codigoBarra, '-')}</p>}
            </div>
            <div className="rounded-xl bg-white px-4 py-3 text-right shadow-sm">
              {type === 'expiring' ? (
                <>
                  <p className="text-xs font-semibold text-[#667197]">Vence</p>
                  <p className="mt-1 font-black text-rose-600">{formatDate(text(item.fechaVencimiento))}</p>
                  <p className="mt-1 text-xs text-[#667197]">Stock: {text(item.stockActual, '0')}</p>
                </>
              ) : (
                <>
                  <p className="text-xs font-semibold text-[#667197]">Stock actual / minimo</p>
                  <p className="mt-1 font-black text-orange-600">{text(item.stockTotal, '0')} / {text(item.stockMinimo, '0')}</p>
                </>
              )}
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}

function NoticeCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[#EEF1F7] bg-[#FBFCFF] p-4">
      <p className="text-sm font-black text-[#111A44]">{label}</p>
      <p className="mt-1 text-sm text-[#667197]">{value}</p>
    </div>
  )
}

function formatDate(value: string) {
  if (!value) {
    return '-'
  }

  return new Intl.DateTimeFormat('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(value))
}
