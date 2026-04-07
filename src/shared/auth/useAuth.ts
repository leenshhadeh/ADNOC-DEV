import { useCallback, useMemo } from 'react'
import { useMsal, useAccount } from '@azure/msal-react'
import { InteractionRequiredAuthError } from '@azure/msal-browser'
import { loginRequest } from './authConfig'
import { msalInstance } from './msalInstance'

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useAuth() {
  const { accounts } = useMsal()
  const account = useAccount(accounts[0] ?? null)

  const login = useCallback(() => msalInstance.loginRedirect(loginRequest), [])

  const logout = useCallback(
    () =>
      msalInstance.logoutRedirect({
        account: account ?? undefined,
        postLogoutRedirectUri: window.location.origin,
      }),
    [account],
  )

  const user = useMemo(
    () => (account ? { name: account.name ?? '', username: account.username } : null),
    [account],
  )

  return { login, logout, getAccessToken, user, isAuthenticated: !!account }
}

// ── Standalone token helper ───────────────────────────────────────────────────
// Can be imported and called outside React components (e.g. Axios interceptors).

export async function getAccessToken(): Promise<string> {
  const account = msalInstance.getActiveAccount()
  if (!account) {
    throw new Error('No active account — user must sign in first.')
  }

  try {
    const response = await msalInstance.acquireTokenSilent({
      ...loginRequest,
      account,
    })
    return response.accessToken
  } catch (error) {
    if (error instanceof InteractionRequiredAuthError) {
      // Silent renewal failed — fall back to redirect.
      await msalInstance.acquireTokenRedirect(loginRequest)
      // acquireTokenRedirect navigates away; code below is unreachable.
      return ''
    }
    throw error
  }
}
