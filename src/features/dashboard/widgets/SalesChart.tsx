import { CalendarDays, ChevronDown, MoreHorizontal } from 'lucide-react'
import type { SalesChartPoint } from '../types/dashboard.types'

type SalesChartProps = {
  data: SalesChartPoint[]
}

const chartWidth = 760
const chartHeight = 280
const leftPadding = 56
const rightPadding = 12
const topPadding = 30
const bottomPadding = 48

export function SalesChart({ data }: SalesChartProps) {
  const maxValue = Math.max(...data.map((point) => point.total), 1)
  const chartPoints = data.map((point, index) => {
    const x = leftPadding + (index * (chartWidth - leftPadding - rightPadding)) / Math.max(data.length - 1, 1)
    const y = topPadding + (1 - point.total / maxValue) * (chartHeight - topPadding - bottomPadding)

    return {
      ...point,
      x,
      y,
    }
  })
  const linePoints = chartPoints.map((point) => `${point.x},${point.y}`).join(' ')
  const areaPoints =
    chartPoints.length > 0
      ? `${chartPoints[0].x},${chartHeight - bottomPadding} ${linePoints} ${chartPoints.at(-1)?.x ?? leftPadding},${chartHeight - bottomPadding}`
      : ''

  return (
    <section className="rounded-2xl border border-[#E8EAF3] bg-white p-6 shadow-[0_10px_30px_rgba(17,26,68,0.06)]">
      <div className="mb-7 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#F6E8FA] to-white text-[#AE19C2] shadow-[0_12px_24px_rgba(174,25,194,0.12)]">
            <ChartIcon />
          </span>
          <h2 className="text-lg font-bold text-[#111A44]">Ventas ultimos 7 dias</h2>
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 rounded-lg border border-[#E0E4EF] px-4 py-2 text-sm font-semibold text-[#475174]" type="button">
            <CalendarDays size={17} />
            Ultimos 7 dias
            <ChevronDown size={16} />
          </button>
          <MoreHorizontal className="text-[#667197]" size={22} />
        </div>
      </div>

      <div className="mb-4 flex gap-7 pl-16 text-sm text-[#667197]">
        <span className="flex items-center gap-2">
          <span className="h-1 w-6 rounded-full bg-[#AE19C2]" />
          Ventas (S/)
        </span>
        <span className="flex items-center gap-2">
          <span className="h-1 w-6 rounded-full bg-sky-400" />
          Periodo anterior (S/)
        </span>
      </div>

      <div className="relative h-[280px]">
        <svg className="h-full w-full" preserveAspectRatio="none" viewBox="0 0 760 280">
          <defs>
            <linearGradient id="salesArea" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#AE19C2" stopOpacity="0.23" />
              <stop offset="100%" stopColor="#AE19C2" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[40, 86, 132, 178, 224].map((y) => (
            <line key={y} stroke="#E9ECF4" x1="56" x2="748" y1={y} y2={y} />
          ))}
          {areaPoints && <polygon fill="url(#salesArea)" points={areaPoints} />}
          {linePoints && <polyline fill="none" points={linePoints} stroke="#AE19C2" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />}
          {chartPoints.map((point) => (
            <g key={point.date}>
              <circle cx={point.x} cy={point.y} fill="#AE19C2" r="6" />
              <circle cx={point.x} cy={point.y} fill="white" r="2.5" />
            </g>
          ))}
        </svg>
        <div className="absolute left-0 top-3 grid h-[230px] grid-rows-5 text-xs text-[#667197]">
          <span>{formatAxis(maxValue)}</span>
          <span>{formatAxis(maxValue * 0.75)}</span>
          <span>{formatAxis(maxValue * 0.5)}</span>
          <span>{formatAxis(maxValue * 0.25)}</span>
          <span>0</span>
        </div>
        <div className="absolute bottom-0 left-14 right-7 grid grid-cols-7 text-center text-sm text-[#667197]">
          {data.map((day) => (
            <span className="capitalize" key={day.date}>{day.label}</span>
          ))}
        </div>
        <div className="absolute right-5 top-16 rounded-xl border border-[#F0DDF5] bg-white/90 px-4 py-3 shadow-[0_10px_24px_rgba(174,25,194,0.12)]">
          <p className="text-xs font-semibold text-[#667197]">Total 7 dias</p>
          <p className="text-lg font-black text-[#111A44]">{formatMoney(data.reduce((total, day) => total + day.total, 0))}</p>
        </div>
      </div>
    </section>
  )
}

function ChartIcon() {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24">
      <path d="M4 19V5M4 19H20M8 15L12 11L15 14L20 8" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.3" />
    </svg>
  )
}

function formatMoney(value: number) {
  return new Intl.NumberFormat('es-PE', {
    currency: 'PEN',
    maximumFractionDigits: 0,
    style: 'currency',
  }).format(value)
}

function formatAxis(value: number) {
  if (value >= 1000) {
    return `${Math.round(value / 1000)}K`
  }

  return Math.round(value).toString()
}
