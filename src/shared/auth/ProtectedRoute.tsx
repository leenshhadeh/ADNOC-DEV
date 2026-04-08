import { type ReactNode, useEffect } from 'react'
import { useMsal } from '@azure/msal-react'
import { InteractionStatus } from '@azure/msal-browser'
import { useAuth, MOCK_AUTH } from './useAuth'
import { getAccountRoles } from './roles'
import { useUserStore } from './useUserStore'
import type { Role } from '@/shared/lib/permissions'
import { ROLES } from '@/shared/lib/permissions'

// ── Sync MSAL account into Zustand ────────────────────────────────────────────

function useSyncAuthUser() {
  const { user: msalUser, isAuthenticated } = useAuth()
  const setUser = useUserStore((s) => s.setUser)

  useEffect(() => {
    if (!isAuthenticated || !msalUser) return

    // When mocked, the store already has the correct defaults — skip.
    if (MOCK_AUTH) return

    const claimRoles = getAccountRoles()
    // Pick the first role that matches our known roles; default to BFP.
    const role: Role =
      (claimRoles.find((r) => (ROLES as readonly string[]).includes(r)) as Role | undefined) ??
      'Business Focal Point'

    setUser({ name: msalUser.name, role })
  }, [isAuthenticated, msalUser, setUser])
}

// ── Component ─────────────────────────────────────────────────────────────────

interface ProtectedRouteProps {
  children: ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { inProgress } = useMsal()
  const { isAuthenticated, login } = useAuth()

  useSyncAuthUser()

  // In mock mode, skip all MSAL checks.
  if (MOCK_AUTH) return <>{children}</>

  // MSAL is still handling a redirect — show nothing until it resolves.
  if (inProgress !== InteractionStatus.None) {
    return (
      <div className="flex h-screen items-center justify-center">
        <span className="text-muted-foreground text-sm">Signing in…</span>
      </div>
    )
  }

  if (!isAuthenticated) {
    login()
    return (
      <div className="flex h-screen items-center justify-center">
        <span className="text-muted-foreground text-sm">Redirecting to login…</span>
      </div>
    )
  }

  return <>{children}</>
}
