import { type ReactNode } from 'react'
import { useMsal } from '@azure/msal-react'
import { InteractionStatus } from '@azure/msal-browser'
import { useAuth } from './useAuth'

interface ProtectedRouteProps {
  children: ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { inProgress } = useMsal()
  const { isAuthenticated, login } = useAuth()

  //   // MSAL is still handling a redirect — show nothing until it resolves.
  //   if (inProgress !== InteractionStatus.None) {
  //     return (
  //       <div className="flex h-screen items-center justify-center">
  //         <span className="text-muted-foreground text-sm">Signing in…</span>
  //       </div>
  //     )
  //   }

  //   if (!isAuthenticated) {
  //     // Trigger redirect login automatically — no intermediate UI needed.
  //     login()
  //     return (
  //       <div className="flex h-screen items-center justify-center">
  //         <span className="text-muted-foreground text-sm">Redirecting to login…</span>
  //       </div>
  //     )
  //   }

  return <>{children}</>
}
