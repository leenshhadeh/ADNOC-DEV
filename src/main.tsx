import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MsalProvider } from '@azure/msal-react'
import './index.css'
import App from './app/App.tsx'
import { msalInstance, initialiseMsal } from './shared/auth/msalInstance'
import { MOCK_AUTH } from './shared/auth/useAuth'

const bootstrap = MOCK_AUTH ? Promise.resolve() : initialiseMsal()

bootstrap.then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <MsalProvider instance={msalInstance}>
        <App />
      </MsalProvider>
    </StrictMode>,
  )
})
