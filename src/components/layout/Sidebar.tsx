import { ChevronDown, Headphones } from 'lucide-react'
import pharmaflowLogo from '../../assets/pharmaflow-logo.png'
import { navigationItems } from '../../config/navigation'

type SidebarProps = {
  activePath: string
  onNavigate?: (path: string) => void
}

export function Sidebar({ activePath, onNavigate }: SidebarProps) {
  return (
    <aside className="hidden w-[298px] shrink-0 bg-[#AE19C2] px-4 py-7 text-white lg:flex lg:flex-col">
      <div className="mb-8 flex items-center gap-3 px-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/16 p-1.5 shadow-[0_10px_24px_rgba(17,26,68,0.16)] backdrop-blur">
          <img
            alt="PharmaFlow"
            className="h-full w-full object-contain mix-blend-normal"
            src={pharmaflowLogo}
          />
        </div>
        <p className="text-3xl font-semibold tracking-tight">PharmaFlow</p>
      </div>

      <nav className="space-y-3">
        {navigationItems.map((item) => {
          const Icon = item.icon
          const isActive = item.path === activePath

          return (
            <button
              className={`flex w-full items-center gap-4 rounded-lg px-4 py-3.5 text-left text-base font-semibold transition ${
                isActive ? 'bg-white/18 shadow-sm' : 'hover:bg-white/12'
              }`}
              key={item.path}
              onClick={() => onNavigate?.(item.path)}
              type="button"
            >
              <Icon size={23} />
              {item.label}
            </button>
          )
        })}
      </nav>

      <div className="mt-auto rounded-2xl bg-white/90 p-5 text-[#111A44] shadow-xl">
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-white text-[#AE19C2] shadow-sm">
          <Headphones size={25} />
        </div>
        <p className="text-lg font-bold">¿Necesitas ayuda?</p>
        <p className="mt-2 text-sm leading-6 text-slate-600">Estamos aqui para ayudarte</p>
        <button
          className="mt-5 flex w-full items-center justify-between rounded-lg bg-white px-4 py-3 text-sm font-bold text-[#AE19C2] shadow-sm"
          type="button"
        >
          Centro de ayuda
          <ChevronDown className="-rotate-90" size={18} />
        </button>
      </div>
    </aside>
  )
}
