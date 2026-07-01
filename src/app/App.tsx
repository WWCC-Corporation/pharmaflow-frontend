import { useEffect, useMemo, useState } from 'react'
import { AppLayout } from '../components/layout/AppLayout'
import { DashboardPage } from '../pages/DashboardPage'
import { SalesPage } from '../pages/SalesPage'
import { SuperAdminModulePage } from '../pages/SuperAdminModulePage'
import { getDefaultPathByRole, getNavigationByRole } from '../config/navigation'
import { LoginPage } from '../features/auth/pages/LoginPage'
import { useAuth } from '../features/auth/hooks/useAuth'
import { useSuperAdminModule } from '../features/super-admin/hooks/useSuperAdminModule'

export function App() {
  const { authError, isAuthenticating, signIn, signOut, user } = useAuth()
  const [activePath, setActivePath] = useState('/dashboard')
  const allowedPaths = useMemo(() => getNavigationByRole(user?.roleKey).map((item) => item.path), [user?.roleKey])
  const activeModule = useSuperAdminModule(activePath)

  useEffect(() => {
    if (!user) {
      return
    }

    const defaultPath = getDefaultPathByRole(user.roleKey)

    if (!allowedPaths.includes(activePath)) {
      setActivePath(defaultPath)
    }
  }, [activePath, allowedPaths, user])

  if (!user) {
    return <LoginPage error={authError} isLoading={isAuthenticating} onLogin={signIn} />
  }

  const navigate = (path: string) => {
    if (allowedPaths.includes(path)) {
      setActivePath(path)
    }
  }

  return (
    <AppLayout activePath={activePath} currentUser={user} onLogout={signOut} onNavigate={navigate}>
      {activePath === '/dashboard' && <DashboardPage />}
      {activePath === '/ventas' && <SalesPage />}
      {activeModule && <SuperAdminModulePage module={activeModule} />}
    </AppLayout>
  )
}
