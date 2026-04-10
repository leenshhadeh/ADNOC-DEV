import { useMemo, useState } from 'react'
import { Download, FileText, Info, Loader2, Settings2, Table2, Upload } from 'lucide-react'
import ViewToggle from '@/shared/components/ViewToggle'
import type { RowSelectionState } from '@tanstack/react-table'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/shared/components/ui/breadcrumb'
import ModuleToolbar from '@/shared/components/ModuleToolbar'
import type { ToolbarAction } from '@/shared/components/ModuleToolbar'
import { SuccessToast } from '@/shared/components/SuccessToast'
import { ASSESSMENT_BULK_ACTIONS, ASSESSMENT_TABS } from '../constants/assessment-toolbar'
import { ASSESSMENT_DATA } from '../constants/assessment-data'
import { flattenAssessmentData } from './tabels/ProcessDataTable'
import { useAssessmentExport } from '../hooks/useAssessmentExport'
import { useMyTasksExport } from '../hooks/useMyTasksExport'
import ProcessesMenu from '../../../shared/components/ProcessesMenu'
import MyTasksTable from './tabels/MyTasksTable'
import type { TaskRowAction } from './tabels/MyTasksTable'
import type { TaskItem } from '../types/my-tasks'
import SubmittedRequestsTable from './tabels/SubmittedRequestsTable'
import ProcessDataTable from './tabels/ProcessDataTable'
import AssessmentBulkActionBar from './AssessmentBulkActionBar'
import TaskBulkActionBar from './TaskBulkActionBar'
import {
  BulkEditModal,
  BulkCommentModal,
  CopyAssessmentDataModal,
  MarkAsReviewedModal,
} from './AssessmentBulkModals'
import {
  ApproveTasksModal,
  ReturnTasksModal,
  RejectTasksModal,
  RequestEndorsementModal,
} from './TaskBulkModals'
import {
  bulkEditProcesses,
  bulkCommentProcesses,
  copyAssessmentData,
  bulkSubmitProcesses,
  bulkMarkAsReviewed,
} from '../api/processAssesmentService'

type ActiveModal = 'edit' | 'comment' | 'copy' | 'review' | null
type TaskModal = 'approve' | 'return' | 'reject' | 'request-endorsement' | null

