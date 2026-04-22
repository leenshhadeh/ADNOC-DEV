import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AddProcessesModal from './AddProcessesModal'
import type { RowSelectionState } from '@tanstack/react-table'
import CatalogHeader from './CatalogHeader'
import DataTable from '../../../shared/components/data-table/DataTable'
import { buildCatalogColumns, type CatalogColumnActions } from './catalog-columns'
import type { CatalogView } from './CatalogHeader'
import type { ProcessViewOption } from '@/shared/components/ProcessesMenu'
import MyTasksTable from './tables/MyTasksTable'
import SubmittedRequestsTable from './tables/SubmittedRequestsTable'
import ProcessFilterSheet from './ProcessFilterSheet'
import AddLevel4sModal from './AddLevel4sModal'
import { EditLevel4sModal } from './EditLevel4sModal'
import RenameModal from './RenameModal'
import BulkActionBar, { type BulkAction } from './BulkActionBar'
import ProcessBulkActionBar, { type ProcessBulkAction } from './ProcessBulkActionBar'
import { ApproveModal, BulkEditModal, RejectModal, ReturnModal } from './modals'
import { RequestEndorsementModal } from '@features/module-assessment-data/components/TaskBulkModals'
import { SuccessToast } from '@/shared/components/SuccessToast'
import {
  bulkApproveTasks,
  bulkRejectTasks,
  bulkReturnTasks,
} from '@features/module-process-catalog/api/taskActionService'
import {
  bulkEditProcesses,
  bulkSubmitProcesses,
} from '@features/module-process-catalog/api/processBulkActionService'
import { exportToExcel } from '@features/module-process-catalog/utils/exportToExcel'
import { Info, X } from 'lucide-react'
import { FILTER_SECTION_IDS } from '@features/module-process-catalog/constants/filter-definitions'
import { DOMAINS_DATA } from '@features/module-process-catalog/constants/domains-data'
import {
  useProcessFilters,
  applyProcessFilters,
} from '@features/module-process-catalog/hooks/useProcessFilters'
import { useProcessFilterDefinitions } from '@features/module-process-catalog/hooks/useProcessFilterDefinitions'
import {
  useGetLevel4s,
  useGetLevel4Names,
} from '@features/module-process-catalog/hooks/useGetLevel4s'
import { saveLevel4s } from '@features/module-process-catalog/api/level4Service'
import { useGetProcessCatalogRows } from '@features/module-process-catalog/hooks/useGetProcessCatalogRows'
import { useGetGroupCompanies } from '@features/module-process-catalog/hooks/useGetGroupCompanies'
import { useCatalogNavStore } from '@features/module-process-catalog/store/useCatalogNavStore'
import type { ProcessItem } from '@features/module-process-catalog/types'
import { PROCESS_VIEW_OPTIONS } from '@/shared/components/ProcessesMenu'

