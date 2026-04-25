import { Lock } from 'lucide-react'
import type { AutomationProcessDetail } from '../../../types'
import CommentableField from '../CommentableField'

interface AutomationParametersTabProps {
  process: AutomationProcessDetail
}

/* ── Read-only dropdown field ────────────────────────────────────────────────── */

const DropdownField = ({ label, value }: { label: string; value: string }) => (
  <div className="flex min-w-[280px] flex-1 flex-col gap-2">
    <span className="text-base font-normal text-[#889096]">{label}</span>
    <div className="flex items-center rounded-2xl border border-[#DFE3E6] bg-accent px-4 py-3">
      <span className="flex-1 text-base font-medium text-[#889096]">{value || '—'}</span>
    </div>
  </div>
)

/* ── Read-only input field (single line) ─────────────────────────────────────── */

const InputField = ({ label, value }: { label: string; value: string }) => (
  <div className="flex min-w-[280px] flex-1 flex-col gap-2">
    <span className="text-base font-normal text-[#889096]">{label}</span>
    <div className="rounded-2xl border border-[#DFE3E6] bg-accent px-6 py-3">
      <span className="text-base font-medium text-[#889096]">{value || '—'}</span>
    </div>
  </div>
)

/* ── Read-only textarea field ────────────────────────────────────────────────── */

const TextareaField = ({
  label,
  value,
  charCount,
}: {
  label: string
  value: string
  charCount?: string
}) => (
  <div className="flex min-w-[280px] flex-1 flex-col gap-2">
    <span className="text-base font-normal text-[#889096]">{label}</span>
    <div className="flex min-h-[80px] flex-col rounded-2xl border border-[#DFE3E6] bg-accent px-6 py-4">
      <span className="flex-1 text-base font-medium text-[#889096]">{value || '—'}</span>
      {charCount && (
        <span className="mt-2 self-end text-sm font-light text-[#687076]">{charCount}</span>
      )}
    </div>
  </div>
)

/* ── Tag chip ────────────────────────────────────────────────────────────────── */

const TagChip = ({ label }: { label: string }) => (
  <span className="rounded-full border border-[#DFE3E6]/50 bg-accent px-3 py-1.5 text-xs font-medium text-[#889096]">
    {label}
  </span>
)

/* ── Tag dropdown (read-only multi-value) ────────────────────────────────────── */

const TagDropdownField = ({ label, values }: { label: string; values: string[] }) => (
  <div className="flex min-w-[280px] flex-1 flex-col gap-2">
    <span className="text-base font-normal text-[#889096]">{label}</span>
    <div className="flex items-center gap-2 rounded-2xl border border-[#DFE3E6] bg-accent px-4 py-2">
      <div className="flex flex-1 flex-wrap items-center gap-1">
        {values.length > 0 ? (
          values.map((v) => <TagChip key={v} label={v} />)
        ) : (
          <span className="text-sm text-[#889096]">—</span>
        )}
      </div>
    </div>
  </div>
)

/* ── Toggle with optional child field ────────────────────────────────────────── */

const ToggleWithField = ({
  label,
  value,
  childLabel,
  childValue,
}: {
  label: string
  value: boolean
  childLabel?: string
  childValue?: string
}) => (
  <div className="flex min-w-[280px] flex-1 flex-col gap-6">
    {/* Toggle */}
    <div className="flex flex-col gap-2">
      <span className="text-base font-normal text-[#687076]">{label}</span>
      <div className="flex items-center gap-3 pt-1 opacity-50">
        <div
          className={`flex h-5 w-9 items-center rounded-full p-[1px] ${value ? 'justify-end bg-brand-blue' : 'justify-start bg-[#889096]'}`}
        >
          <div className="size-[18px] rounded-full bg-white" />
        </div>
        <span className="text-base font-light text-[#687076]">{value ? 'Yes' : 'No'}</span>
      </div>
    </div>

    {/* Child textarea (only when toggled on) */}
    {value && childLabel && <TextareaField label={childLabel} value={childValue ?? '—'} />}
  </div>
)

