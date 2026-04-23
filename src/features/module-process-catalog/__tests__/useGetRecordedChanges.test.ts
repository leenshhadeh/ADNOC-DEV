import { describe, it, expect, vi, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement } from 'react'

import {
  useGetRecordedChanges,
  recordedChangesQueryKeys,
} from '../hooks/useGetRecordedChanges'
import * as service from '../api/processCatalogService'
import type { ChangeLogEntry } from '../types'

// ── Mock service to return immediately (no setTimeout) ────────────────────────

const MOCK_ENTRIES: ChangeLogEntry[] = [
  {
    id: 'cl-1',
    processName: 'Basin Modeling',
    levelLabel: 'L3',
    levelNum: 3,
    changeType: 'Modified',
    changedItem: 'Description',
    groupCompany: 'ADNOC',
    oldValue: 'Old desc',
    newValue: 'New desc',
    modifiedBy: 'user@adnoc.ae',
    modifiedOn: '2024-01-15T10:00:00Z',
    section: 'this',
  },
  {
    id: 'cl-2',
    processName: 'Regional Mapping',
    levelLabel: 'L2',
    levelNum: 2,
    changeType: 'Added',
    changedItem: 'Entity',
    groupCompany: 'ADNOC Onshore',
    oldValue: '',
    newValue: 'Activated',
    modifiedBy: 'admin@adnoc.ae',
    modifiedOn: '2024-01-14T08:00:00Z',
    section: 'parent',
  },
  {
    id: 'cl-3',
    processName: 'Core Analysis',
    levelLabel: 'L4',
    levelNum: 4,
    changeType: 'Added',
    changedItem: 'Process Name',
    groupCompany: 'ADNOC Offshore',
    oldValue: '',
    newValue: 'Core Analysis',
    modifiedBy: 'engineer@adnoc.ae',
    modifiedOn: '2024-01-13T09:00:00Z',
    section: 'child',
  },
]

vi.mock('../api/processCatalogService', async (importOriginal) => {
  const original = await importOriginal<typeof service>()
  return {
    ...original,
    getRecordedChanges: vi.fn((id: string) =>
      Promise.resolve(id === 'r1' ? MOCK_ENTRIES : []),
    ),
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

describe('useGetRecordedChanges', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('returns change log entries for a known processId', async () => {
    const { result } = renderHook(() => useGetRecordedChanges('r1'), {
      wrapper: makeWrapper(),
    })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(Array.isArray(result.current.data)).toBe(true)
    expect(result.current.data!.length).toBe(3)
  })

  it('returns an empty array for an unknown processId', async () => {
    const { result } = renderHook(() => useGetRecordedChanges('unknown-id'), {
      wrapper: makeWrapper(),
    })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toEqual([])
  })

  it('does not fire the query when processId is undefined', () => {
    const { result } = renderHook(() => useGetRecordedChanges(undefined), {
      wrapper: makeWrapper(),
    })
    // Query should be disabled — fetchStatus is 'idle', data is undefined
    expect(result.current.fetchStatus).toBe('idle')
    expect(service.getRecordedChanges).not.toHaveBeenCalled()
  })

  it('does not fire the query when processId is an empty string', () => {
    const { result } = renderHook(() => useGetRecordedChanges(''), {
      wrapper: makeWrapper(),
    })
    expect(result.current.fetchStatus).toBe('idle')
    expect(service.getRecordedChanges).not.toHaveBeenCalled()
  })

  it('each entry has all required ChangeLogEntry fields', async () => {
    const { result } = renderHook(() => useGetRecordedChanges('r1'), {
      wrapper: makeWrapper(),
    })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    const requiredKeys: (keyof ChangeLogEntry)[] = [
      'id',
      'processName',
      'levelLabel',
      'levelNum',
      'changeType',
      'changedItem',
      'groupCompany',
      'oldValue',
      'newValue',
      'modifiedBy',
      'modifiedOn',
      'section',
    ]
    for (const entry of result.current.data!) {
      for (const key of requiredKeys) {
        expect(entry).toHaveProperty(key)
      }
    }
  })

  it('calls getRecordedChanges with the provided processId', async () => {
    const { result } = renderHook(() => useGetRecordedChanges('r1'), {
      wrapper: makeWrapper(),
    })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(service.getRecordedChanges).toHaveBeenCalledWith('r1')
  })

  it('uses a query key scoped to the processId', () => {
    expect(recordedChangesQueryKeys.byProcess('r1')).toEqual(['recordedChanges', 'r1'])
    expect(recordedChangesQueryKeys.byProcess('r2')).toEqual(['recordedChanges', 'r2'])
    expect(recordedChangesQueryKeys.byProcess('r1')).not.toEqual(
      recordedChangesQueryKeys.byProcess('r2'),
    )
  })
})

