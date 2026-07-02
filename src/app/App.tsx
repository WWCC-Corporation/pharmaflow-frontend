import { useState } from 'react'
import { AppLayout } from '../components/layout/AppLayout'
import { DashboardPage } from '../pages/DashboardPage'
import { SalesPage } from '../pages/SalesPage'
import { SuperAdminModulePage } from '../pages/SuperAdminModulePage'
import { useSuperAdminModule } from '../features/super-admin/hooks/useSuperAdminModule'
import { ProvidersPage } from '../features/providers/pages/ProvidersPage'

export function App() {
  const [activePath, setActivePath] = useState('/dashboard')
  const activeModule = useSuperAdminModule(activePath)

  return (
      <AppLayout activePath={activePath} onNavigate={setActivePath}>
        {activePath === '/dashboard' && <DashboardPage />}
        {activePath === '/ventas' && <SalesPage />}
        {activePath === '/proveedores' && <ProvidersPage />}

        {activeModule && activePath !== '/proveedores' && (
            <SuperAdminModulePage module={activeModule} />
        )}
      </AppLayout>
  )
}