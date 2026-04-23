import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Check,
  Download,
  FileText,
  Info,
  Loader2,
  MessageSquare,
  RotateCcw,
  Save,
  Settings2,
  Table2,
  Upload,
  X as XIcon,
} from 'lucide-react'
import ViewToggle from '@/shared/components/ViewToggle'
import type { RowSelectionState } from '@tanstack/react-table'
import ModuleToolbar from '@/shared/components/ModuleToolbar'
import type { ToolbarAction } from '@/shared/components/ModuleToolbar'
import { SuccessToast } from '@/shared/components/SuccessToast'
import { hasPermission } from '@/shared/lib/permissions'
import { useUserStore } from '@/shared/auth/useUserStore'
import { ASSESSMENT_BULK_ACTIONS, ASSESSMENT_TABS } from '../constants/assessment-toolbar'
import { flattenAssessmentData } from './tabels/ProcessDataTable'
import type { BulkCellAction, BulkCellOperation } from '../types/process'
import { useAssessmentExport } from '../hooks/useAssessmentExport'
import { useMyTasksExport } from '../hooks/useMyTasksExport'
import ProcessesMenu, {
  type ProcessViewOption,
  type ProcessViewOptionId,
} from '../../../shared/components/ProcessesMenu'
import MyTasksTable from './tabels/MyTasksTable'
import type { TaskRowAction } from './tabels/MyTasksTable'
import type { TaskItem } from '../types/my-tasks'
import SubmittedRequestsTable from './tabels/SubmittedRequestsTable'
import ProcessDataTable from './tabels/ProcessDataTable'
import ProcessDataReport from './tabels/ProcessDataReport'
import AssessmentBulkActionBar from './AssessmentBulkActionBar'
import TaskBulkActionBar from './TaskBulkActionBar'
import {
  BulkEditModal,
  BulkCommentModal,
  CopyAssessmentDataModal,
  MarkAsReviewedModal,
} from './AssessmentBulkModals'
import {
  ApproveModal as ApproveTasksModal,
  ReturnModal as ReturnTasksModal,
  RejectModal as RejectTasksModal,
} from '@/shared/components/modals'
import { RequestEndorsementModal } from './TaskBulkModals'
import FieldCommentSheet from './sidePanels/FieldCommentSheet'
import { bulkCellAction, copyAssessmentData } from '../api/processAssesmentService'
import {
  useApproveTask,
  useReturnTask,
  useRejectTask,
  useRequestEndorsement,
  useSaveTaskFieldComments,
  useBulkApproveTasks,
  useBulkReturnTasks,
  useBulkRejectTasks,
  useBulkRequestEndorsement,
} from '../hooks/useTaskActions'

import {
  useProcessFilters,
  applyProcessFilters,
} from '@features/module-assessment-data/hooks/useProcessFilters'
import { useProcessFilterDefinitions } from '../hooks/useProcessFilterDefinitions'
import ProcessFilterSheet from '@/features/module-process-catalog/components/ProcessFilterSheet'
import { DOMAINS_DATA } from '@/features/module-process-catalog/constants/domains-data'
import Breadcrumb from '@/shared/components/Breadcrumb'
import ManageColumnsSheet from './ManageColumnsSheet'
import { useAssessmentNavStore, type AssessmentTabValue } from '../store/useAssessmentNavStore'
import { useGetAssessmentProcess } from '@features/module-assessment-data/hooks/useGetAssessmentProcess'
import type { DomainItem } from '../types/process'
import type { FlatAssessmentRow } from '../types/process'

type ActiveModal = 'edit' | 'comment' | 'copy' | 'review' | null
type TaskModal = 'approve' | 'return' | 'reject' | 'request-endorsement' | null

const toSearchableText = (value: unknown): string => {
  if (value == null) return ''
  return String(value)
}

const filterAssessmentRowsBySearch = (rows: FlatAssessmentRow[], searchValue: string) => {
  const query = searchValue.trim().toLowerCase()
  if (!query) return rows
  return rows.filter((row) =>
    Object.values(row).some((value) => toSearchableText(value).toLowerCase().includes(query)),
  )
}

