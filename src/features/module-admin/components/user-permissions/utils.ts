import { domains, groupCompanies } from './constants'
import type { AccessConfig } from './types'

export const createEmptyAccessConfig = (): AccessConfig => []

export const createFullAccessConfig = (): AccessConfig =>
  groupCompanies.map((groupCompany) => ({
    groupCompany: {
      ...groupCompany,
      applicableDomains: [...domains],
    },
  }))

export const cloneAccessConfig = (config: AccessConfig): AccessConfig =>
  config.map(({ groupCompany }) => ({
    groupCompany: {
      publicId: groupCompany.publicId,
      name: groupCompany.name,
      applicableDomains: groupCompany.applicableDomains.map((domain) => ({
        publicId: domain.publicId,
        code: domain.code,
        name: domain.name,
      })),
    },
  }))

export const getAccessCounts = (config: AccessConfig) => {
  const selectedDomainIds = new Set(
    config.flatMap(({ groupCompany }) =>
      groupCompany.applicableDomains.map((domain) => domain.publicId),
    ),
  )

  return {
    gcsAccess: config.length,
    domainsAccess: selectedDomainIds.size,
  }
}
