import { ArrowDown, ArrowUp } from 'lucide-react'
import type { CashMovement, DashboardTableRow } from '../types/dashboard.types'

type DashboardDataCardProps = {
  title: string
  columns: string[]
  rows: DashboardTableRow[]
  type: 'sales' | 'purchases'
}

export function DashboardDataCard({ title, columns, rows, type }: DashboardDataCardProps) {
  return (
    <section className="rounded-2xl border border-[#E8EAF3] bg-white p-5 shadow-[0_10px_30px_rgba(17,26,68,0.06)]">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-bold text-[#111A44]">{title}</h2>
        <button className="text-sm font-bold text-[#AE19C2]" type="button">
          Ver todas
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[#E8EAF3] text-xs font-bold text-[#475174]">
              {columns.map((column) => (
                <th className="pb-4" key={column}>
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr className="border-b border-[#E8EAF3] last:border-0" key={row.join('-')}>
                {row.map((cell, index) => (
                  <td className="py-4 text-xs font-medium text-[#283256]" key={`${cell}-${index}`}>
                    {renderCell(cell, index, type)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export function CashMovementsCard({ movements }: { movements: CashMovement[] }) {
  return (
    <section className="rounded-2xl border border-[#E8EAF3] bg-white p-5 shadow-[0_10px_30px_rgba(17,26,68,0.06)]">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-bold text-[#111A44]">Movimientos de caja</h2>
        <button className="text-sm font-bold text-[#AE19C2]" type="button">
          Ver todas
        </button>
      </div>
      <div className="space-y-1">
        {movements.map((movement) => {
          const isIncome = movement.type === 'Ingreso'

          return (
            <div className="grid grid-cols-[1fr_90px_130px] items-center border-b border-[#E8EAF3] py-3 text-xs font-medium text-[#283256] last:border-0" key={`${movement.type}-${movement.date}`}>
              <span className="inline-flex items-center gap-2">
                <span className={`flex h-6 w-6 items-center justify-center rounded-full ${isIncome ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                  {isIncome ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                </span>
                {movement.type}
              </span>
              <span>{movement.amount}</span>
              <span>{movement.date}</span>
            </div>
          )
        })}
      </div>
    </section>
  )
}

function renderCell(cell: string, index: number, type: DashboardDataCardProps['type']) {
  if (type === 'sales' && index === 2) {
    const isYape = cell.toLowerCase() === 'yape'
    const isCash = cell.toLowerCase() === 'efectivo'

    return (
      <span className={`inline-flex rounded px-2 py-1 text-[11px] font-bold ${isYape ? 'bg-[#AE19C2] text-white' : isCash ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-[#475174]'}`}>
        {cell}
      </span>
    )
  }

  if (type === 'purchases' && index === 1) {
    const styles: Record<string, string> = {
      Completada: 'bg-emerald-100 text-emerald-600',
      Pendiente: 'bg-orange-100 text-orange-600',
      Anulada: 'bg-rose-100 text-rose-600',
    }

    return <span className={`rounded px-2 py-1 text-[11px] font-bold ${styles[cell]}`}>{cell}</span>
  }

  return cell
}
