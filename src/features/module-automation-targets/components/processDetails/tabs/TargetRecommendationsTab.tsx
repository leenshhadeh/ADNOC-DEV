import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import RichTextEditor from '@/shared/components/ui/RichTextEditor'
import { useSaveTargetRecommendations } from '../../../hooks/useSaveTargetRecommendations'
import type { AutomationProcessDetail } from '../../../types'

interface TargetRecommendationsTabProps {
  process: AutomationProcessDetail
}

/* ── Read-only dropdown field (gray background) ──────────────────────────────── */

const ReadOnlyDropdown = ({ label, value }: { label: string; value: string }) => (
  <div className="flex min-w-[280px] flex-1 flex-col gap-2">
    <span className="text-base font-normal text-[#889096]">{label}</span>
    <div className="flex items-center rounded-2xl border border-[#DFE3E6] bg-[#F1F3F5] px-4 py-3">
      <span className="flex-1 text-base font-medium text-[#889096]">{value || '—'}</span>
    </div>
  </div>
)

/* ── Editable dropdown field (white background) ──────────────────────────────── */

const EditableDropdown = ({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) => (
  <div className="flex min-w-[280px] flex-1 flex-col gap-2">
    <span className="text-base font-normal text-[#687076]">{label}</span>
    <div className="flex items-center rounded-2xl border border-[#DFE3E6] bg-white px-4 py-3">
      <select
        className="flex-1 bg-transparent text-base font-medium text-[#687076] outline-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">{value || '—'}</option>
      </select>
    </div>
  </div>
)

/* ── Editable input field (white background) ─────────────────────────────────── */

const EditableInput = ({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) => (
  <div className="flex min-w-[280px] flex-1 flex-col gap-2">
    <span className="text-base font-normal text-[#687076]">{label}</span>
    <div className="rounded-2xl border border-[#DFE3E6] bg-white px-6 py-3">
      <input
        type="text"
        className="w-full bg-transparent text-base font-medium text-[#687076] outline-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  </div>
)

const TargetRecommendationsTab = ({ process }: TargetRecommendationsTabProps) => {
  const [targetLevel, setTargetLevel] = useState(process.targetAutomationLevelPercent)
  const [smeFeedback, setSmeFeedback] = useState(process.smeFeedback)
  const [toBeAIPowered, setToBeAIPowered] = useState(process.toBeAIPowered)
  const [toBeAIPoweredComments, setToBeAIPoweredComments] = useState(process.toBeAIPoweredComments)

  const { mutate, isPending } = useSaveTargetRecommendations()

  const handleSave = () => {
    mutate({
      processId: process.id,
      targetAutomationLevelPercent: targetLevel,
      smeFeedback,
      toBeAIPowered,
      toBeAIPoweredComments,
    })
  }

  return (
    <div className="flex flex-col gap-6">
      {/* ── Row 1: "North Star" Target Automation + Target Automation Level ── */}
      <div className="flex flex-wrap gap-4">
        <ReadOnlyDropdown
          label={'"North Star" Target Automation'}
          value={process.northStarTarget}
        />
        <EditableDropdown
          label="Target Automation Level (%)"
          value={targetLevel}
          onChange={setTargetLevel}
        />
      </div>

      {/* ── Row 2: SME Feedback (full-width Rich Text Editor) ────────────── */}
      <div className="flex flex-col gap-2">
        <span className="text-base font-normal text-[#687076]">SME Feedback</span>
        <RichTextEditor value={smeFeedback} placeholder="Write here..." onChange={setSmeFeedback} />
      </div>

      {/* ── Row 3: To be AI-powered + To be AI-powered comments ──────────── */}
      <div className="flex flex-wrap gap-4">
        <EditableDropdown
          label="To be AI-powered"
          value={toBeAIPowered}
          onChange={setToBeAIPowered}
        />
        <EditableInput
          label="To be AI-powered comments"
          value={toBeAIPoweredComments}
          onChange={setToBeAIPoweredComments}
        />
      </div>

      {/* ── Save button ───────────────────────────────────────────────────── */}
      <div className="flex justify-end">
        <button
          type="button"
          disabled={isPending}
          onClick={handleSave}
          className="flex items-center gap-2 rounded-2xl bg-[#0047BA] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#003494] disabled:opacity-60"
        >
          {isPending && <Loader2 className="size-4 animate-spin" />}
          Save
        </button>
      </div>
    </div>
  )
}

export default TargetRecommendationsTab
