import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/shared/components/ui/breadcrumb'
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
import { LayoutGrid, Table2 } from 'lucide-react'
import { useCurrentUser } from '@/shared/auth/useUserStore'
import ViewToggle from '@/shared/components/ViewToggle'
import { hasPermission } from '@/shared/lib/permissions'
import ProcessesMenu, { type ProcessViewOption } from '@/shared/components/ProcessesMenu'

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

  const draftActions: ToolbarAction[] = CATALOG_DRAFT_ACTIONS.map((a) =>
    a.id === 'save' ? { ...a, onClick: onSave } : { ...a, onClick: onValidate },
  )

  const isFullReport = currentView === 'full-report'
  const fullReportActions: ToolbarAction[] = CATALOG_FULL_REPORT_ACTIONS.map((a) =>
    a.id === 'export-full-report'
      ? { ...a, onClick: onExportFullReport, disabled: isExporting }
      : a,
  )
  const defaultActions: ToolbarAction[] = CATALOG_ACTIONS.map((a) =>
    a.id === 'export' ? { ...a, onClick: onExport, disabled: isExporting } : a,
  )
  const actions =
    hasDraftRows || isBulkMode ? draftActions : isFullReport ? fullReportActions : defaultActions

  return (
    <header className="space-y-3">
      <Breadcrumb>
        <BreadcrumbList className="text-xs">
          <BreadcrumbItem>
            <BreadcrumbLink href="#" className="font-medium">
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-muted-foreground">
              Process Catalog Management
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-wrap items-center gap-2">
        <h1 className="text-foreground text-start text-2xl font-semibold">
          {isFullReport ? 'Process Catalog Management - Full Report' : 'Process Catalog Management'}
        </h1>
        {!isFullReport && <ProcessesMenu value={processView} onChange={onProcessViewChange} />}
      </div>

      <div className="flex items-center gap-2">
        <div className="flex-1">
          <ModuleToolbar
            tabs={visibleTabs}
            activeTab={activeTab}
            onTabChange={(value) => onTabChange(value as CatalogTabValue)}
            onFilterClick={onFilterClick}
            activeFilterCount={activeFilterCount}
            bulkMode={
              activeTab === 'myTasks'
                ? taskBulkMode
                : hasDraftRows || isFullReport || isBulkMode
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
              { value: 'full-report', icon: Table2, label: 'View full report' },
              { value: 'default', icon: LayoutGrid, label: 'Default view' },
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
