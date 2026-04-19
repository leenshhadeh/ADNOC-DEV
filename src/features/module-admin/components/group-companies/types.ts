export type GroupCompanyStatus = 'Active' | 'Archived'

export type GroupCompanySite = {
  id: string
  name: string
  isDefault?: boolean
}
export type GroupCompanyRow = {
  id: string
  groupCompany: string
  code: string
  sites: GroupCompanySite[]
  status: GroupCompanyStatus
  isEditing?: boolean
  editingField?: 'groupCompany' | 'code' | null
  isNew?: boolean
}

export type EditableGroupCompanyField = 'groupCompany' | 'code'

export type GroupCompaniesTableProps = {
  data: GroupCompanyRow[]
  searchValue: string
  onRowChange?: (rowId: string, field: EditableGroupCompanyField, value: string) => void
  onEditingFieldChange?: (rowId: string, field: EditableGroupCompanyField) => void
  onOpenSitesDrawer?: (row: GroupCompanyRow) => void
  onEditRow?: (row: GroupCompanyRow, field: 'groupCompany' | 'code') => void
  onArchiveRow?: (row: GroupCompanyRow) => void
  onActivateRow?: (row: GroupCompanyRow) => void
}
