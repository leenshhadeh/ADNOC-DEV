/**
 * AssessmentBulkModals — four modals for bulk actions on the Processes tab.
 *
 * Modals (Figma nodes):
 *   6103-253903  BulkEditModal          — select field + text input
 *   6103-253749  BulkCommentModal       — textarea for comment
 *   6103-255506  CopyAssessmentData     — search + source process picker
 *   6103-253829  MarkAsReviewedModal    — required comment textarea
 */
import { useState } from 'react'
import { createPortal } from 'react-dom'
import { ChevronDown, Search, X } from 'lucide-react'

import BaseModal from '@/shared/components/BaseModal'
import { SuccessToast } from '@/shared/components/SuccessToast'
import { Button } from '@/shared/components/ui/button'
import { Select } from '@/shared/components/ui/select'
import { Textarea } from '@/shared/components/ui/textarea'
import { DOMAINS_DATA } from '@features/module-process-catalog/constants/domains-data'
import BUSheet from './sidePanels/BUSheet'
import SharedServicesSheet from './sidePanels/SharedServicesSheet'
import DigitalTeamSheet from './sidePanels/DigitalTeamSheet'

// ── Field type definitions ────────────────────────────────────────────────────

type BulkFieldType = 'input' | 'number' | 'textarea' | 'dropdown' | 'drawer'

interface BulkEditFieldConfig {
  label: string
  value: string
  type: BulkFieldType
  options?: { label: string; value: string }[]
}

const BULK_EDITABLE_FIELDS: BulkEditFieldConfig[] = [
  { label: 'Automation Level (%)', value: 'automationLevel', type: 'number' },
  {
    label: 'Process Criticality',
    value: 'processCriticality',
    type: 'dropdown',
    options: [
      { label: 'High', value: 'high' },
      { label: 'Medium', value: 'medium' },
      { label: 'Low', value: 'low' },
    ],
  },
  {
    label: 'Scale of Process',
    value: 'scaleOfProcess',
    type: 'dropdown',
    options: [
      { label: 'Large', value: 'large' },
      { label: 'Medium', value: 'medium' },
      { label: 'Small', value: 'small' },
    ],
  },
  {
    label: 'Automation Maturity Level',
    value: 'automationMaturityLevel',
    type: 'dropdown',
    options: [
      { label: 'Initial', value: 'initial' },
      { label: 'Developing', value: 'developing' },
      { label: 'Defined', value: 'defined' },
      { label: 'Managed', value: 'managed' },
      { label: 'Optimizing', value: 'optimizing' },
    ],
  },
  {
    label: 'AI-Powered',
    value: 'aiPowered',
    type: 'dropdown',
    options: [
      { label: 'Yes', value: 'yes' },
      { label: 'No', value: 'no' },
    ],
  },
  { label: 'North Star Target Automation', value: 'northStarTargetAutomation', type: 'number' },
  { label: 'Target Automation Level (%)', value: 'targetAutomationLevelPercent', type: 'number' },
  {
    label: 'Ongoing Automation / Digital Initiatives',
    value: 'ongoingAutomationDigitalInitiatives',
    type: 'textarea',
  },
  {
    label: 'Business Recommendation for Automation',
    value: 'businessRecommendationForAutomation',
    type: 'textarea',
  },
  {
    label: 'Key Challenges & Automation Needs',
    value: 'keyChallengesAutomationNeeds',
    type: 'textarea',
  },
  { label: 'SME Feedback', value: 'smeFeedback', type: 'textarea' },
  { label: 'Business Unit', value: 'businessUnit', type: 'drawer' },
  { label: 'Shared Services', value: 'sharedServices', type: 'drawer' },
  { label: 'Responsible Digital Team', value: 'responsibleDigitalTeam', type: 'drawer' },
]

// ── Shared field styles ───────────────────────────────────────────────────────

const fieldLabel = 'text-muted-foreground mb-1.5 block text-sm'
const fieldInput =
  'border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-ring w-full rounded-xl border px-4 py-3 text-base outline-none focus-visible:ring-2'

// ── Bulk Edit Modal ────────────────────────────────────────────────────────────

interface BulkEditModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedCount: number
  onConfirm: (field: string, value: string) => void
}

