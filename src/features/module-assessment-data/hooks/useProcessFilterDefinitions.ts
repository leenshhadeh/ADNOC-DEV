import { useMemo } from 'react'
import type { FilterDefinition } from '@/shared/types/filters'

// TODO: move the file from the catalog:
import { PROCESS_STATUS_FILTER_OPTIONS } from '../../module-process-catalog/constants/filter-definitions'
import {
  AUTOMATION_MATURITY_LEVEL,
  BUSINESS_RECOMMENDATION_FOR_AUTOMATION,
  NUMBER_OF_PEOPLE_IMPACTED,
  PROCESS_CRITICALITY,
  PROCESS_CYCLE,
  SCALE_OF_PROCESS,
} from '@/constants/dropdownOptions'

export function mapToObjects(arr: string[]) {
  return arr.map((item) => ({
    id: item,
    label: item,
  }))
}

const uniqueStrings = (values: unknown[]): string[] => [
  ...new Set(
    values.filter((value): value is string => typeof value === 'string' && value.trim() !== ''),
  ),
]

const getRowArrayValues = (rows: any[] | undefined, key: string): string[] =>
  uniqueStrings(
    (rows ?? []).flatMap((row) => {
      const value = row?.[key]
      if (Array.isArray(value)) {
        return value.flatMap((item) => {
          if (typeof item === 'string') return item
          if (typeof item === 'object' && item !== null && 'name' in item) {
            return String(item.name ?? '')
          }
          return []
        })
      }
      return typeof value === 'string' ? [value] : []
    }),
  )

const getRowStringValues = (rows: any[] | undefined, key: string): string[] =>
  uniqueStrings((rows ?? []).map((row) => row?.[key]))

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

    const groupCompanyOptions = mapToObjects(getRowStringValues(rows, 'groupCompany'))
    const siteOptions = mapToObjects(getRowStringValues(rows, 'Site'))
    const businessUnitOptions = mapToObjects(getRowArrayValues(rows, 'businessUnit'))
    const digitalTeamOptions = mapToObjects(getRowArrayValues(rows, 'responsibleDigitalTeam'))
    const currentApplicationsOptions = mapToObjects(
      getRowArrayValues(rows, 'currentApplicationsSystems'),
    )

    return [
      {
        id: 'domain',
        label: 'Filter by domain',
        options: domainOptions,
      },
      {
        id: 'groupCompany',
        label: 'Group Company',
        options: groupCompanyOptions,
      },
      {
        id: 'Site',
        label: 'Sites',
        options: siteOptions,
      },

      {
        id: 'status',
        label: 'Filter by status',
        options: PROCESS_STATUS_FILTER_OPTIONS,
      },
      {
        id: 'centrallyGovernedProcess',
        label: 'Centrally Governed Process',
        options: mapToObjects(['Yes', 'No']),
      },
      {
        id: 'sharedService',
        label: 'Shared services',
        options: mapToObjects(['Yes', 'No']),
      },
      {
        id: 'businessUnit',
        label: 'BU',
        options: businessUnitOptions,
      },
      {
        id: 'responsibleDigitalTeam',
        label: 'Digital team',
        options: digitalTeamOptions,
      },
      {
        id: 'processCriticality',
        label: 'Process Criticality',
        options: mapToObjects(PROCESS_CRITICALITY),
      },
      {
        id: 'usersImpacted',
        label: 'Number of People/Users Impacted',
        options: mapToObjects(NUMBER_OF_PEOPLE_IMPACTED),
      },
      {
        id: 'scaleOfProcess',
        label: 'Scale of the Process',
        options: mapToObjects(SCALE_OF_PROCESS),
      },
      {
        id: 'automationMaturityLevel',
        label: 'Automation Maturity Level',
        options: mapToObjects(AUTOMATION_MATURITY_LEVEL),
      },
      {
        id: 'currentApplicationsSystems',
        label: 'Current Applications/Systems',
        options: currentApplicationsOptions,
      },
      {
        id: 'businessRecommendationForAutomation',
        label: 'Business Recommendation for Automation',
        options: mapToObjects(BUSINESS_RECOMMENDATION_FOR_AUTOMATION),
      },
      {
        id: 'aiPowered',
        label: 'AI-Powered - Y/N',
        options: mapToObjects(['Yes', 'No']),
      },
      {
        id: 'autonomousUseCaseEnabled',
        label: 'Autonomous Use Case Enabled',
        options: mapToObjects(['Yes', 'No']),
      },
      {
        id: 'processCycle',
        label: 'How Often the Process Happens (Cycle)',
        options: mapToObjects(PROCESS_CYCLE),
      },
    ]
  }, [domains, rows])
}
