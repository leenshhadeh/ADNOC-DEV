export type RateCardValueNode = {
  id: string
  name: string
  code?: string
  rateCardValue: number
}

export type ProcessLevel3Node = {
  id: string
  name: string
  code?: string
  rateCardValue?: number
  level4Items?: RateCardValueNode[]
}

export type Level2Node = {
  id: string
  name: string
  code?: string
  rateCardValue?: number
  level3Items?: ProcessLevel3Node[]
}

export type Level1Node = {
  id: string
  name: string
  code?: string
  rateCardValue?: number
  level2Items?: Level2Node[]
}

export type DomainNode = {
  id: string
  name: string
  code?: string
  rateCardValue?: number
  level1Items?: Level1Node[]
}

export type RateCardCompanyRow = {
  id: string
  groupCompany: {
    id: string
    name: string
  }
  domains: DomainNode[]
}

export type FlattenedRateCardRow = {
  id: string
  groupCompany: string
  domain?: string
  domainCode?: string
  level1?: string
  level1Code?: string
  level2?: string
  level2Code?: string
  processLevel3?: string
  processLevel3Code?: string
  processLevel4?: string
  processLevel4Code?: string
  rateCardValue: number | string
  isEditing?: boolean
}

export type RateCardsTableProps = {
  data: FlattenedRateCardRow[]
  isBulkEditMode?: boolean
  selectedRowIds?: string[]
  onToggleRowSelection?: (rowId: string, checked: boolean) => void
  onRateCardValueChange?: (rowId: string, value: string) => void
  onEditRateCardRow?: (rowId: string) => void
}
