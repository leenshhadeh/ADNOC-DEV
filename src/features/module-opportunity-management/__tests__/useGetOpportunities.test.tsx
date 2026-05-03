import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { vi } from 'vitest'
import type { ReactNode } from 'react'

vi.mock('../api/opportunityService', () => ({
  getOpportunities: vi.fn().mockResolvedValue([
    {
      id: 'opp-001',
      name: 'Test Opportunity',
      code: 'EXP.1.1.1',
      domain: 'Audit & Assurance',
      gcOwner: 'ADNOC HQ',
      applicability: { proposedTo: 4, acceptedBy: 2 },
      status: 'Draft',
      workflowStatus: 'Proposed',
      description: 'Test description',
    },
  ]),
}))

import { useGetOpportunities } from '../hooks/useGetOpportunities'

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('useGetOpportunities', () => {
  it('returns loading state initially', () => {
    const { result } = renderHook(() => useGetOpportunities(), {
      wrapper: createWrapper(),
    })
    expect(result.current.isLoading).toBe(true)
  })

  it('returns data after fetching', async () => {
    const { result } = renderHook(() => useGetOpportunities(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toHaveLength(1)
    expect(result.current.data?.[0].name).toBe('Test Opportunity')
    expect(result.current.data?.[0].code).toBe('EXP.1.1.1')
  })

  it('returns an array of opportunities', async () => {
    const { result } = renderHook(() => useGetOpportunities(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(Array.isArray(result.current.data)).toBe(true)
  })
})
