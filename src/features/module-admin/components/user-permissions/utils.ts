import { domains, groupCompanies } from './constants'
import type { AccessConfig } from './types'

export const createEmptyAccessConfig = (): AccessConfig => ({
  selectedAccessByGroupCompany: {},
})

export const createFullAccessConfig = (): AccessConfig => ({
  selectedAccessByGroupCompany: Object.fromEntries(
    groupCompanies.map((gc) => [gc.id, domains.map((domain) => domain.id)]),
  ),
})

export const cloneAccessConfig = (config: AccessConfig): AccessConfig => ({
  selectedAccessByGroupCompany: Object.fromEntries(
    Object.entries(config.selectedAccessByGroupCompany).map(([gcId, domainIds]) => [
      gcId,
      [...domainIds],
    ]),
  ),
})

export const getAccessCounts = (config: AccessConfig) => {
  const selectedGroupCompanyIds = Object.entries(config.selectedAccessByGroupCompany)
    .filter(([, domainIds]) => domainIds.length > 0)
    .map(([gcId]) => gcId)

  const selectedDomainIds = new Set(Object.values(config.selectedAccessByGroupCompany).flat())

  return {
    gcsAccess: String(selectedGroupCompanyIds.length),
    domainsAccess: String(selectedDomainIds.size),
  }
}
