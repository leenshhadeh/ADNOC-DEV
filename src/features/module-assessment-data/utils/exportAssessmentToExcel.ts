/**
 * exportAssessmentToExcel
 *
 * Assessment-specific column definitions + thin wrapper around the shared
 * ADNOC Excel engine (`src/shared/lib/excel.ts`).
 *
 * To add or reorder columns, edit `ASSESSMENT_COLUMNS` below.
 * All styling, header formatting, and download logic live in the engine.
 */

import { exportSheet } from '@/shared/lib/excel'
import type { SheetColumn } from '@/shared/lib/excel'
import type { FlatAssessmentRow } from '../types/process'
import { DOMAINS_DATA } from '@features/module-process-catalog/constants/domains-data'

// ── Assessment-specific value serializers ─────────────────────────────────────

function resolveArray(value: unknown): string {
  if (Array.isArray(value)) return value.filter(Boolean).join(', ')
  return value != null ? String(value) : ''
}

function resolveSharedService(value: unknown): string {
  if (!value) return ''
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value) as { services?: number; shared?: number }
      if (typeof parsed === 'object' && parsed !== null) {
        const parts: string[] = []
        if (parsed.services != null) parts.push(`${parsed.services} services`)
        if (parsed.shared != null) parts.push(`${parsed.shared} shared`)
        return parts.join(', ')
      }
    } catch {
      // plain string — return as-is
    }
    return value
  }
  if (typeof value === 'object' && value !== null) {
    const { services, shared } = value as { services?: number; shared?: number }
    const parts: string[] = []
    if (services != null) parts.push(`${services} services`)
    if (shared != null) parts.push(`${shared} shared`)
    return parts.join(', ')
  }
  return String(value)
}

// ── Column definitions ────────────────────────────────────────────────────────

const ASSESSMENT_COLUMNS: SheetColumn<FlatAssessmentRow>[] = [
  {
    header: 'Domain',
    key: 'domain',
    width: 20,
    getValue: (row) => DOMAINS_DATA.find((d) => d.id === row.domain)?.name ?? row.domain,
  },
  { header: 'Level 1', key: 'l1', width: 28 },
  { header: 'L1 Code', key: 'l1Code', width: 14, codeStyle: true },
  { header: 'Level 2', key: 'l2', width: 28 },
  { header: 'L2 Code', key: 'l2Code', width: 14, codeStyle: true },
  { header: 'Level 3', key: 'l3', width: 32 },
  { header: 'L3 Code', key: 'l3Code', width: 16, codeStyle: true },
  { header: 'Level 4', key: 'l4', width: 32 },
  { header: 'L4 Code', key: 'l4Code', width: 16, codeStyle: true },
  { header: 'Group Company', key: 'groupCompany', width: 22 },
  { header: 'Site', key: 'Site', width: 14 },
  { header: 'Status', key: 'status', width: 22 },
  { header: 'Description', key: 'description', width: 50 },
  { header: 'Centrally Governed Process', key: 'centrallyGovernedProcess', width: 28 },
  {
    header: 'Shared Service',
    key: 'SharedService',
    width: 22,
    getValue: (row) => resolveSharedService(row.SharedServiceDisply),
  },
  {
    header: 'Business Unit',
    key: 'businessUnit',
    width: 28,
    getValue: (row) => resolveArray(row.businessUnit),
  },
  {
    header: 'Responsible Digital Team',
    key: 'responsibleDigitalTeam',
    width: 28,
    getValue: (row) => resolveArray(row.responsibleDigitalTeam),
  },
  { header: 'Process Criticality', key: 'processCriticality', width: 22 },
  { header: 'Number of People/Users Impacted', key: 'usersImpacted', width: 30 },
  { header: 'Scale of the Process', key: 'scaleOfProcess', width: 22 },
  { header: 'Automation Maturity Level', key: 'automationMaturityLevel', width: 26 },
  { header: 'Automation Level (%)', key: 'automationLevel', width: 20 },
  { header: 'Current Applications/Systems', key: 'currentApplicationsSystems', width: 28 },
  {
    header: 'Ongoing Automation / Digital Initiatives',
    key: 'ongoingAutomationDigitalInitiatives',
    width: 36,
  },
  {
    header: 'Business Recommendation for Automation',
    key: 'businessRecommendationForAutomation',
    width: 36,
  },
  { header: 'Key Challenges & Automation Needs', key: 'keyChallengesAutomationNeeds', width: 34 },
  { header: 'AI-Powered - Y/N', key: 'aiPowered', width: 18 },
  { header: 'AI-Powered Use Case', key: 'aiPoweredUseCase', width: 26 },
  { header: 'Autonomous Use Case Enabled', key: 'autonomousUseCaseEnabled', width: 26 },
  {
    header: 'Autonomous Use Case Description/Comment',
    key: 'autonomousUseCaseDescriptionComment',
    width: 38,
  },
  { header: 'How Often the Process Happens (Cycle)', key: 'processCycle', width: 32 },
  {
    header: 'Number of Times Repeated within Selected Cycle',
    key: 'processRepetitionWithinCycle',
    width: 40,
  },
  { header: 'Total Personnel Executing (FTE)', key: 'totalPersonnelExecutingFTE', width: 28 },
  { header: 'Total Process Duration (Days)', key: 'totalProcessDurationDays', width: 26 },
  { header: 'Time Spent on Manual Tasks (%)', key: 'timeSpentOnManualTasksPercent', width: 28 },
  { header: 'Key Manual Steps', key: 'keyManualSteps', width: 28 },
  { header: '"North Star" Target Automation', key: 'northStarTargetAutomation', width: 28 },
  { header: 'Target Automation Level (%)', key: 'targetAutomationLevelPercent', width: 26 },
  { header: 'SME Feedback', key: 'smeFeedback', width: 28 },
  { header: 'To be AI Powered - Y/N', key: 'toBeAIPowered', width: 22 },
  { header: 'To be AI Powered - Comments', key: 'toBeAIPoweredComments', width: 28 },
  { header: 'Rate Card (AED)', key: 'rateCardAED', width: 18 },
  { header: 'Cost of Manual Effort (AED)', key: 'costOfManualEffortAED', width: 24 },
  { header: 'Marked as Reviewed?', key: 'markedAsReviewed', width: 20 },
  { header: 'Business Focal Point', key: 'businessFocalPoint', width: 22 },
  { header: 'Digital Focal Point', key: 'digitalFocalPoint', width: 22 },
  { header: 'Published Date', key: 'publishedDate', width: 18 },
  { header: 'Submitted By', key: 'submittedBy', width: 20 },
  { header: 'Submitted On', key: 'submittedOn', width: 20 },
]

// ── Public API ────────────────────────────────────────────────────────────────

export interface AssessmentExportOptions {
  rows: FlatAssessmentRow[]
  /** Filename without extension. Defaults to "assessment-data-export". */
  filename?: string
}

export async function exportAssessmentToExcel({
  rows,
  filename = 'assessment-data-export',
}: AssessmentExportOptions): Promise<void> {
  await exportSheet({
    rows,
    columns: ASSESSMENT_COLUMNS,
    sheetName: 'Assessment Data',
    filename,
    creator: 'ADNOC Assessment Data',
  })
}
