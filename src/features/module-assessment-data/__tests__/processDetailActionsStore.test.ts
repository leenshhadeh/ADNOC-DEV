import { describe, it, expect, beforeEach } from 'vitest'
import { createProcessDetailActionsStore } from '@/shared/store/processDetailActionsStore'

describe('createProcessDetailActionsStore', () => {
  it('creates isolated instances with independent state', () => {
    const storeA = createProcessDetailActionsStore()
    const storeB = createProcessDetailActionsStore()

    storeA.getState().setIsCommentMode(true)

    expect(storeA.getState().isCommentMode).toBe(true)
    expect(storeB.getState().isCommentMode).toBe(false)
  })

  describe('comment mode', () => {
    let store: ReturnType<typeof createProcessDetailActionsStore>

    beforeEach(() => {
      store = createProcessDetailActionsStore()
    })

    it('starts with comment mode off and no selected field', () => {
      const { isCommentMode, selectedField } = store.getState()
      expect(isCommentMode).toBe(false)
      expect(selectedField).toBeNull()
    })

    it('setIsCommentMode(true) enables comment mode', () => {
      store.getState().setIsCommentMode(true)
      expect(store.getState().isCommentMode).toBe(true)
    })

    it('setIsCommentMode(false) disables comment mode and clears selected field', () => {
      store.getState().selectField('customName', 'Custom Name')
      store.getState().setIsCommentMode(false)

      const { isCommentMode, selectedField } = store.getState()
      expect(isCommentMode).toBe(false)
      expect(selectedField).toBeNull()
    })

    it('setIsCommentMode(true) preserves an already-selected field', () => {
      store.getState().setIsCommentMode(true)
      store.getState().selectField('customName', 'Custom Name')
      // Turning mode back on preserves existing selection
      store.getState().setIsCommentMode(true)
      expect(store.getState().selectedField?.fieldId).toBe('customName')
    })
  })

  describe('selectField / clearField', () => {
    let store: ReturnType<typeof createProcessDetailActionsStore>

    beforeEach(() => {
      store = createProcessDetailActionsStore()
    })

    it('selectField sets the selected field', () => {
      store.getState().selectField('processDescription', 'Process Description')
      expect(store.getState().selectedField).toEqual({
        fieldId: 'processDescription',
        fieldName: 'Process Description',
      })
    })

    it('selectField overwrites previously selected field', () => {
      store.getState().selectField('customName', 'Custom Name')
      store.getState().selectField('customDescription', 'Custom Description')
      expect(store.getState().selectedField?.fieldId).toBe('customDescription')
    })

    it('clearField resets selected field to null', () => {
      store.getState().selectField('customName', 'Custom Name')
      store.getState().clearField()
      expect(store.getState().selectedField).toBeNull()
    })
  })

  describe('saveHandler', () => {
    it('triggerSave calls the registered handler', () => {
      const store = createProcessDetailActionsStore()
      const handler = vi.fn()
      store.getState().registerSaveHandler(handler)
      store.getState().triggerSave()
      expect(handler).toHaveBeenCalledOnce()
    })

    it('triggerSave does nothing when no handler is registered', () => {
      const store = createProcessDetailActionsStore()
      expect(() => store.getState().triggerSave()).not.toThrow()
    })

    it('registerSaveHandler(null) clears the handler', () => {
      const store = createProcessDetailActionsStore()
      const handler = vi.fn()
      store.getState().registerSaveHandler(handler)
      store.getState().registerSaveHandler(null)
      store.getState().triggerSave()
      expect(handler).not.toHaveBeenCalled()
    })
  })
})
