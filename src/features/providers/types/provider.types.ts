export type Provider = {
    id?: string
    idProveedor?: string
    nombre: string
    ruc?: string | null
    telefono?: string | null
    correo?: string | null
    activo?: boolean
}

export type CreateProviderRequest = {
    nombre: string
    ruc?: string | null
    telefono?: string | null
    correo?: string | null
}

export type UpdateProviderRequest = {
    nombre: string
    ruc?: string | null
    telefono?: string | null
    correo?: string | null
}

export function getProviderId(provider: Provider) {
    return provider.id ?? provider.idProveedor ?? ''
}
