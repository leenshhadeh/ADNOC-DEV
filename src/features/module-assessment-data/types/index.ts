export interface Level4Row {
  id: string
  level4Name?: string
  level4Code?: string
  /** Per-entity-site editable values for this L4 process. */
  status?:any
  site?: string
  description?: string
  centrallyGovernedProcess?: string
  sharedService?: {services:number,shared:number}
  businessUnit?: string[]
  processCriticality?: string
  OngoingAutomation?: string
  currentApplicationsSystems?: string[]



}

export interface AssessmentLevel3 {
  id: string
  level3Name: string
  level3Code: string
  level4Items: Level4Row[]
  groupCompany?: string
  status?:string
  site?: string
  description?: string
  centrallyGovernedProcess?: string
  sharedService: {services:number,shared:number},
  businessUnit?: string[]
  ResponsibleDigitalTeam ?: string[]
  processCriticality?: string
  OngoingAutomation?: string
  UsersImpacted?: string
  //TODO: add other entity-site specific fields here as needed, e.g. ScaleOfProcess, AutomationMaturityLevel, etc.
  scaleOfProcess?: string
  automationMaturityLevel?: string
  automationLevel?: string
  currentApplicationsSystems?: string[]
  businessRecommendationForAutomation?: string
  keyChallengesAutomationNeeds?: string
  AIPowered ?: string
  AIPoweredUseCase ?: string
  autonomousUseCaseEnabled ?: string
  autonomousUseCaseDescriptionComment ?: string
  howOftenTheProcessHappensCycle ?: string
  processRepetitionWithinCycle ?: string
  totalPersonnelExecutingFTE ?: string
  totalProcessDurationDays ?: string
  timeSpentOnManualTasksPercent ?: string
  keyManualSteps ?: string
  northStarTargetAutomation ?: string
  targetAutomationLevelPercent ?: string
  reviewedOn?: string
  markedAsReviewed?: string
  submittedBy?: string
  submittedOn?: string


  

}

export interface AssessmentLevel2 {
  id: string
  level2Name: string
  level2Code: string
  level3Items: AssessmentLevel3[]
}

export interface AssessmentLevel1 {
  id: string
  level1Name: string
  level1Code: string
  level2Items: AssessmentLevel2[]

}

export interface AssessmentDomain {
  id: string
  domain: string
  level1Items: AssessmentLevel1[]
}

/** Defines one entity group and its sites for the matrix columns. */
export interface EntityConfig {
  assmntCol: any
}

export const ASSESSMENT_ENTITY_CONFIG: EntityConfig[] = [
  { assmntCol: [
    'Site', 
    'status', 
    'description',
    'centrallyGovernedProcess',
    'sharedService',
    'business unit',
    'Responsible Digital Team',
    'Process Criticality',
    'Number of People/Users Impacted',
    'Scale of the process', 
    'Automation Maturity Level',
    'Automation Level (%)',
    'Current applications/systems',
    'Ongoing Automation / Digital Initiatives',
    'Business recommendation for automation',
    'Key Challenges & Automation Needs',
    'AI-Powered - Y/N',
    'AI-Powered use case',
    'Autonomous Use Case Enabled',
    'Autonomous Use Case Description/Comment',
    'How Often the Process Happens (Cycle)',
    'Number of Times the Process is Repeated within Selected Cycle',
    'Total Personnel Executing (FTE)',
    'Total Process Duration (Days)',
    'Time Spent on Manual Tasks (%)',
    'Key Manual Steps',
    '"North Star" Target Automation',
    'Target Automation Level (%)',
    'SME FeedBACK',
    'To be AI powered - Y/N',
    'To be AI powered - Comments',
    'Rate card (AED)',
    'Cost of Manual Effort (AED)',
    'Marked as Reviewed?',
    'Business focal point',
    'Digital focal point',
    'Published Date',
    'Submitted by',
    'Submitted on'



  ] },
]
