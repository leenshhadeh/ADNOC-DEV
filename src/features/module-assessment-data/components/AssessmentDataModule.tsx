import { useMemo, useState } from 'react'
import { Download, FileText, Info, Loader2, Settings2, Table2, Upload } from 'lucide-react'
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
import SubmittedRequestsTable from './tabels/SubmittedRequestsTable'
import ProcessDataTable from './tabels/ProcessDataTable'
import AssessmentBulkActionBar from './AssessmentBulkActionBar'
import {
  BulkEditModal,
  BulkCommentModal,
  CopyAssessmentDataModal,
  MarkAsReviewedModal,
} from './AssessmentBulkModals'
import {
  bulkEditProcesses,
  bulkCommentProcesses,
  copyAssessmentData,
  bulkSubmitProcesses,
  bulkMarkAsReviewed,
} from '../api/processAssesmentService'

type ActiveModal = 'edit' | 'comment' | 'copy' | 'review' | null

const AssessmentDataModule = () => {
  const [activeTab, setActiveTab] = useState('processes')
  const [search, setSearch] = useState('')
  const [isBulkMode, setIsBulkMode] = useState(false)
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [activeModal, setActiveModal] = useState<ActiveModal>(null)
  const [activeView, setActiveView] = useState<'table' | 'report'>('table')
  const [showExportToast, setShowExportToast] = useState(false)

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

  const selectedIds = Object.keys(rowSelection)

  const exitBulkMode = () => {
    setIsBulkMode(false)
    setRowSelection({})
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
            bulkMode={{
              isActive: isBulkMode,
              selectedCount: selectedIds.length,
              onToggle: () => {
                setIsBulkMode((v) => !v)
                setRowSelection({})
              },
            }}
            actions={isBulkMode ? ASSESSMENT_BULK_ACTIONS : defaultActions}
            showFilter={false}
          />
        </div>

        {/* ── View toggle icons ─────────────────────────────────────────── */}
        <div className="border-border flex shrink-0 items-center gap-0.5 rounded-xl border p-1">
          <button
            type="button"
            aria-label="Table view"
            onClick={() => setActiveView('table')}
            className={`flex size-9 items-center justify-center rounded-lg transition-colors ${
              activeView === 'table' ? 'bg-[var(--tab-active-bg,#F1F3F5)]' : 'hover:bg-muted/60'
            }`}
          >
            <Table2 className="size-4" />
          </button>
          <button
            type="button"
            aria-label="Report view"
            onClick={() => setActiveView('report')}
            className={`flex size-9 items-center justify-center rounded-lg transition-colors ${
              activeView === 'report' ? 'bg-[var(--tab-active-bg,#F1F3F5)]' : 'hover:bg-muted/60'
            }`}
          >
            <FileText className="size-4 text-[#687076]" />
          </button>
        </div>
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
        {isBulkMode && (activeTab === 'processes' || activeTab === 'my-tasks') && (
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
        {activeTab == 'processes' ? (
          <ProcessDataTable
            isBulkMode={isBulkMode}
            rowSelection={rowSelection}
            onRowSelectionChange={(updater) =>
              setRowSelection((prev) => (typeof updater === 'function' ? updater(prev) : updater))
            }
          />
        ) : activeTab == 'my-tasks' ? (
          <MyTasksTable />
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
    </div>
  )
}

export default AssessmentDataModule
