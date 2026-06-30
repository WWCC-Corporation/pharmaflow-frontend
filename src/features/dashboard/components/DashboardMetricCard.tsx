import { ArrowUp } from 'lucide-react'
import type { DashboardMetric } from '../types/dashboard.types'

type DashboardMetricCardProps = {
  metric: DashboardMetric
}

export function DashboardMetricCard({ metric }: DashboardMetricCardProps) {
  const Icon = metric.icon

  return (
    <article className="min-h-[192px] rounded-2xl border border-[#E8EAF3] bg-white p-5 shadow-[0_10px_30px_rgba(17,26,68,0.06)]">
      <div className="flex items-center gap-5">
        <div className={`flex h-[76px] w-[76px] shrink-0 items-center justify-center rounded-full ${metric.bubble}`}>
          <Icon size={34} />
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
    </article>
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
