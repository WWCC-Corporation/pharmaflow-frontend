import type { CurrentUser } from '../../../types/user'

export type AuthRole = 'administrador' | 'operador' | 'super_admin'

export type AuthSession = {
  token: string
  refreshToken: string
  expiraEn: string
  usuarioId: string
  correo: string
  rol: AuthRole | string
}

export type AuthUser = CurrentUser & {
  correo: string
  id: string
  roleKey: string
}
