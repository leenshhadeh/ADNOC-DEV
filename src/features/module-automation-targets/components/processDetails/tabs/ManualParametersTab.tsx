import { Lock } from 'lucide-react'
import type { AutomationProcessDetail } from '../../../types'
import CommentableField from '../CommentableField'

interface ManualParametersTabProps {
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

/* ── Read-only input field ───────────────────────────────────────────────────── */

const InputField = ({ label, value }: { label: string; value: string }) => (
  <div className="flex min-w-[280px] flex-1 flex-col gap-2">
    <span className="text-base font-normal text-[#889096]">{label}</span>
    <div className="rounded-2xl border border-[#DFE3E6] bg-accent px-6 py-3">
      <span className="text-base font-medium text-[#889096]">{value || '—'}</span>
    </div>
  </div>
)

/* ── Read-only textarea field ────────────────────────────────────────────────── */

const TextareaField = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-1 flex-col gap-2">
    <span className="text-base font-normal text-[#889096]">{label}</span>
    <div className="min-h-[120px] rounded-2xl border border-[#DFE3E6] bg-accent px-6 py-4">
      <span className="text-base font-medium whitespace-pre-wrap text-[#889096]">
        {value || '—'}
      </span>
    </div>
  </div>
)

const ManualParametersTab = ({ process }: ManualParametersTabProps) => {
  return (
    <div className="flex flex-col gap-6">
      {/* Read-only badge */}
      <div className="bg-muted absolute -top-2 right-4 flex items-center gap-1.5 rounded-md px-2.5 py-1">
        <Lock className="text-muted-foreground size-3" />
        <span className="text-muted-foreground text-xs">Read-only</span>
      </div>
      {/* ── Row 1: Cycle, Repetition, Duration ───────────────────────── */}
      <div className="flex flex-wrap gap-4">
        <CommentableField fieldId="processCycle" fieldName="How Often the Process Happens (Cycle)">
          <DropdownField
            label="How Often the Process Happens (Cycle)"
            value={process.processCycle}
          />
        </CommentableField>
        <CommentableField
          fieldId="processRepetitionWithinCycle"
          fieldName="Number of Times the Process is Repeated within Selected Cycle"
        >
          <DropdownField
            label="Number of Times the Process is Repeated within Selected Cycle"
            value={process.processRepetitionWithinCycle}
          />
        </CommentableField>
        <CommentableField
          fieldId="totalProcessDurationDays"
          fieldName="Total Process Duration (Days)"
        >
          <InputField
            label="Total Process Duration (Days)"
            value={process.totalProcessDurationDays}
          />
        </CommentableField>
      </div>

      {/* ── Row 2: Personnel FTE, Manual %, Daily Rate Card ──────────── */}
      <div className="flex flex-wrap gap-4">
        <CommentableField
          fieldId="totalPersonnelFTE"
          fieldName="Total Personnel Executing the Process (FTE)"
        >
          <DropdownField
            label="Total Personnel Executing the Process (FTE)"
            value={process.totalPersonnelFTE}
          />
        </CommentableField>
        <CommentableField
          fieldId="timeSpentManualPercent"
          fieldName="Time Spent on Manual Tasks (%)"
        >
          <DropdownField
            label="Time Spent on Manual Tasks (%)"
            value={process.timeSpentManualPercent}
          />
        </CommentableField>
        <CommentableField fieldId="dailyRateCardAED" fieldName="Daily Rate Card (AED)">
          <InputField label="Daily Rate Card (AED)" value={process.dailyRateCardAED} />
        </CommentableField>
      </div>

      {/* ── Row 3: Key Manual Steps (full-width textarea) ────────────── */}
      <div className="flex flex-wrap gap-4">
        <CommentableField fieldId="keyManualSteps" fieldName="Key Manual Steps">
          <TextareaField label="Key Manual Steps" value={process.keyManualSteps} />
        </CommentableField>
      </div>

      {/* ── Summary: Annual Cost of Manual Effort ─────────────────────── */}
      <div className="rounded-none border border-[#DFE3E6] bg-accent px-6 pt-6 pb-4">
        <div className="flex items-center gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-lg font-normal text-[#687076]">
              Annual Cost of Manual Effort (AED)
            </span>
            <span className="text-lg font-medium text-[#151718]">
              {process.annualCostOfManualEffortAED
                ? `${process.annualCostOfManualEffortAED} AED`
                : '—'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ManualParametersTab
