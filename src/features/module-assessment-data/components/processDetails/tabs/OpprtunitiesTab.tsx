import DataTable from '@/shared/components/data-table/DataTable'
import type { ColumnDef } from '@tanstack/react-table'
import { useMemo } from 'react'


interface oppRows {
  opportunity: string
  id: string
  description?: string
  domain?: string
}

const OpprtunitiesTab = (props: any) => {
  const { process } = props


  const columns = useMemo<ColumnDef<oppRows, unknown>[]>(() => [
    {
      id: 'opportunity',
      accessorKey: 'opportunity',
      header: 'Opportunity',
      size: 250,
      enableSorting: false,
      cell: (info) => <div><p className='text-foreground'>{info.row.original.opportunity}</p><span className='text-muted-foreground'>{info.row.original.id}</span></div>,
    },
    {
      id: 'description',
      accessorKey: 'description',
      header: 'Description',
      size: 650,
      enableSorting: false,
      cell: (info) => <p className='text-muted-foreground text-wrap'>{info.row.original.description}</p>,
    },
    {
      id: 'domain',
      accessorKey: 'domain',
      header: 'Domain',
      // size: 250,
      enableSorting: false,
      cell: (info) => <p className='text-muted-foreground'>{info.row.original.domain}</p>,
    },
  ], [])




  return (
    <>
      {/* Tag */}
      <span className="bg-sidebar-accent absolute top-2 right-2 mt-[-18px] rounded px-2 py-1 text-xs">
        Read only
      </span>
      {/* table: */}
      {process.opportunities && process.opportunities.length>0 ?
       <div className="table-light ">
            <DataTable
        columns={columns}
        data={process.opportunities || []}
        />
       </div>
    
        :<></>
      }
    
     
    </>
  )
}
export default OpprtunitiesTab
