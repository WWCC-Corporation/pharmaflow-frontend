import { useEffect, useState } from 'react'
import { CalendarDays } from 'lucide-react'
import { FilterButton } from '../../../components/ui/FilterButton'
import { Modal } from '../../../components/ui/Modal'
import { Toast } from '../../../components/ui/Toast'
import { CashMovementsCard, DashboardDataCard } from '../components/DashboardDataCard'
import { DashboardMetricCard } from '../components/DashboardMetricCard'
import { useDashboard } from '../hooks/useDashboard'
import type { DashboardInventoryItem } from '../types/dashboard.types'
import { SalesChart } from '../widgets/SalesChart'
import { TopProducts } from '../widgets/TopProducts'

type DetailList = 'sales' | 'purchases' | 'cash' | null
type InsightModal = 'alerts' | 'low-stock' | 'expiring' | null

const branchOptions = [
  { label: 'Todas las sucursales', value: '' },
  { label: 'Sucursal Principal', value: '11111111-1111-1111-1111-111111111111' },
  { label: 'Sucursal Norte', value: '22222222-2222-2222-2222-222222222222' },
]

export function DashboardPage() {
  const { cashMovements, error, filters, inventory, isLoading, metrics, recentPurchases, recentSales, salesSeries, setFilters, topProducts } = useDashboard()
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState(filters.fecha ?? new Date().toISOString().slice(0, 10))
  const [selectedBranch, setSelectedBranch] = useState(filters.idSucursal ?? '')
  const [activeList, setActiveList] = useState<DetailList>(null)
  const [activeInsight, setActiveInsight] = useState<InsightModal>(null)
  const [showExpirationAlert, setShowExpirationAlert] = useState(false)
  const [expirationAlertDismissed, setExpirationAlertDismissed] = useState(false)

  useEffect(() => {
    const hasPriorityAlert = inventory.expiredCount > 0 || inventory.expiringCount > 0

    if (!isLoading && hasPriorityAlert && !expirationAlertDismissed) {
      setShowExpirationAlert(true)
    }
  }, [expirationAlertDismissed, inventory.expiredCount, inventory.expiringCount, isLoading])

  const applyFilters = () => {
    setFilters({
      fecha: selectedDate,
      idSucursal: selectedBranch || undefined,
    })
    setIsFilterOpen(false)
    setToast(selectedBranch ? 'Dashboard actualizado por sucursal' : 'Dashboard actualizado para todas las sucursales')
    window.setTimeout(() => setToast(null), 2600)
  }

  const selectedBranchLabel = branchOptions.find((branch) => branch.value === selectedBranch)?.label ?? 'Todas las sucursales'
  const visibleMetrics = metrics.filter(
    (metric) => !['Productos con stock bajo', 'Productos por vencer'].includes(metric.label),
  )

  return (
    <>
      <div className="px-5 py-7 md:px-11">
        <div className="mb-7 flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-4xl font-bold tracking-tight text-[#111A44]">Dashboard</h1>
              {isLoading && <span className="rounded-full bg-[#F6E8FA] px-3 py-1 text-xs font-bold text-[#AE19C2]">Actualizando</span>}
            </div>
            <p className="mt-2 text-lg text-[#667197]">
              {error ?? `Resumen operativo de ${selectedBranchLabel.toLowerCase()}`}
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <FilterButton icon={CalendarDays} label={`${selectedDate} - ${selectedDate}`} onClick={() => setIsFilterOpen(true)} />
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {visibleMetrics.map((metric) => (
            <DashboardMetricCard key={metric.label} metric={metric} onClick={getMetricAction(metric.label, setActiveInsight)} />
          ))}
        </div>

        <div className="mt-6 grid gap-5 xl:grid-cols-[1.45fr_0.97fr]">
          <SalesChart data={salesSeries} />
          <TopProducts products={topProducts} />
        </div>

        <div className="mt-6 grid gap-5 xl:grid-cols-[1fr_1fr_1fr]">
          <DashboardDataCard
            columns={['Codigo', 'Cliente', 'Metodo de pago', 'Total', 'Fecha']}
            onViewAll={() => setActiveList('sales')}
            rows={recentSales}
            title="Ventas recientes"
            type="sales"
          />
          <DashboardDataCard
            columns={['Proveedor', 'Estado', 'Total', 'Fecha']}
            onViewAll={() => setActiveList('purchases')}
            rows={recentPurchases}
            title="Compras recientes"
            type="purchases"
          />
          <CashMovementsCard movements={cashMovements} onViewAll={() => setActiveList('cash')} />
        </div>
      </div>

      <Modal
        description="Selecciona fecha y sucursal para revisar el resumen operativo."
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        title="Filtros del dashboard"
      >
        <div className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Fecha" onChange={setSelectedDate} type="date" value={selectedDate} />
            <SelectField label="Sucursal" onChange={setSelectedBranch} options={branchOptions} value={selectedBranch} />
            <Field label="Moneda" placeholder="PEN" value="PEN" />
          </div>
          <div className="flex justify-end">
            <button className="rounded-lg bg-[#AE19C2] px-5 py-3 text-sm font-bold text-white" onClick={applyFilters} type="button">
              Actualizar dashboard
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        description="Listado completo segun los filtros seleccionados."
        isOpen={activeList !== null}
        onClose={() => setActiveList(null)}
        title={getDetailTitle(activeList)}
      >
        {activeList === 'sales' && (
          <DetailTable
            columns={['Codigo', 'Descripcion', 'Estado', 'Total', 'Fecha']}
            emptyLabel="No hay ventas recientes para este filtro."
            rows={recentSales}
          />
        )}
        {activeList === 'purchases' && (
          <DetailTable
            columns={['Codigo', 'Descripcion', 'Total', 'Fecha']}
            emptyLabel="No hay compras recientes para este filtro."
            rows={recentPurchases}
          />
        )}
        {activeList === 'cash' && (
          <div className="space-y-3">
            {cashMovements.length === 0 && <EmptyDetail label="No hay movimientos de caja para este filtro." />}
            {cashMovements.map((movement) => (
              <div className="flex items-center justify-between rounded-xl border border-[#EEF1F7] bg-[#FBFCFF] px-4 py-3" key={`${movement.type}-${movement.amount}-${movement.date}`}>
                <div>
                  <p className="text-sm font-bold text-[#111A44]">{movement.type}</p>
                  <p className="text-xs text-[#667197]">{movement.date}</p>
                </div>
                <p className={`text-sm font-bold ${movement.type === 'Ingreso' ? 'text-emerald-600' : 'text-rose-600'}`}>{movement.amount}</p>
              </div>
            ))}
          </div>
        )}
      </Modal>

      <Modal
        description={getInsightDescription(activeInsight, inventory)}
        isOpen={activeInsight !== null}
        onClose={() => setActiveInsight(null)}
        title={getInsightTitle(activeInsight)}
      >
        {activeInsight === 'alerts' && (
          <div className="space-y-4">
            <InsightSummaryCard
              actionLabel="Revisar productos con stock bajo"
              description={`${inventory.lowStockCount} productos requieren reposicion o revision de stock minimo.`}
              onClick={() => setActiveInsight('low-stock')}
              tone="warning"
              title="Stock bajo"
            />
            <InsightSummaryCard
              actionLabel="Revisar vencimientos"
              description={`${inventory.expiringCount} productos vencen dentro de los proximos 30 dias.`}
              onClick={() => setActiveInsight('expiring')}
              tone="danger"
              title="Productos por vencer"
            />
            <InsightSummaryCard
              description={`${inventory.expiredCount} productos figuran como vencidos y deben ser retirados del flujo de venta.`}
              tone="neutral"
              title="Productos vencidos"
            />
          </div>
        )}

        {activeInsight === 'low-stock' && (
          <InventoryList
            emptyLabel="No hay productos con stock bajo para el filtro actual."
            items={inventory.lowStock}
            type="low-stock"
          />
        )}

        {activeInsight === 'expiring' && (
          <InventoryList
            emptyLabel="No hay productos por vencer para el filtro actual."
            items={inventory.expiringProducts}
            type="expiring"
          />
        )}
      </Modal>

      <Modal
        description="Revisa estos lotes antes de continuar con la operacion diaria."
        isOpen={showExpirationAlert}
        onClose={() => {
          setExpirationAlertDismissed(true)
          setShowExpirationAlert(false)
        }}
        title="Atencion: productos con vencimiento cercano"
      >
        <div className="space-y-5">
          <div className="rounded-2xl border border-rose-100 bg-rose-50 p-5">
            <p className="text-base font-black text-[#111A44]">
              {inventory.expiredCount > 0
                ? `${inventory.expiredCount} productos vencidos requieren retiro inmediato.`
                : `${inventory.expiringCount} productos vencen dentro de los proximos 30 dias.`}
            </p>
            <p className="mt-2 text-sm leading-6 text-[#475174]">
              Prioriza la revision de lotes, fechas de vencimiento y stock disponible antes de vender o reponer mercaderia.
            </p>
          </div>

          {inventory.expiringProducts.length > 0 && (
            <div className="space-y-3">
              {inventory.expiringProducts.slice(0, 3).map((item) => (
                <article className="rounded-xl border border-[#EEF1F7] bg-[#FBFCFF] p-4" key={`${item.product}-${item.branch}-${item.lot ?? ''}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-black text-[#111A44]">{item.product}</p>
                      <p className="mt-1 text-sm text-[#667197]">{item.branch} · Lote {item.lot ?? '-'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-semibold text-[#667197]">Vence</p>
                      <p className="font-black text-rose-600">{formatShortDate(item.expirationDate)}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {inventory.lowStockCount > 0 && (
            <div className="rounded-xl border border-orange-100 bg-orange-50 px-4 py-3 text-sm font-semibold text-orange-700">
              Tambien hay {inventory.lowStockCount} productos con stock bajo para revisar despues de los vencimientos.
            </div>
          )}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              className="rounded-xl border border-[#E0E4EF] px-5 py-3 text-sm font-bold text-[#475174] transition hover:bg-slate-50"
              onClick={() => {
                setExpirationAlertDismissed(true)
                setShowExpirationAlert(false)
              }}
              type="button"
            >
              Recordarme luego
            </button>
            <button
              className="rounded-xl bg-[#AE19C2] px-5 py-3 text-sm font-bold text-white shadow-[0_12px_24px_rgba(174,25,194,0.22)] transition hover:bg-[#9714A8]"
              onClick={() => {
                setExpirationAlertDismissed(true)
                setShowExpirationAlert(false)
                setActiveInsight('expiring')
              }}
              type="button"
            >
              Revisar ahora
            </button>
          </div>
        </div>
      </Modal>

      <Toast message={toast} />
    </>
  )
}

function getMetricAction(label: string, setActiveInsight: (value: InsightModal) => void) {
  if (label === 'Productos con stock bajo') {
    return () => setActiveInsight('low-stock')
  }

  if (label === 'Productos por vencer') {
    return () => setActiveInsight('expiring')
  }

  return undefined
}

function getInsightTitle(activeInsight: InsightModal) {
  if (activeInsight === 'alerts') {
    return 'Alertas pendientes'
  }

  if (activeInsight === 'low-stock') {
    return 'Productos con stock bajo'
  }

  if (activeInsight === 'expiring') {
    return 'Productos por vencer'
  }

  return 'Detalle'
}

function getInsightDescription(activeInsight: InsightModal, inventory: ReturnType<typeof useDashboard>['inventory']) {
  if (activeInsight === 'alerts') {
    return 'Resumen de avisos importantes que requieren seguimiento operativo.'
  }

  if (activeInsight === 'low-stock') {
    return `${inventory.lowStockCount} productos necesitan reposicion o ajuste de inventario.`
  }

  if (activeInsight === 'expiring') {
    return `${inventory.expiringCount} productos tienen vencimiento cercano.`
  }

  return undefined
}

function InsightSummaryCard({
  actionLabel,
  description,
  onClick,
  title,
  tone,
}: {
  actionLabel?: string
  description: string
  onClick?: () => void
  title: string
  tone: 'danger' | 'neutral' | 'warning'
}) {
  const toneClasses = {
    danger: 'border-rose-100 bg-rose-50 text-rose-600',
    neutral: 'border-slate-100 bg-slate-50 text-slate-600',
    warning: 'border-orange-100 bg-orange-50 text-orange-600',
  }

  return (
    <article className={`rounded-2xl border p-4 ${toneClasses[tone]}`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base font-black text-[#111A44]">{title}</h3>
          <p className="mt-1 text-sm leading-6 text-[#475174]">{description}</p>
        </div>
        {onClick && (
          <button className="rounded-xl bg-white px-4 py-2 text-sm font-bold text-[#AE19C2] shadow-sm" onClick={onClick} type="button">
            {actionLabel}
          </button>
        )}
      </div>
    </article>
  )
}

function InventoryList({
  emptyLabel,
  items,
  type,
}: {
  emptyLabel: string
  items: DashboardInventoryItem[]
  type: 'expiring' | 'low-stock'
}) {
  if (items.length === 0) {
    return <EmptyDetail label={emptyLabel} />
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <article className="rounded-2xl border border-[#EEF1F7] bg-[#FBFCFF] p-4" key={`${item.product}-${item.branch}-${item.lot ?? item.code ?? ''}`}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-base font-black text-[#111A44]">{item.product}</p>
              <p className="mt-1 text-sm text-[#667197]">{item.branch}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold">
                {item.code && <span className="rounded-full bg-[#F6E8FA] px-3 py-1 text-[#AE19C2]">Codigo {item.code}</span>}
                {item.lot && <span className="rounded-full bg-[#F6E8FA] px-3 py-1 text-[#AE19C2]">Lote {item.lot}</span>}
                {item.status && <span className="rounded-full bg-slate-100 px-3 py-1 text-[#475174]">{item.status}</span>}
              </div>
            </div>
            <div className="rounded-xl bg-white px-4 py-3 text-right shadow-sm">
              {type === 'low-stock' ? (
                <>
                  <p className="text-xs font-semibold text-[#667197]">Stock actual / minimo</p>
                  <p className="mt-1 text-lg font-black text-orange-600">{item.currentStock} / {item.minimumStock ?? 0}</p>
                </>
              ) : (
                <>
                  <p className="text-xs font-semibold text-[#667197]">Vence</p>
                  <p className="mt-1 text-lg font-black text-rose-600">{formatShortDate(item.expirationDate)}</p>
                  <p className="mt-1 text-xs text-[#667197]">Stock: {item.currentStock}</p>
                </>
              )}
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}

function formatShortDate(value?: string) {
  if (!value) {
    return '-'
  }

  return new Intl.DateTimeFormat('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(value))
}

function getDetailTitle(activeList: DetailList) {
  if (activeList === 'sales') {
    return 'Ventas recientes'
  }

  if (activeList === 'purchases') {
    return 'Compras recientes'
  }

  if (activeList === 'cash') {
    return 'Movimientos de caja'
  }

  return 'Detalle'
}

function DetailTable({ columns, emptyLabel, rows }: { columns: string[]; emptyLabel: string; rows: string[][] }) {
  if (rows.length === 0) {
    return <EmptyDetail label={emptyLabel} />
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[620px] text-left text-sm">
        <thead>
          <tr className="border-b border-[#E8EAF3] text-xs font-bold uppercase tracking-wide text-[#667197]">
            {columns.map((column) => (
              <th className="pb-3" key={column}>
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr className="border-b border-[#EEF1F7] last:border-0" key={row.join('-')}>
              {row.map((cell, index) => (
                <td className={`py-4 text-sm ${index === 0 ? 'font-bold text-[#AE19C2]' : 'font-medium text-[#283256]'}`} key={`${cell}-${index}`}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function EmptyDetail({ label }: { label: string }) {
  return (
    <div className="rounded-xl border border-dashed border-[#DCE1EE] bg-[#F8FAFF] px-5 py-8 text-center">
      <p className="text-sm font-semibold text-[#111A44]">{label}</p>
    </div>
  )
}

function Field({
  label,
  onChange,
  placeholder,
  type = 'text',
  value,
}: {
  label: string
  onChange?: (value: string) => void
  placeholder?: string
  type?: string
  value?: string
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-[#283256]">{label}</span>
      <input
        className="h-12 w-full rounded-lg border border-[#E0E4EF] px-4 text-sm outline-none focus:border-[#AE19C2]"
        onChange={(event) => onChange?.(event.target.value)}
        placeholder={placeholder}
        type={type}
        value={value}
      />
    </label>
  )
}

function SelectField({
  label,
  onChange,
  options,
  value,
}: {
  label: string
  onChange: (value: string) => void
  options: Array<{ label: string; value: string }>
  value: string
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-[#283256]">{label}</span>
      <select
        className="h-12 w-full rounded-lg border border-[#E0E4EF] bg-white px-4 text-sm outline-none focus:border-[#AE19C2]"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      >
        {options.map((option) => (
          <option key={option.label} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}
