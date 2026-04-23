import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

import { updateLevel4 } from '../api/level4Service'

describe('level4Service — updateLevel4', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('resolves with the updated Level4Item for a known id', async () => {
    const promise = updateLevel4('l4-001', {
      processName: 'Updated framework',
      processDescription: 'New description',
    })
    vi.runAllTimers()
    const result = await promise
    expect(result.id).toBe('l4-001')
    expect(result.name).toBe('Updated framework')
    expect(result.description).toBe('New description')
  })

  it('uses the original description when processDescription is omitted', async () => {
    const promise = updateLevel4('l4-001', { processName: 'Renamed' })
    vi.runAllTimers()
    const result = await promise
    expect(result.name).toBe('Renamed')
    expect(typeof result.description).toBe('string')
  })

  it('applies a provided status override', async () => {
    const promise = updateLevel4('l4-001', {
      processName: 'Draft name',
      status: 'Draft',
    })
    vi.runAllTimers()
    const result = await promise
    expect(result.status).toBe('Draft')
  })

  it('keeps the original status when status is omitted', async () => {
    const promise = updateLevel4('l4-001', { processName: 'Keep status' })
    vi.runAllTimers()
    const result = await promise
    // l4-001 is seeded as Published in mock data
    expect(result.status).toBe('Published')
  })

  it('preserves the processCode and parentId from the existing record', async () => {
    const promise = updateLevel4('l4-001', { processName: 'Any name' })
    vi.runAllTimers()
    const result = await promise
    expect(result.processCode).toBe('EXP.1.1.1.1')
    expect(result.parentId).toBe('r1')
  })

  it('rejects with an error for an unknown id', async () => {
    const promise = updateLevel4('nonexistent-id', { processName: 'Fail' })
    vi.runAllTimers()
    await expect(promise).rejects.toThrow('Level 4 record not found: nonexistent-id')
  })
})
