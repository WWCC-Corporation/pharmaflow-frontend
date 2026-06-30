import { useState } from 'react'
import { Filter, Plus, Search } from 'lucide-react'
import { Modal } from '../../../components/ui/Modal'
import { Toast } from '../../../components/ui/Toast'
import { ModuleActionsPanel } from '../components/ModuleActionsPanel'
import { ModuleMetricCard } from '../components/ModuleMetricCard'
import { ModuleTable } from '../components/ModuleTable'
import type { ModuleAction } from '../types/module.types'
import type { ModulePageConfig } from '../types/module.types'

type SuperAdminModulePageProps = {
  module: ModulePageConfig
}

export function SuperAdminModulePage({ module }: SuperAdminModulePageProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [selectedAction, setSelectedAction] = useState<ModuleAction | null>(null)
  const [toast, setToast] = useState<string | null>(null)

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
            <p className="mt-2 text-lg text-[#667197]">{module.description}</p>
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
        description="Formulario visual para simular la accion principal del modulo."
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title={module.primaryAction}
      >
        <GenericModuleForm
          moduleTitle={module.title}
          onCancel={() => setIsCreateOpen(false)}
          onSubmit={() => {
            setIsCreateOpen(false)
            showToast(`${module.primaryAction} guardado en modo simulacion`)
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
            Esta accion esta en modo maqueta. Sirve para validar el flujo UI/UX antes de conectar el API.
          </div>
          <div className="flex justify-end gap-3">
            <button className="rounded-lg border border-[#E0E4EF] px-5 py-3 text-sm font-bold text-[#475174]" onClick={() => setSelectedAction(null)} type="button">
              Cancelar
            </button>
            <button
              className="rounded-lg bg-[#AE19C2] px-5 py-3 text-sm font-bold text-white"
              onClick={() => {
                showToast('Accion simulada correctamente')
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
  moduleTitle,
  onCancel,
  onSubmit,
}: {
  moduleTitle: string
  onCancel: () => void
  onSubmit: () => void
}) {
  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Nombre / codigo" placeholder={`Nuevo registro de ${moduleTitle}`} />
        <Field label="Sucursal" placeholder="Sucursal Principal" />
        <Field label="Estado" placeholder="Activo" />
        <Field label="Observacion" placeholder="Detalle opcional" />
      </div>
      <div className="flex justify-end gap-3">
        <button className="rounded-lg border border-[#E0E4EF] px-5 py-3 text-sm font-bold text-[#475174]" onClick={onCancel} type="button">
          Cancelar
        </button>
        <button className="rounded-lg bg-[#AE19C2] px-5 py-3 text-sm font-bold text-white" onClick={onSubmit} type="button">
          Guardar
        </button>
      </div>
    </div>
  )
}

function GenericFilterForm({ onApply }: { onApply: () => void }) {
  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Desde" type="date" />
        <Field label="Hasta" type="date" />
        <Field label="Sucursal" placeholder="Todas las sucursales" />
        <Field label="Estado" placeholder="Activo / Pendiente / Anulado" />
      </div>
      <div className="flex justify-end">
        <button className="rounded-lg bg-[#AE19C2] px-5 py-3 text-sm font-bold text-white" onClick={onApply} type="button">
          Aplicar filtros
        </button>
      </div>
    </div>
  )
}

function Field({ label, placeholder, type = 'text' }: { label: string; placeholder?: string; type?: string }) {
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
