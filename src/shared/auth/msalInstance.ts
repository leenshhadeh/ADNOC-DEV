import {
  PublicClientApplication,
  EventType,
  type EventMessage,
  type AuthenticationResult,
} from '@azure/msal-browser'
import { buildMsalConfig } from './authConfig'

// ── Singleton MSAL instance ───────────────────────────────────────────────────
// Not created at module load time — assigned in initialiseMsal() after
// loadRuntimeConfig() has resolved so TENANT_ID / CLIENT_ID are available.

export let msalInstance: PublicClientApplication = null!

// ── Initialisation ────────────────────────────────────────────────────────────
// Must be awaited before rendering the React tree.

export async function initialiseMsal(): Promise<void> {
  msalInstance = new PublicClientApplication(buildMsalConfig())
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