const AssessmentDataModule = () => {
  const { activeTab, setActiveTab } = useAssessmentNavStore()
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isManageColumnsOpen, setIsManageColumnsOpen] = useState(false)
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({})
  const [managedColumnOrder, setManagedColumnOrder] = useState<string[]>([])
  const [search, setSearch] = useState('')
  const [isBulkMode, setIsBulkMode] = useState(false)
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [l3Selection, setL3Selection] = useState<Set<string>>(new Set())
  const [isTaskBulkMode, setIsTaskBulkMode] = useState(false)
  const [taskRowSelection, setTaskRowSelection] = useState<RowSelectionState>({})
  const [activeModal, setActiveModal] = useState<ActiveModal>(null)
  const [taskModal, setTaskModal] = useState<TaskModal>(null)
  const [activeView, setActiveView] = useState<'table' | 'report'>('table')
  const [showExportToast, setShowExportToast] = useState(false)
  const [showTaskActionToast, setShowTaskActionToast] = useState(false)
  const [taskActionMessage, setTaskActionMessage] = useState('')
  const [singleActionTask, setSingleActionTask] = useState<TaskItem | null>(null)
  const [processView, setProcessView] = useState<ProcessViewOptionId>('published')

  // API:
  const { data, isLoading, isError, error } = useGetAssessmentProcess(processView)

  const userRole = useUserStore((s) => s.user.role)
  const canCommentOnField = hasPermission(userRole, 'COMMENT_ON_FIELD')
  const canApprove = hasPermission(userRole, 'APPROVE_REQUEST')
  const canReturn = hasPermission(userRole, 'RETURN_REQUEST')
  const canReject = hasPermission(userRole, 'REJECT_REQUEST')
  const hasTaskBulkActions = canApprove || canReturn || canReject

  const [isCommentMode, setIsCommentMode] = useState(false)
  const [commentSheetOpen, setCommentSheetOpen] = useState(false)
  const [commentSheetFieldName, setCommentSheetFieldName] = useState('')

  // ── Task action mutations ──────────────────────────────────────────────────
  const approveTaskMutation = useApproveTask()
  const returnTaskMutation = useReturnTask()
  const rejectTaskMutation = useRejectTask()
  const requestEndorsementMutation = useRequestEndorsement()
  const saveFieldCommentsMutation = useSaveTaskFieldComments()
  const bulkApproveMutation = useBulkApproveTasks()
  const bulkReturnMutation = useBulkReturnTasks()
  const bulkRejectMutation = useBulkRejectTasks()
  const bulkEndorsementMutation = useBulkRequestEndorsement()

  const { isExporting, exportRows } = useAssessmentExport()
  const { isExporting: isExportingTasks, exportTasks } = useMyTasksExport()
  const [dataSet, setDataSet] = useState<DomainItem[]>([])

  useEffect(() => {
    if (data) {
      setDataSet(data)
    }
    if (isError) {
      console.log('Error fetching Assessment data:', error)
    }
  }, [data])

  const tableData = useMemo(() => flattenAssessmentData(dataSet), [dataSet])
  const searchedData = useMemo(
    () => filterAssessmentRowsBySearch(tableData, search),
    [tableData, search],
  )

  // Global filters:-------------------------
  const globalFilterIds = ['domain', 'status']
  const filterDefs = useProcessFilterDefinitions(DOMAINS_DATA, searchedData)
  const { pending, applied, activePerSection, toggle, apply, reset } =
    useProcessFilters(globalFilterIds)
  const filteredData = useMemo(
    () => applyProcessFilters(searchedData, applied),
    [searchedData, applied],
  )

  const handleExport = async () => {
    if (activeTab === 'my-tasks') {
      await exportTasks()
    } else {
      await exportRows(filteredData)
    }
    setShowExportToast(true)
  }

  const currentIsExporting = activeTab === 'my-tasks' ? isExportingTasks : isExporting

  const defaultActions = useMemo<ToolbarAction[]>(
    () => [
      {
        id: 'manage-columns',
        label: 'Manage columns',
        icon: Settings2,
        onClick: () => setIsManageColumnsOpen(true),
      },
      { id: 'import', label: 'Import', icon: Upload },
      {
        id: 'export',
        label: currentIsExporting ? 'Exporting…' : 'Export',
        icon: currentIsExporting ? Loader2 : Download,
        disabled: currentIsExporting,
        onClick: handleExport,
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentIsExporting],
  )

  const myTasksActions = useMemo<ToolbarAction[]>(
    () =>
      isCommentMode
        ? [
            {
              id: 'save',
              label: 'Save',
              icon: Save,
              onClick: () => {
                if (singleActionTask) {
                  saveFieldCommentsMutation.mutate(
                    { taskId: singleActionTask.id },
                    {
                      onSuccess: () => {
                        setTaskActionMessage('Comments saved successfully.')
                        setShowTaskActionToast(true)
                      },
                    },
                  )
                }
              },
            },
            {
              id: 'approve-request',
              label: 'Approve request',
              icon: Check,
              onClick: () => setTaskModal('approve'),
            },
            {
              id: 'return-request',
              label: 'Return request',
              icon: RotateCcw,
              onClick: () => setTaskModal('return'),
            },
            {
              id: 'reject-request',
              label: 'Reject request',
              icon: XIcon,
              onClick: () => setTaskModal('reject'),
            },
          ]
        : [
            ...(canCommentOnField
              ? [
                  {
                    id: 'comment-on-field',
                    label: 'Comment on field',
                    icon: MessageSquare,
                    onClick: () => setIsCommentMode(true),
                  } satisfies ToolbarAction,
                ]
              : []),
            {
              id: 'export',
              label: isExportingTasks ? 'Exporting…' : 'Export',
              icon: isExportingTasks ? Loader2 : Download,
              disabled: isExportingTasks,
              onClick: handleExport,
            },
          ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isExportingTasks, canCommentOnField, isCommentMode],
  )

  // Map l3GroupId → l3ItemId for efficient lookup
  const l3GroupToItemId = useMemo(
    () => new Map(filteredData.map((row) => [row.l3GroupId, row.l3ItemId])),
    [filteredData],
  )

  /** Builds a typed BulkCellOperation[] from the current L3 + L4 selections */
  const buildBulkOps = useCallback(
    (
      action: BulkCellAction,
      extras?: { columnKey?: string; payload?: string },
    ): BulkCellOperation[] => {
      const l4Ops: BulkCellOperation[] = Object.keys(rowSelection).map((rowId) => ({
        rowId,
        level: 'l4' as const,
        action,
        ...extras,
      }))
      const l3Ops: BulkCellOperation[] = Array.from(l3Selection).map((groupId) => ({
        rowId: l3GroupToItemId.get(groupId) ?? groupId,
        level: 'l3' as const,
        action,
        ...extras,
      }))
      return [...l4Ops, ...l3Ops]
    },
    [rowSelection, l3Selection, l3GroupToItemId],
  )

  const selectedIds = [...Object.keys(rowSelection), ...Array.from(l3Selection)]
  const taskSelectedIds = Object.keys(taskRowSelection)

  const exitBulkMode = () => {
    setIsBulkMode(false)
    setRowSelection({})
    setL3Selection(new Set())
    setIsTaskBulkMode(false)
    setTaskRowSelection({})
    setIsCommentMode(false)
    setCommentSheetOpen(false)
    setCommentSheetFieldName('')
    setSingleActionTask(null)
  }

  const onChangeView = (option: ProcessViewOption) => {
    setProcessView(option.id)
  }

  return (
    <div className="flex h-full flex-col gap-0 overflow-hidden px-6">
      <Breadcrumb links={[{ title: 'Assessment Data Processes' }]} />

      {/* ── Title bar ──────────────────────────────────────────────────── */}
      <div className="flex items-center py-3">
        <h1 className="text-foreground text-2xl font-bold">Assessment Data Processes</h1>

        <ProcessesMenu onChange={onChangeView} />
      </div>

      {/* ── Tabs + search + filter + toolbar ──────────────────────────── */}
      <div className="flex items-center gap-2 py-3">
        <div className="flex-1">
          <ModuleToolbar
            tabs={ASSESSMENT_TABS}
            activeTab={activeTab}
            onTabChange={(tab) => {
              setActiveTab(tab as AssessmentTabValue)
              exitBulkMode()
            }}
            searchValue={search}
            onSearchChange={setSearch}
            bulkMode={
              activeTab === 'submittedRequests'
                ? undefined
                : activeTab === 'my-tasks'
                  ? hasTaskBulkActions
                    ? {
                        isActive: isTaskBulkMode,
                        selectedCount: taskSelectedIds.length,
                        onToggle: () => {
                          setIsTaskBulkMode((v) => !v)
                          setTaskRowSelection({})
                        },
                      }
                    : undefined
                  : {
                      isActive: isBulkMode,
                      selectedCount: selectedIds.length,
                      onToggle: () => {
                        setIsBulkMode((v) => !v)
                        setRowSelection({})
                        setL3Selection(new Set())
                      },
                    }
            }
            actions={
              activeTab === 'my-tasks'
                ? myTasksActions
                : activeTab === 'submittedRequests'
                  ? [
                      {
                        id: 'export',
                        label: currentIsExporting ? 'Exporting…' : 'Export',
                        icon: currentIsExporting ? Loader2 : Download,
                        disabled: currentIsExporting,
                        onClick: handleExport,
                      },
                    ]
                  : isBulkMode
                    ? ASSESSMENT_BULK_ACTIONS
                    : defaultActions
            }
            showFilter={true}
            onFilterClick={() => setIsFilterOpen(true)}
          />
        </div>

        {/* ── View toggle icons ─────────────────────────────────────────── */}
        {activeTab === 'processes' && (
          <ViewToggle
            options={[
              { value: 'table', icon: Table2, label: 'Table view' },
              { value: 'report', icon: FileText, label: 'Report view' },
            ]}
            value={activeView}
            onChange={(v) => setActiveView(v as 'table' | 'report')}
          />
        )}
      </div>
      {/* ── Info bar ───────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 py-2 text-sm">
        <Info className="size-4 shrink-0" />
        <span>
          You can edit values inline at the lowest level (L3 or L4) only. Editable cells are
          highlighted on hover.
        </span>
      </div>

      {/* ── Table + Comment panel ─────────────────────────────────────── */}
      <div className="flex min-h-0 flex-1 gap-4 py-1">
        {/* ── Main table area ──────────────────────────────────────────── */}
        <div className="min-w-0 flex-1 overflow-auto">
          {isBulkMode && activeTab === 'processes' && (
            <AssessmentBulkActionBar
              selectedCount={selectedIds.length}
              onAction={(action) => {
                if (action === 'submit') {
                  bulkCellAction(buildBulkOps('submit')).then(() => {
                    setRowSelection({})
                    setL3Selection(new Set())
                  })
                } else if (action === 'copy-assessment-data') {
                  setActiveModal('copy')
                } else if (action === 'mark-as-reviewed') {
                  setActiveModal('review')
                } else {
                  setActiveModal(action)
                }
              }}
              onCancel={exitBulkMode}
            />
          )}
          {isTaskBulkMode && activeTab === 'my-tasks' && (
            <TaskBulkActionBar
              selectedCount={taskSelectedIds.length}
              onAction={(action) => setTaskModal(action)}
              onCancel={exitBulkMode}
            />
          )}
          {activeTab == 'processes' ? (
            activeView === 'report' ? (
              <ProcessDataReport />
            ) : (
              <ProcessDataTable
                data={filteredData}
                isBulkMode={isBulkMode}
                rowSelection={rowSelection}
                onRowSelectionChange={(updater: any) =>
                  setRowSelection((prev) =>
                    typeof updater === 'function' ? updater(prev) : updater,
                  )
                }
                selectedL3Ids={l3Selection}
                onL3SelectionChange={(id, checked) =>
                  setL3Selection((prev) => {
                    const next = new Set(prev)
                    checked ? next.add(id) : next.delete(id)
                    return next
                  })
                }
                columnVisibility={columnVisibility}
                onColumnVisibilityChange={setColumnVisibility}
                columnOrder={managedColumnOrder}
                onColumnOrderChange={setManagedColumnOrder}
                isLoading={isLoading}
              />
            )
          ) : activeTab == 'my-tasks' ? (
            <MyTasksTable
              isBulkMode={isTaskBulkMode}
              isCommentMode={isCommentMode}
              rowSelection={taskRowSelection}
              onRowSelectionChange={(updater) =>
                setTaskRowSelection((prev) =>
                  typeof updater === 'function' ? updater(prev) : updater,
                )
              }
              onRowAction={(task: TaskItem, action: TaskRowAction) => {
                setSingleActionTask(task)
                setTaskModal(action)
              }}
              onFieldClick={(_change, fieldName, parentTask) => {
                setCommentSheetFieldName(fieldName)
                setCommentSheetOpen(true)
                if (parentTask) {
                  setSingleActionTask(parentTask)
                }
              }}
            />
          ) : activeTab == 'submittedRequests' ? (
            <SubmittedRequestsTable />
          ) : (
            <p className="text-foreground text-sm italic">No data found</p>
          )}
        </div>

        {/* ── Inline comment panel (right side) ────────────────────────── */}
        <FieldCommentSheet
          open={commentSheetOpen}
          onOpenChange={(open) => {
            setCommentSheetOpen(open)
            if (!open) {
              setIsCommentMode(false)
              setSingleActionTask(null)
            }
          }}
          fieldName={commentSheetFieldName}
          taskId={singleActionTask?.id}
        />
      </div>

      <BulkEditModal
        open={activeModal === 'edit'}
        selectedCount={selectedIds.length}
        onConfirm={(field, value) => {
          bulkCellAction(buildBulkOps('edit', { columnKey: field, payload: value })).then(() => {
            setRowSelection({})
            setL3Selection(new Set())
          })
          setActiveModal(null)
        }}
        onOpenChange={(open) => {
          if (!open) setActiveModal(null)
        }}
      />
      <BulkCommentModal
        open={activeModal === 'comment'}
        selectedCount={selectedIds.length}
        onConfirm={(comment) => {
          bulkCellAction(buildBulkOps('comment', { payload: comment })).then(() => {
            setRowSelection({})
            setL3Selection(new Set())
          })
          setActiveModal(null)
        }}
        onOpenChange={(open) => {
          if (!open) setActiveModal(null)
        }}
      />
      <CopyAssessmentDataModal
        open={activeModal === 'copy'}
        selectedCount={selectedIds.length}
        onConfirm={(sourceId) => {
          copyAssessmentData(
            buildBulkOps('edit').map((op) => op.rowId),
            sourceId,
          ).then(() => {
            setRowSelection({})
            setL3Selection(new Set())
          })
          setActiveModal(null)
        }}
        onOpenChange={(open) => {
          if (!open) setActiveModal(null)
        }}
      />
      <MarkAsReviewedModal
        open={activeModal === 'review'}
        selectedCount={selectedIds.length}
        onConfirm={(comment) => {
          bulkCellAction(buildBulkOps('mark-as-reviewed', { payload: comment })).then(() => {
            setRowSelection({})
            setL3Selection(new Set())
          })
          setActiveModal(null)
        }}
        onOpenChange={(open) => {
          if (!open) setActiveModal(null)
        }}
      />
      <SuccessToast
        open={showExportToast}
        message="Assessment data exported successfully."
        onClose={() => setShowExportToast(false)}
      />

      {/* ── Task bulk action modals ────────────────────────────────────── */}
      <ApproveTasksModal
        open={taskModal === 'approve'}
        selectedCount={singleActionTask ? 1 : taskSelectedIds.length}
        title={`Approve ${singleActionTask ? 1 : taskSelectedIds.length} selected request${(singleActionTask ? 1 : taskSelectedIds.length) !== 1 ? 's' : ''}`}
        description="These requests will be forwarded for Quality Manager Review. Are you sure you want to approve them?"
        onConfirm={() => {
          const ids = singleActionTask ? [singleActionTask.id] : taskSelectedIds
          if (singleActionTask) {
            approveTaskMutation.mutate(
              { taskId: singleActionTask.id },
              {
                onSuccess: () => {
                  setTaskModal(null)
                  setSingleActionTask(null)
                  setTaskRowSelection({})
                  setTaskActionMessage('Approved and forwarded for Quality Manager.')
                  setShowTaskActionToast(true)
                },
              },
            )
          } else {
            bulkApproveMutation.mutate(
              { taskIds: ids },
              {
                onSuccess: () => {
                  setTaskModal(null)
                  setSingleActionTask(null)
                  setTaskRowSelection({})
                  setTaskActionMessage('Approved and forwarded for Quality Manager.')
                  setShowTaskActionToast(true)
                },
              },
            )
          }
        }}
        onOpenChange={(open) => {
          if (!open) {
            setTaskModal(null)
            setSingleActionTask(null)
          }
        }}
      />
      <ReturnTasksModal
        open={taskModal === 'return'}
        selectedCount={singleActionTask ? 1 : taskSelectedIds.length}
        title={`Return ${singleActionTask ? 1 : taskSelectedIds.length} selected request${(singleActionTask ? 1 : taskSelectedIds.length) !== 1 ? 's' : ''}`}
        onConfirm={(reason) => {
          const ids = singleActionTask ? [singleActionTask.id] : taskSelectedIds
          if (singleActionTask) {
            returnTaskMutation.mutate(
              { taskId: singleActionTask.id, reason: reason ?? '' },
              {
                onSuccess: () => {
                  setTaskModal(null)
                  setSingleActionTask(null)
                  setTaskRowSelection({})
                  setTaskActionMessage('Selected requests have been returned.')
                  setShowTaskActionToast(true)
                },
              },
            )
          } else {
            bulkReturnMutation.mutate(
              { taskIds: ids, reason: reason ?? '' },
              {
                onSuccess: () => {
                  setTaskModal(null)
                  setSingleActionTask(null)
                  setTaskRowSelection({})
                  setTaskActionMessage('Selected requests have been returned.')
                  setShowTaskActionToast(true)
                },
              },
            )
          }
        }}
        onOpenChange={(open) => {
          if (!open) {
            setTaskModal(null)
            setSingleActionTask(null)
          }
        }}
      />
      <RejectTasksModal
        open={taskModal === 'reject'}
        selectedCount={singleActionTask ? 1 : taskSelectedIds.length}
        title={`Reject ${singleActionTask ? 1 : taskSelectedIds.length} selected request${(singleActionTask ? 1 : taskSelectedIds.length) !== 1 ? 's' : ''}`}
        description="These requests will be marked as Rejected. Please add the rejection reason below."
        requireReason
        onConfirm={(reason) => {
          const ids = singleActionTask ? [singleActionTask.id] : taskSelectedIds
          if (singleActionTask) {
            rejectTaskMutation.mutate(
              { taskId: singleActionTask.id, reason: reason ?? '' },
              {
                onSuccess: () => {
                  setTaskModal(null)
                  setSingleActionTask(null)
                  setTaskRowSelection({})
                  setTaskActionMessage('Selected requests have been rejected.')
                  setShowTaskActionToast(true)
                },
              },
            )
          } else {
            bulkRejectMutation.mutate(
              { taskIds: ids, reason: reason ?? '' },
              {
                onSuccess: () => {
                  setTaskModal(null)
                  setSingleActionTask(null)
                  setTaskRowSelection({})
                  setTaskActionMessage('Selected requests have been rejected.')
                  setShowTaskActionToast(true)
                },
              },
            )
          }
        }}
        onOpenChange={(open) => {
          if (!open) {
            setTaskModal(null)
            setSingleActionTask(null)
          }
        }}
      />
      <RequestEndorsementModal
        open={taskModal === 'request-endorsement'}
        selectedCount={singleActionTask ? 1 : taskSelectedIds.length}
        onConfirm={(names, reason) => {
          const ids = singleActionTask ? [singleActionTask.id] : taskSelectedIds
          if (singleActionTask) {
            requestEndorsementMutation.mutate(
              { taskId: singleActionTask.id, endorserNames: names, reason: reason ?? '' },
              {
                onSuccess: () => {
                  setTaskModal(null)
                  setSingleActionTask(null)
                  setTaskRowSelection({})
                  setTaskActionMessage('Endorsement request has been sent.')
                  setShowTaskActionToast(true)
                },
              },
            )
          } else {
            bulkEndorsementMutation.mutate(
              { taskIds: ids, endorserNames: names, reason: reason ?? '' },
              {
                onSuccess: () => {
                  setTaskModal(null)
                  setSingleActionTask(null)
                  setTaskRowSelection({})
                  setTaskActionMessage('Endorsement request has been sent.')
                  setShowTaskActionToast(true)
                },
              },
            )
          }
        }}
        onOpenChange={(open) => {
          if (!open) {
            setTaskModal(null)
            setSingleActionTask(null)
          }
        }}
      />
      <SuccessToast
        open={showTaskActionToast}
        message={taskActionMessage}
        onClose={() => setShowTaskActionToast(false)}
      />

      <ProcessFilterSheet
        open={isFilterOpen}
        onOpenChange={setIsFilterOpen}
        filters={filterDefs}
        pending={pending}
        activePerSection={activePerSection}
        onToggle={toggle}
        onApply={apply}
        onReset={reset}
      />
      <ManageColumnsSheet
        open={isManageColumnsOpen}
        onClose={() => setIsManageColumnsOpen(false)}
        columnOrder={managedColumnOrder}
        columnVisibility={columnVisibility}
        onColumnOrderChange={setManagedColumnOrder}
        onColumnVisibilityChange={setColumnVisibility}
      />
    </div>
  )
}

export default AssessmentDataModule
