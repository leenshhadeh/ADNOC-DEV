import { msalInstance } from './msalInstance'
import { loginRequest } from './authConfig'

// ── Role helpers ──────────────────────────────────────────────────────────────
// Reads the `roles` claim from the **ID token** claims exposed by MSAL.
// The access token is treated as opaque — we never decode it on the frontend.

export function getAccountRoles(): string[] {
  const account = msalInstance.getActiveAccount()
  if (!account?.idTokenClaims) return []
  const roles = (account.idTokenClaims as Record<string, unknown>)['roles']
  return Array.isArray(roles) ? (roles as string[]) : []
}

export function hasRole(role: string): boolean {
  return getAccountRoles().includes(role)
}

// ── Scopes helper (re-export for convenience) ────────────────────────────────

export { loginRequest }
