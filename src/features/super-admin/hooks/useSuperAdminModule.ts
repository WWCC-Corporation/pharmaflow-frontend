import { getSuperAdminModule } from '../services/superAdmin.mock'

export function useSuperAdminModule(path: string) {
  return getSuperAdminModule(path)
}
