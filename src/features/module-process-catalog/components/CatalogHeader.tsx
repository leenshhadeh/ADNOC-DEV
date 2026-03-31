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
import { Button } from '@/shared/components/ui/button'
import { LayoutGrid, Table2 } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

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
}: CatalogHeaderProps) => {
  const bulkMode: BulkModeState = {
    isActive: isBulkMode,
    selectedCount,
    onToggle: onToggleBulkMode ?? (() => {}),
    actionLabel: 'Add multiple processes',
    onAction: onBulkAddProcesses,
  }

  const draftActions: ToolbarAction[] = CATALOG_DRAFT_ACTIONS.map((a) =>
    a.id === 'save' ? { ...a, onClick: onSave } : { ...a, onClick: onValidate },
  )

  const isFullReport = currentView === 'full-report'
  const actions = hasDraftRows
    ? draftActions
    : isFullReport
      ? CATALOG_FULL_REPORT_ACTIONS
      : CATALOG_ACTIONS

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

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-foreground text-start text-2xl font-semibold">
          {isFullReport ? 'Process Catalog Management - Full Report' : 'Process Catalog Management'}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex-1">
          <ModuleToolbar
            tabs={CATALOG_TABS}
            activeTab={activeTab}
            onTabChange={(value) => onTabChange(value as CatalogTabValue)}
            onFilterClick={onFilterClick}
            activeFilterCount={activeFilterCount}
            bulkMode={hasDraftRows || isFullReport ? undefined : bulkMode}
            actions={actions}
          />
        </div>

        {/* ── View toggle icons — always visible on the Processes tab ─────── */}
        {activeTab === 'processes' && !hasDraftRows && (
          <div className="border-border flex shrink-0 items-center gap-0.5 rounded-xl border p-1">
            <div className="group relative">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="View full report"
                className={cn('size-9 rounded-lg', currentView === 'full-report' && 'bg-secondary')}
                onClick={() => onViewChange?.('full-report')}
              >
                <Table2 className="size-4" />
              </Button>
              {/* Tooltip */}
              <span className="bg-foreground text-background pointer-events-none absolute top-full left-1/2 z-50 mt-1.5 -translate-x-1/2 rounded-md px-2 py-1 text-xs whitespace-nowrap opacity-0 transition-opacity group-hover:opacity-100">
                View full report
              </span>
            </div>
            <div className="group relative">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Default view"
                className={cn('size-9 rounded-lg', currentView === 'default' && 'bg-secondary')}
                onClick={() => onViewChange?.('default')}
              >
                <LayoutGrid className="size-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default CatalogHeader
