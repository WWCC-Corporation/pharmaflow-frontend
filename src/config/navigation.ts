import {
  Boxes,
  Briefcase,
  Building2,
  Settings,
  Home,
  ShieldCheck,
  ShoppingCart,
  Store,
  Truck,
  User,
  Users,
  WalletCards,
} from 'lucide-react'
import type { NavigationItem } from '../types/navigation'

export const navigationItems: NavigationItem[] = [
  { label: 'Dashboard', icon: Home, path: '/dashboard', roles: ['super_admin', 'administrador', 'operador'] },
  { label: 'Ventas', icon: ShoppingCart, path: '/ventas', roles: ['super_admin', 'administrador', 'operador'] },
  { label: 'Compras', icon: Briefcase, path: '/compras', roles: ['super_admin', 'administrador'] },
  { label: 'Inventario', icon: Boxes, path: '/inventario', roles: ['super_admin', 'administrador', 'operador'] },
  { label: 'Productos', icon: ShieldCheck, path: '/productos', roles: ['super_admin', 'administrador', 'operador'] },
  { label: 'Clientes', icon: Users, path: '/clientes', roles: ['super_admin', 'administrador', 'operador'] },
  { label: 'Proveedores', icon: Truck, path: '/proveedores', roles: ['super_admin', 'administrador'] },
  { label: 'Caja', icon: WalletCards, path: '/caja', roles: ['super_admin', 'administrador', 'operador'] },
  { label: 'Reportes', icon: Building2, path: '/reportes', roles: ['super_admin', 'administrador'] },
  { label: 'Usuarios', icon: User, path: '/usuarios', roles: ['super_admin'] },
  { label: 'Sucursales', icon: Store, path: '/sucursales', roles: ['super_admin'] },
  { label: 'Configuracion', icon: Settings, path: '/configuracion', roles: ['super_admin', 'administrador'] },
]

export function getNavigationByRole(role?: string) {
  return navigationItems.filter((item) => !item.roles || item.roles.includes(role ?? ''))
}

export function getDefaultPathByRole(role?: string) {
  if (role === 'operador') {
    return '/ventas'
  }

  return '/dashboard'
}
