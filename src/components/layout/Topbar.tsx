import { useState } from 'react'
import { Bell, ChevronDown, LogOut, Search, Settings, Store, UserRound } from 'lucide-react'
import pharmaflowLogo from '../../assets/pharmaflow-logo.png'
import { currentUser } from '../../config/user'

const branches = ['Sucursal Principal', 'Sucursal Norte', 'Sucursal Sur']

const searchResults = [
  { title: 'Paracetamol 500mg', type: 'Producto', detail: 'Stock 245 uds. - S/ 4.50' },
  { title: 'VNT-2045', type: 'Venta', detail: 'Juan Perez - S/ 85.00' },
  { title: 'Maria Torres', type: 'Cliente', detail: 'DNI 48752136' },
]

const notifications = [
  { title: 'Stock bajo', detail: '18 productos requieren reposicion', tone: 'warning' },
  { title: 'Venta completada', detail: 'VNT-2045 emitida correctamente', tone: 'success' },
  { title: 'Comprobante pendiente', detail: 'Boleta B001-002456 por validar', tone: 'info' },
]

export function Topbar() {
  const [selectedBranch, setSelectedBranch] = useState(branches[0])
  const [searchTerm, setSearchTerm] = useState('')
  const [openPanel, setOpenPanel] = useState<'search' | 'branches' | 'notifications' | 'profile' | null>(null)

  const closePanel = () => setOpenPanel(null)
  const visibleSearchResults = searchTerm.trim().length > 0 ? searchResults : searchResults.slice(0, 2)

  return (
    <header className="sticky top-0 z-20 border-b border-[#E8EAF3] bg-white px-5 py-5 shadow-sm md:px-11">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#AE19C2]/12 p-1.5 lg:hidden">
            <img alt="PharmaFlow" className="h-full w-full object-contain" src={pharmaflowLogo} />
          </div>
          <div className="relative w-full sm:w-[580px]">
            <label className="flex h-14 w-full items-center gap-4 rounded-lg border border-[#E0E4EF] bg-white px-4 text-[#667197] shadow-sm transition focus-within:border-[#AE19C2] focus-within:ring-4 focus-within:ring-[#AE19C2]/10">
              <Search size={21} />
              <input
                className="w-full bg-transparent text-[15px] outline-none placeholder:text-[#667197]"
                onChange={(event) => {
                  setSearchTerm(event.target.value)
                  setOpenPanel('search')
                }}
                onFocus={() => setOpenPanel('search')}
                placeholder="Buscar productos, ventas o clientes..."
                type="search"
                value={searchTerm}
              />
            </label>
            {openPanel === 'search' && (
              <div className="absolute left-0 right-0 top-16 z-30 rounded-2xl border border-[#E8EAF3] bg-white p-3 shadow-2xl">
                <div className="mb-2 flex items-center justify-between px-2">
                  <p className="text-xs font-bold uppercase tracking-wide text-[#667197]">Busqueda rapida</p>
                  <button className="text-xs font-bold text-[#AE19C2]" onClick={closePanel} type="button">
                    Cerrar
                  </button>
                </div>
                <div className="space-y-2">
                  {visibleSearchResults.map((result) => (
                    <button
                      className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left transition hover:bg-[#FAF1FC]"
                      key={result.title}
                      onClick={closePanel}
                      type="button"
                    >
                      <span>
                        <span className="block text-sm font-bold text-[#111A44]">{result.title}</span>
                        <span className="block text-xs text-[#667197]">{result.detail}</span>
                      </span>
                      <span className="rounded-full bg-[#F6E8FA] px-3 py-1 text-xs font-bold text-[#AE19C2]">
                        {result.type}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 xl:flex-nowrap">
          <div className="relative">
            <button
              aria-label="Cambiar sucursal"
              className="flex h-14 items-center gap-3 rounded-lg border border-[#E0E4EF] bg-white px-5 font-semibold text-[#111A44] shadow-sm transition hover:border-[#AE19C2]/40 hover:bg-[#FAF1FC]"
              onClick={() => setOpenPanel(openPanel === 'branches' ? null : 'branches')}
              type="button"
            >
              <Store className="text-[#AE19C2]" size={23} />
              <span className="max-w-44 truncate">{selectedBranch}</span>
              <ChevronDown size={18} />
            </button>
            {openPanel === 'branches' && (
              <div className="absolute right-0 top-16 z-30 w-72 rounded-2xl border border-[#E8EAF3] bg-white p-3 shadow-2xl">
                <p className="px-2 pb-2 text-xs font-bold uppercase tracking-wide text-[#667197]">Cambiar sucursal</p>
                {branches.map((branch) => (
                  <button
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-sm font-bold transition ${
                      selectedBranch === branch ? 'bg-[#F6E8FA] text-[#AE19C2]' : 'text-[#111A44] hover:bg-[#FAF1FC]'
                    }`}
                    key={branch}
                    onClick={() => {
                      setSelectedBranch(branch)
                      closePanel()
                    }}
                    type="button"
                  >
                    {branch}
                    {selectedBranch === branch && <span className="h-2 w-2 rounded-full bg-[#AE19C2]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <button
              aria-label="Abrir notificaciones"
              className="relative flex h-14 w-14 items-center justify-center rounded-full border border-[#E0E4EF] bg-white text-[#475174] shadow-sm transition hover:border-[#AE19C2]/40 hover:text-[#AE19C2]"
              onClick={() => setOpenPanel(openPanel === 'notifications' ? null : 'notifications')}
              type="button"
            >
              <Bell size={25} />
              <span className="absolute -right-1 -top-1 flex h-6 min-w-6 items-center justify-center rounded-full bg-[#AE19C2] px-1 text-xs font-bold text-white">
                6
              </span>
            </button>
            {openPanel === 'notifications' && (
              <div className="absolute right-0 top-16 z-30 w-80 rounded-2xl border border-[#E8EAF3] bg-white p-4 shadow-2xl">
                <div className="mb-3 flex items-center justify-between">
                  <p className="font-bold text-[#111A44]">Notificaciones</p>
                  <button className="text-xs font-bold text-[#AE19C2]" onClick={closePanel} type="button">
                    Marcar leidas
                  </button>
                </div>
                <div className="space-y-3">
                  {notifications.map((notification) => (
                    <div className="rounded-xl border border-[#EEF1F7] p-3" key={notification.title}>
                      <div className="flex items-start gap-3">
                        <span
                          className={`mt-1 h-2.5 w-2.5 rounded-full ${
                            notification.tone === 'warning'
                              ? 'bg-amber-400'
                              : notification.tone === 'success'
                                ? 'bg-emerald-400'
                                : 'bg-sky-400'
                          }`}
                        />
                        <div>
                          <p className="text-sm font-bold text-[#111A44]">{notification.title}</p>
                          <p className="mt-1 text-xs leading-5 text-[#667197]">{notification.detail}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              aria-label="Abrir perfil"
              className="flex items-center gap-3 rounded-full p-1 pr-2 transition hover:bg-[#FAF1FC]"
              onClick={() => setOpenPanel(openPanel === 'profile' ? null : 'profile')}
              type="button"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#F6E8FA] to-[#AE19C2] text-lg font-bold text-white ring-4 ring-[#F6E8FA]">
                {currentUser.initials}
              </div>
              <div className="hidden text-left sm:block">
                <p className="font-bold text-[#111A44]">{currentUser.name}</p>
                <p className="text-sm text-[#667197]">{currentUser.role}</p>
              </div>
              <ChevronDown size={18} />
            </button>
            {openPanel === 'profile' && (
              <div className="absolute right-0 top-16 z-30 w-72 rounded-2xl border border-[#E8EAF3] bg-white p-3 shadow-2xl">
                <div className="mb-3 rounded-xl bg-[#FAF1FC] p-3">
                  <p className="font-bold text-[#111A44]">{currentUser.name}</p>
                  <p className="text-sm text-[#667197]">{currentUser.role}</p>
                </div>
                <button className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-[#111A44] transition hover:bg-[#FAF1FC]" type="button">
                  <UserRound size={18} />
                  Mi perfil
                </button>
                <button className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-[#111A44] transition hover:bg-[#FAF1FC]" type="button">
                  <Settings size={18} />
                  Configuracion
                </button>
                <button className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-rose-500 transition hover:bg-rose-50" type="button">
                  <LogOut size={18} />
                  Cerrar sesion
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {openPanel && (
        <button
          aria-label="Cerrar panel"
          className="fixed inset-0 z-20 cursor-default bg-transparent"
          onClick={closePanel}
          type="button"
        />
      )}
    </header>
  )
}
