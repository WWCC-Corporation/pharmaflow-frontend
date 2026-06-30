import { CalendarDays, ChevronDown, MoreHorizontal } from 'lucide-react'

export function SalesChart() {
  return (
    <section className="rounded-2xl border border-[#E8EAF3] bg-white p-6 shadow-[0_10px_30px_rgba(17,26,68,0.06)]">
      <div className="mb-7 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ChartIcon />
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
          {[40, 86, 132, 178, 224].map((y) => (
            <line key={y} stroke="#E9ECF4" x1="56" x2="748" y1={y} y2={y} />
          ))}
          <path d="M56 188 L154 152 L252 112 L350 148 L448 132 L546 98 L650 184" fill="none" stroke="#AE19C2" strokeLinecap="round" strokeWidth="4" />
          <path d="M56 224 L154 196 L252 168 L350 198 L448 176 L546 142 L650 210" fill="none" stroke="#2EA7FF" strokeLinecap="round" strokeWidth="4" />
          <path d="M56 188 L154 152 L252 112 L350 148 L448 132 L546 98 L650 184 L650 238 L56 238 Z" fill="url(#purpleArea)" opacity="0.2" />
          <defs>
            <linearGradient id="purpleArea" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#AE19C2" />
              <stop offset="100%" stopColor="#AE19C2" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[56, 154, 252, 350, 448, 546, 650].map((x, i) => (
            <circle cx={x} cy={[188, 152, 112, 148, 132, 98, 184][i]} fill="#AE19C2" key={x} r="6" />
          ))}
          {[56, 154, 252, 350, 448, 546, 650].map((x, i) => (
            <circle cx={x} cy={[224, 196, 168, 198, 176, 142, 210][i]} fill="#2EA7FF" key={`b-${x}`} r="5" />
          ))}
        </svg>
        <div className="absolute left-0 top-3 grid h-[230px] grid-rows-5 text-xs text-[#667197]">
          <span>12K</span>
          <span>8K</span>
          <span>6K</span>
          <span>4K</span>
          <span>0</span>
        </div>
        <div className="absolute bottom-0 left-14 right-7 grid grid-cols-7 text-center text-sm text-[#667197]">
          {['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'].map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>
      </div>
    </section>
  )
}

function ChartIcon() {
  return (
    <div className="text-[#AE19C2]">
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24">
        <path d="M4 19V5M4 19H20M8 15L12 11L15 14L20 8" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      </svg>
    </div>
  )
}
