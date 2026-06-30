import { ChevronDown } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type FilterButtonProps = {
  icon: LucideIcon
  label: string
  onClick?: () => void
}

export function FilterButton({ icon: Icon, label, onClick }: FilterButtonProps) {
  return (
    <button
      className="flex h-13 min-w-64 items-center gap-3 rounded-lg border border-[#E0E4EF] bg-white px-5 text-sm font-semibold text-[#283256] shadow-sm"
      onClick={onClick}
      type="button"
    >
      <Icon className="text-[#667197]" size={20} />
      {label}
      <ChevronDown className="ml-auto" size={17} />
    </button>
  )
}
