import { useMemo } from 'react'
import type { FilterDefinition } from '@/shared/types/filters'
import type { GroupCompany, ProcessItem } from '../types'
import { PROCESS_STATUS_FILTER_OPTIONS } from '../constants/filter-definitions'

/**
 * Composes the full filter definition list for the Process Catalog filter sheet.
 *
 * Three sections:
 *  - Applicability: dynamic — built from the user-scoped group companies API response.
 *    Each user sees only the companies they are authorised for.
 *  - Filter by status: static — maps directly to the ProcessStatus union.
 *  - Domain: semi-dynamic — unique domain values derived from the live row data,
 *    so the options always reflect what actually exists in the user's data set.
 *
 * Memoised: only re-runs when groupCompanies or row domains change.
 */
export function useProcessFilterDefinitions(
  groupCompanies: GroupCompany[] | undefined,
  rows: ProcessItem[] | undefined,
): FilterDefinition[] {
  return useMemo(() => {
    // Applicability options come from the API lookup — user-scoped.
    // We use gc.id as the option id so the filter can directly match
    // against row.entities keys without a secondary lookup.
    const applicabilityOptions = (groupCompanies ?? []).map((gc) => ({
      id: gc.id,
      label: gc.name,
    }))

    // Domain options are derived from the live rows — always reflects real data.
    const uniqueDomains = [...new Set((rows ?? []).map((r) => r.domain))]
    const domainOptions = uniqueDomains.map((domain) => ({ id: domain, label: domain }))

    return [
      {
        id: 'applicability',
        label: 'Applicability',
        options: applicabilityOptions,
      },
      {
        id: 'status',
        label: 'Filter by status',
        options: PROCESS_STATUS_FILTER_OPTIONS,
      },
      {
        id: 'domain',
        label: 'Domain',
        options: domainOptions,
      },
    ]
  }, [groupCompanies, rows])
}
