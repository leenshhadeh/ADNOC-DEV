import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/shared/components/ui/breadcrumb'
import ModuleToolbar, { type BulkModeState } from '@/shared/components/ModuleToolbar'
import {
  CATALOG_ACTIONS,
  CATALOG_TABS,
} from '@features/module-process-catalog/constants/catalog-toolbar'

export type CatalogTabValue = 'processes' | 'myTasks' | 'submittedRequests'

interface CatalogHeaderProps {
  activeTab: CatalogTabValue
  onTabChange: (value: CatalogTabValue) => void
  isBulkMode?: boolean
  onToggleBulkMode?: () => void
  selectedCount?: number
  onBulkAddProcesses?: () => void
}

const CatalogHeader = ({
  activeTab,
  onTabChange,
  isBulkMode = false,
  onToggleBulkMode,
  selectedCount = 0,
  onBulkAddProcesses,
}: CatalogHeaderProps) => {
  const bulkMode: BulkModeState = {
    isActive: isBulkMode,
    selectedCount,
    onToggle: onToggleBulkMode ?? (() => {}),
    actionLabel: 'Add multiple processes',
    onAction: onBulkAddProcesses,
  }

  return (
    <header className="space-y-3">
      <Breadcrumb>
        <BreadcrumbList className="text-xs">
          <BreadcrumbItem>
            <BreadcrumbLink href="#" className="text-primary hover:text-primary/80 font-medium">
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-muted-foreground">Process Catalog</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-foreground text-start text-4xl font-semibold">Process Catalog</h1>
      </div>

      <ModuleToolbar
        tabs={CATALOG_TABS}
        activeTab={activeTab}
        onTabChange={(value) => onTabChange(value as CatalogTabValue)}
        bulkMode={bulkMode}
        actions={CATALOG_ACTIONS}
      />
    </header>
  )
}

export default CatalogHeader
