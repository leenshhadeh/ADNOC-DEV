import { useMemo, useState } from 'react'
import { X } from 'lucide-react'
import type { RowSelectionState } from '@tanstack/react-table'

import { Button } from '@/shared/components/ui/button'
import CatalogHeader, { type CatalogTabValue } from './CatalogHeader'
import DataTable from './data-table/DataTable'
import { buildCatalogColumns, type CatalogColumnActions } from './catalog-columns'
import MyTasksTable from './tables/MyTasksTable'
import SubmittedRequestsTable from './tables/SubmittedRequestsTable'
import ProcessFilterSheet from './ProcessFilterSheet'
import { CATALOG_DATA } from '@features/module-process-catalog/constants/catalog-data'
import { PROCESS_FILTER_DEFINITIONS } from '@features/module-process-catalog/constants/filter-definitions'
import { useProcessFilters } from '@features/module-process-catalog/hooks/useProcessFilters'

const CatalogModule = () => {
  const [activeTab, setActiveTab] = useState<CatalogTabValue>('processes')
  const [isAddL2ModalOpen, setIsAddL2ModalOpen] = useState(false)
  const [numberOfProcesses, setNumberOfProcesses] = useState('1')
  const [targetRowName, setTargetRowName] = useState('')
  const [isBulkMode, setIsBulkMode] = useState(false)
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const filterSectionIds = PROCESS_FILTER_DEFINITIONS.map((f) => f.id)
  const { pending, applied: _applied, toggle, apply, reset } = useProcessFilters(filterSectionIds)

  const selectedCount = Object.values(rowSelection).filter(Boolean).length

  const handleToggleBulkMode = () => {
    setIsBulkMode((prev) => {
      if (prev) setRowSelection({})
      return !prev
    })
  }

  const rowActions: CatalogColumnActions = {
    onAddL2: (item) => {
      setTargetRowName(item.level2Name)
      setIsAddL2ModalOpen(true)
    },
    onRename: (item) => {
      console.log('Rename', item.id)
    },
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const columns = useMemo(() => buildCatalogColumns(rowActions), [])

  return (
    <section className="space-y-4">
      <CatalogHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isBulkMode={isBulkMode}
        onToggleBulkMode={handleToggleBulkMode}
        selectedCount={selectedCount}
        onBulkAddProcesses={() => setIsAddL2ModalOpen(true)}
        onFilterClick={() => setIsFilterOpen(true)}
      />

      {activeTab === 'processes' ? (
        <DataTable
          columns={columns}
          data={CATALOG_DATA}
          density="compact"
          enableColumnDnd={false}
          enableSorting={false}
          rowSelection={rowSelection}
          onRowSelectionChange={setRowSelection}
          getRowId={(row) => row.id}
          tableMeta={{ isBulkMode, rowDividers: true }}
        />
      ) : activeTab === 'myTasks' ? (
        <MyTasksTable />
      ) : activeTab === 'submittedRequests' ? (
        <SubmittedRequestsTable />
      ) : (
        <div className="border-border bg-card rounded-2xl border p-6 text-start">
          <h2 className="text-foreground text-lg font-medium">Tab content</h2>
          <p className="text-muted-foreground mt-1 text-sm">Tab content placeholder.</p>
        </div>
      )}

      {isAddL2ModalOpen ? (
        <div className="bg-foreground/40 fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-[1px]">
          <div className="border-border bg-background w-full max-w-[560px] rounded-2xl border p-7 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-foreground text-4xl/none font-semibold">
                  Add multiple processes
                </h2>
                <p className="text-muted-foreground mt-3 text-lg">
                  Please select the number of processes you want to add.
                </p>
                {targetRowName ? (
                  <p className="text-muted-foreground mt-2 text-sm">
                    Parent process:{' '}
                    <span className="text-foreground font-medium">{targetRowName}</span>
                  </p>
                ) : null}
              </div>

              <Button
                type="button"
                size="icon-sm"
                variant="ghost"
                className="text-muted-foreground"
                aria-label="Close"
                onClick={() => setIsAddL2ModalOpen(false)}
              >
                <X className="size-5" />
              </Button>
            </div>

            <div className="mt-8 space-y-3">
              <label htmlFor="process-count" className="text-foreground text-lg">
                How many processes you want to add?
              </label>
              <select
                id="process-count"
                value={numberOfProcesses}
                onChange={(event) => setNumberOfProcesses(event.target.value)}
                className="border-border bg-background text-foreground focus-visible:ring-ring h-14 w-full rounded-xl border ps-4 pe-4 text-lg outline-none focus-visible:ring-2"
              >
                {[1, 2, 3, 4, 5].map((value) => (
                  <option key={value} value={String(value)}>
                    {value}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="secondary"
                className="h-12 rounded-full"
                onClick={() => setIsAddL2ModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="h-12 rounded-full"
                onClick={() => {
                  console.log('Add L2 processes', {
                    count: numberOfProcesses,
                    parent: targetRowName,
                  })
                  setIsAddL2ModalOpen(false)
                }}
              >
                Add
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      <ProcessFilterSheet
        open={isFilterOpen}
        onOpenChange={setIsFilterOpen}
        filters={PROCESS_FILTER_DEFINITIONS}
        pending={pending}
        onToggle={toggle}
        onApply={apply}
        onReset={reset}
      />
    </section>
  )
}

export default CatalogModule
