import type { RateCardCompanyRow, FlattenedRateCardRow } from './types'

export const flattenRateCards = (companies: RateCardCompanyRow[]): FlattenedRateCardRow[] => {
  const rows: FlattenedRateCardRow[] = []

  companies.forEach((company) => {
    company.domains.forEach((domain) => {
      if (!domain.level1Items?.length && domain.rateCardValue !== undefined) {
        rows.push({
          id: `${company.id}-${domain.id}`,
          groupCompany: company.groupCompany.name,
          domain: domain.name,
          domainCode: domain.code,
          rateCardValue: domain.rateCardValue,
        })
      }

      domain.level1Items?.forEach((level1) => {
        if (!level1.level2Items?.length && level1.rateCardValue !== undefined) {
          rows.push({
            id: `${company.id}-${domain.id}-${level1.id}`,
            groupCompany: company.groupCompany.name,
            domain: domain.name,
            domainCode: domain.code,
            level1: level1.name,
            level1Code: level1.code,
            rateCardValue: level1.rateCardValue,
          })
        }

        level1.level2Items?.forEach((level2) => {
          if (!level2.level3Items?.length && level2.rateCardValue !== undefined) {
            rows.push({
              id: `${company.id}-${domain.id}-${level1.id}-${level2.id}`,
              groupCompany: company.groupCompany.name,
              domain: domain.name,
              domainCode: domain.code,
              level1: level1.name,
              level1Code: level1.code,
              level2: level2.name,
              level2Code: level2.code,
              rateCardValue: level2.rateCardValue,
            })
          }

          level2.level3Items?.forEach((level3) => {
            if (!level3.level4Items?.length && level3.rateCardValue !== undefined) {
              rows.push({
                id: `${company.id}-${domain.id}-${level1.id}-${level2.id}-${level3.id}`,
                groupCompany: company.groupCompany.name,
                domain: domain.name,
                domainCode: domain.code,
                level1: level1.name,
                level1Code: level1.code,
                level2: level2.name,
                level2Code: level2.code,
                processLevel3: level3.name,
                processLevel3Code: level3.code,
                rateCardValue: level3.rateCardValue,
              })
            }

            level3.level4Items?.forEach((level4) => {
              rows.push({
                id: `${company.id}-${domain.id}-${level1.id}-${level2.id}-${level3.id}-${level4.id}`,
                groupCompany: company.groupCompany.name,
                domain: domain.name,
                domainCode: domain.code,
                level1: level1.name,
                level1Code: level1.code,
                level2: level2.name,
                level2Code: level2.code,
                processLevel3: level3.name,
                processLevel3Code: level3.code,
                processLevel4: level4.name,
                processLevel4Code: level4.code,
                rateCardValue: level4.rateCardValue,
              })
            })
          })
        })
      })
    })
  })

  return rows
}
