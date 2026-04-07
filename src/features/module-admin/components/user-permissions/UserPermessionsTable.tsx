import { useMemo, useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'

import DataTable from '@/shared/components/data-table/DataTable'

import NameCell from './cells/NameCell'
import AccountStatusCell from './cells/AccountStatusCell'
import AssignedRoleCell from './cells/AssignedRoleCell'
import AssignedAccessCell from './cells/AssignedAccessCell'
import type { PickerPosition, UserPermissionRow, UserPermissionsTableProps } from './types'

const UserPermissionsTable = ({
  data,
  searchValue,
  onView,
  onDeactivate,
  onRowChange,
  onRowSelectUser,
  onOpenDomainsDrawer,
}: UserPermissionsTableProps) => {
  const [openUserPickerRowId, setOpenUserPickerRowId] = useState<string | null>(null)
  const [userPickerSearch, setUserPickerSearch] = useState('')
  const [pickerPosition, setPickerPosition] = useState<PickerPosition | null>(null)

  const [openRolePickerRowId, setOpenRolePickerRowId] = useState<string | null>(null)
  const [rolePickerPosition, setRolePickerPosition] = useState<PickerPosition | null>(null)

  const filteredData = useMemo(() => {
    const value = searchValue.trim().toLowerCase()

    if (!value) return data

    return data.filter((item) => {
      return (
        item.name.toLowerCase().includes(value) ||
        item.email.toLowerCase().includes(value) ||
        item.accountStatus.toLowerCase().includes(value) ||
        item.assignedRole.some((role) => role.toLowerCase().includes(value))
      )
    })
  }, [data, searchValue])

  const columns = useMemo<ColumnDef<UserPermissionRow>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'NAME',
        cell: ({ row }) => (
          <NameCell
            row={row.original}
            openUserPickerRowId={openUserPickerRowId}
            setOpenUserPickerRowId={setOpenUserPickerRowId}
            userPickerSearch={userPickerSearch}
            setUserPickerSearch={setUserPickerSearch}
            pickerPosition={pickerPosition}
            setPickerPosition={setPickerPosition}
            setOpenRolePickerRowId={setOpenRolePickerRowId}
            setRolePickerPosition={setRolePickerPosition}
            onRowSelectUser={onRowSelectUser}
            onView={onView}
            onDeactivate={onDeactivate}
          />
        ),
      },
      {
        accessorKey: 'accountStatus',
        header: 'ACCOUNT STATUS',
        cell: ({ row }) => <AccountStatusCell status={row.original.accountStatus} />,
      },
      {
        accessorKey: 'assignedRole',
        header: 'ASSIGNED ROLE',
        cell: ({ row }) => (
          <AssignedRoleCell
            row={row.original}
            openRolePickerRowId={openRolePickerRowId}
            setOpenRolePickerRowId={setOpenRolePickerRowId}
            rolePickerPosition={rolePickerPosition}
            setRolePickerPosition={setRolePickerPosition}
            setOpenUserPickerRowId={setOpenUserPickerRowId}
            setPickerPosition={setPickerPosition}
            onRowChange={onRowChange}
          />
        ),
      },
      {
        id: 'assignedAccess',
        header: 'ASSIGNED ACCESS',
        cell: ({ row }) => (
          <AssignedAccessCell row={row.original} onOpenDomainsDrawer={onOpenDomainsDrawer} />
        ),
      },
    ],
    [
      userPickerSearch,
      openUserPickerRowId,
      pickerPosition,
      openRolePickerRowId,
      rolePickerPosition,
      onView,
      onDeactivate,
      onRowChange,
      onRowSelectUser,
      onOpenDomainsDrawer,
    ],
  )

  return (
    <DataTable<UserPermissionRow>
      data={filteredData}
      columns={columns}
      density="compact"
      enableColumnDnd={false}
      enableSorting
      getRowId={(row) => row.id}
    />
  )
}

export default UserPermissionsTable
