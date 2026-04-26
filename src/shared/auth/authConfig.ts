import { LogLevel, type Configuration } from '@azure/msal-browser'

// ── Azure AD configuration from environment variables ──────────────────────────────

export const TENANT_ID = import.meta.env.VITE_TENANT_ID ?? ''
export const CLIENT_ID = import.meta.env.VITE_CLIENT_ID ?? ''
export const BACKEND_CLIENT_ID = import.meta.env.VITE_BACKEND_CLIENT_ID ?? ''

// ── Authority & redirect ──────────────────────────────────────────────────────

const AUTHORITY = `https://login.microsoftonline.com/${TENANT_ID}`
const REDIRECT_URI = window.location.origin

// ── MSAL configuration (Authorization Code + PKCE) ───────────────────────────

export const msalConfig: Configuration = {
  auth: {
    clientId: CLIENT_ID,
    authority: AUTHORITY,
    redirectUri: REDIRECT_URI,
    postLogoutRedirectUri: REDIRECT_URI,
    navigateToLoginRequestUrl: true,
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
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

// ── Scopes requested during login & token acquisition ─────────────────────────

export const loginRequest = {
  scopes: [`api://${BACKEND_CLIENT_ID}/access_as_user`],
}
