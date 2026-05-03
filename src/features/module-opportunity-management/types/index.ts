export type OpportunityStatus =
  | 'Draft'
  | 'Proposed'
  | 'Accepted'
  | 'Rejected'
  | 'In Progress'
  | 'Completed'

export type OpportunityApplicability = {
  proposedTo: number
  acceptedBy: number
}

export interface Opportunity {
  id: string
  name: string
  code: string
  domain: string
  gcOwner: string
  applicability: OpportunityApplicability
  status: OpportunityStatus
  workflowStatus: string
  description: string
  functionalCapabilities?: string
  keyPrerequisites?: string
  keyBusinessBenefits?: string
  solutionType?: string
  illustrativePlatform?: string
  aiApplicability?: string
  impactedBusinessProcesses?: string
  estimatedImplementationDuration?: number
  estimatedImplementationCost?: number
  proposedPriority?: string
  effortManDays?: string
  investmentCost?: string
  riskLevel?: string
  technicalDifficulty?: string
  resourceRequirements?: string
  costSavingRevenuePotential?: string
  customerSatisfactionIncrease?: string
  businessRiskReduction?: string
  efficiencyImprovement?: string
  impactType?: string
  impactReason?: string
  drivers?: string
  costValueEstimationAssumptions?: string
  comments?: string
}

export type OpportunityTabValue = 'opportunities' | 'my-tasks' | 'submitted-requests'
