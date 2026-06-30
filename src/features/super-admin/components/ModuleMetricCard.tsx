import type { ModuleMetric } from '../types/module.types'

type ModuleMetricCardProps = {
  metric: ModuleMetric
}

export function ModuleMetricCard({ metric }: ModuleMetricCardProps) {
  const Icon = metric.icon

  return (
    <article className="rounded-2xl border border-[#E8EAF3] bg-white p-5 shadow-[0_10px_30px_rgba(17,26,68,0.06)]">
      <div className="flex items-center gap-5">
        <div className={`flex h-[70px] w-[70px] shrink-0 items-center justify-center rounded-full ${metric.tone}`}>
          <Icon size={31} />
        </div>
        <div>
          <p className="text-[15px] leading-5 text-[#394463]">{metric.label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-[#111A44]">{metric.value}</p>
        </div>
      </div>
      <p className="mt-5 text-sm font-medium text-[#667197]">{metric.detail}</p>
    </article>
  )
}
