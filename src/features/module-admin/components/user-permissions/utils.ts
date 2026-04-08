import { domains, groupCompanies } from './constants'
import type { AccessConfig } from './types'

export const createEmptyAccessConfig = (): AccessConfig => ({
  selectedGroupCompanyIds: [],
  selectedAccessByGroupCompany: {},
})

export const createFullAccessConfig = (): AccessConfig => ({
  selectedGroupCompanyIds: groupCompanies.map((gc) => gc.id),
  selectedAccessByGroupCompany: Object.fromEntries(
    groupCompanies.map((gc) => [gc.id, domains.map((domain) => domain.id)]),
  ),
})

export const cloneAccessConfig = (config: AccessConfig): AccessConfig => ({
  selectedGroupCompanyIds: [...config.selectedGroupCompanyIds],
  selectedAccessByGroupCompany: Object.fromEntries(
    Object.entries(config.selectedAccessByGroupCompany).map(([gcId, domainIds]) => [
      gcId,
      [...domainIds],
    ]),
  ),
})

export const getAccessCounts = (config: AccessConfig) => {
  const selectedDomainIds = new Set(Object.values(config.selectedAccessByGroupCompany).flat())

  return {
    gcsAccess: String(config.selectedGroupCompanyIds.length),
    domainsAccess: String(selectedDomainIds.size),
  }
}
