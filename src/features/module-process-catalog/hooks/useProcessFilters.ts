import { useCallback, useState } from 'react'

export type ProcessFilters = Record<string, string[]>

interface UseProcessFiltersReturn {
  /** Pending (uncommitted) selections the user is editing in the sheet */
  pending: ProcessFilters
  /** Committed selections applied to the table */
  applied: ProcessFilters
  toggle: (sectionId: string, optionId: string) => void
  apply: () => void
  reset: () => void
}

const makeEmpty = (sectionIds: string[]): ProcessFilters =>
  Object.fromEntries(sectionIds.map((id) => [id, []]))

export function useProcessFilters(sectionIds: string[]): UseProcessFiltersReturn {
  const [pending, setPending] = useState<ProcessFilters>(() => makeEmpty(sectionIds))
  const [applied, setApplied] = useState<ProcessFilters>(() => makeEmpty(sectionIds))

  const toggle = useCallback((sectionId: string, optionId: string) => {
    setPending((prev) => {
      const current = prev[sectionId] ?? []
      return {
        ...prev,
        [sectionId]: current.includes(optionId)
          ? current.filter((x) => x !== optionId)
          : [...current, optionId],
      }
    })
  }, [])

  const apply = useCallback(() => {
    setApplied((prev) => ({ ...prev, ...pending }))
  }, [pending])

  const reset = useCallback(() => {
    const empty = makeEmpty(sectionIds)
    setPending(empty)
    setApplied(empty)
  }, [sectionIds])

  return { pending, applied, toggle, apply, reset }
}
