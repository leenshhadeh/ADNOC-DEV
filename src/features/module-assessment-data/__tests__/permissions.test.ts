import { describe, it, expect } from 'vitest'
import { hasPermission, type Role } from '@/shared/lib/permissions'

describe('hasPermission', () => {
  // ── Super Admin ──────────────────────────────────────────────────────────
  describe('Super Admin', () => {
    const role: Role = 'Super Admin'

    it('has all permissions', () => {
      expect(hasPermission(role, 'APPROVE_REQUEST')).toBe(true)
      expect(hasPermission(role, 'RETURN_REQUEST')).toBe(true)
      expect(hasPermission(role, 'REJECT_REQUEST')).toBe(true)
      expect(hasPermission(role, 'COMMENT_ON_FIELD')).toBe(true)
      expect(hasPermission(role, 'ADD_LEVEL_4')).toBe(true)
      expect(hasPermission(role, 'MANAGE_USER_PERMISSIONS')).toBe(true)
      expect(hasPermission(role, 'APPLY_DIRECT_CHANGES')).toBe(true)
    })
  })

  // ── Quality Manager ──────────────────────────────────────────────────────
  describe('Quality Manager', () => {
    const role: Role = 'Quality Manager'

    it('can COMMENT_ON_FIELD', () => {
      expect(hasPermission(role, 'COMMENT_ON_FIELD')).toBe(true)
    })

    it('can APPROVE_REQUEST', () => {
      expect(hasPermission(role, 'APPROVE_REQUEST')).toBe(true)
    })

    it('can RETURN_REQUEST', () => {
      expect(hasPermission(role, 'RETURN_REQUEST')).toBe(true)
    })

    it('can REJECT_REQUEST', () => {
      expect(hasPermission(role, 'REJECT_REQUEST')).toBe(true)
    })

    it('cannot ADD_LEVEL_4', () => {
      expect(hasPermission(role, 'ADD_LEVEL_4')).toBe(false)
    })

    it('cannot MANAGE_USER_PERMISSIONS', () => {
      expect(hasPermission(role, 'MANAGE_USER_PERMISSIONS')).toBe(false)
    })
  })

  // ── Business Focal Point ─────────────────────────────────────────────────
  describe('Business Focal Point', () => {
    const role: Role = 'Business Focal Point'

    it('cannot APPROVE_REQUEST', () => {
      expect(hasPermission(role, 'APPROVE_REQUEST')).toBe(false)
    })

    it('cannot RETURN_REQUEST', () => {
      expect(hasPermission(role, 'RETURN_REQUEST')).toBe(false)
    })

    it('cannot REJECT_REQUEST', () => {
      expect(hasPermission(role, 'REJECT_REQUEST')).toBe(false)
    })

    it('cannot COMMENT_ON_FIELD', () => {
      expect(hasPermission(role, 'COMMENT_ON_FIELD')).toBe(false)
    })

    it('can REQUEST_PROCESS_CHANGE', () => {
      expect(hasPermission(role, 'REQUEST_PROCESS_CHANGE')).toBe(true)
    })

    it('can SUBMIT_REQUEST', () => {
      expect(hasPermission(role, 'SUBMIT_REQUEST')).toBe(true)
    })

    it('can VIEW_SUBMITTED_REQUESTS', () => {
      expect(hasPermission(role, 'VIEW_SUBMITTED_REQUESTS')).toBe(true)
    })
  })

  // ── BPA Process Catalog Custodian ────────────────────────────────────────
  describe('BPA Process Catalog Custodian', () => {
    const role: Role = 'BPA Process Catalog Custodian'

    it('can APPROVE_REQUEST', () => {
      expect(hasPermission(role, 'APPROVE_REQUEST')).toBe(true)
    })

    it('can EDIT_ROW', () => {
      expect(hasPermission(role, 'EDIT_ROW')).toBe(true)
    })

    it('cannot COMMENT_ON_FIELD', () => {
      expect(hasPermission(role, 'COMMENT_ON_FIELD')).toBe(false)
    })
  })

  // ── BPA Program Manager ─────────────────────────────────────────────────
  describe('BPA Program Manager', () => {
    const role: Role = 'BPA Program Manager'

    it('can APPROVE_REQUEST', () => {
      expect(hasPermission(role, 'APPROVE_REQUEST')).toBe(true)
    })

    it('can RETURN_REQUEST', () => {
      expect(hasPermission(role, 'RETURN_REQUEST')).toBe(true)
    })

    it('cannot EDIT_ROW', () => {
      expect(hasPermission(role, 'EDIT_ROW')).toBe(false)
    })
  })
})
