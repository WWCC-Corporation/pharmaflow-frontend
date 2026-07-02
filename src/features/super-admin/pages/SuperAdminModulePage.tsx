import { useState } from 'react'
import { Filter, Plus, Search } from 'lucide-react'
import { Modal } from '../../../components/ui/Modal'
import { Toast } from '../../../components/ui/Toast'
import { ModuleActionsPanel } from '../components/ModuleActionsPanel'
import { ModuleMetricCard } from '../components/ModuleMetricCard'
import { ModuleTable } from '../components/ModuleTable'
import { createSuperAdminRecord, getModuleFormFields } from '../services/superAdmin.api'
import type { ModuleAction } from '../types/module.types'
import type { ModuleFormField, ModulePageConfig } from '../types/module.types'

type SuperAdminModulePageProps = {
  module: ModulePageConfig
}

export function SuperAdminModulePage({ module }: SuperAdminModulePageProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [selectedAction, setSelectedAction] = useState<ModuleAction | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const formFields = getModuleFormFields(module.path)

  const showToast = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(null), 2600)
  }

  return (
    <>
      <div className="px-5 py-7 md:px-11">
        <div className="mb-7 flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-[#111A44]">{module.title}</h1>
            <p className="mt-2 text-lg text-[#667197]">
              {module.error ?? (module.isLoading ? 'Cargando datos del backend...' : module.description)}
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <label className="flex h-13 min-w-72 items-center gap-3 rounded-lg border border-[#E0E4EF] bg-white px-4 text-sm text-[#667197] shadow-sm">
              <Search size={18} />
              <input className="w-full bg-transparent outline-none" placeholder={module.searchPlaceholder} type="search" />
            </label>
            <button
              className="flex h-13 items-center justify-center gap-2 rounded-lg border border-[#E0E4EF] bg-white px-5 text-sm font-bold text-[#475174]"
              onClick={() => setIsFilterOpen(true)}
              type="button"
            >
              <Filter size={18} />
              Filtros
            </button>
            <button
              className="flex h-13 items-center justify-center gap-2 rounded-lg bg-[#AE19C2] px-5 text-sm font-bold text-white shadow-[0_10px_24px_rgba(174,25,194,0.24)]"
              onClick={() => setIsCreateOpen(true)}
              type="button"
            >
              <Plus size={18} />
              {module.primaryAction}
            </button>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {module.metrics.map((metric) => (
            <ModuleMetricCard key={metric.label} metric={metric} />
          ))}
        </div>

        <div className="mt-6 grid gap-5 xl:grid-cols-[1.35fr_0.65fr]">
          <ModuleTable
            columns={module.columns}
            description={module.tableDescription}
            rows={module.rows}
            title={module.tableTitle}
          />
          <ModuleActionsPanel actions={module.actions} onAction={setSelectedAction} title={module.actionsTitle} />
        </div>
      </div>

      <Modal
        description="Formulario conectado al backend de PharmaFlow."
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title={module.primaryAction}
      >
        <GenericModuleForm
          fields={formFields}
          isSaving={isSaving}
          moduleTitle={module.title}
          onCancel={() => setIsCreateOpen(false)}
          onSubmit={(values) => {
            setIsSaving(true)
            createSuperAdminRecord(module.path, values)
              .then(() => {
                setIsCreateOpen(false)
                showToast(`${module.primaryAction} registrado correctamente`)
              })
              .catch((error: unknown) => {
                showToast(error instanceof Error ? error.message : 'No se pudo guardar el registro')
              })
              .finally(() => setIsSaving(false))
          }}
        />
      </Modal>

      <Modal
        description="Filtros visuales para revisar la informacion del modulo."
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        title={`Filtros de ${module.title}`}
      >
        <GenericFilterForm
          onApply={() => {
            setIsFilterOpen(false)
            showToast('Filtros aplicados')
          }}
        />
      </Modal>

      <Modal
        description={selectedAction?.description}
        isOpen={selectedAction !== null}
        onClose={() => setSelectedAction(null)}
        title={selectedAction?.label ?? ''}
      >
        <div className="space-y-5">
          <div className="rounded-xl bg-[#FAFBFF] p-4 text-sm text-[#667197]">
            Esta accion usa los datos reales visibles del modulo. Para operaciones especiales, usa la accion principal o el endpoint correspondiente del backend.
          </div>
          <div className="flex justify-end gap-3">
            <button className="rounded-lg border border-[#E0E4EF] px-5 py-3 text-sm font-bold text-[#475174]" onClick={() => setSelectedAction(null)} type="button">
              Cancelar
            </button>
            <button
              className="rounded-lg bg-[#AE19C2] px-5 py-3 text-sm font-bold text-white"
              onClick={() => {
                showToast('Accion confirmada')
                setSelectedAction(null)
              }}
              type="button"
            >
              Confirmar
            </button>
          </div>
        </div>
      </Modal>

      <Toast message={toast} />
    </>
  )
}

