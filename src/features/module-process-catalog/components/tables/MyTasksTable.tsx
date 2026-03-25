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

import type { TaskItem } from '@features/module-process-catalog/types/my-tasks'
import { MY_TASKS } from '@features/module-process-catalog/constants/my-tasks'

const LevelCell = ({ level }: { level: string }) => {
  return (
    <div className="text-foreground flex items-center gap-2 text-start text-[1.02rem] font-medium">
      <span className="text-muted-foreground inline-flex h-5 items-end gap-0.5" aria-hidden="true">
        <span className="h-4 w-1 rounded-sm bg-current" />
        <span className="h-5 w-1 rounded-sm bg-current" />
        <span className="h-3 w-1 rounded-sm bg-current" />
      </span>
      {level}
    </div>
  )
}

const MyTasksTable = () => {
  const columns = useMemo<ColumnDef<TaskItem, unknown>[]>(
    () => [
      {
        id: 'processName',
        accessorKey: 'processName',
        header: 'Process Name',
        size: 240,
        cell: (info) => {
          if (info.row.depth > 0) return null
          const row = info.row.original
          return <ProcessInfoCell processName={row.processName} requestId={row.requestId} />
        },
      },
      {
        id: 'level',
        accessorKey: 'level',
        header: 'Level',
        cell: (info) => {
          if (info.row.depth > 0) return null
          return <LevelCell level={String(info.getValue())} />
        },
      },
      {
        id: 'domain',
        accessorKey: 'domain',
        header: 'Domain',
        cell: (info) => {
          if (info.row.depth > 0) return null
          return <span className="text-foreground text-[1.02rem]">{String(info.getValue())}</span>
        },
      },
      {
        id: 'stage',
        header: 'Process Stage',
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
        id: 'requester',
        accessorKey: 'requester',
        header: 'Requester',
        cell: (info) => {
          if (info.row.depth > 0) return null
          return <UserBadgeCell name={String(info.getValue())} />
        },
      },
      {
        id: 'status',
        accessorKey: 'status',
        header: 'Status',
        cell: (info) => {
          if (info.row.depth > 0) return null
          return <StatusBadgeCell status={info.getValue() as CatalogStatus} />
        },
      },
      {
        id: 'returnComment',
        accessorKey: 'returnComment',
        header: 'Return Comment',
        size: 200,
        cell: (info) => {
          if (info.row.depth > 0) return null
          return <span className="text-foreground text-sm">{String(info.getValue() ?? '—')}</span>
        },
      },
      {
        id: 'returnedBy',
        accessorKey: 'returnedBy',
        header: 'Returned By',
        cell: (info) => {
          if (info.row.depth > 0) return null
          return info.getValue() ? (
            <UserBadgeCell name={String(info.getValue())} />
          ) : (
            <span className="text-muted-foreground text-sm">—</span>
          )
        },
      },
      {
        id: 'actionRequired',
        accessorKey: 'actionRequired',
        header: 'Action Required',
        size: 200,
        cell: (info) => {
          if (info.row.depth > 0) return null
          return <span className="text-foreground text-sm">{String(info.getValue() ?? '—')}</span>
        },
      },
      {
        id: 'changeName',
        header: 'Name',
        size: 200,
        cell: (info) => {
          if (info.row.depth === 0) return null
          const change = info.row.original.changes?.[0]
          return <span className="text-foreground text-sm">{change?.name ?? '—'}</span>
        },
      },
      {
        id: 'changeType',
        header: 'Change Type',
        size: 120,
        cell: (info) => {
          if (info.row.depth === 0) return null
          const change = info.row.original.changes?.[0]
          return <span className="text-foreground text-sm">{change?.changeType ?? '—'}</span>
        },
      },
      {
        id: 'oldValue',
        header: 'Old Value',
        size: 140,
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
        id: 'submittedOn',
        accessorKey: 'submittedOn',
        header: 'Submitted On',
        size: 140,
        cell: (info) => {
          if (info.row.depth > 0) return null
          return <span className="text-foreground text-sm">{String(info.getValue() ?? '—')}</span>
        },
      },
      {
        id: 'goToAffect',
        header: 'Go To',
        size: 80,
        cell: (info) => {
          if (info.row.depth === 0) return null
          return (
            <Button type="button" variant="ghost" size="icon-sm" className="text-primary">
              <Eye className="size-4" />
            </Button>
          )
        },
      },
    ],
    [],
  )

  return (
    <DataTable
      columns={columns}
      data={MY_TASKS}
      density="comfortable"
      enableColumnDnd={false}
      enableSorting={false}
      getSubRows={(row) => row.subRows}
    />
  )
}

export default MyTasksTable
