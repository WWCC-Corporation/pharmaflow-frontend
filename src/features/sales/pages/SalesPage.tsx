import { useState } from 'react'
import { CalendarDays, Plus } from 'lucide-react'
import { FilterButton } from '../../../components/ui/FilterButton'
import { Modal } from '../../../components/ui/Modal'
import { Toast } from '../../../components/ui/Toast'
import { useSales } from '../hooks/useSales'
import { QuickSalePanel } from '../components/QuickSalePanel'
import { SalesList } from '../components/SalesList'
import { SalesMetricCard } from '../components/SalesMetricCard'
import type { SaleRow } from '../types/sales.types'

export function SalesPage() {
  const { metrics, quickSaleItems, sales } = useSales()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [selectedSale, setSelectedSale] = useState<SaleRow | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  const showToast = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(null), 2600)
  }

  return (
    <>
      <div className="px-5 py-7 md:px-11">
        <div className="mb-7 flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-[#111A44]">Ventas</h1>
            <p className="mt-2 text-lg text-[#667197]">Gestion de ventas, comprobantes y pagos</p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <FilterButton icon={CalendarDays} label="16/06/2026 - 16/06/2026" onClick={() => setIsFilterOpen(true)} />
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
          <QuickSalePanel items={quickSaleItems} onSubmit={() => showToast('Venta registrada en modo simulacion')} />
        </div>
      </div>

      <Modal
        description="Formulario visual para simular el registro de una nueva venta."
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Nueva venta"
      >
        <SalesForm
          onCancel={() => setIsCreateOpen(false)}
          onSubmit={() => {
            setIsCreateOpen(false)
            showToast('Borrador de venta guardado')
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

function SalesForm({ onCancel, onSubmit }: { onCancel: () => void; onSubmit: () => void }) {
  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Cliente" placeholder="Cliente general" />
        <Field label="Documento" placeholder="DNI o RUC opcional" />
        <Field label="Producto" placeholder="Buscar producto" />
        <Field label="Cantidad" placeholder="1" type="number" />
      </div>
      <div className="rounded-xl bg-[#FAFBFF] p-4">
        <p className="text-sm font-bold text-[#111A44]">Resumen simulado</p>
        <div className="mt-3 space-y-2 text-sm text-[#667197]">
          <p>Producto: Paracetamol 500mg</p>
          <p>Metodo de pago: Yape</p>
          <p className="font-bold text-[#111A44]">Total: S/ 47.50</p>
        </div>
      </div>
      <div className="flex justify-end gap-3">
        <button className="rounded-lg border border-[#E0E4EF] px-5 py-3 text-sm font-bold text-[#475174]" onClick={onCancel} type="button">
          Cancelar
        </button>
        <button className="rounded-lg bg-[#AE19C2] px-5 py-3 text-sm font-bold text-white" onClick={onSubmit} type="button">
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

function Field({ label, placeholder, type = 'text' }: { label: string; placeholder?: string; type?: string }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-[#283256]">{label}</span>
      <input
        className="h-12 w-full rounded-lg border border-[#E0E4EF] px-4 text-sm outline-none focus:border-[#AE19C2]"
        placeholder={placeholder}
        type={type}
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
