type ModuleTableProps = {
  title: string
  description: string
  columns: string[]
  rows: string[][]
}

export function ModuleTable({ title, description, columns, rows }: ModuleTableProps) {
  return (
    <section className="rounded-2xl border border-[#E8EAF3] bg-white p-6 shadow-[0_10px_30px_rgba(17,26,68,0.06)]">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-[#111A44]">{title}</h2>
        <p className="mt-1 text-sm text-[#667197]">{description}</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead>
            <tr className="border-b border-[#E8EAF3] text-xs font-bold text-[#475174]">
              {columns.map((column) => (
                <th className="pb-4" key={column}>
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td className="py-10 text-center" colSpan={columns.length}>
                  <div className="rounded-xl border border-dashed border-[#DCE1EE] bg-[#F8FAFF] px-5 py-8">
                    <p className="text-sm font-bold text-[#111A44]">Sin registros reales para mostrar</p>
                    <p className="mt-2 text-sm text-[#667197]">Cuando el backend responda datos para este modulo, apareceran en esta tabla.</p>
                  </div>
                </td>
              </tr>
            )}

            {rows.map((row) => (
              <tr className="border-b border-[#E8EAF3] last:border-0" key={row.join('-')}>
                {row.map((cell, index) => (
                  <td className="py-4 text-xs font-medium text-[#283256]" key={`${cell}-${index}`}>
                    {renderCell(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function renderCell(cell: string) {
  const statusStyles: Record<string, string> = {
    Activa: 'bg-emerald-100 text-emerald-600',
    Activo: 'bg-emerald-100 text-emerald-600',
    Completada: 'bg-emerald-100 text-emerald-600',
    Recepcionada: 'bg-emerald-100 text-emerald-600',
    Pendiente: 'bg-orange-100 text-orange-600',
    Bajo: 'bg-orange-100 text-orange-600',
    Observacion: 'bg-sky-100 text-sky-600',
    Anulada: 'bg-rose-100 text-rose-600',
    Controlado: 'bg-[#F6E8FA] text-[#AE19C2]',
    super_admin: 'bg-[#F6E8FA] text-[#AE19C2]',
    administrador: 'bg-sky-100 text-sky-600',
    operador: 'bg-emerald-100 text-emerald-600',
  }

  if (statusStyles[cell]) {
    return <span className={`rounded px-2 py-1 text-[11px] font-bold ${statusStyles[cell]}`}>{cell}</span>
  }

  return cell
}
