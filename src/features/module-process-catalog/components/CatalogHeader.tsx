import ModuleToolbar, {
  type BulkModeState,
  type ToolbarAction,
} from '@/shared/components/ModuleToolbar'
import {
  CATALOG_ACTIONS,
  CATALOG_TABS,
  CATALOG_DRAFT_ACTIONS,
  CATALOG_FULL_REPORT_ACTIONS,
} from '@features/module-process-catalog/constants/catalog-toolbar'
import { FileText } from 'lucide-react'
import { useCurrentUser } from '@/shared/auth/useUserStore'
import ViewToggle from '@/shared/components/ViewToggle'
import { hasPermission } from '@/shared/lib/permissions'
import ProcessesMenu, { type ProcessViewOption } from '@/shared/components/ProcessesMenu'
import Breadcrumb from '@/shared/components/Breadcrumb'
import EditableIcon from '@/assets/icons/editable.svg?react'

export type CatalogTabValue = 'processes' | 'myTasks' | 'submittedRequests'
export type CatalogView = 'default' | 'full-report'

interface CatalogHeaderProps {
  activeTab: CatalogTabValue
  onTabChange: (value: CatalogTabValue) => void
  isBulkMode?: boolean
  onToggleBulkMode?: () => void
  selectedCount?: number
  onBulkAddProcesses?: () => void
  onFilterClick?: () => void
  /** Total active filter count — shown as a badge on the filter button */
  activeFilterCount?: number
  hasDraftRows?: boolean
  onSave?: () => void
  onValidate?: () => void
  onDiscard?: () => void
  currentView?: CatalogView
  onViewChange?: (view: CatalogView) => void
  onExportFullReport?: () => void
  onExport?: () => void
  isExporting?: boolean
  processView?: ProcessViewOption
  onProcessViewChange?: (value: ProcessViewOption) => void
  // My Tasks bulk mode
  isTaskBulkMode?: boolean
  onToggleTaskBulkMode?: () => void
  taskSelectedCount?: number
}

const CatalogHeader = ({
  activeTab,
  onTabChange,
  isBulkMode = false,
  onToggleBulkMode,
  selectedCount = 0,
  onBulkAddProcesses,
  onFilterClick,
  activeFilterCount,
  hasDraftRows = false,
  onSave,
  onValidate,
  onDiscard,
  currentView = 'default',
  onViewChange,
  onExportFullReport,
  onExport,
  isExporting = false,
  processView,
  onProcessViewChange,
  isTaskBulkMode = false,
  onToggleTaskBulkMode,
  taskSelectedCount = 0,
}: CatalogHeaderProps) => {
  const { role } = useCurrentUser()

  const visibleTabs = hasPermission(role, 'VIEW_SUBMITTED_REQUESTS')
    ? CATALOG_TABS
    : CATALOG_TABS.filter((t) => t.value !== 'submittedRequests')

  const bulkMode: BulkModeState = {
    isActive: isBulkMode,
    selectedCount,
    onToggle: onToggleBulkMode ?? (() => {}),
    actionLabel: 'Add multiple processes',
    onAction: onBulkAddProcesses,
  }

  const taskBulkMode: BulkModeState = {
    isActive: isTaskBulkMode,
    selectedCount: taskSelectedCount,
    onToggle: onToggleTaskBulkMode ?? (() => {}),
    actionLabel: 'Bulk action',
  }

  const draftActions: ToolbarAction[] = CATALOG_DRAFT_ACTIONS.map((a) => {
    if (a.id === 'save') return { ...a, onClick: onSave }
    if (a.id === 'discard') return { ...a, onClick: onDiscard }
    return { ...a, onClick: onValidate }
  })

  const isFullReport = currentView === 'full-report'
  const fullReportActions: ToolbarAction[] = CATALOG_FULL_REPORT_ACTIONS.map((a) =>
    a.id === 'export-full-report'
      ? { ...a, onClick: onExportFullReport, disabled: isExporting }
      : a,
  )
  const defaultActions: ToolbarAction[] = CATALOG_ACTIONS.map((a) =>
    a.id === 'export' ? { ...a, onClick: onExport, disabled: isExporting } : a,
  )
  const exportOnlyActions: ToolbarAction[] = defaultActions.filter((a) => a.id !== 'import')
  const actions =
    hasDraftRows && activeTab === 'processes'
      ? draftActions
      : isFullReport
        ? fullReportActions
        : activeTab === 'processes'
          ? defaultActions
          : exportOnlyActions

  return (
    <header className="space-y-3">
      <Breadcrumb links={[{ title: ' Process Catalog Management' }]} />

      <div className="flex flex-wrap items-center gap-2">
        <h1 className="text-foreground text-start text-2xl font-semibold">
          {isFullReport ? 'Process Catalog Management - Full Report' : 'Process Catalog Management'}
        </h1>
        {!isFullReport && activeTab === 'processes' && (
          <ProcessesMenu value={processView} onChange={onProcessViewChange} />
        )}
      </div>

      <div className="flex items-center gap-2">
        <div className="flex-1">
          <ModuleToolbar
            tabs={isFullReport ? [] : visibleTabs}
            activeTab={activeTab}
            onTabChange={(value) => onTabChange(value as CatalogTabValue)}
            onFilterClick={onFilterClick}
            activeFilterCount={activeFilterCount}
            bulkMode={
              activeTab === 'myTasks'
                ? taskBulkMode
                : activeTab === 'submittedRequests' || hasDraftRows || isFullReport || isBulkMode
                  ? undefined
                  : bulkMode
            }
            actions={actions}
          />
        </div>

        {/* ── View toggle icons — always visible on the Processes tab ─────── */}
        {activeTab === 'processes' && !hasDraftRows && (
          <ViewToggle
            options={[
              { value: 'default', icon: EditableIcon, label: 'Editable view' },
              { value: 'full-report', icon: FileText, label: 'Full report view' },
            ]}
            value={currentView}
            onChange={(v) => onViewChange?.(v as CatalogView)}
          />
        )}
      </div>
    </header>
  )
}

export default CatalogHeader
