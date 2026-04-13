import { useCallback, useMemo, useState } from 'react'
import type { ProcessItem } from '../types'

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
 * - Applicability: option id = group company id; a row matches if any site
 *   under the company is 'Yes'.
 * - Status: exact match on row.level3Status.
 * - Domain: exact match on row.domain.
 *
 * Multiple selections within a section are OR'd.
 * Multiple sections are AND'd.
 * Draft rows are never hidden — they are unsaved local state.
 */
export function applyProcessFilters(rows: ProcessItem[], applied: ProcessFilters): ProcessItem[] {
  const applicability = applied['applicability'] ?? []
  const status = applied['status'] ?? []
  const domain = applied['domain'] ?? []

  if (!applicability.length && !status.length && !domain.length) return rows

  return rows.filter((row) => {
    // Draft rows bypass all filters — they are unsaved in-progress work
    if (row.level3Status === 'Draft') return true

    // Applicability: at least one selected company has a 'Yes' site on this row
    if (applicability.length > 0) {
      const matches = applicability.some((companyId) =>
        Object.values(row.entities[companyId] ?? {}).some((v) => v === 'Yes'),
      )
      if (!matches) return false
    }

    // Status: row's level3Status is in the selected set
    if (status.length > 0 && !status.includes(row.level3Status)) return false

    // Domain: row's domain is in the selected set
    if (domain.length > 0 && !domain.includes(row.domain)) return false

    return true
  })
}
