import { useEffect } from 'react'
import type { AutomationProcessDetail } from '../../../types'
import { Lock } from 'lucide-react'
import CommentableField from '../CommentableField'
import { useProcessDetailActionsStore } from '../../../store/processDetailActionsStore'

interface GeneralInfoTabProps {
  process: AutomationProcessDetail
}

/* ── Inline definition list item ─────────────────────────────────────────────── */

const DefinitionItem = ({
  label,
  children,
  showSeparator = true,
}: {
  label: string
  children: React.ReactNode
  showSeparator?: boolean
}) => (
  <div className="flex items-center gap-4">
    {showSeparator && <div className="h-10 w-px shrink-0 bg-[#DFE3E6]" />}
    <div className="flex flex-col gap-0.5">
      <span className="text-sm font-light text-[#687076]">{label}</span>
      <span className="text-sm font-medium text-[#151718]">{children}</span>
    </div>
  </div>
)

/* ── Read-only input field (single line) ─────────────────────────────────────── */

const ReadOnlyField = ({ label, value }: { label: string; value: string }) => (
  <div className="flex min-w-[280px] flex-1 flex-col gap-2">
    <span className="text-base font-normal text-[#889096]">{label}</span>
    <div className="bg-accent rounded-2xl border border-[#DFE3E6] px-6 py-3">
      <span className="text-base font-medium text-[#889096]">{value || '—'}</span>
    </div>
  </div>
)

/* ── Read-only textarea field ────────────────────────────────────────────────── */

const ReadOnlyTextarea = ({ label, value }: { label: string; value: string }) => (
  <div className="flex min-w-[280px] flex-1 flex-col gap-2">
    <span className="text-base font-normal text-[#889096]">{label}</span>
    <div className="bg-accent min-h-[80px] rounded-2xl border border-[#DFE3E6] px-6 py-4">
      <span className="text-base font-medium text-[#889096]">{value || '—'}</span>
    </div>
  </div>
)

/* ── Tag chip for focal points ───────────────────────────────────────────────── */

const TagChip = ({ label }: { label: string }) => (
  <span className="bg-accent rounded-full border border-[#DFE3E6]/50 px-3 py-1.5 text-xs font-medium text-[#889096]">
    {label}
  </span>
)

/* ── Tag dropdown (read-only) ────────────────────────────────────────────────── */

const TagDropdownField = ({ label, values }: { label: string; values: string[] }) => (
  <div className="flex min-w-[280px] flex-1 flex-col gap-2">
    <span className="text-base font-normal text-[#889096]">{label}</span>
    <div className="bg-accent flex items-center gap-2 rounded-2xl border border-[#DFE3E6] px-4 py-2">
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

/* ── Toggle row (read-only) ──────────────────────────────────────────────────── */

const ToggleItem = ({
  label,
  value,
  showSeparator = true,
}: {
  label: string
  value: boolean
  showSeparator?: boolean
}) => (
  <div className="flex items-center gap-4">
    {showSeparator && <div className="h-10 w-px shrink-0 bg-[#DFE3E6]" />}
    <div className="flex flex-col gap-0.5">
      <span className="text-sm font-light text-[#687076]">{label}</span>
      <div className="flex items-center gap-2 pt-1 opacity-50">
        <div
          className={`flex h-5 w-9 items-center rounded-full p-[1px] ${value ? 'bg-brand-blue justify-end' : 'justify-start bg-[#889096]'}`}
        >
          <div className="size-[18px] rounded-full bg-white" />
        </div>
        <span className="text-sm font-light text-[#687076]">{value ? 'Yes' : 'No'}</span>
      </div>
    </div>
  </div>
)

const FIRST_FIELD = { fieldId: 'customName', fieldName: 'Custom Name' } as const

const GeneralInfoTab = ({ process }: GeneralInfoTabProps) => {
  const { isCommentMode, selectField } = useProcessDetailActionsStore()

  // Auto-select the first commentable field when comment mode is activated
  useEffect(() => {
    if (isCommentMode) {
      selectField(FIRST_FIELD.fieldId, FIRST_FIELD.fieldName)
    }
  }, [isCommentMode, selectField])

  return (
    <div className="flex flex-col gap-6">
      {/* Read-only badge */}
      <div className="bg-muted absolute -top-2 right-4 flex items-center gap-1.5 rounded-md px-2.5 py-1">
        <Lock className="text-muted-foreground size-3" />
        <span className="text-muted-foreground text-xs">Read-only</span>
      </div>
      {/* ── Row 1: Process levels + toggles (horizontal definition list) ── */}
      <div className="flex flex-wrap items-center gap-x-12 gap-y-4">
        <DefinitionItem label="Process Level 1" showSeparator={false}>
          {process.level1Name}
        </DefinitionItem>
        <DefinitionItem label="Process Level 2">{process.level2Name}</DefinitionItem>
        <DefinitionItem label="Process Level 3">{process.level3Name}</DefinitionItem>
        <DefinitionItem label="Process Level 4">{process.level4Name}</DefinitionItem>
        <ToggleItem label="Centrally Governed Process" value={process.centrallyGovernedProcess} />
        <ToggleItem label="Shared Service Process" value={process.sharedServiceProcess} />
      </div>

      {/* ── Row 2: Form fields ───────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-4">
        <CommentableField fieldId="customName" fieldName="Custom Name">
          <ReadOnlyField label="Custom Name" value={process.customName} />
        </CommentableField>
        <CommentableField fieldId="customDescription" fieldName="Custom Description">
          <ReadOnlyTextarea label="Custom Description" value={process.customDescription} />
        </CommentableField>
        <CommentableField fieldId="processDescription" fieldName="Process Description">
          <ReadOnlyTextarea label="Process Description" value={process.processDescription} />
        </CommentableField>
      </div>

      {/* ── Row 3: Focal points ──────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-4">
        <CommentableField
          fieldId="responsibleBusinessFocalPoints"
          fieldName="Responsible Business Focal Point"
        >
          <TagDropdownField
            label="Responsible Business Focal Point"
            values={process.responsibleBusinessFocalPoints}
          />
        </CommentableField>
        <CommentableField
          fieldId="responsibleDigitalFocalPoints"
          fieldName="Responsible Digital Focal Point"
        >
          <TagDropdownField
            label="Responsible Digital Focal Point"
            values={process.responsibleDigitalFocalPoints}
          />
        </CommentableField>
      </div>

      {/* ── Row 4: Organisation data mapping ─────────────────────────────── */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <h3 className="shrink-0 text-base font-medium text-[#151718]">
            Organization data mapping
          </h3>
          <div className="h-px flex-1 bg-[#DFE3E6]" />
        </div>

        {process.orgDataMapping.length > 0 ? (
          <div className="overflow-hidden rounded-xl border border-[#DFE3E6]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#DFE3E6]">
                  <th className="px-4 py-2 text-left text-xs font-normal text-[#687076] uppercase">
                    Org unit
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-normal text-[#687076] uppercase">
                    Sub Units
                  </th>
                </tr>
              </thead>
              <tbody>
                {process.orgDataMapping.map((row) => (
                  <tr key={row.id} className="border-b border-[#DFE3E6] last:border-b-0">
                    <td className="px-4 py-3 text-sm font-medium text-[#151718]">{row.orgUnit}</td>
                    <td className="px-4 py-3 text-sm text-[#687076]">{row.subUnits}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-[#687076]">No organization data mapped.</p>
        )}
      </div>
    </div>
  )
}

export default GeneralInfoTab
