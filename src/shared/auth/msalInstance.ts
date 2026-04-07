import {
  PublicClientApplication,
  EventType,
  type EventMessage,
  type AuthenticationResult,
} from '@azure/msal-browser'
import { msalConfig } from './authConfig'

// ── Singleton MSAL instance ───────────────────────────────────────────────────
// Exported so it can be used outside the React component tree
// (e.g. Axios interceptors).

export const msalInstance = new PublicClientApplication(msalConfig)

// ── Initialisation ────────────────────────────────────────────────────────────
// Must be awaited before rendering the React tree.

export async function initialiseMsal(): Promise<void> {
  await msalInstance.initialize()

  // If returning from a redirect, set the active account automatically.
  const accounts = msalInstance.getAllAccounts()
  if (accounts.length > 0) {
    msalInstance.setActiveAccount(accounts[0])
  }

  // Keep active account in sync after every successful login.
  msalInstance.addEventCallback((event: EventMessage) => {
    if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
      const result = event.payload as AuthenticationResult
      msalInstance.setActiveAccount(result.account)
    }
  })
}
