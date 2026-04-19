export type DomainStatus = 'Activated' | 'Archived'
export type DomainEditingField = 'businessDomain' | 'code' | 'sortingIndex' | null

export type DomainRow = {
  id: string
  businessDomain: string
  code: string
  sortingIndex: number | string
  status: DomainStatus
  isEditing?: boolean
  isNew?: boolean
  editingField?: DomainEditingField
}
export type EditableDomainField = keyof Pick<DomainRow, 'businessDomain' | 'code' | 'sortingIndex'>

export type DomainsTableProps = {
  data: DomainRow[]
  searchValue: string
  onRowChange?: (rowId: string, field: EditableDomainField, value: string) => void
  onEditingFieldChange?: (rowId: string, field: EditableDomainField) => void
  onEditRow?: (row: DomainRow, field: 'businessDomain' | 'code' | 'sortingIndex') => void
  onArchiveRow?: (row: DomainRow) => void
  onActivateRow?: (row: DomainRow) => void
  isEditingRow?: boolean
}
