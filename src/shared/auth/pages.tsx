import { useAuth } from '@/shared/auth/useAuth'
import { getAccountRoles } from '@/shared/auth/roles'

export function LoginPage() {
  const { login } = useAuth()

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-6 bg-[#F8F9FA]">
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-2xl font-semibold text-[#151718]">Welcome to ADNOC BPA</h1>
        <p className="text-sm text-[#687076]">Sign in with your Microsoft account to continue.</p>
      </div>
      <button
        type="button"
        onClick={() => login()}
        className="rounded-full bg-gradient-to-r from-[#5B23FF] to-[#3C00EB] px-8 py-3 text-sm font-medium text-white shadow transition-opacity hover:opacity-90"
      >
        Sign in with Microsoft
      </button>
    </div>
  )
}

export function HomePage() {
  const { user, logout } = useAuth()
  const roles = getAccountRoles()

  return (
    <div className="mx-auto max-w-lg space-y-6 py-12 text-start">
      <h1 className="text-2xl font-semibold text-[#151718]">Welcome, {user?.name ?? 'User'}</h1>

      <div className="rounded-2xl border border-[#DFE3E6] bg-white p-6 shadow-sm">
        <dl className="space-y-3 text-sm">
          <div className="flex gap-2">
            <dt className="font-medium text-[#687076]">Email:</dt>
            <dd className="text-[#151718]">{user?.username ?? '—'}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="font-medium text-[#687076]">Roles:</dt>
            <dd className="text-[#151718]">
              {roles.length > 0 ? roles.join(', ') : 'No roles assigned'}
            </dd>
          </div>
        </dl>
      </div>

      <button
        type="button"
        onClick={() => logout()}
        className="rounded-full border border-[#DFE3E6] bg-white px-6 py-2.5 text-sm font-medium text-[#151718] shadow-sm transition-colors hover:bg-accent"
      >
        Sign out
      </button>
    </div>
  )
}
