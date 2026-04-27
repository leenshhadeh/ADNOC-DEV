import { LogLevel, type Configuration } from '@azure/msal-browser'
import { getRuntimeConfig } from '@/shared/lib/runtimeConfig'

// ── MSAL configuration — built from runtime config (ConfigMap) ────────────────
// Called after loadRuntimeConfig() resolves, not at module load time.

const REDIRECT_URI = window.location.origin

export function buildMsalConfig(): Configuration {
  const { TENANT_ID, CLIENT_ID } = getRuntimeConfig()

  if (!CLIENT_ID || !TENANT_ID) {
    throw new Error(
      'Missing Azure AD credentials. Set CLIENT_ID and TENANT_ID in public/config.json (or VITE_CLIENT_ID / VITE_TENANT_ID in .env.local for local dev).',
    )
  }

  return {
    auth: {
      clientId: CLIENT_ID,
      authority: `https://login.microsoftonline.com/${TENANT_ID}`,
      redirectUri: REDIRECT_URI,
      postLogoutRedirectUri: REDIRECT_URI,
    },
    cache: {
      cacheLocation: 'sessionStorage',
    },
    system: {
      loggerOptions: {
        logLevel: LogLevel.Warning,
        loggerCallback: (_level, message, containsPii) => {
          if (!containsPii) console.warn('[MSAL]', message)
        },
      },
    },
  }
}

// ── Scopes requested during login & token acquisition ─────────────────────────
// Returns a new object each call — safe to spread alongside `account`.

export function getLoginRequest() {
  const { BACKEND_CLIENT_ID } = getRuntimeConfig()
  return { scopes: [`api://${BACKEND_CLIENT_ID}/access_as_user`] }
}
