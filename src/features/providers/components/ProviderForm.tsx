import { useEffect, useState, type FormEvent } from 'react'
import type {
    CreateProviderRequest,
    Provider,
    UpdateProviderRequest,
} from '../types/provider.types'

type ProviderFormProps = {
    selectedProvider: Provider | null
    isSaving: boolean
    onCancel: () => void
    onSubmit: (payload: CreateProviderRequest | UpdateProviderRequest) => Promise<void>
}

const emptyForm = {
    nombre: '',
    ruc: '',
    telefono: '',
    correo: '',
}

export function ProviderForm({
                                 selectedProvider,
                                 isSaving,
                                 onCancel,
                                 onSubmit,
                             }: ProviderFormProps) {
    const [form, setForm] = useState(emptyForm)
    const [formError, setFormError] = useState<string | null>(null)

    useEffect(() => {
        if (!selectedProvider) {
            setForm(emptyForm)
            setFormError(null)
            return
        }

        setForm({
            nombre: selectedProvider.nombre ?? '',
            ruc: selectedProvider.ruc ?? '',
            telefono: selectedProvider.telefono ?? '',
            correo: selectedProvider.correo ?? '',
        })

        setFormError(null)
    }, [selectedProvider])

    const updateField = (field: keyof typeof form, value: string) => {
        setForm((current) => ({
            ...current,
            [field]: value,
        }))
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (!form.nombre.trim()) {
            setFormError('El nombre del proveedor es obligatorio.')
            return
        }

        await onSubmit({
            nombre: form.nombre.trim(),
            ruc: form.ruc.trim() || null,
            telefono: form.telefono.trim() || null,
            correo: form.correo.trim() || null,
        })

        if (!selectedProvider) {
            setForm(emptyForm)
        }

        setFormError(null)
    }

    return (
        <form
            className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm"
            onSubmit={handleSubmit}
        >
            <div className="mb-5">
                <h2 className="text-xl font-bold text-slate-900">
                    {selectedProvider ? 'Editar proveedor' : 'Nuevo proveedor'}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                    Registra proveedores para usarlos luego en compras.
                </p>
            </div>

            {formError && (
                <div className="mb-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
                    {formError}
                </div>
            )}

            <div className="space-y-4">
                <label className="block">
                    <span className="text-sm font-semibold text-slate-700">Nombre *</span>
                    <input
                        className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-[#AE19C2]"
                        placeholder="Ejemplo: Distribuidora Farma Perú"
                        value={form.nombre}
                        onChange={(event) => updateField('nombre', event.target.value)}
                    />
                </label>

                <label className="block">
                    <span className="text-sm font-semibold text-slate-700">RUC</span>
                    <input
                        className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-[#AE19C2]"
                        placeholder="Ejemplo: 20601234567"
                        value={form.ruc}
                        onChange={(event) => updateField('ruc', event.target.value)}
                    />
                </label>

                <label className="block">
                    <span className="text-sm font-semibold text-slate-700">Teléfono</span>
                    <input
                        className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-[#AE19C2]"
                        placeholder="Ejemplo: 987654321"
                        value={form.telefono}
                        onChange={(event) => updateField('telefono', event.target.value)}
                    />
                </label>

                <label className="block">
                    <span className="text-sm font-semibold text-slate-700">Correo</span>
                    <input
                        className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-[#AE19C2]"
                        placeholder="proveedor@correo.com"
                        type="email"
                        value={form.correo}
                        onChange={(event) => updateField('correo', event.target.value)}
                    />
                </label>
            </div>

            <div className="mt-6 flex gap-3">
                <button
                    className="rounded-2xl bg-[#AE19C2] px-5 py-3 text-sm font-bold text-white disabled:opacity-60"
                    disabled={isSaving}
                    type="submit"
                >
                    {isSaving ? 'Guardando...' : selectedProvider ? 'Actualizar' : 'Guardar'}
                </button>

                {selectedProvider && (
                    <button
                        className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600"
                        disabled={isSaving}
                        type="button"
                        onClick={onCancel}
                    >
                        Cancelar
                    </button>
                )}
            </div>
        </form>
    )
}