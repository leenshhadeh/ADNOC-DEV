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
import LevelsIcon from '@/assets/Levels.svg?react'

import type { TaskItem } from '@features/module-process-catalog/types/my-tasks'
import { MY_TASKS } from '@features/module-process-catalog/constants/my-tasks'

const LevelCell = ({ level }: { level: string }) => {
  return (
    <div className="text-foreground flex items-center gap-1 text-start text-sm font-medium">
      <LevelsIcon />
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
        size: 200,
        meta: { isDivider: true },
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
        size: 80,
        cell: (info) => {
          if (info.row.depth > 0) return null
          return <LevelCell level={String(info.getValue())} />
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
        id: 'returnedBy',
        accessorKey: 'returnedBy',
        header: 'Returned By',
        size: 160,
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
        size: 180,
        cell: (info) => {
          if (info.row.depth > 0) return null
          return <span className="text-foreground text-sm">{String(info.getValue() ?? '—')}</span>
        },
      },
      {
        id: 'changeName',
        header: 'Name',
        size: 180,
        cell: (info) => {
          if (info.row.depth === 0) return null
          const change = info.row.original.changes?.[0]
          return <span className="text-foreground text-sm">{change?.name ?? '—'}</span>
        },
      },
      {
        id: 'changeType',
        header: 'Change Type',
        size: 110,
        cell: (info) => {
          if (info.row.depth === 0) return null
          const change = info.row.original.changes?.[0]
          return <span className="text-foreground text-sm">{change?.changeType ?? '—'}</span>
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
        header: 'Go To',
        size: 60,
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
      initialColumnPinning={{ left: ['processName'] }}
      getSubRows={(row) => row.subRows}
      tableMeta={{ rowDividers: true }}
    />
  )
}

export default MyTasksTable
