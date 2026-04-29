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
    setApplied({ ...pending })
  }, [pending])

  const reset = useCallback(() => {
    const allIds = [...new Set([...sectionIds, ...Object.keys(pending), ...Object.keys(applied)])]
    const empty = makeEmpty(allIds)
    setPending(empty)
    setApplied(empty)
  }, [applied, pending, sectionIds])

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
  const activeFilters = Object.entries(applied).filter(([, values]) => values.length > 0)

  if (activeFilters.length === 0) return rows

  const getFilterableValues = (row: any, sectionId: string): string[] => {
    switch (sectionId) {
      case 'domain':
      case 'groupCompany':
      case 'Site':
      case 'status':
      case 'centrallyGovernedProcess':
      case 'processCriticality':
      case 'usersImpacted':
      case 'scaleOfProcess':
      case 'automationMaturityLevel':
      case 'businessRecommendationForAutomation':
      case 'aiPowered':
      case 'autonomousUseCaseEnabled':
      case 'processCycle': {
        const value = row?.[sectionId]
        return typeof value === 'string' && value.trim() !== '' ? [value] : []
      }
      case 'sharedService': {
        const sharedService = row?.SharedService
        if (
          sharedService &&
          typeof sharedService === 'object' &&
          Array.isArray(sharedService.shared)
        ) {
          return [sharedService.shared.length > 0 ? 'Yes' : 'No']
        }
        return []
      }
      case 'businessUnit':
      case 'responsibleDigitalTeam': {
        return Array.isArray(row?.[sectionId]) ? row[sectionId].filter(Boolean) : []
      }
      case 'currentApplicationsSystems': {
        if (!Array.isArray(row?.currentApplicationsSystems)) return []
        return row.currentApplicationsSystems
          .map((item: any) => (typeof item === 'string' ? item : item?.name))
          .filter(Boolean)
      }
      default:
        return []
    }
  }

  return rows.filter((row) => {
    return activeFilters.every(([sectionId, selectedValues]) => {
      const rowValues = getFilterableValues(row, sectionId)
      return rowValues.some((value) => selectedValues.includes(value))
    })
  })
}
