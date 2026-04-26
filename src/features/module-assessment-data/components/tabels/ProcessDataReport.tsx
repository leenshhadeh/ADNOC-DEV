import { useMemo } from 'react'
import { ASSESSMENT_DATA } from '../../constants/assessment-data'
import { flattenAssessmentData } from './ProcessDataTable'
import type { FlatAssessmentRow } from '../../types/process'
import { DOMAINS_DATA } from '@features/module-process-catalog/constants/domains-data'
import { StatusBadgeCell } from '@/shared/components/cells'
import type { CatalogStatus } from '@/shared/components/cells/StatusBadgeCell'

/* ─── Column definition for the scrollable right section ────────────── */

interface DataColumn {
  key: keyof FlatAssessmentRow | ((row: FlatAssessmentRow) => string)
  header: string
  width?: number
  render?: (row: FlatAssessmentRow) => React.ReactNode
}

const DATA_COLUMNS: DataColumn[] = [
  { key: 'groupCompany', header: 'Group Company', width: 160 },
  { key: 'Site', header: 'Site', width: 80 },
  {
    key: 'status',
    header: 'Status',
    width: 160,
    render: (row) => (row.status ? <StatusBadgeCell status={row.status as CatalogStatus} /> : null),
  },
  { key: 'description', header: 'Process Description', width: 280 },
  { key: 'centrallyGovernedProcess', header: 'Centrally Governed Process', width: 200 },
  {
    key: 'SharedService',
    header: 'Shared Service',
    width: 140,
    render: (row) => {
      const val:any = row.SharedServiceDisply
      // const val2:any = row.SharedServiceDisply?.shared?.length
      if (!val) return null
      if (typeof val === 'object' && 'services' in val) {
        return (
          <span>
            {val.services ? `${val.services.length} services` : ''}
            {val.shared ? ` / ${val.shared.length} shared` : ''}
            
          </span>
        )
      }
      return <span>{String(val)}</span>
    },
  },
  {
    key: 'businessUnit',
    header: 'Business Unit',
    width: 220,
    render: (row) => <TagsCell values={row.businessUnit} />,
  },
  {
    key: 'responsibleDigitalTeam',
    header: 'Responsible Digital Team',
    width: 220,
    render: (row) => <TagsCell values={row.responsibleDigitalTeam} />,
  },
  { key: 'processCriticality', header: 'Process Criticality', width: 160 },
  { key: 'usersImpacted', header: 'Number of People/Users Impacted', width: 240 },
  { key: 'scaleOfProcess', header: 'Scale of the Process', width: 240 },
  { key: 'automationMaturityLevel', header: 'Automation Maturity Level', width: 200 },
  { key: 'automationLevel', header: 'Automation Level (%)', width: 160 },
  {
    key: 'currentApplicationsSystems',
    header: 'Current Applications/Systems',
    width: 240,
    render: (row) => <TagsCell values={row.currentApplicationsSystems} />,
  },
  {
    key: 'ongoingAutomationDigitalInitiatives',
    header: 'Ongoing Automation/Digital Initiatives',
    width: 280,
  },
  {
    key: 'businessRecommendationForAutomation',
    header: 'Business Recommendation for Automation',
    width: 280,
  },
  { key: 'keyChallengesAutomationNeeds', header: 'Key Challenges & Automation Needs', width: 260 },
  { key: 'aiPowered', header: 'AI-Powered - Y/N', width: 140 },
  { key: 'aiPoweredUseCase', header: 'AI-Powered Use Case', width: 200 },
  { key: 'autonomousUseCaseEnabled', header: 'Autonomous Use Case Enabled', width: 220 },
  {
    key: 'autonomousUseCaseDescriptionComment',
    header: 'Autonomous Use Case Description/Comment',
    width: 300,
  },
  { key: 'processCycle', header: 'How Often the Process Happens (Cycle)', width: 260 },
  {
    key: 'processRepetitionWithinCycle',
    header: 'Number of Times the Process is Repeated within Selected Cycle',
    width: 320,
  },
  { key: 'totalPersonnelExecutingFTE', header: 'Total Personnel Executing (FTE)', width: 220 },
  { key: 'totalProcessDurationDays', header: 'Total Process Duration (Days)', width: 220 },
  {
    key: 'timeSpentOnManualTasksPercent',
    header: 'Time Spent on Manual Tasks (%)',
    width: 220,
  },
  { key: 'keyManualSteps', header: 'Key Manual Steps', width: 240 },
  { key: 'northStarTargetAutomation', header: '"North Star" Target Automation', width: 240 },
  { key: 'targetAutomationLevelPercent', header: 'Target Automation Level (%)', width: 200 },
  { key: 'smeFeedback', header: 'SME Feedback', width: 200 },
  { key: 'toBeAIPowered', header: 'To Be AI Powered - Y/N', width: 180 },
  { key: 'toBeAIPoweredComments', header: 'To Be AI Powered - Comments', width: 240 },
  { key: 'rateCardAED', header: 'Rate Card (AED)', width: 140 },
  { key: 'costOfManualEffortAED', header: 'Cost of Manual Effort (AED)', width: 200 },
  { key: 'markedAsReviewed', header: 'Marked as Reviewed?', width: 160 },
  {
    key: 'businessFocalPoint',
    header: 'Business Focal Point',
    width: 200,
    render: (row) => <TagsCell values={row.businessFocalPoint} />,
  },
  {
    key: 'digitalFocalPoint',
    header: 'Digital Focal Point',
    width: 200,
    render: (row) => <TagsCell values={row.digitalFocalPoint} />,
  },
  { key: 'publishedDate', header: 'Published Date', width: 140 },
  { key: 'submittedBy', header: 'Submitted By', width: 140 },
  { key: 'submittedOn', header: 'Submitted On', width: 140 },
]