export function BulkEditModal({
  open,
  onOpenChange,
  selectedCount,
  onConfirm,
}: BulkEditModalProps) {
  const [fieldValue, setFieldValue] = useState('')
  const [value, setValue] = useState('')
  const [sheetOpen, setSheetOpen] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const selectedField = BULK_EDITABLE_FIELDS.find((f) => f.value === fieldValue) ?? null
  const isDrawer = selectedField?.type === 'drawer'
  const isValueValid = isDrawer ? false : !!value.trim()

  const reset = () => {
    setFieldValue('')
    setValue('')
    setSheetOpen(false)
  }

  const close = () => {
    reset()
    onOpenChange(false)
  }

  const handleFieldChange = (next: string) => {
    setFieldValue(next)
    setValue('')
  }

  const handleApply = (finalValue: string) => {
    onConfirm(fieldValue, finalValue)
    close()
    setShowSuccess(true)
  }

  /** Called by BUSheet / DigitalTeamSheet Save button (passes selected string[]) or Cancel (passes undefined) */
  const handleSheetSave = (val?: string | string[]) => {
    setSheetOpen(false)
    if (val !== undefined && val !== null) {
      const label = Array.isArray(val) ? val.join(', ') : String(val)
      if (label) handleApply(label)
    }
  }

  const gradCancel =
    'rounded-[36px] bg-gradient-to-r from-[#EAEFFF] to-[#C7D6F9] px-6 py-3 text-[14px] font-[500] text-[#151718] shadow transition-opacity hover:opacity-80 disabled:opacity-40'
  const gradApply =
    'rounded-full bg-gradient-to-r from-[#5B23FF] to-[#3C00EB] px-6 py-3 text-[14px] font-[500] text-white shadow transition-opacity hover:opacity-80 disabled:opacity-40'

  return (
    <>
      <BaseModal
        open={open}
        onClose={close}
        title={`Bulk edit to ${selectedCount} selected process${selectedCount !== 1 ? 'es' : ''}`}
        subtitle="Changes will apply to all selected items."
        footer={
          <>
            <button type="button" className={gradCancel} onClick={close}>
              Cancel
            </button>
            {isDrawer ? (
              <button
                type="button"
                className={gradApply}
                disabled={!fieldValue}
                onClick={() => setSheetOpen(true)}
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                className={gradApply}
                disabled={!fieldValue || !isValueValid}
                onClick={() => handleApply(value)}
              >
                Apply changes
              </button>
            )}
          </>
        }
      >
        {/* Field / Column name */}
        <div>
          <label className={fieldLabel}>Field / Column name</label>
          <div className="relative">
            <Select
              options={BULK_EDITABLE_FIELDS.map((f) => ({ label: f.label, value: f.value }))}
              value={fieldValue}
              placeholder="Select a field…"
              onChange={handleFieldChange}
              className={`${fieldInput} h-auto appearance-none pe-10`}
            />
            <ChevronDown className="pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2 text-[#687076]" />
          </div>
        </div>

        {/* Dynamic value field — hidden for drawer-based fields and until a field is selected */}
        {fieldValue && !isDrawer && (
          <div>
            <label className={fieldLabel}>Value</label>
            {selectedField?.type === 'dropdown' && (
              <div className="relative">
                <Select
                  options={selectedField.options ?? []}
                  value={value}
                  placeholder="Select a value…"
                  onChange={setValue}
                  className={`${fieldInput} h-auto appearance-none pe-10`}
                />
                <ChevronDown className="pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2 text-[#687076]" />
              </div>
            )}
            {selectedField?.type === 'textarea' && (
              <Textarea
                value={value}
                onChange={(e) => setValue(e.target.value)}
                rows={4}
                placeholder="Enter value…"
                className={`${fieldInput} resize-none`}
              />
            )}
            {(selectedField?.type === 'input' || selectedField?.type === 'number') && (
              <input
                type={selectedField.type === 'number' ? 'number' : 'text'}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Enter value…"
                className={fieldInput}
              />
            )}
          </div>
        )}
      </BaseModal>

      {/* ── Dedicated sheets for drawer-type fields ───────────────────── */}
      {fieldValue === 'businessUnit' && (
        <BUSheet
          open={sheetOpen}
          selected={Array.isArray(value) ? value : []}
          handleOpenChange={handleSheetSave}
        />
      )}
      {fieldValue === 'sharedServices' && (
        <SharedServicesSheet
          open={sheetOpen}
          handleOpenChange={(payload: any) => {
            console.log('payload', payload)
          }}
          onClose={() => setSheetOpen(false)}
        />
      )}
      {fieldValue === 'responsibleDigitalTeam' && (
        <DigitalTeamSheet
          open={sheetOpen}
          selected={Array.isArray(value) ? value : []}
          handleOpenChange={handleSheetSave}
        />
      )}

      {/* Success toast */}
      <SuccessToast
        open={showSuccess}
        message="Bulk edit applied successfully."
        onClose={() => setShowSuccess(false)}
      />
    </>
  )
}

