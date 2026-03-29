import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { X } from 'lucide-react'
import type { RowSelectionState } from '@tanstack/react-table'
import { Button } from '@/shared/components/ui/button'
import CatalogHeader, { type CatalogTabValue } from './CatalogHeader'
import DataTable from './data-table/DataTable'
import { buildCatalogColumns, type CatalogColumnActions } from './catalog-columns'
import MyTasksTable from './tables/MyTasksTable'
import SubmittedRequestsTable from './tables/SubmittedRequestsTable'
import ProcessFilterSheet from './ProcessFilterSheet'
import AddLevel4sModal from './AddLevel4sModal'
import { EditLevel4sModal } from './EditLevel4sModal'
import { FILTER_SECTION_IDS } from '@features/module-process-catalog/constants/filter-definitions'
import {
  useProcessFilters,
  applyProcessFilters,
} from '@features/module-process-catalog/hooks/useProcessFilters'
import { useProcessFilterDefinitions } from '@features/module-process-catalog/hooks/useProcessFilterDefinitions'
import { useGetLevel4s } from '@features/module-process-catalog/hooks/useGetLevel4s'
import { useGetProcessCatalogRows } from '@features/module-process-catalog/hooks/useGetProcessCatalogRows'
import { useGetGroupCompanies } from '@features/module-process-catalog/hooks/useGetGroupCompanies'
import type { ProcessItem } from '@features/module-process-catalog/types'

const CatalogModule = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<CatalogTabValue>('processes')
  const [isAddL2ModalOpen, setIsAddL2ModalOpen] = useState(false)
  const [numberOfProcesses, setNumberOfProcesses] = useState('1')
  const [targetItem, setTargetItem] = useState<ProcessItem | null>(null)
  const [isBulkMode, setIsBulkMode] = useState(false)
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isAddL4sModalOpen, setIsAddL4sModalOpen] = useState(false)
  const [isEditL4sModalOpen, setIsEditL4sModalOpen] = useState(false)
  const [targetL3Item, setTargetL3Item] = useState<ProcessItem | null>(null)

  // ── Server state ────────────────────────────────────────────────────────────
  // Row data comes from API; group companies are a user-scoped lookup.
  const { data: serverRows } = useGetProcessCatalogRows()
  const { data: groupCompanies } = useGetGroupCompanies()

  // Table data as mutable state so we can inject draft rows.
  // Seeded from the server response; draft rows are injected locally.
  const [tableData, setTableData] = useState<ProcessItem[]>([])

  useEffect(() => {
    if (serverRows) setTableData(serverRows)
  }, [serverRows])

  const [firstDraftRowId, setFirstDraftRowId] = useState<string | undefined>()
  const tableContainerRef = useRef<HTMLDivElement>(null)

  const filterDefs = useProcessFilterDefinitions(groupCompanies, serverRows)
  const { pending, applied, activeCount, activePerSection, toggle, apply, reset } =
    useProcessFilters(FILTER_SECTION_IDS)

  // Computed filtered view — does not mutate tableData (draft injection is preserved)
  const filteredData = useMemo(() => applyProcessFilters(tableData, applied), [tableData, applied])

  // Fetch existing L4s for the selected L3 row — only runs when Edit L4s modal is open
  const { data: existingL4s, isLoading: isLoadingL4s } = useGetLevel4s(
    isEditL4sModalOpen ? (targetL3Item?.id ?? undefined) : undefined,
  )

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
    onAddL3: (item) => {
      setTargetItem(item)
      setIsAddL2ModalOpen(true)
    },
    onRename: (item) => {
      console.log('Rename', item.id)
    },
    onViewRecordedChanges: (item) => {
      navigate(`/process-catalog/recorded-changes/${item.id}`)
    },
    onSwitchToDraft: (item) => {
      setTableData((prev) =>
        prev.map((row) => (row.id === item.id ? { ...row, level3Status: 'Draft' } : row)),
      )
    },
    onAddL4s: (item) => {
      setTargetL3Item(item)
      setIsAddL4sModalOpen(true)
    },
    onEditL4s: (item) => {
      setTargetL3Item(item)
      setIsEditL4sModalOpen(true)
    },
  }

  // Rebuild columns only when the group company structure changes (first API load
  // or user permission change). rowActions callbacks are stable via closure.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const columns = useMemo(
    () => buildCatalogColumns(rowActions, groupCompanies ?? []),
    [groupCompanies],
  )

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
        activeFilterCount={activeCount}
        hasDraftRows={hasDraftRows}
        onSave={handleSave}
        onValidate={handleValidate}
      />

      {activeTab === 'processes' ? (
        <div ref={tableContainerRef} className="overflow-auto">
          <DataTable
            columns={columns}
            data={filteredData}
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
        filters={filterDefs}
        pending={pending}
        activePerSection={activePerSection}
        onToggle={toggle}
        onApply={apply}
        onReset={reset}
      />

      {/* Entry A — triggered from L3 dropdown "Add L4s" */}
      <AddLevel4sModal
        open={isAddL4sModalOpen}
        onOpenChange={setIsAddL4sModalOpen}
        parentItem={
          targetL3Item
            ? { level3Name: targetL3Item.level3Name, level3Code: targetL3Item.level3Code }
            : null
        }
        onSave={(groupCompany, items) => {
          // State is scoped to the modal. Do NOT inject into tableData.
          // Wire to a POST /api/level4s call here when the backend is ready.
          console.log('Save L4s (Entry A)', {
            groupCompany,
            items,
            parent: targetL3Item?.level3Code,
          })
        }}
      />

      {/* Entry B — triggered from "Edit L4s" cell action; rows live only inside the modal */}
      <EditLevel4sModal
        open={isEditL4sModalOpen}
        onOpenChange={setIsEditL4sModalOpen}
        parentLabel={targetL3Item?.level3Name ?? ''}
        parentCode={targetL3Item?.level3Code ?? ''}
        isLoading={isLoadingL4s}
        initialRows={existingL4s?.map((l4) => ({
          processCode: l4.processCode,
          processName: l4.name,
          processDescription: l4.description,
        }))}
        onSave={(rows) => {
          // State is scoped to the modal. Do NOT inject into tableData.
          // Wire to a PUT /api/level4s call here when the backend is ready.
          console.log('Save L4s (Entry B)', { rows, parent: targetL3Item?.level3Code })
        }}
      />
    </section>
  )
}

export default CatalogModule
