export type SharedService =
  | {
      services?: number
      shared?: number
    }
  | string
  | null
  | undefined

export type Level4Item = {
  id?: string
  level4Name?: string
  level4Code?: string
  status?: string
  site?: string
  groupCompany?: string
  description?: string
  centrallyGovernedProcess?: string
  sharedService?: SharedService
  businessUnit?: string[]
  ResponsibleDigitalTeam?: string[]
  processCriticality?: string
  UsersImpacted?: string
  scaleOfProcess?: string
  automationMaturityLevel?: string
  automationLevel?: string
  currentApplicationsSystems?: string[]
  OngoingAutomationDigitalInitiatives?: string
  businessRecommendationForAutomation?: string
  keyChallengesAutomationNeeds?: string
  AIPowered?: string
  AIPoweredUseCase?: string
  autonomousUseCaseEnabled?: string
  AutonomousUseCaseDescriptionComment?: string
  ProcessCycle?: string
  processRepetitionWithinCycle?: string
  totalPersonnelExecutingFTE?: string
  totalProcessDurationDays?: string
  timeSpentOnManualTasksPercent?: string
  keyManualSteps?: string
  northStarTargetAutomation?: string
  targetAutomationLevelPercent?: string
  SMEFeedback?: string
  toBeAIPowered?: string
  toBeAIPoweredComments?: string
  rateCardAED?: string
  costOfManualEffortAED?: string
  markedAsReviewed?: string
  reviewedOn?: string
  businessFocalPoint?: string[]
  digitalFocalPoint?: string[]
  publishedDate?: string
  submittedBy?: string
  submittedOn?: string
}

export type Level3Item = Level4Item & {
  id?: string
  level3Name?: string
  level3Code?: string
  groupCompany?: string
  level4Items?: Level4Item[]
}

export type Level2Item = {
  id: string
  level2Name?: string
  level2Code?: string
  level3Items?: Level3Item[]
}

export type Level1Item = {
  id: string
  level1Name?: string
  level1Code?: string
  level2Items?: Level2Item[]
}

export type DomainItem = {
  id: string
  domain?: string
  level1Items?: Level1Item[]
}

export type FlatAssessmentRow = {
  id: string
  rowId: string
  domain: string
  l1: string
  l2: string
  l3: string
  l4: string
  displayDomain: string
  displayL1: string
  displayL2: string
  displayL3: string
  l1Code?: string
  l2Code?: string
  l3Code?: string
  l4Code?: string
  pinned?: boolean
  Site: string
  groupCompany: string
  status: string
  description: string
  centrallyGovernedProcess: string
  sharedService: string
  businessUnit: Array<string>
  responsibleDigitalTeam: Array<string>
  processCriticality: string
  usersImpacted: string
  scaleOfProcess: string
  automationMaturityLevel: string
  automationLevel: string
  currentApplicationsSystems: string[]
  ongoingAutomationDigitalInitiatives: string
  businessRecommendationForAutomation: string
  keyChallengesAutomationNeeds: string
  aiPowered: string
  aiPoweredUseCase: string
  autonomousUseCaseEnabled: string
  autonomousUseCaseDescriptionComment: string
  processCycle: string
  processRepetitionWithinCycle: string
  totalPersonnelExecutingFTE: string
  totalProcessDurationDays: string
  timeSpentOnManualTasksPercent: string
  keyManualSteps: string
  northStarTargetAutomation: string
  targetAutomationLevelPercent: string
  smeFeedback: string
  toBeAIPowered: string
  toBeAIPoweredComments: string
  rateCardAED: string
  costOfManualEffortAED: string
  markedAsReviewed: string
  reviewedOn: string
  businessFocalPoint: string[]
  digitalFocalPoint: string[]
  publishedDate: string
  submittedBy: string
  submittedOn: string
}

// ── Bulk Cell Operations ──────────────────────────────────────────────────────

export type BulkCellAction = 'edit' | 'comment' | 'submit' | 'mark-as-reviewed'

export interface BulkCellOperation {
  rowId: string
  columnKey?: string
  action: BulkCellAction
  payload?: string
}

export interface BulkCellActionResult {
  processedIds: string[]
}