// ── Bulk Comment Modal ─────────────────────────────────────────────────────────

interface BulkCommentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedCount: number
  onConfirm: (comment: string) => void
}

export function BulkCommentModal({
  open,
  onOpenChange,
  selectedCount,
  onConfirm,
}: BulkCommentModalProps) {
  const [comment, setComment] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)

  const close = () => {
    setComment('')
    onOpenChange(false)
  }

  return (
    <>
      <BaseModal
        open={open}
        onClose={close}
        title={`Bulk comment to ${selectedCount} selected processes`}
        subtitle="The comment will appear in the Comments tab for each selected process."
        footer={
          <>
            <Button type="button" variant="secondary" className="h-12 rounded-full" onClick={close}>
              Cancel
            </Button>
            <Button
              type="button"
              className="h-12 rounded-full"
              disabled={!comment.trim()}
              onClick={() => {
                onConfirm(comment.trim())
                close()
                setShowSuccess(true)
              }}
            >
              Save
            </Button>
          </>
        }
      >
        <div>
          <label className={fieldLabel}>Comment</label>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            placeholder="Enter comment…"
            className={`${fieldInput} resize-none`}
          />
        </div>
      </BaseModal>

      <SuccessToast
        open={showSuccess}
        message="Bulk comment added successfully."
        onClose={() => setShowSuccess(false)}
      />
    </>
  )
}

// ── Copy Assessment Data Modal ─────────────────────────────────────────────────

interface CopyAssessmentDataModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedCount: number
  onConfirm: (sourceId: string) => void
}

interface SourceProcess {
  id: string
  name: string
  code: string
  level: number
  domain: string
  status: 'Published' | 'Draft' | 'In Review'
}

const MOCK_SOURCE_PROCESSES: SourceProcess[] = [
  {
    id: 'src-1',
    name: 'Accounts Payable Invoice Processing',
    code: 'ANN.1.1.3',
    level: 3,
    domain: 'dom-006',
    status: 'Published',
  },
  {
    id: 'src-2',
    name: 'Procurement Purchase Order Management',
    code: 'SCM.2.3.1',
    level: 3,
    domain: 'dom-009',
    status: 'Published',
  },
  {
    id: 'src-3',
    name: 'HR Onboarding Process',
    code: 'HR.1.2.4',
    level: 4,
    domain: 'dom-003',
    status: 'Draft',
  },
  {
    id: 'src-4',
    name: 'Asset Maintenance Scheduling',
    code: 'OPS.3.1.2',
    level: 3,
    domain: 'dom-001',
    status: 'In Review',
  },
  {
    id: 'src-5',
    name: 'Budget Planning & Forecasting',
    code: 'FIN.4.2.1',
    level: 4,
    domain: 'dom-006',
    status: 'Published',
  },
  {
    id: 'src-6',
    name: 'Supplier Evaluation & Selection',
    code: 'SCM.1.4.3',
    level: 3,
    domain: 'dom-009',
    status: 'Draft',
  },
  {
    id: 'src-7',
    name: 'Capital Expenditure Approval',
    code: 'FIN.2.1.5',
    level: 4,
    domain: 'dom-003',
    status: 'Published',
  },
]

const DOMAIN_OPTIONS = [
  { label: 'Domain', value: 'all' },
  ...DOMAINS_DATA.map((d) => ({ label: d.name, value: d.id })),
]

const LEVEL_OPTIONS = [
  { label: 'Level', value: 'Level' },
  { label: 'Level 3', value: 'Level 3' },
  { label: 'Level 4', value: 'Level 4' },
]

const STATUS_BADGE_STYLES: Record<SourceProcess['status'], string> = {
  Published: 'bg-[#DFEBFF] text-[#151718]',
  Draft: 'bg-accent text-[#687076]',
  'In Review': 'bg-[#FFF3D6] text-[#7A4F00]',
}