const AutomationParametersTab = ({ process }: AutomationParametersTabProps) => {
  return (
    <div className="flex flex-col gap-6">
      {/* Read-only badge */}
      <div className="bg-muted absolute -top-2 right-4 flex items-center gap-1.5 rounded-md px-2.5 py-1">
        <Lock className="text-muted-foreground size-3" />
        <span className="text-muted-foreground text-xs">Read-only</span>
      </div>
      {/* ── Row 1: Process Criticality, Number of People, Scale ───────── */}
      <div className="flex flex-wrap gap-4">
        <CommentableField fieldId="processCriticality" fieldName="Process Criticality">
          <DropdownField label="Process Criticality" value={process.processCriticality} />
        </CommentableField>
        <CommentableField fieldId="numberOfPeopleInvolved" fieldName="Number of People Involved">
          <DropdownField label="Number of People Involved" value={process.numberOfPeopleInvolved} />
        </CommentableField>
        <CommentableField fieldId="scaleOfProcess" fieldName="Scale of Process">
          <DropdownField label="Scale of Process" value={process.scaleOfProcess} />
        </CommentableField>
      </div>

      {/* ── Row 2: Maturity Level, Automation %, Applications ─────────── */}
      <div className="flex flex-wrap gap-4">
        <CommentableField
          fieldId="automationMaturityLevel"
          fieldName="Process Automation Maturity Level"
        >
          <DropdownField
            label="Process Automation Maturity Level"
            value={process.automationMaturityLevel}
          />
        </CommentableField>
        <CommentableField fieldId="automationLevel" fieldName="Automation Level (%)">
          <InputField label="Automation Level (%)" value={process.automationLevel} />
        </CommentableField>
        <CommentableField
          fieldId="currentApplicationsSystems"
          fieldName="Current Applications / Systems"
        >
          <TagDropdownField
            label="Current Applications / Systems"
            values={process.currentApplicationsSystems}
          />
        </CommentableField>
      </div>

      {/* ── Row 3: Recommendation, Challenges, Ongoing Initiatives ────── */}
      <div className="flex flex-wrap gap-4">
        <CommentableField
          fieldId="businessRecommendation"
          fieldName="Business Recommendation for Automation"
        >
          <DropdownField
            label="Business Recommendation for Automation"
            value={process.businessRecommendation}
          />
        </CommentableField>
        <CommentableField fieldId="keyChallenges" fieldName="Key Challenges & Automation Needs">
          <InputField label="Key Challenges & Automation Needs" value={process.keyChallenges} />
        </CommentableField>
        <CommentableField fieldId="ongoingAutomation" fieldName="Ongoing Digital Initiatives">
          <TextareaField
            label="Ongoing Digital Initiatives"
            value={process.ongoingAutomation}
            charCount="200 / 500"
          />
        </CommentableField>
      </div>

      {/* ── Row 4: AI-Powered toggle + Autonomous toggle ─────────────── */}
      <div className="flex flex-wrap gap-4">
        <CommentableField fieldId="aiPowered" fieldName="AI-Powered">
          <ToggleWithField
            label="AI-Powered"
            value={process.aiPowered === 'Yes'}
            childLabel="AI-Powered Use-case"
            childValue={process.aiPoweredUseCase}
          />
        </CommentableField>
        <CommentableField
          fieldId="autonomousUseCaseEnabled"
          fieldName="Autonomous Use-case Enabled"
        >
          <ToggleWithField
            label="Autonomous Use-case Enabled"
            value={process.autonomousUseCaseEnabled === 'Yes'}
            childLabel="Autonomous Use-case Description"
            childValue={process.autonomousUseCaseDescription}
          />
        </CommentableField>
      </div>
    </div>
  )
}

export default AutomationParametersTab
