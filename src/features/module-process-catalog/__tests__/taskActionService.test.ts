import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

import {
  approveTask,
  returnTask,
  rejectTask,
  requestEndorsement,
  bulkApproveTasks,
  bulkReturnTasks,
  bulkRejectTasks,
} from '../api/taskActionService'

describe('taskActionService', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  // ── Single-row actions ──────────────────────────────────────────────────────

  it('approveTask resolves with approved status and message', async () => {
    const promise = approveTask('task-1')
    vi.runAllTimers()
    const result = await promise
    expect(result.taskId).toBe('task-1')
    expect(result.status).toBe('approved')
    expect(result.message).toBeTruthy()
  })

  it('returnTask resolves with returned status and includes reason in message', async () => {
    const promise = returnTask('task-2', { reason: 'needs revision' })
    vi.runAllTimers()
    const result = await promise
    expect(result.taskId).toBe('task-2')
    expect(result.status).toBe('returned')
    expect(result.message).toContain('needs revision')
  })

  it('rejectTask resolves with rejected status and includes reason in message', async () => {
    const promise = rejectTask('task-3', { reason: 'out of scope' })
    vi.runAllTimers()
    const result = await promise
    expect(result.taskId).toBe('task-3')
    expect(result.status).toBe('rejected')
    expect(result.message).toContain('out of scope')
  })

  it('requestEndorsement resolves with approved status and endorsement message', async () => {
    const promise = requestEndorsement('task-4', ['Ahmed Al Mansoori'], 'needs VP sign-off')
    vi.runAllTimers()
    const result = await promise
    expect(result.taskId).toBe('task-4')
    expect(result.status).toBe('approved')
    expect(result.message).toBeTruthy()
  })

  // ── Bulk actions ────────────────────────────────────────────────────────────

  it('bulkApproveTasks resolves with processed count matching taskIds length', async () => {
    const promise = bulkApproveTasks({ taskIds: ['t1', 't2', 't3'] })
    vi.runAllTimers()
    const result = await promise
    expect(result.processed).toBe(3)
    expect(result.failed).toBe(0)
  })

  it('bulkReturnTasks resolves with processed count matching taskIds length', async () => {
    const promise = bulkReturnTasks({ taskIds: ['t1', 't2'], reason: 'fix required' })
    vi.runAllTimers()
    const result = await promise
    expect(result.processed).toBe(2)
    expect(result.failed).toBe(0)
  })

  it('bulkRejectTasks resolves with processed count matching taskIds length', async () => {
    const promise = bulkRejectTasks({ taskIds: ['t1'], reason: 'invalid' })
    vi.runAllTimers()
    const result = await promise
    expect(result.processed).toBe(1)
    expect(result.failed).toBe(0)
  })

  it('bulkRejectTasks works without optional reason', async () => {
    const promise = bulkRejectTasks({ taskIds: ['t1', 't2'] })
    vi.runAllTimers()
    const result = await promise
    expect(result.processed).toBe(2)
    expect(result.failed).toBe(0)
  })
})
