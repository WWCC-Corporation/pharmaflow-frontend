import type { ReactNode } from 'react'
import type { CurrentUser } from '../../types/user'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

type AppLayoutProps = {
  activePath: string
  children: ReactNode
  currentUser: CurrentUser
  onLogout: () => void
  onNavigate?: (path: string) => void
}

export function AppLayout({ activePath, children, currentUser, onLogout, onNavigate }: AppLayoutProps) {
  return (
    <main className="min-h-screen bg-[#FAFBFF] text-[#111A44]">
      <div className="flex min-h-screen">
        <Sidebar activePath={activePath} onNavigate={onNavigate} role={currentUser.roleKey} />

        <section className="min-w-0 flex-1">
          <Topbar currentUser={currentUser} onLogout={onLogout} />
          {children}
        </section>
      </div>
    </main>
  )
}
