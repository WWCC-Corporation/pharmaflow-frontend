import { ArrowUp } from 'lucide-react'
import type { DashboardMetric } from '../types/dashboard.types'

type DashboardMetricCardProps = {
  metric: DashboardMetric
  onClick?: () => void
}

export function DashboardMetricCard({ metric, onClick }: DashboardMetricCardProps) {
  const Icon = metric.icon
  const visual = getMetricVisual(metric.footer)
  const Component = onClick ? 'button' : 'article'

  return (
    <Component
      className={`group relative min-h-[192px] overflow-hidden rounded-2xl border border-[#E8EAF3] bg-white p-5 text-left shadow-[0_10px_30px_rgba(17,26,68,0.06)] transition duration-300 hover:-translate-y-0.5 hover:border-[#E8C8F0] hover:shadow-[0_18px_38px_rgba(174,25,194,0.12)] ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
      type={onClick ? 'button' : undefined}
    >
      <div className={`pointer-events-none absolute -right-10 -top-12 h-28 w-28 rounded-full opacity-70 blur-2xl ${visual.glow}`} />
      <div className="flex items-center gap-5">
        <div className={`relative flex h-[78px] w-[78px] shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${visual.card} shadow-[0_14px_30px_rgba(17,26,68,0.12)]`}>
          <span className="absolute inset-1 rounded-[18px] border border-white/55" />
          <span className="absolute -right-1 -top-1 h-5 w-5 rounded-full border-2 border-white bg-white/80 shadow-sm" />
          <Icon className="relative z-10 drop-shadow-sm" size={36} strokeWidth={2.4} />
        </div>
        <div>
          <p className="max-w-36 text-[15px] leading-5 text-[#394463]">{metric.label}</p>
          <p className="mt-3 text-4xl font-bold tracking-tight text-[#111A44]">{metric.value}</p>
        </div>
      </div>

      <div className="mt-6 flex min-h-8 items-center justify-between">
        {metric.footer === 'trend' && (
          <>
            <p className="flex items-center gap-2 text-sm font-semibold text-emerald-500">
              <ArrowUp size={17} />
              {metric.detail}
            </p>
            <MiniSparkline color="#AE19C2" />
          </>
        )}
        {metric.footer === 'progress' && (
          <div className="w-full">
            <p className="mb-3 text-sm text-[#667197]">{metric.detail}</p>
            <div className="h-3 rounded-full bg-[#EDF0F7]">
              <div className="h-full w-[83%] rounded-full bg-[#AE19C2]" />
            </div>
          </div>
        )}
        {metric.footer === 'spark' && (
          <>
            <span className="rounded-lg bg-sky-50 px-3 py-2 text-sm font-semibold text-sky-500">{metric.detail}</span>
            <MiniSparkline color="#2EA7FF" />
          </>
        )}
        {metric.footer === 'warning' && (
          <span className="rounded-lg bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-500">{metric.detail}</span>
        )}
        {metric.footer === 'danger' && (
          <span className="rounded-lg bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-500">{metric.detail}</span>
        )}
      </div>
    </Component>
  )
}

function MiniSparkline({ color }: { color: string }) {
  return (
    <svg className="h-9 w-16" viewBox="0 0 64 36">
      <polyline
        fill="none"
        points="2,32 14,24 26,26 36,14 47,18 61,4"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="3"
      />
    </svg>
  )
}

function getMetricVisual(footer: DashboardMetric['footer']) {
  const visuals: Record<DashboardMetric['footer'], { card: string; glow: string }> = {
    danger: {
      card: 'from-rose-100 via-rose-50 to-white text-rose-500',
      glow: 'bg-rose-100',
    },
    progress: {
      card: 'from-[#F6E8FA] via-[#FDF4FF] to-white text-[#AE19C2]',
      glow: 'bg-[#F6E8FA]',
    },
    spark: {
      card: 'from-sky-100 via-sky-50 to-white text-sky-500',
      glow: 'bg-sky-100',
    },
    trend: {
      card: 'from-[#F6E8FA] via-[#FDF4FF] to-white text-[#AE19C2]',
      glow: 'bg-[#F6E8FA]',
    },
    warning: {
      card: 'from-orange-100 via-orange-50 to-white text-orange-500',
      glow: 'bg-orange-100',
    },
  }

  return visuals[footer]
}
