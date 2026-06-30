import type { ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

type AppLayoutProps = {
  activePath: string
  children: ReactNode
  onNavigate?: (path: string) => void
}

export function AppLayout({ activePath, children, onNavigate }: AppLayoutProps) {
  return (
    <main className="min-h-screen bg-[#FAFBFF] text-[#111A44]">
      <div className="flex min-h-screen">
        <Sidebar activePath={activePath} onNavigate={onNavigate} />

        <section className="min-w-0 flex-1">
          <Topbar />
          {children}
        </section>
      </div>
    </main>
  )
}
