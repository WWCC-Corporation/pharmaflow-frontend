import type { ModuleAction } from '../types/module.types'

type ModuleActionsPanelProps = {
  title: string
  actions: ModuleAction[]
  onAction: (action: ModuleAction) => void
}

export function ModuleActionsPanel({ actions, onAction, title }: ModuleActionsPanelProps) {
  return (
    <section className="rounded-2xl border border-[#E8EAF3] bg-white p-6 shadow-[0_10px_30px_rgba(17,26,68,0.06)]">
      <h2 className="text-xl font-bold text-[#111A44]">{title}</h2>
      <p className="mt-1 text-sm text-[#667197]">Atajos frecuentes para Super Admin</p>

      <div className="mt-6 space-y-4">
        {actions.map((action) => {
          const Icon = action.icon

          return (
            <button
              className="flex w-full items-start gap-4 rounded-xl border border-[#E8EAF3] p-4 text-left transition hover:border-[#AE19C2] hover:bg-[#FDF6FF]"
              key={action.label}
              onClick={() => onAction(action)}
              type="button"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F6E8FA] text-[#AE19C2]">
                <Icon size={21} />
              </span>
              <span>
                <span className="block text-sm font-bold text-[#111A44]">{action.label}</span>
                <span className="mt-1 block text-xs leading-5 text-[#667197]">{action.description}</span>
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
