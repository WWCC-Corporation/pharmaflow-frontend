import { useState } from 'react'
import { Building2, CalendarDays } from 'lucide-react'
import { FilterButton } from '../../../components/ui/FilterButton'
import { Modal } from '../../../components/ui/Modal'
import { Toast } from '../../../components/ui/Toast'
import { CashMovementsCard, DashboardDataCard } from '../components/DashboardDataCard'
import { DashboardMetricCard } from '../components/DashboardMetricCard'
import { useDashboard } from '../hooks/useDashboard'
import { SalesChart } from '../widgets/SalesChart'
import { TopProducts } from '../widgets/TopProducts'

const branchOptions = [
  { label: 'Todas las sucursales', value: '' },
  { label: 'Sucursal Principal', value: '11111111-1111-1111-1111-111111111111' },
  { label: 'Sucursal Norte', value: '22222222-2222-2222-2222-222222222222' },
]

export function DashboardPage() {
  const { cashMovements, error, filters, isLoading, metrics, recentPurchases, recentSales, setFilters, topProducts } = useDashboard()
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState(filters.fecha ?? '2026-06-22')
  const [selectedBranch, setSelectedBranch] = useState(filters.idSucursal ?? '')

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

  return (
    <>
      <div className="px-5 py-7 md:px-11">
        <div className="mb-7 flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-4xl font-bold tracking-tight text-[#111A44]">Dashboard</h1>
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${
                  error ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                }`}
              >
                {isLoading ? 'Conectando API' : error ? 'Modo respaldo' : 'API real'}
              </span>
            </div>
            <p className="mt-2 text-lg text-[#667197]">
              {error ?? 'Resumen global de todas las sucursales conectado al backend'}
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <FilterButton icon={CalendarDays} label={`${selectedDate} - ${selectedDate}`} onClick={() => setIsFilterOpen(true)} />
            <FilterButton icon={Building2} label={selectedBranchLabel} onClick={() => setIsFilterOpen(true)} />
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          {metrics.map((metric) => (
            <DashboardMetricCard key={metric.label} metric={metric} />
          ))}
        </div>

        <div className="mt-6 grid gap-5 xl:grid-cols-[1.45fr_0.97fr]">
          <SalesChart />
          <TopProducts products={topProducts} />
        </div>

        <div className="mt-6 grid gap-5 xl:grid-cols-[1fr_1fr_1fr]">
          <DashboardDataCard
            columns={['Codigo', 'Cliente', 'Metodo de pago', 'Total', 'Fecha']}
            rows={recentSales}
            title="Ventas recientes"
            type="sales"
          />
          <DashboardDataCard
            columns={['Proveedor', 'Estado', 'Total', 'Fecha']}
            rows={recentPurchases}
            title="Compras recientes"
            type="purchases"
          />
          <CashMovementsCard movements={cashMovements} />
        </div>
      </div>

      <Modal
        description="Selecciona fecha y sucursal para consultar el resumen real del backend."
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

      <Toast message={toast} />
    </>
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
