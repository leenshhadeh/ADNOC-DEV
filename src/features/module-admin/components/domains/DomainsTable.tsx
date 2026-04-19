import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'

import DataTable from '@/shared/components/data-table/DataTable'

import BusinessDomainCell from './cells/BusinessDomainCell'
import DomainCodeCell from './cells/DomainCodeCell'
import SortingIndexCell from './cells/SortingIndexCell'
import DomainStatusCell from './cells/DomainStatusCell'
import type { DomainRow, DomainsTableProps, EditableDomainField } from './types'

const DomainsTable = ({
  data,
  searchValue,
  onRowChange,
  onEditingFieldChange,
  onEditRow,
  onArchiveRow,
  onActivateRow,
  isEditingRow = false,
}: DomainsTableProps) => {
  const filteredData = useMemo(() => {
    const value = searchValue.trim().toLowerCase()

    if (!value) return data

    return data.filter((item) => {
      return (
        item.businessDomain.toLowerCase().includes(value) ||
        item.code.toLowerCase().includes(value) ||
        String(item.sortingIndex).includes(value) ||
        item.status.toLowerCase().includes(value)
      )
    })
  }, [data, searchValue])

  const columns = useMemo<ColumnDef<DomainRow>[]>(
    () => [
      {
        accessorKey: 'businessDomain',
        header: 'BUSINESS DOMAINS',
        cell: ({ row }) => (
          <BusinessDomainCell
            row={row.original}
            onChange={(rowId, field, value) =>
              onRowChange?.(rowId, field as EditableDomainField, value)
            }
            onFocusField={(rowId, field) =>
              onEditingFieldChange?.(rowId, field as EditableDomainField)
            }
            onEdit={onEditRow}
            onArchive={onArchiveRow}
            onActivate={onActivateRow}
          />
        ),
      },
      {
        accessorKey: 'status',
        header: 'STATUS',
        cell: ({ row }) => <DomainStatusCell row={row.original} />,
      },
      {
        accessorKey: 'code',
        header: 'CODE',
        cell: ({ row }) => (
          <DomainCodeCell
            row={row.original}
            onChange={(rowId, field, value) =>
              onRowChange?.(rowId, field as EditableDomainField, value)
            }
            onFocusField={(rowId, field) =>
              onEditingFieldChange?.(rowId, field as EditableDomainField)
            }
            onEdit={onEditRow}
          />
        ),
      },
      {
        accessorKey: 'sortingIndex',
        header: 'SORTING INDEX',
        cell: ({ row }) => (
          <SortingIndexCell
            row={row.original}
            onChange={(rowId, field, value) =>
              onRowChange?.(rowId, field as EditableDomainField, value)
            }
            onFocusField={(rowId, field) =>
              onEditingFieldChange?.(rowId, field as EditableDomainField)
            }
            onEdit={onEditRow}
          />
        ),
      },
    ],
    [onActivateRow, onArchiveRow, onEditRow, onRowChange, onEditingFieldChange],
  )

  return (
    <DataTable<DomainRow>
      data={filteredData}
      columns={columns}
      density="comfortable"
      enableColumnDnd={false}
      enableSorting={!isEditingRow}
      getRowId={(row) => row.id}
      tableMeta={{ rowDividers: true }}
    />
  )
}

export default DomainsTable
