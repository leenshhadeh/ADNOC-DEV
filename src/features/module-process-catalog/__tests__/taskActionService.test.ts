import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

import {
  approveTask,
  returnTask,
  rejectTask,
  requestEndorsement,
  bulkApproveTasks,
  bulkReturnTasks,
  bulkRejectTasks,
  endorseApprove,
  endorseReject,
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

  // ── Endorsement response actions ────────────────────────────────────────────

  it('endorseApprove resolves with endorsed status and correct taskId', async () => {
    const promise = endorseApprove('task-5')
    vi.runAllTimers()
    const result = await promise
    expect(result.taskId).toBe('task-5')
    expect(result.endorsementStatus).toBe('endorsed')
    expect(result.message).toBeTruthy()
  })

  it('endorseApprove resolves when called with optional comment', async () => {
    const promise = endorseApprove('task-6', { comment: 'Looks good' })
    vi.runAllTimers()
    const result = await promise
    expect(result.taskId).toBe('task-6')
    expect(result.endorsementStatus).toBe('endorsed')
  })

  it('endorseApprove resolves when called with no arguments for comment (default body)', async () => {
    const promise = endorseApprove('task-7', {})
    vi.runAllTimers()
    const result = await promise
    expect(result.endorsementStatus).toBe('endorsed')
  })

  it('endorseReject resolves with endorsement-rejected status and correct taskId', async () => {
    const promise = endorseReject('task-8', { reason: 'Process scope mismatch' })
    vi.runAllTimers()
    const result = await promise
    expect(result.taskId).toBe('task-8')
    expect(result.endorsementStatus).toBe('endorsement-rejected')
    expect(result.message).toBeTruthy()
  })

  it('endorseReject resolves with a non-empty rejection message', async () => {
    const promise = endorseReject('task-9', { reason: 'Domain not aligned' })
    vi.runAllTimers()
    const result = await promise
    expect(result.message.length).toBeGreaterThan(0)
  })
})
