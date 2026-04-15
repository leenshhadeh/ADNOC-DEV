import { useMemo, useState } from 'react'
import { Download, Loader2, Save } from 'lucide-react'
import type { RowSelectionState } from '@tanstack/react-table'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/shared/components/ui/breadcrumb'
import ModuleToolbar from '@/shared/components/ModuleToolbar'
import { SuccessToast } from '@/shared/components/SuccessToast'
import { useGetAutomationTargets } from '../hooks/useGetAutomationTargets'
import { submitForApproval } from '../api/automationTargetsService'
import { AUTOMATION_TARGETS_TABS } from '../constants/toolbar'
import AutomationTargetsTable from './tables/AutomationTargetsTable'
import SMEFeedbackSheet from './sidePanels/SMEFeedbackSheet'
import SubmitForApprovalModal from './modals/SubmitForApprovalModal'
import type { AutomationTargetRow } from '../types'

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
      <div className="pt-5 pb-1">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Automation Targets</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

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
          <AutomationTargetsTable data={filteredData} onSmeFeedbackClick={handleSmeFeedbackClick} />
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
