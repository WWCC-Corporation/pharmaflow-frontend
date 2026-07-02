import { useState, type FormEvent } from 'react'
import { LockKeyhole, Mail, ShieldCheck, UserPlus } from 'lucide-react'
import pharmaflowLogo from '../../../assets/pharmaflow-logo.png'

type LoginPageProps = {
  error?: string | null
  isLoading: boolean
  onLogin: (correo: string, password: string) => Promise<unknown>
}

export function LoginPage({ error, isLoading, onLogin }: LoginPageProps) {
  const [correo, setCorreo] = useState('admin.seed@pharmaflow.test')
  const [password, setPassword] = useState('seed-password-hash')
  const [localError, setLocalError] = useState<string | null>(null)

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLocalError(null)

    if (!correo.trim() || !password.trim()) {
      setLocalError('Ingresa correo y contrasena.')
      return
    }

    await onLogin(correo.trim(), password)
  }

  return (
    <main className="min-h-screen bg-[#FAFBFF] text-[#111A44]">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative hidden overflow-hidden bg-[#AE19C2] p-12 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -right-24 top-16 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-10 left-20 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
          <div className="relative z-10 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/16 p-2 shadow-xl">
              <img alt="PharmaFlow" className="h-full w-full object-contain" src={pharmaflowLogo} />
            </div>
            <p className="text-4xl font-black tracking-tight">PharmaFlow</p>
          </div>

          <div className="relative z-10 max-w-xl">
            <p className="mb-4 inline-flex rounded-full bg-white/16 px-4 py-2 text-sm font-bold">Acceso seguro por rol</p>
            <h1 className="text-5xl font-black leading-tight">Gestiona tu farmacia desde un solo panel.</h1>
            <p className="mt-5 text-lg leading-8 text-white/82">
              Super Admin administra sucursales y usuarios. Administradores y operadores ingresan con la cuenta asignada.
            </p>
          </div>

          <div className="relative z-10 grid gap-4 md:grid-cols-3">
            {['Ventas', 'Inventario', 'Sucursales'].map((item) => (
              <div className="rounded-2xl bg-white/12 p-4 backdrop-blur" key={item}>
                <p className="text-sm font-bold text-white/70">Modulo</p>
                <p className="mt-1 text-lg font-black">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="flex items-center justify-center px-5 py-10">
          <div className="w-full max-w-md">
            <div className="mb-8 text-center lg:hidden">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#AE19C2]/10 p-2">
                <img alt="PharmaFlow" className="h-full w-full object-contain" src={pharmaflowLogo} />
              </div>
              <p className="text-3xl font-black">PharmaFlow</p>
            </div>

            <div className="rounded-3xl border border-[#E8EAF3] bg-white p-7 shadow-[0_20px_60px_rgba(17,26,68,0.10)]">
              <div className="mb-6">
                <p className="inline-flex rounded-full bg-[#F6E8FA] px-3 py-1 text-xs font-black text-[#AE19C2]">Iniciar sesion</p>
                <h2 className="mt-4 text-3xl font-black tracking-tight text-[#111A44]">Bienvenido de nuevo</h2>
                <p className="mt-2 text-sm leading-6 text-[#667197]">Ingresa con la cuenta creada por el Super Admin.</p>
              </div>

              <form className="space-y-4" onSubmit={submit}>
                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-[#283256]">Correo</span>
                  <span className="flex h-13 items-center gap-3 rounded-xl border border-[#E0E4EF] px-4 transition focus-within:border-[#AE19C2] focus-within:ring-4 focus-within:ring-[#AE19C2]/10">
                    <Mail className="text-[#667197]" size={19} />
                    <input
                      className="h-full w-full bg-transparent text-sm outline-none"
                      onChange={(event) => setCorreo(event.target.value)}
                      placeholder="correo@farmacia.com"
                      type="email"
                      value={correo}
                    />
                  </span>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-[#283256]">Contrasena</span>
                  <span className="flex h-13 items-center gap-3 rounded-xl border border-[#E0E4EF] px-4 transition focus-within:border-[#AE19C2] focus-within:ring-4 focus-within:ring-[#AE19C2]/10">
                    <LockKeyhole className="text-[#667197]" size={19} />
                    <input
                      className="h-full w-full bg-transparent text-sm outline-none"
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="********"
                      type="password"
                      value={password}
                    />
                  </span>
                </label>

                {(localError || error) && (
                  <div className="rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600">
                    {localError ?? error}
                  </div>
                )}

                <button
                  className="flex h-13 w-full items-center justify-center rounded-xl bg-[#AE19C2] text-sm font-black text-white shadow-[0_14px_28px_rgba(174,25,194,0.24)] transition hover:bg-[#9714A8]"
                  disabled={isLoading}
                  type="submit"
                >
                  {isLoading ? 'Validando acceso...' : 'Ingresar'}
                </button>
              </form>

              <div className="mt-6 rounded-2xl border border-[#EEF1F7] bg-[#FBFCFF] p-4">
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F6E8FA] text-[#AE19C2]">
                    <UserPlus size={20} />
                  </span>
                  <div>
                    <p className="text-sm font-black text-[#111A44]">No hay registro publico</p>
                    <p className="mt-1 text-xs leading-5 text-[#667197]">Las cuentas se crean desde Usuarios para asignar rol y sucursal correctamente.</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-[#667197]">
                <ShieldCheck className="text-emerald-500" size={17} />
                Sesion protegida por token y permisos por rol.
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
