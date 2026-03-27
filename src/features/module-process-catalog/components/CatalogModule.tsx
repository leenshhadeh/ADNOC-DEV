import { useCallback, useMemo, useRef, useState } from 'react'
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
import type { ProcessItem } from '@features/module-process-catalog/types'

const CatalogModule = () => {
  const [activeTab, setActiveTab] = useState<CatalogTabValue>('processes')
  const [isAddL2ModalOpen, setIsAddL2ModalOpen] = useState(false)
  const [numberOfProcesses, setNumberOfProcesses] = useState('1')
  const [targetItem, setTargetItem] = useState<ProcessItem | null>(null)
  const [isBulkMode, setIsBulkMode] = useState(false)
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Table data as mutable state so we can inject draft rows
  const [tableData, setTableData] = useState<ProcessItem[]>(CATALOG_DATA)
  const [firstDraftRowId, setFirstDraftRowId] = useState<string | undefined>()
  const tableContainerRef = useRef<HTMLDivElement>(null)

  const filterSectionIds = PROCESS_FILTER_DEFINITIONS.map((f) => f.id)
  const { pending, applied: _applied, toggle, apply, reset } = useProcessFilters(filterSectionIds)

  const selectedCount = Object.values(rowSelection).filter(Boolean).length

  const handleToggleBulkMode = () => {
    setIsBulkMode((prev) => {
      if (prev) setRowSelection({})
      return !prev
    })
  }

  /** Called when the user clicks "Add" in the modal */
  const handleAddProcesses = useCallback(() => {
    if (!targetItem) return
    const count = parseInt(numberOfProcesses, 10)

    // Find siblings (rows with same level2Code) to compute next code index
    const siblings = tableData.filter((r) => r.level2Code === targetItem.level2Code)
    const maxIndex = siblings.reduce((max, r) => {
      const parts = r.level3Code.split('.')
      const n = parseInt(parts[parts.length - 1], 10)
      return isNaN(n) ? max : Math.max(max, n)
    }, 0)

    const newRows: ProcessItem[] = Array.from({ length: count }, (_, i) => {
      const idx = maxIndex + i + 1
      const id = `draft-${targetItem.level2Code}-${idx}-${Date.now() + i}`
      return {
        id,
        domain: targetItem.domain,
        level1Name: targetItem.level1Name,
        level1Code: targetItem.level1Code,
        level2Name: targetItem.level2Name,
        level2Code: targetItem.level2Code,
        level3Name: '',
        level3Code: `${targetItem.level2Code}.${idx}`,
        level3Status: 'Draft',
        description: '',
        isSharedService: false,
        entities: Object.fromEntries(
          Object.keys(targetItem.entities).map((entity) => [
            entity,
            Object.fromEntries(
              Object.keys(targetItem.entities[entity]).map((site) => [site, 'No']),
            ),
          ]),
        ),
      } satisfies ProcessItem
    })

    setTableData((prev) => {
      // Insert new draft rows right after the last sibling of the same level 2
      const lastSiblingIdx = prev.reduce(
        (max, r, i) => (r.level2Code === targetItem.level2Code ? i : max),
        -1,
      )
      const insertAt = lastSiblingIdx >= 0 ? lastSiblingIdx + 1 : prev.length
      const next = [...prev]
      next.splice(insertAt, 0, ...newRows)
      return next
    })

    setFirstDraftRowId(newRows[0].id)
    setIsAddL2ModalOpen(false)

    // Scroll table to bottom after paint so first draft row is visible
    requestAnimationFrame(() => {
      tableContainerRef.current?.scrollTo({
        top: tableContainerRef.current.scrollHeight,
        behavior: 'smooth',
      })
    })
  }, [targetItem, numberOfProcesses, tableData])

  /** Updates a draft row field as the user types */
  const handleUpdateDraftRow = useCallback(
    (id: string, field: 'level3Name' | 'description', value: string) => {
      setTableData((prev) => prev.map((row) => (row.id === id ? { ...row, [field]: value } : row)))
    },
    [],
  )

  const hasDraftRows = tableData.some((r) => r.level3Status === 'Draft')

  const handleSave = useCallback(() => {
    // Promote all Draft rows to Published (replace with API call when ready)
    setTableData((prev) =>
      prev.map((row) =>
        row.level3Status === 'Draft' ? { ...row, level3Status: 'Published' } : row,
      ),
    )
    setFirstDraftRowId(undefined)
  }, [])

  const handleValidate = useCallback(() => {
    // Placeholder — wire to backend validation when ready
    console.log(
      'Validate drafts',
      tableData.filter((r) => r.level3Status === 'Draft'),
    )
  }, [tableData])

  const rowActions: CatalogColumnActions = {
    onAddL2: (item) => {
      setTargetItem(item)
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
        hasDraftRows={hasDraftRows}
        onSave={handleSave}
        onValidate={handleValidate}
      />

      {activeTab === 'processes' ? (
        <div ref={tableContainerRef} className="overflow-auto">
          <DataTable
            columns={columns}
            data={tableData}
            density="compact"
            enableColumnDnd={false}
            enableSorting={false}
            rowSelection={rowSelection}
            onRowSelectionChange={setRowSelection}
            getRowId={(row) => row.id}
            tableMeta={{
              isBulkMode,
              rowDividers: true,
              onUpdateDraftRow: handleUpdateDraftRow,
              firstDraftRowId,
            }}
          />
        </div>
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
                {targetItem ? (
                  <p className="text-muted-foreground mt-2 text-sm">
                    Parent process:{' '}
                    <span className="text-foreground font-medium">{targetItem.level2Name}</span>
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
              <Button type="button" className="h-12 rounded-full" onClick={handleAddProcesses}>
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
