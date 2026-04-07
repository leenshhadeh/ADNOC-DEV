export type AccessConfig = {
  selectedAccessByGroupCompany: Record<string, string[]>
}

export type UserPermissionRow = {
  id: string
  name: string
  email: string
  accountStatus: 'Active' | 'Deactivated'
  assignedRole: string[]
  gcsAccess: string
  domainsAccess: string
  accessConfig: AccessConfig
  isEditing?: boolean
}

export type EditableField = keyof Pick<
  UserPermissionRow,
  'name' | 'email' | 'assignedRole' | 'gcsAccess' | 'domainsAccess'
>

export type UserDirectoryItem = {
  id: string
  name: string
  email: string
}

export type PickerPosition = {
  top: number
  left: number
  width: number
}

export type UserPermissionsTableProps = {
  data: UserPermissionRow[]
  searchValue: string
  onView?: (row: UserPermissionRow) => void
  onDeactivate?: (row: UserPermissionRow) => void
  onRowChange?: (rowId: string, field: EditableField, value: string | string[]) => void
  onRowSelectUser?: (rowId: string, user: { name: string; email: string }) => void
  onOpenDomainsDrawer?: (row: UserPermissionRow) => void
}
