/**
 * Tests for useAuth hook and getAccessToken helper.
 *
 * Strategy
 * ────────
 * All tests run with MOCK_AUTH = true (the current dev default).
 * We mock @azure/msal-react so the hook can be called inside renderHook
 * without a real MsalProvider.
 */

import { renderHook } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

// ── Mocks ─────────────────────────────────────────────────────────────────────

// Mock the MSAL React hooks so we never need an MsalProvider.
vi.mock('@azure/msal-react', () => ({
  useMsal: () => ({ accounts: [], instance: {} }),
  useAccount: () => null,
}))

// Mock msalInstance to prevent real MSAL initialisation.
vi.mock('../msalInstance', () => ({
  msalInstance: {
    loginRedirect: vi.fn(),
    logoutRedirect: vi.fn(),
    getActiveAccount: vi.fn(() => null),
    acquireTokenSilent: vi.fn(),
    acquireTokenRedirect: vi.fn(),
  },
}))

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('useAuth (mock mode)', () => {
  let useAuth: typeof import('../useAuth').useAuth
  let getAccessToken: typeof import('../useAuth').getAccessToken
  let MOCK_AUTH: boolean

  beforeEach(async () => {
    const mod = await import('../useAuth')
    useAuth = mod.useAuth
    getAccessToken = mod.getAccessToken
    MOCK_AUTH = mod.MOCK_AUTH
  })

  it('MOCK_AUTH flag is true in test env', () => {
    expect(MOCK_AUTH).toBe(true)
  })

  it('returns isAuthenticated true', () => {
    const { result } = renderHook(() => useAuth())
    expect(result.current.isAuthenticated).toBe(true)
  })

  it('returns mock user with name and username', () => {
    const { result } = renderHook(() => useAuth())
    expect(result.current.user).toEqual({
      name: 'Jane Doe',
      username: 'jane.doe@adnoc.ae',
    })
  })

  it('login is a no-op (does not throw)', () => {
    const { result } = renderHook(() => useAuth())
    expect(() => result.current.login()).not.toThrow()
  })

  it('logout is a no-op (does not throw)', () => {
    const { result } = renderHook(() => useAuth())
    expect(() => result.current.logout()).not.toThrow()
  })
})

describe('getAccessToken (mock mode)', () => {
  let getAccessToken: typeof import('../useAuth').getAccessToken

  beforeEach(async () => {
    const mod = await import('../useAuth')
    getAccessToken = mod.getAccessToken
  })

  it('returns a mock token string', async () => {
    const token = await getAccessToken()
    expect(token).toBe('mock-access-token')
  })
})
