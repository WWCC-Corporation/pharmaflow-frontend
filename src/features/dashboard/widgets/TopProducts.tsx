import { Pill, Trophy } from 'lucide-react'
import type { TopProduct } from '../types/dashboard.types'

type TopProductsProps = {
  products: TopProduct[]
}

export function TopProducts({ products }: TopProductsProps) {
  return (
    <section className="rounded-2xl border border-[#E8EAF3] bg-white p-6 shadow-[0_10px_30px_rgba(17,26,68,0.06)]">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Trophy className="text-[#AE19C2]" size={24} />
          <h2 className="text-lg font-bold text-[#111A44]">Productos mas vendidos</h2>
        </div>
        <button className="rounded-lg bg-[#F6E8FA] px-4 py-2 text-sm font-bold text-[#AE19C2]" type="button">
          Ver todos
        </button>
      </div>

      <div className="space-y-5">
        {products.map((product, index) => (
          <div className="grid grid-cols-[34px_44px_1fr_80px_150px] items-center gap-4" key={product.name}>
            <span className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${index < 3 ? 'bg-[#F6E8FA] text-[#AE19C2]' : 'bg-slate-100 text-[#475174]'}`}>
              {index + 1}
            </span>
            <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-[#E8EAF3] bg-slate-50">
              <Pill className="text-sky-500" size={22} />
            </div>
            <p className="text-sm font-semibold text-[#111A44]">{product.name}</p>
            <p className="text-sm text-[#475174]">{product.units}</p>
            <div className="h-3 rounded-full bg-[#EDF0F7]">
              <div className={`h-full rounded-full ${product.color}`} style={{ width: `${product.percent}%` }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
