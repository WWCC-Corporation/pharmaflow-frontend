import { Edit3, Trash2 } from 'lucide-react'
import type { Provider } from '../types/provider.types'
import { getProviderId } from '../types/provider.types'

type ProvidersTableProps = {
    deletingId: string | null
    isLoading: boolean
    providers: Provider[]
    onDelete: (provider: Provider) => void
    onEdit: (provider: Provider) => void
}

export function ProvidersTable({
                                   deletingId,
                                   isLoading,
                                   providers,
                                   onDelete,
                                   onEdit,
                               }: ProvidersTableProps) {
    if (isLoading) {
        return (
            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                <p className="text-sm text-slate-500">Cargando proveedores...</p>
            </div>
        )
    }

    if (providers.length === 0) {
        return (
            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                <p className="text-sm text-slate-500">Todavía no hay proveedores registrados.</p>
            </div>
        )
    }

    return (
        <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-6 py-5">
                <h2 className="text-xl font-bold text-slate-900">Listado de proveedores</h2>
                <p className="mt-1 text-sm text-slate-500">
                    Datos reales consumidos desde el backend.
                </p>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full min-w-[780px] text-left text-sm">
                    <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                        <th className="px-6 py-4">Nombre</th>
                        <th className="px-6 py-4">RUC</th>
                        <th className="px-6 py-4">Teléfono</th>
                        <th className="px-6 py-4">Correo</th>
                        <th className="px-6 py-4">Estado</th>
                        <th className="px-6 py-4 text-right">Acciones</th>
                    </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                    {providers.map((provider) => {
                        const id = getProviderId(provider)

                        return (
                            <tr key={id || provider.nombre} className="hover:bg-slate-50">
                                <td className="px-6 py-4 font-semibold text-slate-800">
                                    {provider.nombre}
                                </td>
                                <td className="px-6 py-4 text-slate-600">{provider.ruc || '-'}</td>
                                <td className="px-6 py-4 text-slate-600">{provider.telefono || '-'}</td>
                                <td className="px-6 py-4 text-slate-600">{provider.correo || '-'}</td>
                                <td className="px-6 py-4">
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600">
                      {provider.activo === false ? 'Inactivo' : 'Activo'}
                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:border-[#AE19C2] hover:text-[#AE19C2]"
                                            type="button"
                                            onClick={() => onEdit(provider)}
                                        >
                                            <Edit3 size={16} />
                                        </button>

                                        <button
                                            className="rounded-xl border border-red-100 p-2 text-red-500 hover:bg-red-50 disabled:opacity-60"
                                            disabled={deletingId === id}
                                            type="button"
                                            onClick={() => onDelete(provider)}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )
                    })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}