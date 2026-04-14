import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'

import * as api from '../api/processAssesmentService'
import {
  useApproveTask,
  useReturnTask,
  useRejectTask,
  useRequestEndorsement,
  useSaveTaskFieldComments,
  useBulkApproveTasks,
  useBulkReturnTasks,
  useBulkRejectTasks,
  useBulkRequestEndorsement,
} from '../hooks/useTaskActions'

vi.mock('../api/processAssesmentService', () => ({
  approveTask: vi.fn().mockResolvedValue({ success: true }),
  returnTask: vi.fn().mockResolvedValue({ success: true }),
  rejectTask: vi.fn().mockResolvedValue({ success: true }),
  requestEndorsement: vi.fn().mockResolvedValue({ success: true }),
  saveTaskFieldComments: vi.fn().mockResolvedValue({ success: true }),
  bulkApproveTasks: vi.fn().mockResolvedValue({ approvedIds: ['t1'] }),
  bulkReturnTasks: vi.fn().mockResolvedValue({ returnedIds: ['t1'] }),
  bulkRejectTasks: vi.fn().mockResolvedValue({ rejectedIds: ['t1'] }),
  bulkRequestEndorsement: vi.fn().mockResolvedValue({ requestedIds: ['t1'] }),
}))

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('useTaskActions hooks', () => {
  beforeEach(() => vi.clearAllMocks())

  it('useApproveTask calls approveTask API', async () => {
    const { result } = renderHook(() => useApproveTask(), { wrapper: createWrapper() })
    result.current.mutate({ taskId: 't1', comment: 'ok' })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(api.approveTask).toHaveBeenCalledWith('t1', 'ok')
  })

  it('useReturnTask calls returnTask API', async () => {
    const { result } = renderHook(() => useReturnTask(), { wrapper: createWrapper() })
    result.current.mutate({ taskId: 't2', reason: 'needs fix', comment: 'check' })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(api.returnTask).toHaveBeenCalledWith('t2', 'needs fix', 'check')
  })

  it('useRejectTask calls rejectTask API', async () => {
    const { result } = renderHook(() => useRejectTask(), { wrapper: createWrapper() })
    result.current.mutate({ taskId: 't3', reason: 'invalid' })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(api.rejectTask).toHaveBeenCalledWith('t3', 'invalid', undefined)
  })

  it('useRequestEndorsement calls requestEndorsement API', async () => {
    const { result } = renderHook(() => useRequestEndorsement(), { wrapper: createWrapper() })
    result.current.mutate({ taskId: 't4', endorserNames: ['Alice'], reason: 'need review' })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(api.requestEndorsement).toHaveBeenCalledWith('t4', ['Alice'], 'need review')
  })

  it('useSaveTaskFieldComments calls saveTaskFieldComments API', async () => {
    const { result } = renderHook(() => useSaveTaskFieldComments(), { wrapper: createWrapper() })
    result.current.mutate({ taskId: 't5' })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(api.saveTaskFieldComments).toHaveBeenCalledWith('t5')
  })

  it('useBulkApproveTasks calls bulkApproveTasks API', async () => {
    const { result } = renderHook(() => useBulkApproveTasks(), { wrapper: createWrapper() })
    result.current.mutate({ taskIds: ['t1', 't2'] })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(api.bulkApproveTasks).toHaveBeenCalledWith(['t1', 't2'])
  })

  it('useBulkReturnTasks calls bulkReturnTasks API', async () => {
    const { result } = renderHook(() => useBulkReturnTasks(), { wrapper: createWrapper() })
    result.current.mutate({ taskIds: ['t1'], reason: 'fix it' })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(api.bulkReturnTasks).toHaveBeenCalledWith(['t1'], 'fix it')
  })

  it('useBulkRejectTasks calls bulkRejectTasks API', async () => {
    const { result } = renderHook(() => useBulkRejectTasks(), { wrapper: createWrapper() })
    result.current.mutate({ taskIds: ['t1'], reason: 'out of scope' })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(api.bulkRejectTasks).toHaveBeenCalledWith(['t1'], 'out of scope')
  })

  it('useBulkRequestEndorsement calls bulkRequestEndorsement API', async () => {
    const { result } = renderHook(() => useBulkRequestEndorsement(), { wrapper: createWrapper() })
    result.current.mutate({ taskIds: ['t1'], endorserNames: ['Bob'], reason: 'pls' })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(api.bulkRequestEndorsement).toHaveBeenCalledWith(['t1'], ['Bob'], 'pls')
  })
})
