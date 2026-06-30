import type { ReactNode } from 'react'
import { X } from 'lucide-react'

type ModalProps = {
  children: ReactNode
  isOpen: boolean
  title: string
  description?: string
  onClose: () => void
}

export function Modal({ children, description, isOpen, onClose, title }: ModalProps) {
  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 backdrop-blur-sm">
      <section className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-[#111A44]">{title}</h2>
            {description && <p className="mt-1 text-sm text-[#667197]">{description}</p>}
          </div>
          <button
            aria-label="Cerrar"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-[#F6E8FA] hover:text-[#AE19C2]"
            onClick={onClose}
            type="button"
          >
            <X size={20} />
          </button>
        </div>
        {children}
      </section>
    </div>
  )
}