/* ─── Small tag pill used for arrays (BU, Digital Team, etc.) ───────── */

const getTagLabel = (value: unknown): string => {
  if (typeof value === 'string') {
    return value
  }

  if (typeof value === 'object' && value !== null && 'name' in value) {
    return String((value as { name?: unknown }).name ?? '')
  }

  return String(value ?? '')
}

const getTagKey = (value: unknown, index: number): string => {
  if (typeof value === 'string') {
    return value
  }

  if (typeof value === 'object' && value !== null && 'id' in value) {
    return String((value as { id?: unknown }).id ?? index)
  }

  return String(index)
}

const TagsCell = ({ values }: { values: unknown[] }) => {
  if (!values?.length) return null
  return (
    <div className="flex flex-wrap gap-1">
      {values.map((value, index) => (
        <span
          key={getTagKey(value, index)}
          className="max-w-[200px] truncate rounded-full border border-[#DFE3E6] bg-accent  px-3 py-1 text-xs text-[#889096]"
        >
          {getTagLabel(value)}
          test
        </span>
      ))}
    </div>
  )
}

/* ─── Helper: resolve domain id → name ──────────────────────────────── */

const domainMap = new Map(DOMAINS_DATA.map((d) => [d.id, d.name]))

/* ─── Main Report Component ─────────────────────────────────────────── */

