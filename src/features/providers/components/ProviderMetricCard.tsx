import type { LucideIcon } from 'lucide-react'

type ProviderMetricCardProps = {
    title: string
    value: string | number
    detail: string
    icon: LucideIcon
}

export function ProviderMetricCard({
                                       title,
                                       value,
                                       detail,
                                       icon: Icon,
                                   }: ProviderMetricCardProps) {
    return (
        <article className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <p className="text-sm font-medium text-slate-500">{title}</p>
                    <strong className="mt-2 block text-3xl font-bold text-slate-900">{value}</strong>
                    <span className="mt-1 block text-sm text-slate-400">{detail}</span>
                </div>

                <div className="rounded-2xl bg-purple-100 p-3 text-[#AE19C2]">
                    <Icon size={24} />
                </div>
            </div>
        </article>
    )
}