export function CopyAssessmentDataModal({
  open,
  onOpenChange,
  selectedCount: _selectedCount,
  onConfirm,
}: CopyAssessmentDataModalProps) {
  const [search, setSearch] = useState('')
  const [selectedLevel, setSelectedLevel] = useState('Level')
  const [selectedDomain, setSelectedDomain] = useState('all')
  const [pendingSource, setPendingSource] = useState<SourceProcess | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const closeDrawer = () => {
    setSearch('')
    setSelectedLevel('Level')
    setSelectedDomain('all')
    setPendingSource(null)
    setConfirmOpen(false)
    onOpenChange(false)
  }

  const handleRowClick = (process: SourceProcess) => {
    setPendingSource(process)
    setConfirmOpen(true)
  }

  const handleConfirmCopy = () => {
    if (pendingSource) {
      onConfirm(pendingSource.id)
    }
    closeDrawer()
    setShowSuccess(true)
  }

  const filtered = MOCK_SOURCE_PROCESSES.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.code.toLowerCase().includes(search.toLowerCase())
    const matchesLevel = selectedLevel === 'Level' || `Level ${p.level}` === selectedLevel
    const matchesDomain = selectedDomain === 'all' || p.domain === selectedDomain
    return matchesSearch && matchesLevel && matchesDomain
  })

  return createPortal(
    <>
      {/* ── Overlay ── */}
      {open && (
        <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[1px]" onClick={closeDrawer} />
      )}

      {/* ── Side Drawer ── */}
      <aside
        className={`fixed inset-y-0 end-0 z-50 flex w-[480px] flex-col bg-[#FDFDFD] shadow-2xl transition-transform duration-300 ease-in-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-10 pb-0">
          <div className="flex flex-col gap-1">
            <h2 className="text-[24px] leading-8 font-[500] text-[#111827]">
              Copy Assessment Data
            </h2>
            <p className="mt-3 text-[16px] leading-normal font-[400] text-[#687076]">
              All copied fields will replace the current values in this draft.
            </p>
          </div>
          <button
            type="button"
            onClick={closeDrawer}
            className="hover:bg-accent mt-1 rounded-full p-1.5 text-[#687076] transition-colors"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Search + Filters */}
        <div className="px-6 pt-6 pb-8">
          <div className="flex items-center">
            {/* Search input - Using flex-[2] to take double the space of others */}
            <div className="relative flex-[2]">
              <Search className="pointer-events-none absolute start-4 top-1/2 size-4 -translate-y-1/2 text-[#889096]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search processes…"
                className={`w-full rounded-2xl border bg-white py-3 ps-11 pe-4 text-base text-[#151718] transition-colors outline-none placeholder:text-[#889096] ${
                  search ? 'border-brand-blue' : 'border-[#DFE3E6]'
                }`}
              />
            </div>

            {/* Domain filter - Using flex-1 */}
            <div className="relative flex-1">
              <Select
                options={DOMAIN_OPTIONS}
                value={selectedDomain}
                onChange={setSelectedDomain}
                // Changed max-w-[150px] to w-full so it fills its 1/3 share
                className="h-auto w-full appearance-none rounded-2xl py-3 ps-4 pe-9 text-base font-medium text-[#151718]"
              />
              <ChevronDown className="pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2 text-[#687076]" />
            </div>

            {/* Level filter - Using flex-1 */}
            <div className="relative flex-1">
              <Select
                options={LEVEL_OPTIONS}
                value={selectedLevel}
                onChange={setSelectedLevel}
                className="h-auto w-full appearance-none rounded-2xl py-3 ps-4 pe-9 text-base font-medium text-[#151718]"
              />
              <ChevronDown className="pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2 text-[#687076]" />
            </div>
          </div>
        </div>
        {/* Results — each process as its own card */}
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          {filtered.length === 0 ? (
            <p className="py-8 text-center text-sm text-[#889096]">No processes found.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {filtered.map((process) => (
                <button
                  key={process.id}
                  type="button"
                  onClick={() => handleRowClick(process)}
                  className="flex w-full items-center justify-between rounded-3xl bg-white px-6 py-5 text-left shadow-[0px_4px_8px_0px_rgba(209,213,223,0.5)] transition-shadow hover:shadow-md"
                >
                  <div className="flex min-w-0 flex-col gap-1">
                    <span className="text-[16px] leading-5 font-[500] text-[#151718]">
                      {process.name}
                    </span>
                    <div className="flex items-center gap-3 pt-1">
                      <span className="text-[14px] leading-[14px] font-[400] text-[#889096]">
                        Code: {process.code}
                      </span>
                      <span className="text-[14px] leading-[14px] font-[500] text-[#889096]">
                        ·
                      </span>
                      <span className="text-[14px] leading-[14px] font-[400] text-[#889096]">
                        Level: {process.level}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`ml-4 shrink-0 rounded-full px-3 py-1 text-[12px] leading-[14.4px] font-[400] ${STATUS_BADGE_STYLES[process.status]}`}
                  >
                    {process.status}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </aside>

      {/* ── Confirmation Modal ── */}
      {confirmOpen && pendingSource && (
        <>
          <div className="fixed inset-0 z-[60] bg-black/50" onClick={() => setConfirmOpen(false)} />
          <div className="fixed inset-0 z-[61] flex items-center justify-center p-4">
            <div className="bg-accent w-full max-w-[540px] rounded-2xl p-8 shadow-2xl">
              <div className="flex items-start gap-2">
                <div className="flex flex-1 flex-col gap-2">
                  <h3 className="text-[24px] leading-8 font-[500] text-[#151718]">
                    Confirm copy from &ldquo;{pendingSource.name}&rdquo;
                  </h3>
                  <p className="text-[16px] leading-6 font-[400] text-[#687076]">
                    Copying will overwrite your existing draft values. You can still edit the copied
                    data before submitting for review.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setConfirmOpen(false)}
                  className="mt-1 rounded-full p-1.5 text-[#687076] transition-colors hover:bg-[#E4E7EA]"
                  aria-label="Close"
                >
                  <X className="size-5" />
                </button>
              </div>
              <div className="mt-8 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setConfirmOpen(false)}
                  className="flex-1 rounded-[36px] bg-gradient-to-r from-[#EAEFFF] to-[#C7D6F9] px-6 py-3 text-[14px] font-[500] text-[#151718] shadow transition-opacity hover:opacity-80"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmCopy}
                  className="flex-1 rounded-full bg-gradient-to-r from-[#5B23FF] to-[#3C00EB] px-6 py-3 text-[14px] font-[500] text-white shadow transition-opacity hover:opacity-80"
                >
                  Copy
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── Success Toast ── */}
      <SuccessToast
        open={showSuccess}
        message="Assessment data copied and applied successfully."
        onClose={() => setShowSuccess(false)}
      />
    </>,
    document.body,
  )
}

// ── Mark As Reviewed Modal ─────────────────────────────────────────────────────

interface MarkAsReviewedModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedCount: number
  onConfirm: (comment: string) => void
}

const MAX_REVIEW_CHARS = 500

export function MarkAsReviewedModal({
  open,
  onOpenChange,
  selectedCount,
  onConfirm,
}: MarkAsReviewedModalProps) {
  const [comment, setComment] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)

  const close = () => {
    setComment('')
    onOpenChange(false)
  }

  return (
    <>
      <BaseModal
        open={open}
        onClose={close}
        title="Mark as reviewed"
        subtitle={`The comment will appear in the Comments tab for each of the ${selectedCount} selected process${selectedCount !== 1 ? 'es' : ''}.`}
        footer={
          <>
            <Button type="button" variant="secondary" className="h-12 rounded-full" onClick={close}>
              Cancel
            </Button>
            <Button
              type="button"
              className="h-12 rounded-full"
              disabled={!comment.trim()}
              onClick={() => {
                onConfirm(comment.trim())
                close()
                setShowSuccess(true)
              }}
            >
              Mark as reviewed
            </Button>
          </>
        }
      >
        <div>
          <label className={fieldLabel}>
            Comment <span className="text-destructive">*</span>
          </label>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value.slice(0, MAX_REVIEW_CHARS))}
            rows={4}
            placeholder="Enter review comment…"
            className={`${fieldInput} resize-none`}
          />
          <p className="text-muted-foreground mt-1 text-right text-xs">
            {comment.length} / {MAX_REVIEW_CHARS}
          </p>
        </div>
      </BaseModal>

      <SuccessToast
        open={showSuccess}
        message="Processes marked as reviewed successfully."
        onClose={() => setShowSuccess(false)}
      />
    </>
  )
}
