import { createContext, useCallback, useContext, useRef } from 'react'
import type { ReactNode } from 'react'

interface ProcessDetailActionsContextValue {
  registerSaveHandler: (handler: (() => void) | null) => void
  triggerSave: () => void
}

const ProcessDetailActionsContext = createContext<ProcessDetailActionsContextValue>({
  registerSaveHandler: () => {},
  triggerSave: () => {},
})

export const ProcessDetailActionsProvider = ({ children }: { children: ReactNode }) => {
  const saveHandlerRef = useRef<(() => void) | null>(null)

  const registerSaveHandler = useCallback((handler: (() => void) | null) => {
    saveHandlerRef.current = handler
  }, [])

  const triggerSave = useCallback(() => {
    saveHandlerRef.current?.()
  }, [])

  return (
    <ProcessDetailActionsContext.Provider value={{ registerSaveHandler, triggerSave }}>
      {children}
    </ProcessDetailActionsContext.Provider>
  )
}

export const useProcessDetailActions = () => useContext(ProcessDetailActionsContext)
