import { PackagePlus, Search } from 'lucide-react'
import type { QuickSaleItem } from '../types/sales.types'

type QuickSalePanelProps = {
  items: QuickSaleItem[]
  onSubmit: () => void
}

export function QuickSalePanel({ items, onSubmit }: QuickSalePanelProps) {
  const subtotal = items.reduce((sum, item) => sum + parseMoney(item.total), 0)
  const formattedSubtotal = new Intl.NumberFormat('es-PE', { currency: 'PEN', style: 'currency' }).format(subtotal)

  return (
    <section className="rounded-2xl border border-[#E8EAF3] bg-white p-6 shadow-[0_10px_30px_rgba(17,26,68,0.06)]">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#111A44]">Venta rapida</h2>
          <p className="mt-1 text-sm text-[#667197]">Borrador visual para nueva venta</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F6E8FA] text-[#AE19C2]">
          <PackagePlus size={24} />
        </div>
      </div>

      <div className="space-y-4">
        <label className="block">
          <span className="mb-2 block text-sm font-bold text-[#283256]">Cliente</span>
          <input
            className="h-12 w-full rounded-lg border border-[#E0E4EF] px-4 text-sm outline-none focus:border-[#AE19C2]"
            placeholder="Cliente general"
            type="text"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-bold text-[#283256]">Producto</span>
          <div className="flex h-12 items-center gap-3 rounded-lg border border-[#E0E4EF] px-4 text-[#667197]">
            <Search size={18} />
            <input className="w-full bg-transparent text-sm outline-none" placeholder="Buscar por nombre o codigo" type="search" />
          </div>
        </label>

        <div className="rounded-xl bg-[#FAFBFF] p-4">
          <p className="mb-4 text-sm font-bold text-[#111A44]">Detalle</p>
          <div className="space-y-3">
            {items.length === 0 && (
              <div className="rounded-lg border border-dashed border-[#DCE1EE] bg-white px-4 py-6 text-center">
                <p className="text-sm font-bold text-[#111A44]">Sin productos agregados</p>
                <p className="mt-1 text-xs text-[#667197]">Usa "Nueva venta" para registrar una venta real mediante el API.</p>
              </div>
            )}

            {items.map((item) => (
              <div className="rounded-lg bg-white p-3 shadow-sm" key={item.product}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-[#111A44]">{item.product}</p>
                    <p className="text-xs text-[#667197]">
                      Lote {item.batch} · Cantidad {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-bold text-[#AE19C2]">{item.total}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3 rounded-xl border border-[#E8EAF3] p-4">
          <SummaryRow label="Subtotal" value={formattedSubtotal} />
          <SummaryRow label="Descuento" value="S/ 0.00" />
          <SummaryRow label="Total" strong value={formattedSubtotal} />
        </div>

        <div className="grid grid-cols-3 gap-3">
          {['Efectivo', 'Yape', 'Tarjeta'].map((method) => (
            <button
              className={`rounded-lg border px-3 py-3 text-sm font-bold ${
                method === 'Yape'
                  ? 'border-[#AE19C2] bg-[#F6E8FA] text-[#AE19C2]'
                  : 'border-[#E0E4EF] text-[#475174]'
              }`}
              key={method}
              type="button"
            >
              {method}
            </button>
          ))}
        </div>

        <button
          className="h-13 w-full rounded-lg bg-[#AE19C2] text-sm font-bold text-white shadow-[0_10px_24px_rgba(174,25,194,0.24)]"
          onClick={onSubmit}
          type="button"
        >
          Registrar venta
        </button>
      </div>
    </section>
  )
}

function parseMoney(value: string) {
  const normalized = value.replace(/[^\d.,-]/g, '').replace(',', '.')
  const parsed = Number(normalized)

  return Number.isFinite(parsed) ? parsed : 0
}

function SummaryRow({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={`flex items-center justify-between ${strong ? 'text-lg font-bold text-[#111A44]' : 'text-sm text-[#667197]'}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  )
}
