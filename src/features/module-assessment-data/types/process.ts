export type SharedService =
  | {
      services?: string[]
      shared?: string[]
    }
  | string
  | null
  | undefined

export type DraftVersionData = {
  id?: string
  level3Name?: string
  level3Code?: string
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
  currentApplicationsSystems?: currentApplicationsSystems[]
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

export type currentApplicationsSystems = {
  id: string
  name: string
}

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
  currentApplicationsSystems?: currentApplicationsSystems[]
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
  draftVersion?: DraftVersionData
}

export type Level3Item = Level4Item & {
  id?: string
  level3Name?: string
  level3Code?: string
  groupCompany?: string
  draftVersion?: DraftVersionData
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
  /** Stable group key shared by all flat rows belonging to the same L3 item */
  l3GroupId: string
  /** Actual backend ID of the L3 item — used as rowId in bulk operations */
  l3ItemId: string
  pinned?: boolean
  Site: string
  groupCompany: string
  status: string
  description: string
  centrallyGovernedProcess: string
  SharedServiceDisply: any
  SharedService:{services?: string[]; shared?: string[]} | string | null | undefined
  businessUnit: Array<string>
  responsibleDigitalTeam: Array<string>
  processCriticality: string
  usersImpacted: string
  scaleOfProcess: string
  automationMaturityLevel: string
  automationLevel: string
  currentApplicationsSystems: currentApplicationsSystems[]
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
  readyForSave?: boolean
  draftVersion?: DraftVersionData
}

// ── Bulk Cell Operations ──────────────────────────────────────────────────────

export type BulkCellAction = 'edit' | 'comment' | 'submit' | 'mark-as-reviewed'

export interface BulkCellOperation {
  rowId: string
  /** Whether the operation targets an L3 or L4 process */
  level: 'l3' | 'l4'
  columnKey?: string
  action: BulkCellAction
  payload?: string
}

export interface BulkCellActionResult {
  processedIds: string[]
}
