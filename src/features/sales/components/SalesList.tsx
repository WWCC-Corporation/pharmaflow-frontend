import { Eye, Filter, Search } from 'lucide-react'
import type { PaymentMethod, SaleRow, SaleStatus } from '../types/sales.types'

type SalesListProps = {
  sales: SaleRow[]
  onViewSale: (sale: SaleRow) => void
}

export function SalesList({ onViewSale, sales }: SalesListProps) {
  return (
    <section className="rounded-2xl border border-[#E8EAF3] bg-white p-6 shadow-[0_10px_30px_rgba(17,26,68,0.06)]">
      <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#111A44]">Historial de ventas</h2>
          <p className="mt-1 text-sm text-[#667197]">Ventas registradas en la sucursal seleccionada</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="flex h-11 items-center gap-3 rounded-lg border border-[#E0E4EF] px-3 text-sm text-[#667197]">
            <Search size={17} />
            <input className="bg-transparent outline-none" placeholder="Buscar codigo o cliente" type="search" />
          </label>
          <button className="flex h-11 items-center gap-2 rounded-lg border border-[#E0E4EF] px-4 text-sm font-bold text-[#475174]" type="button">
            <Filter size={17} />
            Filtros
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[920px] text-left text-sm">
          <thead>
            <tr className="border-b border-[#E8EAF3] text-xs font-bold text-[#475174]">
              {['Codigo', 'Cliente', 'Productos', 'Pago', 'Estado', 'Total', 'Fecha', 'Acciones'].map((column) => (
                <th className="pb-4" key={column}>
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sales.length === 0 && (
              <tr>
                <td className="py-10 text-center" colSpan={8}>
                  <div className="rounded-xl border border-dashed border-[#DCE1EE] bg-[#F8FAFF] px-5 py-8">
                    <p className="text-sm font-bold text-[#111A44]">No hay ventas registradas desde el API</p>
                    <p className="mt-2 text-sm text-[#667197]">Cuando se registren ventas reales, apareceran en este historial.</p>
                  </div>
                </td>
              </tr>
            )}

            {sales.map((sale) => (
              <tr className="border-b border-[#E8EAF3] last:border-0" key={sale.code}>
                <td className="py-4 text-xs font-medium text-[#283256]">{sale.code}</td>
                <td className="py-4 text-xs font-medium text-[#283256]">{sale.customer}</td>
                <td className="py-4 text-xs font-medium text-[#283256]">
                  <span className="line-clamp-1 max-w-[220px] text-[#475174]">{sale.products}</span>
                </td>
                <td className="py-4 text-xs font-medium text-[#283256]">{renderPaymentMethod(sale.paymentMethod)}</td>
                <td className="py-4 text-xs font-medium text-[#283256]">{renderSaleStatus(sale.status)}</td>
                <td className="py-4 text-xs font-medium text-[#283256]">{sale.total}</td>
                <td className="py-4 text-xs font-medium text-[#283256]">{sale.date}</td>
                <td className="py-4">
                  <button
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F6E8FA] text-[#AE19C2]"
                    onClick={() => onViewSale(sale)}
                    type="button"
                  >
                    <Eye size={17} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function renderPaymentMethod(method: PaymentMethod) {
  const styles: Record<PaymentMethod, string> = {
    Efectivo: 'bg-emerald-100 text-emerald-600',
    Plin: 'bg-cyan-100 text-cyan-700',
    Tarjeta: 'bg-slate-100 text-[#475174]',
    Yape: 'bg-[#AE19C2] text-white',
  }

  return <span className={`rounded px-2 py-1 text-[11px] font-bold ${styles[method]}`}>{method}</span>
}

function renderSaleStatus(status: SaleStatus) {
  const isCancelled = status === 'Anulada'

  return (
    <span className={`rounded px-2 py-1 text-[11px] font-bold ${isCancelled ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
      {status}
    </span>
  )
}
