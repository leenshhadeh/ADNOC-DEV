import { useCallback, useEffect, useMemo, useState } from 'react'
import { Check, CornerDownLeft, Eye, MoreVertical, X as XIcon } from 'lucide-react'
import type { ColumnDef, RowSelectionState } from '@tanstack/react-table'

import { Button } from '@/shared/components/ui/button'
import { Checkbox } from '@/shared/components/ui/checkbox'
import DataTable from '@/shared/components/data-table/DataTable'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
import {
  ProcessInfoCell,
  StageProgressCell,
  StatusBadgeCell,
  type CatalogStatus,
  UserBadgeCell,
} from '@features/module-process-catalog/components/cells'
import {
  ApproveModal,
  ReturnModal,
  RejectModal,
  SuccessToast,
} from '@features/module-process-catalog/components/modals'
import LevelsIcon from '@/assets/icons/Levels.svg?react'

import TaskDetailsSheet from './TaskDetailsSheet'

import type { TaskItem } from '@features/module-process-catalog/types/my-tasks'
import { useGetMyTasks } from '@features/module-process-catalog/hooks/useGetMyTasks'
import { useCatalogNavStore } from '@features/module-process-catalog/store/useCatalogNavStore'
import {
  approveTask,
  returnTask,
  rejectTask,
} from '@features/module-process-catalog/api/taskActionService'

const LevelCell = ({ level }: { level: string }) => {
  return (
    <div className="text-foreground flex items-center gap-1 text-start text-sm font-medium">
      <LevelsIcon />
      {level}
    </div>
  )
}

interface MyTasksTableProps {
  isBulkMode?: boolean
  rowSelection?: RowSelectionState
  onRowSelectionChange?: (
    updater: RowSelectionState | ((prev: RowSelectionState) => RowSelectionState),
  ) => void
}

