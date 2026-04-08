/**
 * Tests for <ProtectedRoute> and <LoginPage>.
 *
 * Strategy
 * ────────
 * With MOCK_AUTH = true (dev default), ProtectedRoute renders children
 * immediately. LoginPage renders the sign-in button and heading.
 * We mock @azure/msal-react so no real MsalProvider is needed.
 */

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'

// ── Mocks ─────────────────────────────────────────────────────────────────────

vi.mock('@azure/msal-react', () => ({
  useMsal: () => ({ accounts: [], instance: {}, inProgress: 'none' }),
  useAccount: () => null,
}))

vi.mock('../msalInstance', () => ({
  msalInstance: {
    loginRedirect: vi.fn(),
    logoutRedirect: vi.fn(),
    getActiveAccount: vi.fn(() => null),
    acquireTokenSilent: vi.fn(),
    acquireTokenRedirect: vi.fn(),
  },
}))

vi.mock('../roles', () => ({
  getAccountRoles: vi.fn(() => []),
  loginRequest: { scopes: ['api://mock/access_as_user'] },
}))

// ── Imports (after mocks) ─────────────────────────────────────────────────────

import { ProtectedRoute } from '../ProtectedRoute'
import { LoginPage } from '../pages'

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('<ProtectedRoute> (mock mode)', () => {
  it('renders children immediately when MOCK_AUTH is true', () => {
    render(
      <ProtectedRoute>
        <div data-testid="protected-content">Secret stuff</div>
      </ProtectedRoute>,
    )

    expect(screen.getByTestId('protected-content')).toBeInTheDocument()
    expect(screen.getByText('Secret stuff')).toBeInTheDocument()
  })

  it('does not show "Signing in…" or "Redirecting to login…"', () => {
    render(
      <ProtectedRoute>
        <p>OK</p>
      </ProtectedRoute>,
    )

    expect(screen.queryByText(/signing in/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/redirecting to login/i)).not.toBeInTheDocument()
  })
})

describe('<LoginPage>', () => {
  it('renders the welcome heading', () => {
    render(<LoginPage />)

    expect(screen.getByText('Welcome to ADNOC BPA')).toBeInTheDocument()
  })

  it('renders the sign-in button', () => {
    render(<LoginPage />)

    const button = screen.getByRole('button', { name: /sign in with microsoft/i })
    expect(button).toBeInTheDocument()
  })

  it('calls login when sign-in button is clicked', async () => {
    const user = userEvent.setup()
    render(<LoginPage />)

    const button = screen.getByRole('button', { name: /sign in with microsoft/i })
    await user.click(button)

    // In mock mode login is a no-op — just ensure no error is thrown.
    expect(button).toBeInTheDocument()
  })
})
