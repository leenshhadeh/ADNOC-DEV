import { useMemo } from 'react'
import { Eye } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'

import { Button } from '@/shared/components/ui/button'
import DataTable from '../data-table/DataTable'
import {
  ProcessInfoCell,
  StageProgressCell,
  StatusBadgeCell,
  type CatalogStatus,
  UserBadgeCell,
} from '../cells'

export interface ChangeRecord {
  name: string
  changeType: string
  oldValue: string
  newValue: string
}

export interface TaskItem {
  id: string
  processName: string
  requestId: string
  level: string
  domain: string
  stageCurrent: number
  stageTotal: number
  stageText: string
  requester: string
  status: CatalogStatus
  returnComment?: string
  returnedBy?: string
  actionRequired?: string
  changes?: ChangeRecord[]
  submittedOn?: string
  /** Derived from `changes` — drives TanStack sub-row expansion. */
  subRows?: TaskItem[]
}

function makeChangeSubRow(parentId: string, change: ChangeRecord, index: number): TaskItem {
  return {
    id: `${parentId}-c${index}`,
    processName: '',
    requestId: '',
    level: '',
    domain: '',
    stageCurrent: 0,
    stageTotal: 0,
    stageText: '',
    requester: '',
    status: 'Published',
    changes: [change],
  }
}

function withSubRows(item: Omit<TaskItem, 'subRows'>): TaskItem {
  return {
    ...item,
    subRows: (item.changes ?? []).map((c, i) => makeChangeSubRow(item.id, c, i)),
  }
}

const taskItems: TaskItem[] = [
  withSubRows({
    id: 'task-1',
    processName: 'Regional studies',
    requestId: '9377353',
    level: 'L 3',
    domain: 'Corporate Communications',
    stageCurrent: 1,
    stageTotal: 3,
    stageText: 'Pending updates',
    requester: 'Maryam Al Shamsi',
    status: 'Returned draft',
    returnComment: 'Please revise section 2',
    returnedBy: 'Ahmed Al Mansoori',
    actionRequired: 'Review and update',
    submittedOn: '08 Apr 2024',
    changes: [
      { name: 'Process creation', changeType: 'Create', oldValue: '-', newValue: 'L3 created' },
      {
        name: 'Process name',
        changeType: 'Update',
        oldValue: '-',
        newValue: 'Play-based exploration (concept) 2 (Dashboard)',
      },
      {
        name: 'Process hierarchy',
        changeType: 'Update',
        oldValue: '-',
        newValue: 'Domain / Exploration & Planning',
      },
      {
        name: 'Process hierarchy',
        changeType: 'Update',
        oldValue: '-',
        newValue: 'L1 / Exploration',
      },
      {
        name: 'Process hierarchy',
        changeType: 'Update',
        oldValue: '-',
        newValue: 'L2 / Regional studies',
      },
      {
        name: 'Process description',
        changeType: 'Update',
        oldValue: '-',
        newValue: 'Creating a comprehensive Basin Modeling concept i...',
      },
      {
        name: 'Process parent name (L2)',
        changeType: 'Update',
        oldValue: 'Regional studies',
        newValue: 'Studies',
      },
    ],
  }),
  withSubRows({
    id: 'task-2',
    processName: 'Define Budget and Schedule',
    requestId: '9377354',
    level: 'L 3',
    domain: 'Corporate Communications',
    stageCurrent: 1,
    stageTotal: 3,
    stageText: 'Pending updates',
    requester: 'Maryam Al Shamsi',
    status: 'Returned draft',
    returnComment: 'Budget figures need review',
    returnedBy: 'Sara Al Mazrouei',
    actionRequired: 'Re-submit with corrections',
    submittedOn: '14 Jan 2026',
    changes: [
      { name: 'Budget Plan', changeType: 'Edit', oldValue: '1,200,000', newValue: '1,500,000' },
      { name: 'Schedule', changeType: 'Update', oldValue: 'Q1 2026', newValue: 'Q2 2026' },
    ],
  }),
  withSubRows({
    id: 'task-3',
    processName: 'Develop external communication',
    requestId: '9377355',
    level: 'L 3',
    domain: 'Corporate Communications',
    stageCurrent: 1,
    stageTotal: 3,
    stageText: 'Pending updates',
    requester: 'Maryam Al Shamsi',
    status: 'Returned draft',
    returnComment: 'Tone needs adjustment',
    returnedBy: 'Khalid Al Hamadi',
    actionRequired: 'Revise communication plan',
    submittedOn: '15 Jan 2026',
    changes: [{ name: 'Comm. Plan', changeType: 'Edit', oldValue: 'V1', newValue: 'V2' }],
  }),
  withSubRows({
    id: 'task-4',
    processName: 'Prepare media materials',
    requestId: '9377356',
    level: 'L 3',
    domain: 'Corporate Communications',
    stageCurrent: 1,
    stageTotal: 3,
    stageText: 'Pending updates',
    requester: 'Maryam Al Shamsi',
    status: 'Returned draft',
    returnComment: 'Missing brand guidelines',
    returnedBy: 'Noura Al Dhaheri',
    actionRequired: 'Attach brand assets',
    submittedOn: '16 Jan 2026',
    changes: [{ name: 'Media Pack', changeType: 'Addition', oldValue: '—', newValue: 'Attached' }],
  }),
  withSubRows({
    id: 'task-5',
    processName: 'Defining brand performance',
    requestId: '9377357',
    level: 'L 3',
    domain: 'Corporate Communications',
    stageCurrent: 1,
    stageTotal: 3,
    stageText: 'Pending updates',
    requester: 'Maryam Al Shamsi',
    status: 'Returned draft',
    returnComment: 'KPIs not aligned',
    returnedBy: 'Omar Al Ketbi',
    actionRequired: 'Align KPIs with strategy',
    submittedOn: '17 Jan 2026',
    changes: [
      { name: 'KPI Dashboard', changeType: 'Edit', oldValue: 'Q3 Target', newValue: 'Q4 Target' },
    ],
  }),
]

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
      data={taskItems}
      density="comfortable"
      enableColumnDnd={false}
      enableSorting={false}
      getSubRows={(row) => row.subRows}
    />
  )
}

export default MyTasksTable
