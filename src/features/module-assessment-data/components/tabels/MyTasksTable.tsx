import { useMemo } from 'react'
import { Eye } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'

import { Button } from '@/shared/components/ui/button'
import DataTable from '@features/module-process-catalog/components/data-table/DataTable'
import {
  ProcessInfoCell,
  StageProgressCell,
  StatusBadgeCell,
  type CatalogStatus,
  UserBadgeCell,
} from '@features/module-process-catalog/components/cells'

import type { TaskItem } from '@features/module-assessment-data/types/my-tasks'
import { useGetMyTasks } from '@features/module-assessment-data/hooks/useGetMyTasks'
// import { useCatalogNavStore } from '@features/module-process-catalog/store/useCatalogNavStore'

 

const MyTasksTable = () => {
  const { data: tasks, isLoading, isError } = useGetMyTasks()
  // const navigateToProcess = useCatalogNavStore((s) => s.navigateToProcess)
  const columns = useMemo<ColumnDef<TaskItem, unknown>[]>(
    () => [
      {
        id: 'processName',
        accessorKey: 'processName',
        header: 'Process Name',
        size: 200,
        meta: { isDivider: true },
        cell: (info) => {
          if (info.row.depth > 0) return null
          const row = info.row.original
          return <ProcessInfoCell processName={row.processName} requestId={row.requestId} />
        },
      },
  
      {
        id: 'domain',
        accessorKey: 'domain',
        header: 'Domain',
        size: 150,
        cell: (info) => {
          if (info.row.depth > 0) return null
          return (
            <div className="flex min-h-[40px] flex-col justify-center">
              <span className="block max-w-[120px] font-normal break-words whitespace-normal text-[#687076]">
                {String(info.getValue())}
              </span>
            </div>
          )
        },
      },
      {
        id: 'groupCompany',
        accessorKey: 'groupCompany',
        header: 'Group Company',
        size: 180,
        cell: (info) => {
          if (info.row.depth > 0) return null
          const row = info.row.original
          return <span className="text-foreground text-sm">{row.groupCompany}</span>
        }
      },
      {
        id: 'requester',
        accessorKey: 'requester',
        header: 'Requester',
        size: 160,
        cell: (info) => {
          if (info.row.depth > 0) return null
          return <UserBadgeCell name={String(info.getValue())} />
        },
      },
      {
        id: 'status',
        accessorKey: 'status',
        header: 'Status',
        size: 150,
        cell: (info) => {
          if (info.row.depth > 0) return null
          return <StatusBadgeCell status={info.getValue() as CatalogStatus} />
        },
      },
      {
        id: 'returnComment',
        accessorKey: 'returnComment',
        header: 'Return Comment',
        size: 180,
        cell: (info) => {
          if (info.row.depth > 0) return null
          return <span className="text-foreground text-sm">{String(info.getValue() ?? '—')}</span>
        },
      },
      {
        id: 'stage',
        header: 'Process Stage',
        size: 280,
        cell: (info) => {
          if (info.row.depth > 0) return null
          const row = info.row.original
          return (
            <StageProgressCell
              currentStep={row.stageCurrent}
              totalSteps={row.stageTotal}
              statusText={row.stageText}
              active
            />
          )
        },
      },
       {
        id: 'changeName',
        header: 'FIELD Name',
        size: 180,
        cell: (info) => {
          if (info.row.depth === 0) return null
          const change = info.row.original.changes?.[0]
          return <span className="text-foreground text-sm">{change?.name ?? '—'}</span>
        },
      },
    
      {
        id: 'oldValue',
        header: 'Old Value',
        size: 130,
        cell: (info) => {
          if (info.row.depth === 0) return null
          const change = info.row.original.changes?.[0]
          return <span className="text-muted-foreground text-sm">{change?.oldValue ?? '—'}</span>
        },
      },
      {
        id: 'newValue',
        header: 'New Value',
        size: 200,
        cell: (info) => {
          if (info.row.depth === 0) return null
          const change = info.row.original.changes?.[0]
          return <span className="text-foreground text-sm">{change?.newValue ?? '—'}</span>
        },
      },
      {
        id: 'comment',
        header: 'field Comment',
        size: 110,
        cell: (info) => {
          if (info.row.depth === 0) return null
          const change = info.row.original.changes?.[0]
          return <span className="text-foreground text-sm">{change?.comment ?? '—'}</span>
        },
      },
      {
        id: 'actionRequired',
        accessorKey: 'actionRequired',
        header: 'Action Required',
        size: 180,
        cell: (info) => {
          if (info.row.depth > 0) return null
          return <span className="text-foreground text-sm">{String(info.getValue() ?? '—')}</span>
        },
      },
      {
        id: 'submittedOn',
        accessorKey: 'submittedOn',
        header: 'Submitted On',
        size: 130,
        cell: (info) => {
          if (info.row.depth > 0) return null
          return <span className="text-foreground text-sm">{String(info.getValue() ?? '—')}</span>
        },
      },
      {
        id: 'goToAffect',
        header: 'Go To Affected Record',
        size: 120,
        meta: { multiline: true },
        cell: (info) => {
          if (info.row.depth > 0) return null
          const row = info.row.original
          return (
            <div className="flex justify-center">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="text-muted-foreground rounded-full"
                disabled={!row.processId}
                aria-label="Go to affected record"
                onClick={() =>{} /* row.processId && navigateToProcess(row.processId) */}
               // onClick={() => row.processId && navigateToProcess(row.processId)}
              >
                <Eye className="size-4" />
              </Button>
            </div>
          )
        },
      },
    ],
    [],
  )

  if (isError) {
    return (
      <p className="text-destructive px-1 py-4 text-sm">
        Failed to load tasks. Please refresh and try again.
      </p>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-3 py-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="bg-muted h-14 w-full animate-pulse rounded-xl" />
        ))}
      </div>
    )
  }

  return (
    <DataTable
      columns={columns}
      data={tasks ?? []}
      density="comfortable"
      enableColumnDnd={false}
      enableSorting={false}
      initialColumnPinning={{ left: ['processName'] }}
      getSubRows={(row) => row.subRows}
      tableMeta={{ rowDividers: true }}
    />
  )
}

export default MyTasksTable
