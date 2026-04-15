import { useMemo } from 'react'
import type { FilterDefinition } from '@/shared/types/filters'

// TODO: move the file from the catalog: 
import { PROCESS_STATUS_FILTER_OPTIONS } from '../../module-process-catalog/constants/filter-definitions'

export function useProcessFilterDefinitions(
  domains: any[] | undefined,
  rows: any[] | undefined,

): FilterDefinition[] {
  return useMemo(() => {
  
    // Domain options are derived from the live rows — always reflects real data.
    const uniqueDomainIds = [...new Set((rows ?? []).map((r) => r.domain))]
    const domainOptions = uniqueDomainIds.map((domainId) => {
      const found = (domains ?? []).find((d) => d.id === domainId)
      return { id: domainId, label: found?.name ?? domainId }
    })

    return [
      {
        id: 'domain',
        label: 'Filter by domain',
        options: domainOptions,
      },
      // {
      //   id: 'organizational',
      //   label: 'Filter by organizational unit ',
      //   options: [],
      // },
      // {
      //   id: 'subUnit',
      //   label: 'Filter by sub unit ',
      //   options: []
      // },
     
      {
        id: 'status',
        label: 'Filter by status',
        options: PROCESS_STATUS_FILTER_OPTIONS,
      },
      // {
      //   id: 'Requireupdate?',
      //   label: 'Require update?',
      //   options: [],
      // },
    ]
  }, [domains, rows])
}