const ProcessDataReport = () => {
  const rows: FlatAssessmentRow[] = useMemo(() => flattenAssessmentData(ASSESSMENT_DATA), [])

  return (
    <div className="overflow-hidden rounded-3xl border border-[#DFE3E6] bg-white shadow-[0px_4px_8px_0px_rgba(209,213,223,0.5)]">
      <div className="flex">
        {/* ── Left: Fixed hierarchy columns ─────────────────────────── */}
        <div className="sticky left-0 z-10 flex shrink-0 bg-white">
          {/* Domain column */}
          <HierarchyColumn
            header="Domain"
            rows={rows}
            getValue={(r) => {
              const domainName = domainMap.get(r.domain) ?? r.domain
              return domainName
            }}
            isLevel="domain"
            width={180}
          />
          {/* Level 1 */}
          <HierarchyColumn
            header="Level 1"
            rows={rows}
            getValue={(r) => r.l1}
            getCode={(r) => r.l1Code}
            isLevel="l1"
            width={200}
          />
          {/* Level 2 */}
          <HierarchyColumn
            header="Level 2"
            rows={rows}
            getValue={(r) => r.l2}
            getCode={(r) => r.l2Code}
            isLevel="l2"
            width={200}
          />
          {/* Level 3 */}
          <HierarchyColumn
            header="Level 3"
            rows={rows}
            getValue={(r) => r.l3}
            getCode={(r) => r.l3Code}
            isLevel="l3"
            width={220}
          />
          {/* Level 4 */}
          <HierarchyColumn
            header="Level 4"
            rows={rows}
            getValue={(r) => r.l4}
            getCode={(r) => r.l4Code}
            isLevel="l4"
            width={220}
          />
        </div>

        {/* ── Right: Scrollable data columns ────────────────────────── */}
        <div className="overflow-x-auto">
          <div
            className="flex"
            style={{ minWidth: DATA_COLUMNS.reduce((s, c) => s + (c.width ?? 180), 0) }}
          >
            {DATA_COLUMNS.map((col) => (
              <div
                key={col.header}
                className="shrink-0 border-l border-[#DFE3E6]"
                style={{ width: col.width ?? 180 }}
              >
                {/* Header */}
                <div className="flex h-[56px] items-center gap-2 border-b border-[#DFE3E6] bg-accent px-4 py-2">
                  <span className="text-xs leading-4 font-normal text-[#687076] uppercase">
                    {col.header}
                  </span>
                </div>
                {/* Data cells */}
                {rows.map((row) => (
                  <div
                    key={row.id}
                    className="flex min-h-[56px] items-center border-b border-[#DFE3E6] px-4 py-2"
                  >
                    {col.render ? (
                      col.render(row)
                    ) : (
                      <span className="text-sm leading-[18px] font-normal text-[#687076]">
                        {typeof col.key === 'function' ? col.key(row) : String(row[col.key] ?? '')}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Hierarchy Column (frozen left side) ───────────────────────────── */

interface HierarchyColumnProps {
  header: string
  rows: FlatAssessmentRow[]
  getValue: (row: FlatAssessmentRow) => string
  getCode?: (row: FlatAssessmentRow) => string | undefined
  isLevel: 'domain' | 'l1' | 'l2' | 'l3' | 'l4'
  width: number
}

const HierarchyColumn = ({
  header,
  rows,
  getValue,
  getCode,
  isLevel,
  width,
}: HierarchyColumnProps) => {
  const isBold = isLevel === 'domain' || isLevel === 'l1' || isLevel === 'l2'

  return (
    <div className="shrink-0 border-r border-[#DFE3E6]" style={{ width }}>
      {/* Header */}
      <div className="flex h-[56px] items-center gap-2 border-b border-[#DFE3E6] bg-accent px-4 py-2">
        <span className="text-xs leading-4 font-normal text-[#687076] uppercase">{header}</span>
      </div>
      {/* Cells */}
      {rows.map((row) => {
        const value = getValue(row)
        const code = getCode?.(row)
        const isEmpty = !value

        return (
          <div
            key={row.id}
            className="flex min-h-[56px] items-center border-b border-[#DFE3E6] px-4 py-2"
          >
            {isEmpty && isLevel === 'l4' ? (
              <span className="text-sm leading-5 text-[#687076] italic">No Level 4 processes</span>
            ) : value ? (
              <div className="flex flex-col gap-1">
                <span
                  className={`text-[16px] leading-5 text-[#151718] ${isBold ? 'font-medium' : 'font-light'}`}
                >
                  {value}
                </span>
                {code && (
                  <span className="text-sm leading-[18px] font-light text-[#687076]">{code}</span>
                )}
              </div>
            ) : null}
          </div>
        )
      })}
    </div>
  )
}

export default ProcessDataReport
