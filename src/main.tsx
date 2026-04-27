import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MsalProvider } from '@azure/msal-react'
import './index.css'
import App from './app/App.tsx'
import * as msalModule from './shared/auth/msalInstance'
import { MOCK_AUTH } from './shared/auth/useAuth'
import { loadRuntimeConfig, getRuntimeConfig } from './shared/lib/runtimeConfig'
import { apiClient } from './shared/api/client'

// Load runtime config first, then set dependent values before mounting React.
const bootstrap = loadRuntimeConfig().then(() => {
  apiClient.defaults.baseURL = getRuntimeConfig().API_BASE_URL
  return MOCK_AUTH ? Promise.resolve() : msalModule.initialiseMsal()
})

bootstrap
  .then(() => {
    const app = MOCK_AUTH ? (
      <StrictMode>
        <App />
      </StrictMode>
    ) : (
      <StrictMode>
        <MsalProvider instance={msalModule.msalInstance}>
          <App />
        </MsalProvider>
      </StrictMode>
    )
    createRoot(document.getElementById('root')!).render(app)
  })
  .catch((err: unknown) => {
    const message = err instanceof Error ? err.message : String(err)
    document.getElementById('root')!.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;flex-direction:column;gap:12px;">
        <strong style="color:#B12A4C;font-size:18px;">App failed to start</strong>
        <pre style="color:#687076;font-size:13px;max-width:600px;white-space:pre-wrap;">${message}</pre>
      </div>`
  })
