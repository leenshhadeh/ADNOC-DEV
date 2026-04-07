import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'

import DataTable from '@/shared/components/data-table/DataTable'

import GroupCompanyNameCell from './cells/GroupCompanyNameCell'
import GroupCompanyCodeCell from './cells/GroupCompanyCodeCell'
import GroupCompanySitesCell from './cells/GroupCompanySitesCell'
import type { EditableGroupCompanyField, GroupCompaniesTableProps, GroupCompanyRow } from './types'

const GroupCompaniesTable = ({
  data,
  searchValue,
  onRowChange,
  onOpenSitesDrawer,
}: GroupCompaniesTableProps) => {
  const filteredData = useMemo(() => {
    const value = searchValue.trim().toLowerCase()

    if (!value) return data

    return data.filter((item) => {
      return (
        item.groupCompany.toLowerCase().includes(value) ||
        item.code.toLowerCase().includes(value) ||
        item.sites.some((site) => site.name.toLowerCase().includes(value))
      )
    })
  }, [data, searchValue])

  const columns = useMemo<ColumnDef<GroupCompanyRow>[]>(
    () => [
      {
        accessorKey: 'groupCompany',
        header: 'GROUP COMPANIES',
        cell: ({ row }) => (
          <GroupCompanyNameCell
            row={row.original}
            onChange={(rowId, field, value) =>
              onRowChange?.(rowId, field as EditableGroupCompanyField, value)
            }
          />
        ),
      },
      {
        accessorKey: 'code',
        header: 'CODE',
        cell: ({ row }) => (
          <GroupCompanyCodeCell
            row={row.original}
            onChange={(rowId, field, value) =>
              onRowChange?.(rowId, field as EditableGroupCompanyField, value)
            }
          />
        ),
      },
      {
        id: 'sites',
        header: 'SITES',
        cell: ({ row }) => (
          <GroupCompanySitesCell row={row.original} onOpenSitesDrawer={onOpenSitesDrawer} />
        ),
      },
    ],
    [onRowChange, onOpenSitesDrawer],
  )

  return (
    <DataTable<GroupCompanyRow>
      data={filteredData}
      columns={columns}
      density="compact"
      enableColumnDnd={false}
      enableSorting
      getRowId={(row) => row.id}
    />
  )
}

export default GroupCompaniesTable
