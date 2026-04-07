export type GroupCompanySite = {
  id: string
  name: string
}

export type GroupCompanyRow = {
  id: string
  groupCompany: string
  code: string
  sites: GroupCompanySite[]
  isEditing?: boolean
}

export type EditableGroupCompanyField = keyof Pick<GroupCompanyRow, 'groupCompany' | 'code'>

export type GroupCompaniesTableProps = {
  data: GroupCompanyRow[]
  searchValue: string
  onRowChange?: (rowId: string, field: EditableGroupCompanyField, value: string) => void
  onOpenSitesDrawer?: (row: GroupCompanyRow) => void
}