function GenericModuleForm({
  fields,
  isSaving,
  moduleTitle,
  onCancel,
  onSubmit,
}: {
  fields: ModuleFormField[]
  isSaving: boolean
  moduleTitle: string
  onCancel: () => void
  onSubmit: (values: Record<string, string | boolean>) => void
}) {
  const [values, setValues] = useState<Record<string, string | boolean>>({})

  if (fields.length === 0) {
    return (
      <div className="space-y-5">
        <div className="rounded-xl bg-[#FAFBFF] p-4 text-sm text-[#667197]">
          {moduleTitle} no requiere alta directa desde esta pantalla. Usa los filtros y acciones disponibles para consultar informacion real.
        </div>
        <div className="flex justify-end">
          <button className="rounded-lg border border-[#E0E4EF] px-5 py-3 text-sm font-bold text-[#475174]" onClick={onCancel} type="button">
            Cerrar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        {fields.map((field) => (
            <ModuleField
            field={field}
            key={field.key}
            onChange={(value) => setValues((current) => ({ ...current, [field.key]: value }))}
            value={values[field.key] ?? ''}
          />
        ))}
      </div>
      <div className="flex justify-end gap-3">
        <button className="rounded-lg border border-[#E0E4EF] px-5 py-3 text-sm font-bold text-[#475174]" onClick={onCancel} type="button">
          Cancelar
        </button>
        <button
          className="rounded-lg bg-[#AE19C2] px-5 py-3 text-sm font-bold text-white disabled:opacity-60"
          disabled={isSaving}
          onClick={() => onSubmit(values)}
          type="button"
        >
          {isSaving ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </div>
  )
}

function GenericFilterForm({ onApply }: { onApply: () => void }) {
  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <SimpleField label="Desde" type="date" />
        <SimpleField label="Hasta" type="date" />
        <SimpleField label="Sucursal" placeholder="Todas las sucursales" />
        <SimpleField label="Estado" placeholder="Activo / Pendiente / Anulado" />
      </div>
      <div className="flex justify-end">
        <button className="rounded-lg bg-[#AE19C2] px-5 py-3 text-sm font-bold text-white" onClick={onApply} type="button">
          Aplicar filtros
        </button>
      </div>
    </div>
  )
}

function ModuleField({
  field,
  onChange,
  value,
}: {
  field: ModuleFormField
  onChange?: (value: string | boolean) => void
  value?: string | boolean
}) {
  if (field.type === 'checkbox') {
    return (
      <label className="flex items-center gap-3 rounded-lg border border-[#E0E4EF] px-4 py-3">
        <input checked={Boolean(value)} onChange={(event) => onChange?.(event.target.checked)} type="checkbox" />
        <span className="text-sm font-bold text-[#283256]">{field.label}</span>
      </label>
    )
  }

  if (field.type === 'select') {
    return (
      <label className="block">
        <span className="mb-2 block text-sm font-bold text-[#283256]">{field.label}</span>
        <select
          className="h-12 w-full rounded-lg border border-[#E0E4EF] bg-white px-4 text-sm outline-none focus:border-[#AE19C2]"
          onChange={(event) => onChange?.(event.target.value)}
          required={field.required}
          value={String(value ?? '')}
        >
          {(field.options ?? []).map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    )
  }

  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-[#283256]">{field.label}</span>
      <input
        className="h-12 w-full rounded-lg border border-[#E0E4EF] px-4 text-sm outline-none focus:border-[#AE19C2]"
        onChange={(event) => onChange?.(event.target.value)}
        placeholder={field.placeholder}
        required={field.required}
        type={field.type ?? 'text'}
        value={String(value ?? '')}
      />
    </label>
  )
}

function SimpleField({ label, placeholder, type = 'text' }: { label: string; placeholder?: string; type?: string }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-[#283256]">{label}</span>
      <input
        className="h-12 w-full rounded-lg border border-[#E0E4EF] px-4 text-sm outline-none focus:border-[#AE19C2]"
        placeholder={placeholder}
        type={type}
      />
    </label>
  )
}
