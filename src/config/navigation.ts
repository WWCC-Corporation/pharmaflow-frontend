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
  { label: 'Dashboard', icon: Home, path: '/dashboard' },
  { label: 'Ventas', icon: ShoppingCart, path: '/ventas' },
  { label: 'Compras', icon: Briefcase, path: '/compras' },
  { label: 'Inventario', icon: Boxes, path: '/inventario' },
  { label: 'Productos', icon: ShieldCheck, path: '/productos' },
  { label: 'Clientes', icon: Users, path: '/clientes' },
  { label: 'Proveedores', icon: Truck, path: '/proveedores' },
  { label: 'Caja', icon: WalletCards, path: '/caja' },
  { label: 'Reportes', icon: Building2, path: '/reportes' },
  { label: 'Usuarios', icon: User, path: '/usuarios' },
  { label: 'Sucursales', icon: Store, path: '/sucursales' },
  { label: 'Configuracion', icon: Settings, path: '/configuracion' },
]
