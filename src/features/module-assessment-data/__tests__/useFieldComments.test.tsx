import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'

import * as api from '../api/processAssesmentService'
import { useFieldComments, useAddFieldComment } from '../hooks/useFieldComments'

vi.mock('../api/processAssesmentService', () => ({
  getFieldComments: vi
    .fn()
    .mockResolvedValue([
      { id: 'cmt-1', author: 'Alice', role: 'QM', text: 'Hello', timestamp: '01 Jan' },
    ]),
  addFieldComment: vi.fn().mockResolvedValue({ id: 'cmt-new', success: true }),
}))

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('useFieldComments', () => {
  beforeEach(() => vi.clearAllMocks())

  it('fetches comments with correct params', async () => {
    const { result } = renderHook(() => useFieldComments('task-1', 'c1-0'), {
      wrapper: createWrapper(),
    })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(api.getFieldComments).toHaveBeenCalledWith({ taskId: 'task-1', changeId: 'c1-0' })
    expect(result.current.data).toHaveLength(1)
  })

  it('does not fetch when taskId is undefined', () => {
    const { result } = renderHook(() => useFieldComments(undefined, 'c1-0'), {
      wrapper: createWrapper(),
    })
    expect(result.current.fetchStatus).toBe('idle')
    expect(api.getFieldComments).not.toHaveBeenCalled()
  })

  it('does not fetch when changeId is undefined', () => {
    const { result } = renderHook(() => useFieldComments('task-1', undefined), {
      wrapper: createWrapper(),
    })
    expect(result.current.fetchStatus).toBe('idle')
    expect(api.getFieldComments).not.toHaveBeenCalled()
  })
})

describe('useAddFieldComment', () => {
  beforeEach(() => vi.clearAllMocks())

  it('calls addFieldComment API and invalidates cache on success', async () => {
    const { result } = renderHook(() => useAddFieldComment(), { wrapper: createWrapper() })
    result.current.mutate({ taskId: 'task-1', changeId: 'c1-0', text: 'Nice' })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(api.addFieldComment).toHaveBeenCalledWith(
      expect.objectContaining({ taskId: 'task-1', changeId: 'c1-0', text: 'Nice' }),
      expect.anything(),
    )
  })
})