const CatalogModule = () => {
  const navigate = useNavigate()
  const { activeTab, setActiveTab, highlightedProcessId, clearHighlight } = useCatalogNavStore()
  const [isAddL2ModalOpen, setIsAddL2ModalOpen] = useState(false)
  const [addMode, setAddMode] = useState<'l1' | 'l2' | 'l3'>('l3')
  const [currentView, setCurrentView] = useState<CatalogView>('default')
  const [numberOfProcesses, setNumberOfProcesses] = useState('1')
  const [targetItem, setTargetItem] = useState<ProcessItem | null>(null)
  const [isBulkMode, setIsBulkMode] = useState(false)
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isAddL4sModalOpen, setIsAddL4sModalOpen] = useState(false)
  const [isEditL4sModalOpen, setIsEditL4sModalOpen] = useState(false)
  const [targetL3Item, setTargetL3Item] = useState<ProcessItem | null>(null)
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false)
  const [renameTarget, setRenameTarget] = useState<ProcessItem | null>(null)
  const [isExporting, setIsExporting] = useState(false)
  const [draftNotificationDismissed, setDraftNotificationDismissed] = useState(false)
  const [processView, setProcessView] = useState<ProcessViewOption>(PROCESS_VIEW_OPTIONS[0])
  const [successToast, setSuccessToast] = useState<string | null>(null)
  const [draftValidationErrors, setDraftValidationErrors] = useState<Record<string, string[]>>({})

  // ── Processes bulk action state ─────────────────────────────────────────────
  const [bulkEditOpen, setBulkEditOpen] = useState(false)

  const selectedCount = Object.values(rowSelection).filter(Boolean).length

  const handleToggleBulkMode = () => {
    setIsBulkMode((prev) => {
      if (prev) setRowSelection({})
      return !prev
    })
  }

  const handleProcessBulkAction = (action: ProcessBulkAction) => {
    if (action === 'edit') setBulkEditOpen(true)
    else if (action === 'submit') handleBulkSubmitProcesses()
  }

  const handleBulkEditApply = async (companySite: string) => {
    const selectedIds = Object.keys(rowSelection).filter((k) => rowSelection[k])
    try {
      const result = await bulkEditProcesses({ processIds: selectedIds, companySite })
      setSuccessToast(`${result.processed} process(es) updated with "${companySite}".`)
    } catch {
      setSuccessToast('Failed to apply bulk edit.')
    }
    setRowSelection({})
    setIsBulkMode(false)
  }

  const handleBulkSubmitProcesses = async () => {
    const selectedIds = Object.keys(rowSelection).filter((k) => rowSelection[k])
    try {
      const result = await bulkSubmitProcesses({ processIds: selectedIds })
      setSuccessToast(`${result.processed} process(es) submitted successfully.`)
    } catch {
      setSuccessToast('Failed to submit processes.')
    }
    setRowSelection({})
    setIsBulkMode(false)
  }

  // ── My Tasks bulk action state ──────────────────────────────────────────────
  const [isTaskBulkMode, setIsTaskBulkMode] = useState(false)
  const [taskRowSelection, setTaskRowSelection] = useState<RowSelectionState>({})
  const [bulkApproveOpen, setBulkApproveOpen] = useState(false)
  const [bulkReturnOpen, setBulkReturnOpen] = useState(false)
  const [bulkRejectOpen, setBulkRejectOpen] = useState(false)
  const [bulkEndorsementOpen, setBulkEndorsementOpen] = useState(false)

  const taskSelectedCount = Object.values(taskRowSelection).filter(Boolean).length

  const handleToggleTaskBulkMode = () => {
    setIsTaskBulkMode((prev) => {
      if (prev) setTaskRowSelection({})
      return !prev
    })
  }

  const handleTaskBulkAction = (action: BulkAction) => {
    if (action === 'approve') setBulkApproveOpen(true)
    else if (action === 'return') setBulkReturnOpen(true)
    else if (action === 'reject') setBulkRejectOpen(true)
    else if (action === 'request-endorsement') setBulkEndorsementOpen(true)
  }

  const handleBulkApprove = async () => {
    const selectedIds = Object.keys(taskRowSelection).filter((k) => taskRowSelection[k])
    try {
      const result = await bulkApproveTasks({ taskIds: selectedIds })
      setSuccessToast(`${result.processed} request(s) approved successfully.`)
    } catch {
      setSuccessToast(`Failed to approve requests.`)
    }
    setTaskRowSelection({})
    setIsTaskBulkMode(false)
  }

  const handleBulkReject = async () => {
    const selectedIds = Object.keys(taskRowSelection).filter((k) => taskRowSelection[k])
    try {
      const result = await bulkRejectTasks({ taskIds: selectedIds })
      setSuccessToast(`${result.processed} request(s) rejected.`)
    } catch {
      setSuccessToast(`Failed to reject requests.`)
    }
    setTaskRowSelection({})
    setIsTaskBulkMode(false)
  }

  const handleBulkReturn = async (reason: string) => {
    const selectedIds = Object.keys(taskRowSelection).filter((k) => taskRowSelection[k])
    try {
      const result = await bulkReturnTasks({ taskIds: selectedIds, reason })
      setSuccessToast(`${result.processed} request(s) returned.`)
    } catch {
      setSuccessToast(`Failed to return requests.`)
    }
    setTaskRowSelection({})
    setIsTaskBulkMode(false)
  }

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

  // ── Deep-link scroll + highlight ────────────────────────────────────────────
  // When a task/request Eye button triggers navigateToProcess(), the store sets
  // highlightedProcessId. We wait one frame for the Processes tab to render,
  // then scroll the marked row into view and auto-clear after 2.5 s.
  useEffect(() => {
    if (!highlightedProcessId) return
    const frame = requestAnimationFrame(() => {
      const el = tableContainerRef.current?.querySelector(`[data-row-id="${highlightedProcessId}"]`)
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    })
    const timer = setTimeout(clearHighlight, 2500)
    return () => {
      cancelAnimationFrame(frame)
      clearTimeout(timer)
    }
  }, [highlightedProcessId, clearHighlight])

  const [firstDraftRowId, setFirstDraftRowId] = useState<string | undefined>()
  const tableContainerRef = useRef<HTMLDivElement>(null)

  const filterDefs = useProcessFilterDefinitions(groupCompanies, serverRows, DOMAINS_DATA)
  const { pending, applied, activeCount, activePerSection, toggle, apply, reset } =
    useProcessFilters(FILTER_SECTION_IDS)

  // Computed filtered view — does not mutate tableData (draft injection is preserved)
  const filteredData = useMemo(() => applyProcessFilters(tableData, applied), [tableData, applied])

  // Derive company/site options for the bulk edit "Applicable to" dropdown
  const companySiteOptions = useMemo(
    () =>
      (groupCompanies ?? []).flatMap((gc) => (gc.sites ?? []).map((s) => `${gc.name} - ${s.name}`)),
    [groupCompanies],
  )

  const handleExportFullReport = useCallback(async () => {
    setIsExporting(true)
    try {
      await exportToExcel({
        rows: filteredData,
        groupCompanies: groupCompanies ?? [],
        domains: DOMAINS_DATA,
        includeL4: true,
        filename: 'process-catalog-full-report',
      })
    } finally {
      setIsExporting(false)
    }
  }, [filteredData, groupCompanies])

  const handleExport = useCallback(async () => {
    setIsExporting(true)
    try {
      await exportToExcel({
        rows: filteredData,
        groupCompanies: groupCompanies ?? [],
        domains: DOMAINS_DATA,
        includeL4: false,
        filename: 'process-catalog',
      })
    } finally {
      setIsExporting(false)
    }
  }, [filteredData, groupCompanies])

  // Fetch existing L4s for the selected L3 row — only runs when Edit L4s modal is open
  const { data: existingL4s, isLoading: isLoadingL4s } = useGetLevel4s(
    isEditL4sModalOpen ? (targetL3Item?.id ?? undefined) : undefined,
  )

  // Fetch previously added L4 names for suggestion dropdown
  const { data: previousL4Names } = useGetLevel4Names(
    isEditL4sModalOpen || isAddL4sModalOpen ? (targetL3Item?.id ?? undefined) : undefined,
  )

  /** Called when the user clicks "Add" in the modal */
  const handleAddProcesses = useCallback(() => {
    if (!targetItem) return
    const count = parseInt(numberOfProcesses, 10)

    if (addMode === 'l1') {
      // ── Add L1 draft rows ──────────────────────────────────────────────────
      // Find existing L1s under the same domain to compute the next code index.
      const siblings = tableData.filter((r) => r.domain === targetItem.domain)
      const maxIndex = siblings.reduce((max, r) => {
        const parts = r.level1Code.split('.')
        const n = parseInt(parts[parts.length - 1], 10)
        return isNaN(n) ? max : Math.max(max, n)
      }, 0)

      const newRows: ProcessItem[] = Array.from({ length: count }, (_, i) => {
        const idx = maxIndex + i + 1
        const domainEntry = DOMAINS_DATA.find((d) => d.id === targetItem.domain)
        const domainCode = domainEntry?.code ?? targetItem.domain.slice(0, 3).toUpperCase()
        const level1Code = `${domainCode}.${idx}`
        const level2Code = `${level1Code}.1`
        const id = `draft-${level1Code}-${Date.now() + i}`
        return {
          id,
          domain: targetItem.domain,
          level1Name: '',
          level1Code,
          level2Name: '',
          level2Code,
          level3Name: '',
          level3Code: `${level2Code}.1`,
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
        const lastSiblingIdx = prev.reduce(
          (max, r, i) => (r.domain === targetItem.domain ? i : max),
          -1,
        )
        const insertAt = lastSiblingIdx >= 0 ? lastSiblingIdx + 1 : prev.length
        const next = [...prev]
        next.splice(insertAt, 0, ...newRows)
        return next
      })

      setFirstDraftRowId(newRows[0].id)
      setDraftNotificationDismissed(false)
      setIsAddL2ModalOpen(false)

      requestAnimationFrame(() => {
        tableContainerRef.current?.scrollTo({
          top: tableContainerRef.current.scrollHeight,
          behavior: 'smooth',
        })
      })
      return
    }

    if (addMode === 'l2') {
      // ── Add L2 draft rows ──────────────────────────────────────────────────
      // Siblings share the same level1Code; compute the next L2 index.
      const siblings = tableData.filter((r) => r.level1Code === targetItem.level1Code)
      const maxIndex = siblings.reduce((max, r) => {
        const parts = r.level2Code.split('.')
        const n = parseInt(parts[parts.length - 1], 10)
        return isNaN(n) ? max : Math.max(max, n)
      }, 0)

      const newRows: ProcessItem[] = Array.from({ length: count }, (_, i) => {
        const idx = maxIndex + i + 1
        const level2Code = `${targetItem.level1Code}.${idx}`
        const id = `draft-${level2Code}-${Date.now() + i}`
        return {
          id,
          domain: targetItem.domain,
          level1Name: targetItem.level1Name,
          level1Code: targetItem.level1Code,
          level2Name: '',
          level2Code,
          level3Name: '',
          level3Code: `${level2Code}.1`,
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
        const lastSiblingIdx = prev.reduce(
          (max, r, i) => (r.level1Code === targetItem.level1Code ? i : max),
          -1,
        )
        const insertAt = lastSiblingIdx >= 0 ? lastSiblingIdx + 1 : prev.length
        const next = [...prev]
        next.splice(insertAt, 0, ...newRows)
        return next
      })

      setFirstDraftRowId(newRows[0].id)
      setDraftNotificationDismissed(false)
      setIsAddL2ModalOpen(false)

      requestAnimationFrame(() => {
        tableContainerRef.current?.scrollTo({
          top: tableContainerRef.current.scrollHeight,
          behavior: 'smooth',
        })
      })
      return
    }

    // ── Add L3 draft rows (existing l3 logic) ────────────────────────────────
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
    setDraftNotificationDismissed(false)
    setIsAddL2ModalOpen(false)

    // Scroll table to bottom after paint so first draft row is visible
    requestAnimationFrame(() => {
      tableContainerRef.current?.scrollTo({
        top: tableContainerRef.current.scrollHeight,
        behavior: 'smooth',
      })
    })
  }, [targetItem, numberOfProcesses, tableData, addMode])

  /** Updates a draft row field as the user types */
  const handleUpdateDraftRow = useCallback(
    (
      id: string,
      field: 'level1Name' | 'level2Name' | 'level3Name' | 'description',
      value: string,
    ) => {
      setTableData((prev) => prev.map((row) => (row.id === id ? { ...row, [field]: value } : row)))
      if (value.trim()) {
        setDraftValidationErrors((prev) => {
          const rowErrors = prev[id]
          if (!rowErrors?.includes(field)) return prev
          const filtered = rowErrors.filter((f) => f !== field)
          if (filtered.length === 0) {
            const { [id]: _removed, ...rest } = prev
            return rest
          }
          return { ...prev, [id]: filtered }
        })
      }
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

  const handleDiscard = useCallback(() => {
    setTableData((prev) => prev.filter((r) => r.level3Status !== 'Draft'))
    setFirstDraftRowId(undefined)
    setDraftNotificationDismissed(false)
    setDraftValidationErrors({})
  }, [])

  const handleValidate = useCallback(() => {
    const PLACEHOLDER_RE = /^\s*(n\/a|na|tbd)\s*$/i
    const errors: Record<string, string[]> = {}
    for (const row of tableData) {
      if (row.level3Status !== 'Draft') continue
      const rowErrors: string[] = []
      if (!row.description.trim() || PLACEHOLDER_RE.test(row.description)) {
        rowErrors.push('description')
      }
      if (!row.level3Name.trim() || PLACEHOLDER_RE.test(row.level3Name)) {
        rowErrors.push('level3Name')
      }
      if (rowErrors.length > 0) errors[row.id] = rowErrors
    }
    setDraftValidationErrors(errors)
  }, [tableData])

  const rowActions: CatalogColumnActions = {
    onAddL1: (item) => {
      setTargetItem(item)
      setAddMode('l1')
      setNumberOfProcesses('1')
      setIsAddL2ModalOpen(true)
    },
    onAddL2: (item) => {
      setTargetItem(item)
      setAddMode('l2')
      setNumberOfProcesses('1')
      setIsAddL2ModalOpen(true)
    },
    onAddL3: (item) => {
      setTargetItem(item)
      setAddMode('l3')
      setNumberOfProcesses('1')
      setIsAddL2ModalOpen(true)
    },
    onRename: (item) => {
      setRenameTarget(item)
      setIsRenameModalOpen(true)
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

  // Rebuild columns only when the group company structure or view changes.
  // rowActions is intentionally omitted — its identity changes every render
  // but callbacks always close over the latest state via useState setters.
  const columns = useMemo(
    () =>
      buildCatalogColumns(
        rowActions,
        groupCompanies ?? [],
        currentView === 'full-report',
        DOMAINS_DATA,
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [groupCompanies, currentView],
  )

  return (
    <section className="space-y-4">
      <CatalogHeader
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab)
          if (tab !== 'myTasks' && isTaskBulkMode) {
            setIsTaskBulkMode(false)
            setTaskRowSelection({})
          }
        }}
        isBulkMode={isBulkMode}
        onToggleBulkMode={handleToggleBulkMode}
        selectedCount={selectedCount}
        onBulkAddProcesses={() => setIsAddL2ModalOpen(true)}
        onFilterClick={() => setIsFilterOpen(true)}
        activeFilterCount={activeCount}
        hasDraftRows={hasDraftRows}
        onSave={handleSave}
        onValidate={handleValidate}
        onDiscard={handleDiscard}
        currentView={currentView}
        onViewChange={setCurrentView}
        onExportFullReport={handleExportFullReport}
        onExport={handleExport}
        isExporting={isExporting}
        processView={processView}
        onProcessViewChange={setProcessView}
        isTaskBulkMode={isTaskBulkMode}
        onToggleTaskBulkMode={handleToggleTaskBulkMode}
        taskSelectedCount={taskSelectedCount}
      />

      {activeTab === 'processes' ? (
        <div ref={tableContainerRef} className="overflow-auto">
          {isBulkMode && selectedCount > 0 && (
            <ProcessBulkActionBar
              selectedCount={selectedCount}
              onAction={handleProcessBulkAction}
              onCancel={handleToggleBulkMode}
            />
          )}
          <DataTable
            columns={columns}
            data={filteredData}
            className="table-light"
            density="compact"
            enableColumnDnd={false}
            enableSorting={false}
            rowSelection={rowSelection}
            onRowSelectionChange={setRowSelection}
            getRowId={(row) => row.id}
            tableMeta={{
              isBulkMode,
              isFullReport: currentView === 'full-report',
              rowDividers: true,
              onUpdateDraftRow: handleUpdateDraftRow,
              firstDraftRowId,
              highlightedRowId: highlightedProcessId ?? undefined,
              draftValidationErrors,
            }}
          />
        </div>
      ) : activeTab === 'myTasks' ? (
        <>
          {isTaskBulkMode && (
            <BulkActionBar
              selectedCount={taskSelectedCount}
              onAction={handleTaskBulkAction}
              onCancel={handleToggleTaskBulkMode}
            />
          )}
          <MyTasksTable
            isBulkMode={isTaskBulkMode}
            rowSelection={taskRowSelection}
            onRowSelectionChange={setTaskRowSelection}
          />
        </>
      ) : activeTab === 'submittedRequests' ? (
        <SubmittedRequestsTable />
      ) : (
        <div className="border-border bg-card rounded-2xl border p-6 text-start">
          <h2 className="text-foreground text-lg font-medium">Tab content</h2>
          <p className="text-muted-foreground mt-1 text-sm">Tab content placeholder.</p>
        </div>
      )}

      <AddProcessesModal
        open={isAddL2ModalOpen}
        onOpenChange={setIsAddL2ModalOpen}
        numberOfProcesses={numberOfProcesses}
        onNumberOfProcessesChange={setNumberOfProcesses}
        onAdd={handleAddProcesses}
      />

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

      {/* ── Draft editing notification ── */}
      {hasDraftRows && !draftNotificationDismissed && (
        <div className="fixed bottom-6 left-1/2 z-50 w-[380px] -translate-x-1/2">
          <div className="bg-accent flex items-start gap-2 rounded-2xl p-4 shadow-[0px_10px_30px_0px_rgba(0,0,0,0.2)]">
            <Info className="text-foreground mt-0.5 size-6 shrink-0" />
            <div className="flex flex-1 flex-col gap-2">
              <p className="text-foreground text-base leading-6 font-semibold">
                Now editing Draft version
              </p>
              <p className="text-foreground text-sm leading-6 font-normal">
                A Draft was created from the Published version. The Published version remains
                unchanged.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setDraftNotificationDismissed(true)}
              className="flex size-8 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-black/10"
              aria-label="Dismiss notification"
            >
              <X className="text-foreground size-6" />
            </button>
          </div>
        </div>
      )}

      {/* ── Exporting toast ── */}
      {isExporting && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
          <div className="bg-foreground text-background flex items-center gap-3 rounded-xl px-5 py-3 shadow-2xl">
            <svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
            <span className="text-sm font-medium">Preparing download…</span>
          </div>
        </div>
      )}

      {/* Entry A — triggered from L3 dropdown "Add L4s" */}
      <AddLevel4sModal
        open={isAddL4sModalOpen}
        onOpenChange={setIsAddL4sModalOpen}
        parentItem={
          targetL3Item
            ? { level3Name: targetL3Item.level3Name, level3Code: targetL3Item.level3Code }
            : null
        }
        previousProcessNames={previousL4Names}
        onSave={(companySites, items) => {
          // Wire to a POST /api/level4s call here when the backend is ready.
          console.log('Save L4s (Entry A)', {
            companySites,
            items,
            parent: targetL3Item?.level3Code,
          })
          setSuccessToast('Level 4s added as draft. Submit Level 3s to publish.')
        }}
      />

      <RenameModal
        open={isRenameModalOpen}
        onOpenChange={setIsRenameModalOpen}
        currentName={
          renameTarget?.level3Name ||
          renameTarget?.level2Name ||
          renameTarget?.level1Name ||
          renameTarget?.domain ||
          ''
        }
        onRename={(newName) => {
          if (!renameTarget) return
          console.log('Rename', renameTarget.id, '->', newName)
        }}
      />

      {/* Entry B — triggered from "Edit L4s" cell action; rows live only inside the modal */}
      <EditLevel4sModal
        open={isEditL4sModalOpen}
        onOpenChange={setIsEditL4sModalOpen}
        parentLabel={targetL3Item?.level3Name ?? ''}
        parentCode={targetL3Item?.level3Code ?? ''}
        isLoading={isLoadingL4s}
        previousProcessNames={previousL4Names}
        initialRows={existingL4s?.map((l4) => ({
          processName: l4.name,
          processDescription: l4.description,
        }))}
        onSave={async (rows) => {
          if (!targetL3Item) return
          try {
            const result = await saveLevel4s(
              targetL3Item.id,
              rows.map((r) => ({
                processName: r.processName,
                processDescription: r.processDescription,
                status: r.status,
              })),
            )
            setSuccessToast(
              `Level 4s saved — ${result.created} created, ${result.updated} updated, ${result.deleted} removed.`,
            )
          } catch {
            setSuccessToast('Failed to save Level 4 changes.')
          }
        }}
      />

      {/* ── Bulk action modals ── */}
      <BulkEditModal
        open={bulkEditOpen}
        onOpenChange={setBulkEditOpen}
        selectedCount={selectedCount}
        companySiteOptions={companySiteOptions}
        onApply={handleBulkEditApply}
      />
      <ApproveModal
        open={bulkApproveOpen}
        onOpenChange={setBulkApproveOpen}
        selectedCount={taskSelectedCount}
        onConfirm={handleBulkApprove}
      />
      <RejectModal
        open={bulkRejectOpen}
        onOpenChange={setBulkRejectOpen}
        selectedCount={taskSelectedCount}
        onConfirm={handleBulkReject}
      />
      <ReturnModal
        open={bulkReturnOpen}
        onOpenChange={setBulkReturnOpen}
        selectedCount={taskSelectedCount}
        onConfirm={handleBulkReturn}
      />
      <RequestEndorsementModal
        open={bulkEndorsementOpen}
        onOpenChange={setBulkEndorsementOpen}
        selectedCount={taskSelectedCount}
        onConfirm={(_names, _reason) => {
          setBulkEndorsementOpen(false)
          setSuccessToast(`Endorsement requested for ${taskSelectedCount} request(s).`)
          setTaskRowSelection({})
          setIsTaskBulkMode(false)
        }}
      />

      {/* ── Success toast ── */}
      <SuccessToast
        open={!!successToast}
        message={successToast ?? ''}
        onClose={() => setSuccessToast(null)}
      />
    </section>
  )
}

export default CatalogModule