const AssessmentDataModule = () => {
  const [activeTab, setActiveTab] = useState('processes')
  const [search, setSearch] = useState('')
  const [isBulkMode, setIsBulkMode] = useState(false)
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [isTaskBulkMode, setIsTaskBulkMode] = useState(false)
  const [taskRowSelection, setTaskRowSelection] = useState<RowSelectionState>({})
  const [activeModal, setActiveModal] = useState<ActiveModal>(null)
  const [taskModal, setTaskModal] = useState<TaskModal>(null)
  const [activeView, setActiveView] = useState<'table' | 'report'>('table')
  const [showExportToast, setShowExportToast] = useState(false)
  const [showTaskActionToast, setShowTaskActionToast] = useState(false)
  const [taskActionMessage, setTaskActionMessage] = useState('')
  const [singleActionTask, setSingleActionTask] = useState<TaskItem | null>(null)

  const { isExporting, exportRows } = useAssessmentExport()
  const { isExporting: isExportingTasks, exportTasks } = useMyTasksExport()

  const tableData = useMemo(() => flattenAssessmentData(ASSESSMENT_DATA), [])

  const handleExport = async () => {
    if (activeTab === 'my-tasks') {
      await exportTasks()
    } else {
      await exportRows(tableData)
    }
    setShowExportToast(true)
  }

  const currentIsExporting = activeTab === 'my-tasks' ? isExportingTasks : isExporting

  const defaultActions = useMemo<ToolbarAction[]>(
    () => [
      { id: 'manage-columns', label: 'Manage columns', icon: Settings2 },
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
    () => [
      {
        id: 'export',
        label: isExportingTasks ? 'Exporting…' : 'Export',
        icon: isExportingTasks ? Loader2 : Download,
        disabled: isExportingTasks,
        onClick: handleExport,
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isExportingTasks],
  )

  const selectedIds = Object.keys(rowSelection)
  const taskSelectedIds = Object.keys(taskRowSelection)

  const exitBulkMode = () => {
    setIsBulkMode(false)
    setRowSelection({})
    setIsTaskBulkMode(false)
    setTaskRowSelection({})
  }

  return (
    <div className="flex h-full flex-col gap-0 overflow-hidden">
      {/* ── Breadcrumb ─────────────────────────────────────────────────── */}
      <div className="px-6 pt-5 pb-1">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Assessment Data Processes</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* ── Title bar ──────────────────────────────────────────────────── */}
      <div className="flex items-center px-6 py-3">
        <h1 className="text-foreground text-2xl font-bold">Assessment Data Processes</h1>

        <ProcessesMenu />
      </div>

      {/* ── Tabs + search + filter + toolbar ──────────────────────────── */}
      <div className="flex items-center gap-2 px-6 py-3">
        <div className="flex-1">
          <ModuleToolbar
            tabs={ASSESSMENT_TABS}
            activeTab={activeTab}
            onTabChange={(tab) => {
              setActiveTab(tab)
              exitBulkMode()
            }}
            searchValue={search}
            onSearchChange={setSearch}
            bulkMode={
              activeTab === 'my-tasks'
                ? {
                    isActive: isTaskBulkMode,
                    selectedCount: taskSelectedIds.length,
                    onToggle: () => {
                      setIsTaskBulkMode((v) => !v)
                      setTaskRowSelection({})
                    },
                  }
                : {
                    isActive: isBulkMode,
                    selectedCount: selectedIds.length,
                    onToggle: () => {
                      setIsBulkMode((v) => !v)
                      setRowSelection({})
                    },
                  }
            }
            actions={
              activeTab === 'my-tasks'
                ? myTasksActions
                : isBulkMode
                  ? ASSESSMENT_BULK_ACTIONS
                  : defaultActions
            }
            showFilter={false}
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
      <div className="flex items-center gap-2 px-6 py-2 text-sm">
        <Info className="size-4 shrink-0" />
        <span>
          You can edit values inline at the lowest level (L3 or L4) only. Editable cells are
          highlighted on hover.
        </span>
      </div>

      {/* ── Table ──────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-auto px-6 py-1">
        {isBulkMode && activeTab === 'processes' && (
          <AssessmentBulkActionBar
            selectedCount={selectedIds.length}
            onAction={(action) => {
              if (action === 'submit') {
                bulkSubmitProcesses(selectedIds).then(() => setRowSelection({}))
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
          <ProcessDataTable
            isBulkMode={isBulkMode}
            rowSelection={rowSelection}
            onRowSelectionChange={(updater) =>
              setRowSelection((prev) => (typeof updater === 'function' ? updater(prev) : updater))
            }
          />
        ) : activeTab == 'my-tasks' ? (
          <MyTasksTable
            isBulkMode={isTaskBulkMode}
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
          />
        ) : activeTab == 'submittedRequests' ? (
          <SubmittedRequestsTable />
        ) : (
          <p className="text-foreground text-sm italic">No data found</p>
        )}
      </div>

      <BulkEditModal
        open={activeModal === 'edit'}
        selectedCount={selectedIds.length}
        onConfirm={(field, value) => {
          bulkEditProcesses(selectedIds, field, value).then(() => setRowSelection({}))
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
          bulkCommentProcesses(selectedIds, comment).then(() => setRowSelection({}))
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
          copyAssessmentData(selectedIds, sourceId).then(() => setRowSelection({}))
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
          bulkMarkAsReviewed(selectedIds, comment).then(() => setRowSelection({}))
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
        onConfirm={() => {
          // TODO: wire to actual API call
          setTaskModal(null)
          setSingleActionTask(null)
          setTaskRowSelection({})
          setTaskActionMessage('Approved and forwarded for Quality Manager.')
          setShowTaskActionToast(true)
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
        onConfirm={(_reason) => {
          // TODO: wire to actual API call with reason
          setTaskModal(null)
          setSingleActionTask(null)
          setTaskRowSelection({})
          setTaskActionMessage('Selected requests have been returned.')
          setShowTaskActionToast(true)
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
        onConfirm={(_reason) => {
          // TODO: wire to actual API call with reason
          setTaskModal(null)
          setSingleActionTask(null)
          setTaskRowSelection({})
          setTaskActionMessage('Selected requests have been rejected.')
          setShowTaskActionToast(true)
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
        onConfirm={(_names, _reason) => {
          // TODO: wire to actual API call with names and reason
          setTaskModal(null)
          setSingleActionTask(null)
          setTaskRowSelection({})
          setTaskActionMessage('Endorsement request has been sent.')
          setShowTaskActionToast(true)
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
    </div>
  )
}

export default AssessmentDataModule
