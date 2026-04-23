import DataTable from '@/shared/components/data-table/DataTable'
import type { ColumnDef } from '@tanstack/react-table'
import { useMemo } from 'react'

interface ChangesRows {
  name: string
  comment: string
  oldValue?: string
  newValue?: string
  changeType?: string
  modifiedBy?: string
  modifiedOn?: string
}

const RecordedChangesTab = (props: any) => {
  const { process } = props

  const columns = useMemo<ColumnDef<ChangesRows, unknown>[]>(
    () => [
      {
        id: 'name',
        accessorKey: 'name',
        header: 'Field name',
 
        enableSorting: false,
        cell: (info) => (
          <div>
            <p className="text-foreground">{info.row.original.name}</p>
          </div>
        ),
      },
      {
        id: 'changeType',
        accessorKey: 'changeType',
        header: 'Change Type',
        enableSorting: false,
        size:200,
        cell: (info) => (
          <p className="text-muted-foreground text-wrap">{info.row.original.changeType}</p>
        ),
      },
      {
        id: 'oldValue',
        accessorKey: 'oldValue',
        header: 'Old Value',
        size:150,
        enableSorting: false,
        cell: (info) => <p className="text-muted-foreground">{info.row.original.oldValue}</p>,
      },
      {
        id: 'newValue',
        accessorKey: 'newValue',
        header: 'New Value',
        size:150,
        enableSorting: false,
        cell: (info) => <p className="text-muted-foreground">{info.row.original.newValue}</p>,
      },
      // {
      //   id: 'comment',
      //   accessorKey: 'comment',
      //   header: 'Comment',
      //   size: 300,
      //   enableSorting: false,
      //   cell: (info) => <p className="text-muted-foreground text-wrap">{info.row.original.comment}</p>,
      // },
      {
        id: 'modifiedBy',
        accessorKey: 'modifiedBy',
        header: 'Modified By',
        enableSorting: false,
        cell: (info) =>  <div className="text-muted-foreground rounded-[99px] bg-accent p-1 text-center"><p className="text-muted-foreground">{info.row.original.modifiedBy}</p></div>
      },
      {
        id: 'modifiedOn',
        accessorKey: 'modifiedOn',
        header: 'Modified On',
        enableSorting: false,
        cell: (info) => <p className="text-muted-foreground">{info.row.original.modifiedOn}</p>,
      },
    ],
    [],
  )

  return (
    <>
      {/* table: */}
      {process.changes && process.changes.length > 0 ? (
        <div className="table-light overflow-auto">
          <DataTable columns={columns} data={process.changes || []} />
        </div>
      ) : (
        <></>
      )}
    </>
  )
}
export default RecordedChangesTab
