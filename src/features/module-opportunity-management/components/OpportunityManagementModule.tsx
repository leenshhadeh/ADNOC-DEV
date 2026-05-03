import { useState, useMemo } from 'react'
import { LayoutGrid, Table2 } from 'lucide-react'
import type { RowSelectionState } from '@tanstack/react-table'

import Breadcrumb from '@/shared/components/Breadcrumb'
import ViewToggle from '@/shared/components/ViewToggle'
import ModuleToolbar from '@/shared/components/ModuleToolbar'

import { useOpportunityNavStore } from '../store/useOpportunityNavStore'
import { useGetOpportunities } from '../hooks/useGetOpportunities'
import { OPPORTUNITY_TABS, OPPORTUNITY_DEFAULT_ACTIONS } from '../constants/opportunities-toolbar'
import ManageColumnsSheet from './ManageColumnsSheet'
import OpportunitiesTable from './tables/OpportunitiesTable'
import type { OpportunityTabValue } from '../types'

const toSearchableText = (value: unknown): string => {
  if (value == null) return ''
  return String(value)
}

const OpportunityManagementModule = () => {
  const { activeTab, setActiveTab } = useOpportunityNavStore()
  const [search, setSearch] = useState('')
  const [isBulkMode, setIsBulkMode] = useState(false)
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [isManageColumnsOpen, setIsManageColumnsOpen] = useState(false)
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({})
  const [managedColumnOrder, setManagedColumnOrder] = useState<string[]>([])
  const [activeView, setActiveView] = useState<'table' | 'grid'>('table')

  const { data = [], isLoading } = useGetOpportunities()

  const filteredData = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return data
    return data.filter((row) =>
      Object.values(row).some((value) => toSearchableText(value).toLowerCase().includes(query)),
    )
  }, [data, search])

  const selectedCount = Object.keys(rowSelection).length

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as OpportunityTabValue)
    setIsBulkMode(false)
    setRowSelection({})
  }

  const defaultActions = OPPORTUNITY_DEFAULT_ACTIONS.map((action) => ({
    ...action,
    onClick: action.id === 'manage-columns' ? () => setIsManageColumnsOpen(true) : action.onClick,
  }))

  return (
    <div className="flex h-full flex-col gap-0 overflow-hidden px-6">
      {/* ── Breadcrumb ─────────────────────────────────────────────────── */}
      <Breadcrumb links={[{ title: 'Opportunities Manag...', isCurrentPage: true }]} />

      {/* ── Page title row ─────────────────────────────────────────────── */}
      <div className="flex items-center justify-between py-3">
        <h1 className="text-foreground text-2xl font-semibold">Opportunities Management</h1>
      </div>

      {/* ── Toolbar + view toggle row ──────────────────────────────────── */}
      <div className="flex items-center gap-3 py-1">
        <div className="min-w-0 flex-1">
          <ModuleToolbar
            tabs={OPPORTUNITY_TABS}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            searchValue={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search opportunities..."
            showFilter
            bulkMode={
              activeTab === 'opportunities'
                ? {
                    isActive: isBulkMode,
                    selectedCount,
                    actionLabel: 'Bulk action',
                    onToggle: () => {
                      setIsBulkMode((v) => !v)
                      setRowSelection({})
                    },
                  }
                : undefined
            }
            actions={activeTab === 'opportunities' ? defaultActions : []}
          />
        </div>

        {activeTab === 'opportunities' && (
          <ViewToggle
            options={[
              { value: 'table', icon: Table2, label: 'Table view' },
              { value: 'grid', icon: LayoutGrid, label: 'Grid view' },
            ]}
            value={activeView}
            onChange={(v) => setActiveView(v as 'table' | 'grid')}
          />
        )}
      </div>

      {/* ── Main content ───────────────────────────────────────────────── */}
      <div className="min-h-0 flex-1 overflow-auto py-2">
        {activeTab === 'opportunities' && (
          <OpportunitiesTable
            data={filteredData}
            isLoading={isLoading}
            search=""
            rowSelection={rowSelection}
            onRowSelectionChange={setRowSelection}
            columnVisibility={columnVisibility}
            onColumnVisibilityChange={setColumnVisibility}
            columnOrder={managedColumnOrder}
            onColumnOrderChange={setManagedColumnOrder}
            isBulkMode={isBulkMode}
          />
        )}

        {activeTab === 'my-tasks' && (
          <div className="text-muted-foreground flex h-48 items-center justify-center text-sm">
            No tasks assigned to you yet.
          </div>
        )}

        {activeTab === 'submitted-requests' && (
          <div className="text-muted-foreground flex h-48 items-center justify-center text-sm">
            No submitted requests found.
          </div>
        )}
      </div>

      {/* ── Manage Columns Sheet ───────────────────────────────────────── */}
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

export default OpportunityManagementModule
