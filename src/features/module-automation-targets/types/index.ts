import type { CatalogStatus } from '@/shared/components/cells/StatusBadgeCell'

// ── Flat row for main automation targets grid ─────────────────────────────────

export interface AutomationTargetRow {
  id: string
  domain: string
  level1: string
  level1Code: string
  level2: string
  level2Code: string
  level3: string
  level3Code: string
  level4: string
  level4Code: string
  groupCompany: string
  site: string
  status: CatalogStatus
  /** Rich-text HTML string captured via the SME Feedback sheet */
  smeFeedback: string
  // ── Automation parameters ────────────────────────────────────────────────
  processCriticality: string
  numberOfPeopleInvolved: string
  scaleOfProcess: string
  automationMaturityLevel: string
  automationLevel: string
  currentApplicationsSystems: string[]
  ongoingAutomation: string
  businessRecommendation: string
  keyChallenges: string
  aiPowered: string
  aiPoweredUseCase: string
  autonomousUseCaseEnabled: string
  autonomousUseCaseDescription: string
  // ── Manual operations volume parameters ──────────────────────────────────
  processCycle: string
  processRepetitionWithinCycle: string
  totalPersonnelFTE: string
  totalProcessDurationDays: string
  timeSpentManualPercent: string
  dailyRateCardAED: string
  keyManualSteps: string
  annualCostOfManualEffortAED: string
  // ── Target recommendation ────────────────────────────────────────────────
  northStarTarget: string
  targetAutomationLevelPercent: string
  toBeAIPowered: string
  toBeAIPoweredComments: string
  rateCardAED: string
  costOfManualEffortAED: string
}

// ── Process detail types (returned by getProcessDetails API) ──────────────────

export interface AutomationProcessDetail {
  id: string
  name: string
  code: string
  domain: string
  groupCompany: string
  site: string
  status: CatalogStatus
  stageCurrent: number
  stageTotal: number
  level1Name: string
  level2Name: string
  level3Name: string
  level4Name: string
  processApplicability: boolean
  centrallyGovernedProcess: boolean
  sharedServiceProcess: boolean
  customName: string
  customDescription: string
  processDescription: string
  responsibleBusinessFocalPoints: string[]
  responsibleDigitalFocalPoints: string[]
  orgDataMapping: OrgDataMappingRow[]
  lastPublishedDate: string
  markedReviewDate: string
  // ── Automation parameters ────────────────────────────────────────────────
  processCriticality: string
  numberOfPeopleInvolved: string
  scaleOfProcess: string
  automationMaturityLevel: string
  automationLevel: string
  currentApplicationsSystems: string[]
  ongoingAutomation: string
  businessRecommendation: string
  keyChallenges: string
  aiPowered: string
  aiPoweredUseCase: string
  autonomousUseCaseEnabled: string
  autonomousUseCaseDescription: string
  // ── Manual volume parameters ─────────────────────────────────────────────
  processCycle: string
  processRepetitionWithinCycle: string
  totalPersonnelFTE: string
  totalProcessDurationDays: string
  timeSpentManualPercent: string
  dailyRateCardAED: string
  keyManualSteps: string
  annualCostOfManualEffortAED: string
  // ── Target recommendation ────────────────────────────────────────────────
  northStarTarget: string
  targetAutomationLevelPercent: string
  toBeAIPowered: string
  toBeAIPoweredComments: string
  rateCardAED: string
  costOfManualEffortAED: string
  smeFeedback: string
  // ── Opportunities ────────────────────────────────────────────────────────
  opportunities: OpportunityItem[]
  // ── Recorded changes ─────────────────────────────────────────────────────
  recordedChanges: RecordedChange[]
  // ── Comments ─────────────────────────────────────────────────────────────
  comments: CommentEntry[]
}

// ── Organisation data mapping row ─────────────────────────────────────────────

export interface OrgDataMappingRow {
  id: string
  orgUnit: string
  subUnits: string
}

// ── Opportunity ───────────────────────────────────────────────────────────────

export interface OpportunityItem {
  id: string
  title: string
  type: string
  status: string
  priority: string
  estimatedSavings: string
  description: string
}

// ── Recorded change ───────────────────────────────────────────────────────────

export interface RecordedChange {
  id: string
  fieldName: string
  oldValue: string
  newValue: string
  changedBy: string
  changedOn: string
}

// ── Comment ───────────────────────────────────────────────────────────────────

export interface CommentEntry {
  id: string
  author: string
  role: string
  text: string
  timestamp: string
}
