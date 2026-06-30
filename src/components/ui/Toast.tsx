import { CheckCircle2 } from 'lucide-react'

type ToastProps = {
  message: string | null
}

export function Toast({ message }: ToastProps) {
  if (!message) {
    return null
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl bg-[#111A44] px-5 py-4 text-sm font-semibold text-white shadow-2xl">
      <CheckCircle2 className="text-emerald-300" size={20} />
      {message}
    </div>
  )
}
