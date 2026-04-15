import { Lock } from 'lucide-react'
import type { AutomationProcessDetail } from '../../../types'

interface ManualParametersTabProps {
  process: AutomationProcessDetail
}

/* ── Read-only dropdown field ────────────────────────────────────────────────── */

const DropdownField = ({ label, value }: { label: string; value: string }) => (
  <div className="flex min-w-[280px] flex-1 flex-col gap-2">
    <span className="text-base font-normal text-[#889096]">{label}</span>
    <div className="flex items-center rounded-2xl border border-[#DFE3E6] bg-[#F1F3F5] px-4 py-3">
      <span className="flex-1 text-base font-medium text-[#889096]">{value || '—'}</span>
    </div>
  </div>
)

/* ── Read-only input field ───────────────────────────────────────────────────── */

const InputField = ({ label, value }: { label: string; value: string }) => (
  <div className="flex min-w-[280px] flex-1 flex-col gap-2">
    <span className="text-base font-normal text-[#889096]">{label}</span>
    <div className="rounded-2xl border border-[#DFE3E6] bg-[#F1F3F5] px-6 py-3">
      <span className="text-base font-medium text-[#889096]">{value || '—'}</span>
    </div>
  </div>
)

/* ── Read-only textarea field ────────────────────────────────────────────────── */

const TextareaField = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-1 flex-col gap-2">
    <span className="text-base font-normal text-[#889096]">{label}</span>
    <div className="min-h-[120px] rounded-2xl border border-[#DFE3E6] bg-[#F1F3F5] px-6 py-4">
      <span className="text-base font-medium whitespace-pre-wrap text-[#889096]">
        {value || '—'}
      </span>
    </div>
  </div>
)

const ManualParametersTab = ({ process }: ManualParametersTabProps) => {
  return (
    <div className="flex flex-col gap-6">
      {/* ── Row 1: Cycle, Repetition, Duration ───────────────────────── */}
      <div className="flex flex-wrap gap-4">
        <DropdownField label="How Often the Process Happens (Cycle)" value={process.processCycle} />
        <DropdownField
          label="Number of Times the Process is Repeated within Selected Cycle"
          value={process.processRepetitionWithinCycle}
        />
        <InputField
          label="Total Process Duration (Days)"
          value={process.totalProcessDurationDays}
        />
      </div>

      {/* ── Row 2: Personnel FTE, Manual %, Daily Rate Card ──────────── */}
      <div className="flex flex-wrap gap-4">
        <DropdownField
          label="Total Personnel Executing the Process (FTE)"
          value={process.totalPersonnelFTE}
        />
        <DropdownField
          label="Time Spent on Manual Tasks (%)"
          value={process.timeSpentManualPercent}
        />
        <InputField label="Daily Rate Card (AED)" value={process.dailyRateCardAED} />
      </div>

      {/* ── Row 3: Key Manual Steps (full-width textarea) ────────────── */}
      <div className="flex flex-wrap gap-4">
        <TextareaField label="Key Manual Steps" value={process.keyManualSteps} />
      </div>

      {/* ── Summary: Annual Cost of Manual Effort ─────────────────────── */}
      <div className="rounded-none border border-[#DFE3E6] bg-[#F1F3F5] px-6 pt-6 pb-4">
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

      {/* ── Read-only badge ───────────────────────────────────────────── */}
      <div className="flex justify-start">
        <span className="inline-flex items-center gap-1 rounded-full bg-[#ECEDED] px-2 py-1.5 text-xs font-normal text-[#7B8899]">
          <Lock className="size-3" />
          Read-only
        </span>
      </div>
    </div>
  )
}

export default ManualParametersTab
