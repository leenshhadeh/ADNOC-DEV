import { useMemo, useState } from 'react'
import { Download, Loader2, Save } from 'lucide-react'
import type { RowSelectionState } from '@tanstack/react-table'
import ModuleToolbar from '@/shared/components/ModuleToolbar'
import { SuccessToast } from '@/shared/components/SuccessToast'
import { useGetAutomationTargets } from '../hooks/useGetAutomationTargets'
import { submitForApproval } from '../api/automationTargetsService'
import { AUTOMATION_TARGETS_TABS } from '../constants/toolbar'
import AutomationTargetsTable from './tables/AutomationTargetsTable'
import SMEFeedbackSheet from './sidePanels/SMEFeedbackSheet'
import SubmitForApprovalModal from './modals/SubmitForApprovalModal'
import type { AutomationTargetRow } from '../types'
import Breadcrumb from '@/shared/components/Breadcrumb'

/** Inserts a synthetic L3-group header row before each new L3 group.
 * Leaf L3 rows (level4Code === '') are shown as-is — no synthetic header. */
function generateDisplayRows(rows: AutomationTargetRow[]): AutomationTargetRow[] {
  const result: AutomationTargetRow[] = []
  let lastL3Code = ''
  for (const row of rows) {
    if (!row.level4Code) {
      // Leaf L3 — the row itself is the process; no synthetic header needed
      result.push(row)
      lastL3Code = row.level3Code
    } else {
      // L4 row — insert a synthetic L3 group header when the L3 changes
      if (row.level3Code !== lastL3Code) {
        result.push({
          ...row,
          id: `${row.id}-l3h`,
          level4: '',
          level4Code: '',
          isL3GroupHeader: true,
        })
        lastL3Code = row.level3Code
      }
      result.push(row)
    }
  }
  return result
}

const AutomationTargetsModule = () => {
  const [activeTab, setActiveTab] = useState('processes')
  const [search, setSearch] = useState('')
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  // ── SME Feedback Sheet ──────────────────────────────────────────────────
  const [smeSheetOpen, setSmeSheetOpen] = useState(false)
  const [smeTarget, setSmeTarget] = useState<AutomationTargetRow | null>(null)

  // ── Submit modal ────────────────────────────────────────────────────────
  const [submitModalOpen, setSubmitModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // ── Data ────────────────────────────────────────────────────────────────
  const { data: targets, isLoading } = useGetAutomationTargets()

  const filteredData = useMemo(() => {
    if (!targets) return []
    if (!search.trim()) return targets
    const q = search.toLowerCase()
    return targets.filter(
      (row) =>
        row.domain.toLowerCase().includes(q) ||
        row.level1.toLowerCase().includes(q) ||
        row.level2.toLowerCase().includes(q) ||
        row.level3.toLowerCase().includes(q) ||
        row.level4.toLowerCase().includes(q) ||
        row.groupCompany.toLowerCase().includes(q),
    )
  }, [targets, search])

  const displayData = useMemo(() => generateDisplayRows(filteredData), [filteredData])

  const handleSmeFeedbackClick = (row: AutomationTargetRow) => {
    setSmeTarget(row)
    setSmeSheetOpen(true)
  }

  const handleSmeFeedbackSaved = () => {
    setSmeSheetOpen(false)
    setToastMessage('SME Feedback saved successfully')
    setShowToast(true)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    const ids = filteredData.map((r) => r.id)
    await submitForApproval(ids)
    setIsSubmitting(false)
    setSubmitModalOpen(false)
    setToastMessage('Submitted for approval successfully')
    setShowToast(true)
  }

  return (
    <div className="flex flex-col gap-0 overflow-hidden px-6">
      {/* ── Breadcrumb ───────────────────────────────────────────────────── */}
     <Breadcrumb links={[{title:'Automation Targets'} ]} />

      {/* ── Title ────────────────────────────────────────────────────────── */}
      <div className="mb-4 flex items-center py-3">
        <h1 className="text-foreground text-2xl font-bold">Automation Targets Grid</h1>
      </div>

      {/* ── Toolbar ──────────────────────────────────────────────────────── */}
      <ModuleToolbar
        tabs={AUTOMATION_TARGETS_TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search processes…"
        actions={[
          {
            id: 'submit',
            label: 'Submit',
            icon: Save,
            onClick: () => setSubmitModalOpen(true),
          },
        ]}
      />

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <div className="mt-4 flex-1 overflow-hidden">
        {isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="text-muted-foreground size-6 animate-spin" />
          </div>
        ) : activeTab === 'processes' ? (
          <AutomationTargetsTable data={displayData} onSmeFeedbackClick={handleSmeFeedbackClick} />
        ) : activeTab === 'myTasks' ? (
          <div className="flex h-40 items-center justify-center">
            <p className="text-muted-foreground text-sm">My Tasks — coming soon</p>
          </div>
        ) : (
          <div className="flex h-40 items-center justify-center">
            <p className="text-muted-foreground text-sm">Submitted Requests — coming soon</p>
          </div>
        )}
      </div>

      {/* ── SME Feedback Sheet ───────────────────────────────────────────── */}
      <SMEFeedbackSheet
        open={smeSheetOpen}
        onOpenChange={setSmeSheetOpen}
        target={smeTarget}
        onSaved={handleSmeFeedbackSaved}
      />

      {/* ── Submit for Approval Modal ────────────────────────────────────── */}
      <SubmitForApprovalModal
        open={submitModalOpen}
        onOpenChange={setSubmitModalOpen}
        onConfirm={handleSubmit}
        isSubmitting={isSubmitting}
        count={filteredData.length}
      />

      {/* ── Toast ────────────────────────────────────────────────────────── */}
      <SuccessToast open={showToast} onClose={() => setShowToast(false)} message={toastMessage} />
    </div>
  )
}

export default AutomationTargetsModule
