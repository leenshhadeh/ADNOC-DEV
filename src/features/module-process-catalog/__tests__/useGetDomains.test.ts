import { describe, it, expect, vi, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement } from 'react'

import { useGetDomains, domainsQueryKeys } from '../hooks/useGetDomains'
import * as service from '../api/processCatalogService'

// ── Mock service to return immediately (no setTimeout) ────────────────────────

vi.mock('../api/processCatalogService', async (importOriginal) => {
  const original = await importOriginal<typeof service>()
  return {
    ...original,
    getDomains: vi.fn().mockResolvedValue([
      { id: 'd1', name: 'Exploration', code: 'EXP' },
      { id: 'd2', name: 'Drilling', code: 'DRL' },
    ]),
  }
})

// ── Test wrapper ──────────────────────────────────────────────────────────────

function makeWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children)
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('useGetDomains', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('returns domain data after the query resolves', async () => {
    const { result } = renderHook(() => useGetDomains(), { wrapper: makeWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(Array.isArray(result.current.data)).toBe(true)
    expect(result.current.data!.length).toBe(2)
  })

  it('each returned domain has id, name, and code fields', async () => {
    const { result } = renderHook(() => useGetDomains(), { wrapper: makeWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    for (const domain of result.current.data!) {
      expect(domain.id).toBeTruthy()
      expect(domain.name).toBeTruthy()
      expect(domain.code).toBeTruthy()
    }
  })

  it('calls getDomains service exactly once per mount', async () => {
    const { result } = renderHook(() => useGetDomains(), { wrapper: makeWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(service.getDomains).toHaveBeenCalledTimes(1)
  })

  it('uses the correct query key', () => {
    expect(domainsQueryKeys.all()).toEqual(['domains'])
  })

  it('is in pending state before the query settles', () => {
    const { result } = renderHook(() => useGetDomains(), { wrapper: makeWrapper() })
    // Before the promise resolves the hook should be in a loading/pending state
    expect(result.current.data).toBeUndefined()
  })
})