const MyTasksTable = ({
  isBulkMode = false,
  rowSelection,
  onRowSelectionChange,
}: MyTasksTableProps) => {
  const { data: tasks, isLoading, isError } = useGetMyTasks()
  const navigateToProcess = useCatalogNavStore((s) => s.navigateToProcess)
  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  // action modal state
  const [activeModal, setActiveModal] = useState<'approve' | 'return' | 'reject' | null>(null)
  const [actionTask, setActionTask] = useState<TaskItem | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isActionLoading, setIsActionLoading] = useState(false)

  // auto-dismiss success toast
  useEffect(() => {
    if (!successMessage) return
    const t = setTimeout(() => setSuccessMessage(null), 4000)
    return () => clearTimeout(t)
  }, [successMessage])

  const handleOpenDetails = (task: TaskItem) => {
    setSelectedTask(task)
    setIsDetailsOpen(true)
  }

  const openActionModal = useCallback((task: TaskItem, action: 'approve' | 'return' | 'reject') => {
    setActionTask(task)
    setActiveModal(action)
  }, [])

  const handleTaskAction = async (
    taskId: string,
    action: 'approve' | 'reject' | 'return',
    reason?: string,
  ) => {
    setIsActionLoading(true)
    try {
      let result
      switch (action) {
        case 'approve':
          result = await approveTask(taskId)
          break
        case 'return':
          result = await returnTask(taskId, { reason: reason ?? '' })
          break
        case 'reject':
          result = await rejectTask(taskId, { reason: reason ?? '' })
          break
      }
      setSuccessMessage(result.message)
    } catch (error) {
      console.error(`Task action failed:`, error)
    } finally {
      setIsActionLoading(false)
      setActiveModal(null)
      setActionTask(null)
    }
  }

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
          const isSelected = info.row.getIsSelected()
          return (
            <div className="flex w-full items-center gap-2">
              {isBulkMode && (
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={(checked) => info.row.toggleSelected(!!checked)}
                  onClick={(e) => e.stopPropagation()}
                  aria-label={`Select ${row.processName}`}
                  className="shrink-0"
                />
              )}
              {!isBulkMode && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="shrink-0 rounded-full text-[#687076] hover:text-[#151718]"
                      onClick={(e) => e.stopPropagation()}
                      aria-label="Row actions"
                    >
                      <MoreVertical className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    sideOffset={4}
                    className="w-56 overflow-hidden rounded-2xl border-0 bg-[#151718] p-0 shadow-[0px_10px_30px_0px_rgba(0,0,0,0.2)]"
                  >
                    <DropdownMenuItem
                      className="cursor-pointer gap-4 bg-[#F1F3F5] px-4 py-2 text-base font-normal text-[#151718] focus:bg-[#E8EAED]"
                      onClick={() => handleOpenDetails(row)}
                    >
                      <Eye className="size-4 shrink-0" />
                      View change details
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="m-0 h-px bg-[#DFE3E6]" />
                    <DropdownMenuItem
                      className="cursor-pointer gap-4 bg-[#F1F3F5] px-4 py-2 text-base font-normal text-[#151718] focus:bg-[#E8EAED]"
                      disabled={!row.processId}
                      onClick={() => row.processId && navigateToProcess(row.processId)}
                    >
                      <Eye className="size-4 shrink-0" />
                      Go to affected record
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="m-0 h-px bg-[#DFE3E6]" />
                    <DropdownMenuItem
                      className="cursor-pointer gap-4 bg-[#F1F3F5] px-4 py-2 text-base font-normal text-[#151718] focus:bg-[#E8EAED]"
                      onClick={() => openActionModal(row, 'approve')}
                    >
                      <Check className="size-4 shrink-0" />
                      Approve
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="m-0 h-px bg-[#DFE3E6]" />
                    <DropdownMenuItem
                      className="cursor-pointer gap-4 bg-[#F1F3F5] px-4 py-2 text-base font-normal text-[#151718] focus:bg-[#E8EAED]"
                      onClick={() => openActionModal(row, 'return')}
                    >
                      <CornerDownLeft className="size-4 shrink-0" />
                      Return
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="m-0 h-px bg-[#DFE3E6]" />
                    <DropdownMenuItem
                      className="cursor-pointer gap-4 bg-[#F1F3F5] px-4 py-2 text-base font-normal text-[#EB3865] focus:bg-[#E8EAED]"
                      onClick={() => openActionModal(row, 'reject')}
                    >
                      <XIcon className="size-4 shrink-0 text-[#EB3865]" />
                      Reject
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              <button
                type="button"
                className="focus-visible:ring-ring min-w-0 flex-1 cursor-pointer text-start outline-none focus-visible:ring-2"
                onClick={() => handleOpenDetails(row)}
              >
                <ProcessInfoCell processName={row.processName} requestId={row.requestId} />
              </button>
            </div>
          )
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
                onClick={() => row.processId && navigateToProcess(row.processId)}
              >
                <Eye className="size-4" />
              </Button>
            </div>
          )
        },
      },
    ],
    [isBulkMode],
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
        enableSorting={false}
        initialColumnPinning={{ left: ['processName'] }}
        getSubRows={(row) => row.subRows}
        getRowId={(row) => row.id}
        rowSelection={rowSelection}
        onRowSelectionChange={onRowSelectionChange}
        tableMeta={{ rowDividers: true, isBulkMode }}
      />
      <TaskDetailsSheet
        task={selectedTask}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        onAction={handleTaskAction}
      />

      {/* Single-row action modals */}
      <ApproveModal
        open={activeModal === 'approve'}
        onOpenChange={(open) => !open && setActiveModal(null)}
        title={`Approve ${actionTask?.processName ?? ''}`}
        description="The request will be forwarded for Quality Manager Review. Are you sure you want to approve it?"
        onConfirm={() => actionTask && handleTaskAction(actionTask.id, 'approve')}
      />
      <ReturnModal
        open={activeModal === 'return'}
        onOpenChange={(open) => !open && setActiveModal(null)}
        title={`Return ${actionTask?.processName ?? ''}`}
        description="The request will be marked as Returned. Please add the return reason below."
        onConfirm={(reason) => actionTask && handleTaskAction(actionTask.id, 'return', reason)}
      />
      <RejectModal
        open={activeModal === 'reject'}
        onOpenChange={(open) => !open && setActiveModal(null)}
        title={`Reject ${actionTask?.processName ?? ''}`}
        description="The request will be marked as Rejected. Please add the reject reason below."
        requireReason
        onConfirm={(reason) => actionTask && handleTaskAction(actionTask.id, 'reject', reason)}
      />

      {/* Success toast */}
      <SuccessToast
        open={!!successMessage}
        message={successMessage ?? ''}
        onClose={() => setSuccessMessage(null)}
      />
    </>
  )
}

export default MyTasksTable
