import { create } from 'zustand'

export interface SelectedField {
  fieldId: string
  fieldName: string
}

export interface ProcessDetailActionsState {
  saveHandler: (() => void) | null
  registerSaveHandler: (handler: (() => void) | null) => void
  triggerSave: () => void

  isCommentMode: boolean
  setIsCommentMode: (on: boolean) => void
  selectedField: SelectedField | null
  selectField: (fieldId: string, fieldName: string) => void
  clearField: () => void
}

/**
 * Factory — call once per module to get an isolated store instance.
 * Never use this singleton directly across modules.
 */
export function createProcessDetailActionsStore() {
  return create<ProcessDetailActionsState>((set, get) => ({
    saveHandler: null,
    registerSaveHandler: (handler) => set({ saveHandler: handler }),
    triggerSave: () => get().saveHandler?.(),

    isCommentMode: false,
    setIsCommentMode: (on) =>
      set({ isCommentMode: on, selectedField: on ? get().selectedField : null }),
    selectedField: null,
    selectField: (fieldId, fieldName) => set({ selectedField: { fieldId, fieldName } }),
    clearField: () => set({ selectedField: null }),
  }))
}
