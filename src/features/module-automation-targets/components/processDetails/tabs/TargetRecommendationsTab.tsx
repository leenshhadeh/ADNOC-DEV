import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import RichTextEditor from '@/shared/components/ui/RichTextEditor'
import { Select } from '@/shared/components/ui/select'
import { useSaveTargetRecommendations } from '../../../hooks/useSaveTargetRecommendations'
import { useProcessDetailActionsStore } from '../../../store/processDetailActionsStore'
import { targetRecommendationsSchema } from '../../../schemas/targetRecommendationsSchema'
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
    <div className="flex items-center rounded-2xl border border-[#DFE3E6] bg-white">
      <Select
        options={value ? [{ label: value, value }] : []}
        value={value}
        placeholder={value || '—'}
        onChange={onChange}
        className="h-auto w-auto flex-1 rounded-2xl border-0 bg-transparent px-4 py-3 text-base font-medium text-[#687076] shadow-none"
      />
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
  const [validationErrors, setValidationErrors] = useState<string[]>([])

  const { mutate, isPending } = useSaveTargetRecommendations()
  const { registerSaveHandler } = useProcessDetailActionsStore()

  const handleSave = () => {
    setValidationErrors([])
    const result = targetRecommendationsSchema.safeParse({
      targetAutomationLevelPercent: targetLevel,
      toBeAIPowered,
      toBeAIPoweredComments,
      smeFeedback,
    })
    if (!result.success) {
      setValidationErrors(result.error.errors.map((e) => e.message))
      return
    }
    mutate({
      processId: process.id,
      targetAutomationLevelPercent: targetLevel,
      smeFeedback,
      toBeAIPowered,
      toBeAIPoweredComments,
    })
  }

  useEffect(() => {
    registerSaveHandler(handleSave)
    return () => registerSaveHandler(null)
  }, [targetLevel, smeFeedback, toBeAIPowered, toBeAIPoweredComments, registerSaveHandler])

  return (
    <div className="flex flex-col gap-6">
      {validationErrors.length > 0 && (
        <div className="border-destructive/30 bg-destructive/10 rounded-xl border px-4 py-3">
          <ul className="list-disc pl-4">
            {validationErrors.map((err) => (
              <li key={err} className="text-destructive text-sm">
                {err}
              </li>
            ))}
          </ul>
        </div>
      )}

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

      {isPending && (
        <div className="flex items-center gap-2 text-sm text-[#687076]">
          <Loader2 className="size-4 animate-spin" />
          Saving...
        </div>
      )}
    </div>
  )
}

export default TargetRecommendationsTab
