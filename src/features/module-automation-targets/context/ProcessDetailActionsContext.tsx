import { createContext, useCallback, useContext, useRef, useState } from 'react'
import type { ReactNode } from 'react'

interface SelectedField {
  fieldId: string
  fieldName: string
}

interface ProcessDetailActionsContextValue {
  registerSaveHandler: (handler: (() => void) | null) => void
  triggerSave: () => void
  isCommentMode: boolean
  setIsCommentMode: (on: boolean) => void
  selectedField: SelectedField | null
  selectField: (fieldId: string, fieldName: string) => void
  clearField: () => void
}

const ProcessDetailActionsContext = createContext<ProcessDetailActionsContextValue>({
  registerSaveHandler: () => {},
  triggerSave: () => {},
  isCommentMode: false,
  setIsCommentMode: () => {},
  selectedField: null,
  selectField: () => {},
  clearField: () => {},
})

export const ProcessDetailActionsProvider = ({ children }: { children: ReactNode }) => {
  const saveHandlerRef = useRef<(() => void) | null>(null)

  const registerSaveHandler = useCallback((handler: (() => void) | null) => {
    saveHandlerRef.current = handler
  }, [])

  const triggerSave = useCallback(() => {
    saveHandlerRef.current?.()
  }, [])

  const [isCommentMode, setIsCommentMode] = useState(false)
  const [selectedField, setSelectedField] = useState<SelectedField | null>(null)

  const selectField = useCallback((fieldId: string, fieldName: string) => {
    setSelectedField({ fieldId, fieldName })
  }, [])

  const clearField = useCallback(() => {
    setSelectedField(null)
  }, [])

  return (
    <ProcessDetailActionsContext.Provider
      value={{
        registerSaveHandler,
        triggerSave,
        isCommentMode,
        setIsCommentMode,
        selectedField,
        selectField,
        clearField,
      }}
    >
      {children}
    </ProcessDetailActionsContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useProcessDetailActions = () => useContext(ProcessDetailActionsContext)
