import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

import {
  getDomains,
  getRecordedChanges,
  createProcess,
  renameProcess,
  updateEntities,
  validateProcess,
} from '../api/processCatalogService'

describe('processCatalogService — new functions', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  // ── getDomains ──────────────────────────────────────────────────────────────

  describe('getDomains', () => {
    it('resolves with a non-empty array of domains', async () => {
      const promise = getDomains()
      vi.runAllTimers()
      const result = await promise
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBeGreaterThan(0)
    })

    it('each domain has id, name, and code fields', async () => {
      const promise = getDomains()
      vi.runAllTimers()
      const result = await promise
      for (const domain of result) {
        expect(typeof domain.id).toBe('string')
        expect(typeof domain.name).toBe('string')
        expect(typeof domain.code).toBe('string')
        expect(domain.id).toBeTruthy()
        expect(domain.name).toBeTruthy()
        expect(domain.code).toBeTruthy()
      }
    })
  })

  // ── getRecordedChanges ──────────────────────────────────────────────────────

  describe('getRecordedChanges', () => {
    it('resolves with entries for a known processId', async () => {
      const promise = getRecordedChanges('r1')
      vi.runAllTimers()
      const result = await promise
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBeGreaterThan(0)
    })

    it('resolves with an empty array for an unknown processId', async () => {
      const promise = getRecordedChanges('does-not-exist')
      vi.runAllTimers()
      const result = await promise
      expect(result).toEqual([])
    })

    it('entries include required fields', async () => {
      const promise = getRecordedChanges('r1')
      vi.runAllTimers()
      const result = await promise
      const entry = result[0]
      expect(entry).toHaveProperty('id')
      expect(entry).toHaveProperty('processName')
      expect(entry).toHaveProperty('levelLabel')
      expect(entry).toHaveProperty('levelNum')
      expect(entry).toHaveProperty('changeType')
      expect(entry).toHaveProperty('changedItem')
      expect(entry).toHaveProperty('groupCompany')
      expect(entry).toHaveProperty('oldValue')
      expect(entry).toHaveProperty('newValue')
      expect(entry).toHaveProperty('modifiedBy')
      expect(entry).toHaveProperty('modifiedOn')
      expect(entry).toHaveProperty('section')
    })

    it('entries have valid section values', async () => {
      const promise = getRecordedChanges('r1')
      vi.runAllTimers()
      const result = await promise
      const validSections = new Set(['parent', 'this', 'child'])
      for (const entry of result) {
        expect(validSections.has(entry.section)).toBe(true)
      }
    })

    it('entries have valid changeType values', async () => {
      const promise = getRecordedChanges('r1')
      vi.runAllTimers()
      const result = await promise
      const validTypes = new Set(['Update', 'Create'])
      for (const entry of result) {
        expect(validTypes.has(entry.changeType)).toBe(true)
      }
    })

    it('returns entries in all three sections', async () => {
      const promise = getRecordedChanges('r1')
      vi.runAllTimers()
      const result = await promise
      const sections = result.map((e) => e.section)
      expect(sections).toContain('parent')
      expect(sections).toContain('this')
      expect(sections).toContain('child')
    })
  })

  // ── createProcess ───────────────────────────────────────────────────────────

  describe('createProcess', () => {
    const basePayload = {
      domain: 'dom-001',
      level1Name: 'Test L1',
      level1Code: 'T.1',
      level2Name: 'Test L2',
      level2Code: 'T.1.1',
      level3Name: 'Test L3',
      level3Code: 'T.1.1.1',
      description: 'A test process',
      isSharedService: false,
      entities: {},
    }

    it('resolves with a ProcessItem that has a generated id', async () => {
      const promise = createProcess(basePayload)
      vi.runAllTimers()
      const result = await promise
      expect(typeof result.id).toBe('string')
      expect(result.id).toBeTruthy()
    })

    it('sets level3Status to Published on the returned item', async () => {
      const promise = createProcess(basePayload)
      vi.runAllTimers()
      const result = await promise
      expect(result.level3Status).toBe('Published')
    })

    it('preserves all payload fields on the returned item', async () => {
      const promise = createProcess(basePayload)
      vi.runAllTimers()
      const result = await promise
      expect(result.domain).toBe(basePayload.domain)
      expect(result.level1Name).toBe(basePayload.level1Name)
      expect(result.level3Name).toBe(basePayload.level3Name)
      expect(result.level3Code).toBe(basePayload.level3Code)
      expect(result.description).toBe(basePayload.description)
      expect(result.isSharedService).toBe(false)
    })

    it('generates a unique id for each call', async () => {
      const p1 = createProcess(basePayload)
      const p2 = createProcess(basePayload)
      vi.runAllTimers()
      const [r1, r2] = await Promise.all([p1, p2])
      expect(r1.id).not.toBe(r2.id)
    })
  })

  // ── renameProcess ───────────────────────────────────────────────────────────

  describe('renameProcess', () => {
    it('resolves with null', async () => {
      const promise = renameProcess('proc-001', 'New Name')
      vi.runAllTimers()
      const result = await promise
      expect(result).toBeNull()
    })
  })

  // ── updateEntities ──────────────────────────────────────────────────────────

  describe('updateEntities', () => {
    it('resolves with null for a single update', async () => {
      const promise = updateEntities({
        updates: [{ processId: 'proc-001', company: 'gc-001', site: 'General', value: 'Yes' }],
      })
      vi.runAllTimers()
      const result = await promise
      expect(result).toBeNull()
    })

    it('resolves with null for multiple updates', async () => {
      const promise = updateEntities({
        updates: [
          { processId: 'proc-001', company: 'gc-001', site: 'General', value: 'Yes' },
          { processId: 'proc-002', company: 'gc-002', site: 'Site A', value: 'No' },
        ],
      })
      vi.runAllTimers()
      const result = await promise
      expect(result).toBeNull()
    })
  })

  // ── validateProcess ─────────────────────────────────────────────────────────

  describe('validateProcess', () => {
    it('resolves with null', async () => {
      const promise = validateProcess('proc-001')
      vi.runAllTimers()
      const result = await promise
      expect(result).toBeNull()
    })
  })
})
