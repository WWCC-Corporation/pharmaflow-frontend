import { AlertTriangle, Plus, Truck } from 'lucide-react'
import { useMemo, useState } from 'react'
import { ProviderForm } from '../components/ProviderForm'
import { ProviderMetricCard } from '../components/ProviderMetricCard'
import { ProvidersTable } from '../components/ProvidersTable'
import { useProviders } from '../hooks/useProviders'
import { createProvider, deleteProvider, updateProvider } from '../services/providers.api'
import type {
    CreateProviderRequest,
    Provider,
    UpdateProviderRequest,
} from '../types/provider.types'
import { getProviderId } from '../types/provider.types'

export function ProvidersPage() {
    const { error, isLoading, providers, reload } = useProviders()
    const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null)
    const [isSaving, setIsSaving] = useState(false)
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const [message, setMessage] = useState<string | null>(null)

    const activeProviders = useMemo(
        () => providers.filter((provider) => provider.activo !== false),
        [providers],
    )

    const inactiveProviders = useMemo(
        () => providers.filter((provider) => provider.activo === false),
        [providers],
    )

    const showMessage = (nextMessage: string) => {
        setMessage(nextMessage)
        window.setTimeout(() => setMessage(null), 2600)
    }

    const handleSubmit = async (payload: CreateProviderRequest | UpdateProviderRequest) => {
        setIsSaving(true)

        try {
            if (selectedProvider) {
                const id = getProviderId(selectedProvider)

                if (!id) {
                    throw new Error('No se encontró el ID del proveedor.')
                }

                await updateProvider(id, payload)
                showMessage('Proveedor actualizado correctamente.')
            } else {
                await createProvider(payload)
                showMessage('Proveedor registrado correctamente.')
            }

            setSelectedProvider(null)
            await reload()
        } catch (error) {
            showMessage(error instanceof Error ? error.message : 'No se pudo guardar el proveedor.')
        } finally {
            setIsSaving(false)
        }
    }

    const handleDelete = async (provider: Provider) => {
        const id = getProviderId(provider)

        if (!id) {
            showMessage('No se encontró el ID del proveedor.')
            return
        }

        const confirmed = window.confirm(`¿Seguro que deseas eliminar a ${provider.nombre}?`)

        if (!confirmed) {
            return
        }

        setDeletingId(id)

        try {
            await deleteProvider(id)
            showMessage('Proveedor eliminado correctamente.')
            await reload()
        } catch (error) {
            showMessage(error instanceof Error ? error.message : 'No se pudo eliminar el proveedor.')
        } finally {
            setDeletingId(null)
        }
    }

    return (
        <section className="space-y-6">
            <div className="flex flex-col justify-between gap-4 rounded-3xl bg-[#FAFBFF] md:flex-row md:items-center">
                <div>
          <span className="text-sm font-bold uppercase tracking-[0.25em] text-[#AE19C2]">
            PharmaFlow
          </span>
                    <h1 className="mt-2 text-3xl font-black text-slate-950">Proveedores</h1>
                    <p className="mt-2 max-w-2xl text-sm text-slate-500">
                        Administra proveedores reales del backend para usarlos en el módulo de compras.
                    </p>
                </div>

                <button
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#AE19C2] px-5 py-3 text-sm font-bold text-white shadow-sm"
                    type="button"
                    onClick={() => setSelectedProvider(null)}
                >
                    <Plus size={18} />
                    Nuevo proveedor
                </button>
            </div>

            {message && (
                <div className="rounded-2xl bg-purple-50 px-5 py-4 text-sm font-semibold text-[#AE19C2]">
                    {message}
                </div>
            )}

            {error && (
                <div className="rounded-2xl bg-red-50 px-5 py-4 text-sm font-semibold text-red-600">
                    {error}
                </div>
            )}

            <div className="grid gap-4 md:grid-cols-3">
                <ProviderMetricCard
                    detail="Registrados en el API"
                    icon={Truck}
                    title="Total proveedores"
                    value={providers.length}
                />

                <ProviderMetricCard
                    detail="Disponibles para compras"
                    icon={Plus}
                    title="Activos"
                    value={activeProviders.length}
                />

                <ProviderMetricCard
                    detail="Revisar directorio"
                    icon={AlertTriangle}
                    title="Inactivos"
                    value={inactiveProviders.length}
                />
            </div>

            <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
                <ProvidersTable
                    deletingId={deletingId}
                    isLoading={isLoading}
                    providers={providers}
                    onDelete={handleDelete}
                    onEdit={setSelectedProvider}
                />

                <ProviderForm
                    isSaving={isSaving}
                    selectedProvider={selectedProvider}
                    onCancel={() => setSelectedProvider(null)}
                    onSubmit={handleSubmit}
                />
            </div>
        </section>
    )
}