export type DomainRow = {
  id: string
  businessDomain: string
  code: string
  sortingIndex: number | string
  isEditing?: boolean
}

export type EditableDomainField = keyof Pick<DomainRow, 'businessDomain' | 'code' | 'sortingIndex'>

export type DomainsTableProps = {
  data: DomainRow[]
  searchValue: string
  onRowChange?: (rowId: string, field: EditableDomainField, value: string) => void
}
