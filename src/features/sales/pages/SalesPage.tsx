import { useState } from 'react'
import { CalendarDays, Plus } from 'lucide-react'
import { FilterButton } from '../../../components/ui/FilterButton'
import { Modal } from '../../../components/ui/Modal'
import { Toast } from '../../../components/ui/Toast'
import { useSales } from '../hooks/useSales'
import { QuickSalePanel } from '../components/QuickSalePanel'
import { SalesList } from '../components/SalesList'
import { SalesMetricCard } from '../components/SalesMetricCard'
import { createSale, type CreateSalePayload } from '../services/sales.api'
import type { SaleRow } from '../types/sales.types'

export function SalesPage() {
  const { error, isLoading, metrics, quickSaleItems, reload, sales } = useSales()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [selectedSale, setSelectedSale] = useState<SaleRow | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const today = new Date().toISOString().slice(0, 10)

  const showToast = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(null), 2600)
  }

  return (
    <>
      <div className="px-5 py-7 md:px-11">
        <div className="mb-7 flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-4xl font-bold tracking-tight text-[#111A44]">Ventas</h1>
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${
                  error ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                }`}
              >
                {isLoading ? 'Cargando API' : error ? 'Datos de respaldo' : 'API real'}
              </span>
            </div>
            <p className="mt-2 text-lg text-[#667197]">{error ?? 'Gestion de ventas, comprobantes y pagos conectada al backend'}</p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <FilterButton icon={CalendarDays} label={`${today} - ${today}`} onClick={() => setIsFilterOpen(true)} />
            <button
              className="flex h-13 items-center justify-center gap-2 rounded-lg bg-[#AE19C2] px-5 text-sm font-bold text-white shadow-[0_10px_24px_rgba(174,25,194,0.24)]"
              onClick={() => setIsCreateOpen(true)}
              type="button"
            >
              <Plus size={18} />
              Nueva venta
            </button>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <SalesMetricCard key={metric.label} metric={metric} />
          ))}
        </div>

        <div className="mt-6 grid gap-5 xl:grid-cols-[1.35fr_0.85fr]">
          <SalesList onViewSale={setSelectedSale} sales={sales} />
          <QuickSalePanel
            items={quickSaleItems}
            onSubmit={() => {
              setIsCreateOpen(true)
            }}
          />
        </div>
      </div>

      <Modal
        description="Formulario conectado a POST /api/ventas."
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Nueva venta"
      >
        <SalesForm
          onCancel={() => setIsCreateOpen(false)}
          onSubmit={(payload) => {
            createSale(payload)
              .then(() => {
                setIsCreateOpen(false)
                showToast('Venta registrada correctamente')
                void reload()
              })
              .catch((err: unknown) => showToast(err instanceof Error ? err.message : 'No se pudo registrar la venta'))
          }}
        />
      </Modal>

      <Modal
        description="Ajusta los criterios de busqueda del historial."
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        title="Filtros de ventas"
      >
        <FilterForm
          onApply={() => {
            setIsFilterOpen(false)
            showToast('Filtros aplicados')
          }}
        />
      </Modal>

      <Modal
        description="Detalle visual de la venta seleccionada."
        isOpen={selectedSale !== null}
        onClose={() => setSelectedSale(null)}
        title={`Detalle ${selectedSale?.code ?? ''}`}
      >
        {selectedSale && <SaleDetail sale={selectedSale} />}
      </Modal>

      <Toast message={toast} />
    </>
  )
}

function SalesForm({ onCancel, onSubmit }: { onCancel: () => void; onSubmit: (payload: CreateSalePayload) => void }) {
  const [form, setForm] = useState<CreateSalePayload>({
    cantidad: 1,
    idProducto: '',
    idSucursal: '',
    metodo: 0,
    moneda: 0,
    montoRecibido: 0,
    precioUnitario: 0,
    tipoCambio: 1,
  })

  const total = Number(form.cantidad) * Number(form.precioUnitario)

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Sucursal ID" onChange={(value) => setForm({ ...form, idSucursal: value })} required value={form.idSucursal} />
        <Field label="Cliente ID" onChange={(value) => setForm({ ...form, idCliente: value })} value={form.idCliente ?? ''} />
        <Field label="Usuario ID" onChange={(value) => setForm({ ...form, idUsuario: value })} value={form.idUsuario ?? ''} />
        <Field label="Turno caja ID" onChange={(value) => setForm({ ...form, idTurnoCaja: value })} value={form.idTurnoCaja ?? ''} />
        <Field label="Producto ID" onChange={(value) => setForm({ ...form, idProducto: value })} required value={form.idProducto} />
        <Field label="Cantidad" onChange={(value) => setForm({ ...form, cantidad: Number(value) })} type="number" value={String(form.cantidad)} />
        <Field label="Precio unitario" onChange={(value) => setForm({ ...form, precioUnitario: Number(value) })} type="number" value={String(form.precioUnitario)} />
        <Field label="Monto recibido" onChange={(value) => setForm({ ...form, montoRecibido: Number(value) })} type="number" value={String(form.montoRecibido)} />
      </div>
      <div className="rounded-xl bg-[#FAFBFF] p-4">
        <p className="text-sm font-bold text-[#111A44]">Resumen de venta</p>
        <div className="mt-3 space-y-2 text-sm text-[#667197]">
          <p>Producto ID: {form.idProducto || '-'}</p>
          <p>Metodo de pago: Efectivo</p>
          <p className="font-bold text-[#111A44]">Total: {new Intl.NumberFormat('es-PE', { currency: 'PEN', style: 'currency' }).format(total)}</p>
        </div>
      </div>
      <div className="flex justify-end gap-3">
        <button className="rounded-lg border border-[#E0E4EF] px-5 py-3 text-sm font-bold text-[#475174]" onClick={onCancel} type="button">
          Cancelar
        </button>
        <button
          className="rounded-lg bg-[#AE19C2] px-5 py-3 text-sm font-bold text-white disabled:opacity-60"
          disabled={!form.idSucursal || !form.idProducto}
          onClick={() => onSubmit(form)}
          type="button"
        >
          Guardar venta
        </button>
      </div>
    </div>
  )
}

function FilterForm({ onApply }: { onApply: () => void }) {
  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Desde" type="date" />
        <Field label="Hasta" type="date" />
        <Field label="Cliente" placeholder="Nombre del cliente" />
        <Field label="Estado" placeholder="Completada / Anulada" />
      </div>
      <div className="flex justify-end">
        <button className="rounded-lg bg-[#AE19C2] px-5 py-3 text-sm font-bold text-white" onClick={onApply} type="button">
          Aplicar filtros
        </button>
      </div>
    </div>
  )
}

function SaleDetail({ sale }: { sale: SaleRow }) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Info label="Cliente" value={sale.customer} />
        <Info label="Metodo de pago" value={sale.paymentMethod} />
        <Info label="Estado" value={sale.status} />
        <Info label="Total" value={sale.total} />
      </div>
      <div className="rounded-xl bg-[#FAFBFF] p-4">
        <p className="text-sm font-bold text-[#111A44]">Productos</p>
        <p className="mt-2 text-sm text-[#667197]">{sale.products}</p>
      </div>
    </div>
  )
}

function Field({
  label,
  onChange,
  placeholder,
  required,
  type = 'text',
  value,
}: {
  label: string
  onChange?: (value: string) => void
  placeholder?: string
  required?: boolean
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
        required={required}
        type={type}
        value={value}
      />
    </label>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[#E8EAF3] p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-[#667197]">{label}</p>
      <p className="mt-1 text-sm font-bold text-[#111A44]">{value}</p>
    </div>
  )
}
