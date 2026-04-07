import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'

import DataTable from '@/shared/components/data-table/DataTable'

import BusinessDomainCell from './cells/BusinessDomainCell'
import DomainCodeCell from './cells/DomainCodeCell'
import SortingIndexCell from './cells/SortingIndexCell'
import type { DomainRow, DomainsTableProps, EditableDomainField } from './types'

const DomainsTable = ({ data, searchValue, onRowChange }: DomainsTableProps) => {
  const filteredData = useMemo(() => {
    const value = searchValue.trim().toLowerCase()

    if (!value) return data

    return data.filter((item) => {
      return (
        item.businessDomain.toLowerCase().includes(value) ||
        item.code.toLowerCase().includes(value) ||
        String(item.sortingIndex).includes(value)
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
          />
        ),
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
          />
        ),
      },
    ],
    [onRowChange],
  )

  return (
    <DataTable<DomainRow>
      data={filteredData}
      columns={columns}
      density="compact"
      enableColumnDnd={false}
      enableSorting
      getRowId={(row) => row.id}
    />
  )
}

export default DomainsTable
