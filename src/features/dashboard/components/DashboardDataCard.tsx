import { ArrowDown, ArrowUp } from 'lucide-react'
import type { CashMovement, DashboardTableRow } from '../types/dashboard.types'

type DashboardDataCardProps = {
  title: string
  columns: string[]
  rows: DashboardTableRow[]
  type: 'sales' | 'purchases'
  onViewAll: () => void
}

export function DashboardDataCard({ title, columns, onViewAll, rows, type }: DashboardDataCardProps) {
  return (
    <section className="min-h-[285px] rounded-2xl border border-[#E8EAF3] bg-white p-5 shadow-[0_10px_30px_rgba(17,26,68,0.06)]">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-[#111A44]">{title}</h2>
          <p className="mt-1 text-xs font-medium text-[#667197]">{rows.length} {rows.length === 1 ? 'registro encontrado' : 'registros encontrados'}</p>
        </div>
        <button className="rounded-lg px-3 py-2 text-sm font-bold text-[#AE19C2] transition hover:bg-[#F6E8FA]" onClick={onViewAll} type="button">
          Ver todas
        </button>
      </div>

      <div className="space-y-3">
        {rows.length === 0 && <EmptyState label={`No hay ${title.toLowerCase()} para el filtro actual.`} />}

        {rows.slice(0, 4).map((row) => (
          <CompactActivityRow columns={columns} key={row.join('-')} row={row} type={type} />
        ))}
      </div>
    </section>
  )
}

export function CashMovementsCard({ movements, onViewAll }: { movements: CashMovement[]; onViewAll: () => void }) {
  return (
    <section className="min-h-[285px] rounded-2xl border border-[#E8EAF3] bg-white p-5 shadow-[0_10px_30px_rgba(17,26,68,0.06)]">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-[#111A44]">Movimientos de caja</h2>
          <p className="mt-1 text-xs font-medium text-[#667197]">{movements.length} {movements.length === 1 ? 'movimiento registrado' : 'movimientos registrados'}</p>
        </div>
        <button className="rounded-lg px-3 py-2 text-sm font-bold text-[#AE19C2] transition hover:bg-[#F6E8FA]" onClick={onViewAll} type="button">
          Ver todas
        </button>
      </div>
      <div className="space-y-3">
        {movements.length === 0 && <EmptyState label="No hay movimientos de caja para el filtro actual." />}

        {movements.slice(0, 5).map((movement) => {
          const isIncome = movement.type === 'Ingreso'

          return (
            <div className="grid grid-cols-[1fr_auto] items-center rounded-xl border border-[#EEF1F7] bg-[#FBFCFF] px-4 py-3" key={`${movement.type}-${movement.date}-${movement.amount}`}>
              <span className="inline-flex items-center gap-3">
                <span className={`flex h-6 w-6 items-center justify-center rounded-full ${isIncome ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                  {isIncome ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                </span>
                <span>
                  <span className="block text-sm font-bold text-[#111A44]">{movement.type}</span>
                  <span className="block text-xs text-[#667197]">{movement.date}</span>
                </span>
              </span>
              <span className={`text-sm font-bold ${isIncome ? 'text-emerald-600' : 'text-rose-600'}`}>{movement.amount}</span>
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
    const normalized = cell.toLowerCase()
    const style = normalized.includes('recepcionada') || normalized.includes('completada')
      ? 'bg-emerald-100 text-emerald-600'
      : normalized.includes('pendiente')
        ? 'bg-orange-100 text-orange-600'
        : normalized.includes('anulada')
          ? 'bg-rose-100 text-rose-600'
          : 'bg-slate-100 text-[#475174]'

    return <span className={`rounded px-2 py-1 text-[11px] font-bold ${style}`}>{cell}</span>
  }

  return cell
}

function CompactActivityRow({ columns, row, type }: { columns: string[]; row: DashboardTableRow; type: DashboardDataCardProps['type'] }) {
  const code = row[0]
  const title = type === 'sales' ? row[1] : row[0]
  const badge = type === 'sales' ? row[2] : row[1]
  const amount = type === 'sales' ? row[3] : row[2]
  const date = type === 'sales' ? row[4] : row[3]
  const detail = type === 'sales' ? row[2] : row[1]

  return (
    <article className="rounded-xl border border-[#EEF1F7] bg-[#FBFCFF] px-4 py-3 transition hover:border-[#E8C8F0] hover:bg-white">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="rounded-lg bg-[#F6E8FA] px-2.5 py-1 text-xs font-bold text-[#AE19C2]">{code}</span>
            {renderCell(badge, type === 'sales' ? 2 : 1, type)}
          </div>
          <p className="truncate text-sm font-bold text-[#111A44]">{title}</p>
          <p className="mt-1 text-xs text-[#667197]">{columns[type === 'sales' ? 2 : 1]}: {detail}</p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-sm font-bold text-[#111A44]">{amount}</p>
          <p className="mt-1 max-w-[120px] text-xs text-[#667197]">{date}</p>
        </div>
      </div>
    </article>
  )
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="rounded-xl border border-dashed border-[#DCE1EE] bg-[#F8FAFF] px-5 py-8 text-center">
      <p className="text-sm font-semibold text-[#111A44]">{label}</p>
    </div>
  )
}
