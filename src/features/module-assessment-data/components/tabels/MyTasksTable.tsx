import { useMemo, useState } from 'react'
import {
  ArrowLeftRight,
  Check,
  Eye,
  ExternalLink,
  MoreVertical,
  UserRoundCog,
  X,
} from 'lucide-react'
import type { ColumnDef, RowSelectionState } from '@tanstack/react-table'

import { Button } from '@/shared/components/ui/button'
import { Checkbox } from '@/shared/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
import DataTable from '@/shared/components/data-table/DataTable'
import {
  ProcessInfoCell,
  StageProgressCell,
  StatusBadgeCell,
  type CatalogStatus,
  UserBadgeCell,
} from '@/shared/components/cells'
import { hasPermission } from '@/shared/lib/permissions'
import { useUserStore } from '@/shared/auth/useUserStore'

import type { TaskItem } from '@features/module-assessment-data/types/my-tasks'
import { useGetMyTasks } from '@features/module-assessment-data/hooks/useGetMyTasks'
import TaskDetailsSheet from '@features/module-assessment-data/components/sidePanels/TaskDetailsSheet'
import { DOMAINS_DATA } from '@features/module-process-catalog/constants/domains-data'
// import { useCatalogNavStore } from '@features/module-process-catalog/store/useCatalogNavStore'

export type TaskRowAction = 'approve' | 'return' | 'reject' | 'request-endorsement'

interface MyTasksTableProps {
  isBulkMode?: boolean
  rowSelection?: RowSelectionState
  onRowSelectionChange?: (
    updater: RowSelectionState | ((prev: RowSelectionState) => RowSelectionState),
  ) => void
  onRowAction?: (task: TaskItem, action: TaskRowAction) => void
}

const MyTasksTable = ({
  isBulkMode = false,
  rowSelection,
  onRowSelectionChange,
  onRowAction,
}: MyTasksTableProps) => {
  const { data: tasks, isLoading, isError } = useGetMyTasks()
  const userRole = useUserStore((s) => s.user.role)
  // const navigateToProcess = useCatalogNavStore((s) => s.navigateToProcess)

  const canApprove = hasPermission(userRole, 'APPROVE_REQUEST')
  const canReturn = hasPermission(userRole, 'RETURN_REQUEST')

  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const columns = useMemo<ColumnDef<TaskItem, unknown>[]>(
    () => [
      {
        id: 'processName',
        accessorKey: 'processName',
        header: 'Process Name',
        size: 320,
        meta: { isDivider: true },
        cell: (info) => {
          if (info.row.depth > 0) return null
          const row = info.row.original
          return (
            <div className="flex w-full items-center gap-2">
              <button
                type="button"
                className="min-w-0 flex-1 text-start"
                onClick={() => {
                  setSelectedTask(row)
                  setIsSheetOpen(true)
                }}
              >
                <ProcessInfoCell
                  processName={row.processName}
                  requestId={row.requestId}
                  processCode={row.processCode}
                />
              </button>
              {isBulkMode ? (
                <Checkbox
                  className="shrink-0"
                  checked={info.row.getIsSelected()}
                  onCheckedChange={info.row.getToggleSelectedHandler()}
                  aria-label={`Select ${row.processName}`}
                />
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      className="text-muted-foreground shrink-0 rounded-full"
                      aria-label="Row actions"
                    >
                      <MoreVertical className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-56 rounded-2xl bg-[#F1F3F5] p-0 shadow-[0px_10px_30px_rgba(0,0,0,0.2)]"
                  >
                    <DropdownMenuItem
                      className="gap-4 px-4 py-2"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedTask(row)
                        setIsSheetOpen(true)
                      }}
                    >
                      <Eye className="size-4 shrink-0" />
                      View change details
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="my-0" />
                    <DropdownMenuItem className="gap-4 px-4 py-2" disabled={!row.processId}>
                      <ExternalLink className="size-4 shrink-0" />
                      Go to record
                    </DropdownMenuItem>
                    {canApprove && (
                      <>
                        <DropdownMenuSeparator className="my-0" />
                        <DropdownMenuItem
                          className="gap-4 px-4 py-2"
                          onClick={() => onRowAction?.(row, 'request-endorsement')}
                        >
                          <UserRoundCog className="size-4 shrink-0" />
                          Request endorsement
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="my-0" />
                        <DropdownMenuItem
                          className="gap-4 px-4 py-2"
                          onClick={() => onRowAction?.(row, 'approve')}
                        >
                          <Check className="size-4 shrink-0" />
                          Approve
                        </DropdownMenuItem>
                      </>
                    )}
                    {canReturn && (
                      <>
                        <DropdownMenuSeparator className="my-0" />
                        <DropdownMenuItem
                          className="gap-4 px-4 py-2"
                          onClick={() => onRowAction?.(row, 'return')}
                        >
                          <ArrowLeftRight className="size-4 shrink-0" />
                          Return
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator className="my-0" />
                    <DropdownMenuItem
                      className="gap-4 px-4 py-2 text-[#EB3865]"
                      onClick={() => onRowAction?.(row, 'reject')}
                    >
                      <X className="size-4 shrink-0" />
                      Reject
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          )
        },
      },

      {
        id: 'domain',
        accessorKey: 'domain',
        header: 'Domain',
        size: 150,
        cell: (info) => {
          if (info.row.depth > 0) return null
          const domainId = String(info.getValue())
          const domainName = DOMAINS_DATA.find((d) => d.id === domainId)?.name ?? domainId
          return (
            <div className="flex min-h-[40px] flex-col justify-center">
              <span className="block max-w-[120px] font-normal break-words whitespace-normal text-[#687076]">
                {domainName}
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
    ],
    [canApprove, canReturn, isBulkMode, onRowAction],
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
    <>
      <DataTable
        columns={columns}
        data={tasks ?? []}
        density="comfortable"
        enableColumnDnd={false}
        enableSorting={true}
        initialColumnPinning={{ left: ['processName'] }}
        getSubRows={(row) => row.subRows}
        tableMeta={{ rowDividers: true }}
        rowSelection={isBulkMode ? rowSelection : undefined}
        onRowSelectionChange={isBulkMode ? onRowSelectionChange : undefined}
        getRowId={(row) => row.id}
      />
      <TaskDetailsSheet task={selectedTask} open={isSheetOpen} onOpenChange={setIsSheetOpen} />
    </>
  )
}

export default MyTasksTable
