import { create } from 'zustand'

interface SelectedField {
  fieldId: string
  fieldName: string
}

interface ProcessDetailActionsState {
  saveHandler: (() => void) | null
  registerSaveHandler: (handler: (() => void) | null) => void
  triggerSave: () => void

  isCommentMode: boolean
  setIsCommentMode: (on: boolean) => void
  selectedField: SelectedField | null
  selectField: (fieldId: string, fieldName: string) => void
  clearField: () => void
}

export const useProcessDetailActionsStore = create<ProcessDetailActionsState>((set, get) => ({
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
