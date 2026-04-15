import { useCallback, useMemo, useState } from 'react'
// import type { ProcessItem } from '../types'

export type ProcessFilters = Record<string, string[]>

interface UseProcessFiltersReturn {
  /** Pending (uncommitted) selections the user is editing in the sheet */
  pending: ProcessFilters
  /** Committed selections applied to the table */
  applied: ProcessFilters
  /** Total number of checked options across all sections */
  activeCount: number
  /** Count of checked options per section — used for section badge labels */
  activePerSection: Record<string, number>
  toggle: (sectionId: string, optionId: string) => void
  apply: () => void
  reset: () => void
}

const makeEmpty = (sectionIds: readonly string[]): ProcessFilters =>
  Object.fromEntries(sectionIds.map((id) => [id, []]))

export function useProcessFilters(sectionIds: readonly string[]): UseProcessFiltersReturn {
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

  const activeCount = useMemo(
    () => Object.values(applied).reduce((sum, arr) => sum + arr.length, 0),
    [applied],
  )

  const activePerSection = useMemo(
    () => Object.fromEntries(Object.entries(applied).map(([k, v]) => [k, v.length])),
    [applied],
  )

  return { pending, applied, activeCount, activePerSection, toggle, apply, reset }
}

/**
 * Pure filter function — applies committed filter state to a row array.
 *
 * Filter semantics:
 * - Status: exact match on row.level3Status.
 * - Domain: exact match on row.domain.
 *
 * Multiple selections within a section are OR'd.
 * Multiple sections are AND'd.
 * Draft rows are never hidden — they are unsaved local state.
 */
export function applyProcessFilters(rows: any[], applied: ProcessFilters): any[] {
  const status = applied['status'] ?? []
  const domain = applied['domain'] ?? []

  if (!status.length && !domain.length) return rows

  return rows.filter((row) => {
    // Draft rows bypass all filters — they are unsaved in-progress work
    if (row.status === 'Draft') return true

    if (status.length > 0 && !status.includes(row.status)) return false

    // Domain: row's domain is in the selected set
    if (domain.length > 0 && !domain.includes(row.domain)) return false

    return true
  })
}
