import type {
  AutomationProcessDetail,
  AutomationTargetRow,
  CommentEntry,
  OpportunityItem,
  RecordedChange,
} from '../types'
import { AUTOMATION_TARGETS_DATA } from '../constants/automation-targets-data'

const SIMULATED_LATENCY_MS = 600

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// ── Grid data ─────────────────────────────────────────────────────────────────

export const getAutomationTargets = async (): Promise<AutomationTargetRow[]> => {
  await delay(SIMULATED_LATENCY_MS)
  return AUTOMATION_TARGETS_DATA
}

// ── Process detail ────────────────────────────────────────────────────────────

export const getAutomationProcessDetail = async (
  processId: string,
): Promise<AutomationProcessDetail> => {
  await delay(SIMULATED_LATENCY_MS)

  const row = AUTOMATION_TARGETS_DATA.find((r) => r.id === processId)
  if (!row) throw new Error(`Process ${processId} not found`)

  return {
    id: row.id,
    name: row.level4,
    code: row.level4Code,
    domain: row.domain,
    groupCompany: row.groupCompany,
    site: row.site,
    status: row.status,
    stageCurrent: 2,
    stageTotal: 3,
    level1Name: row.level1,
    level2Name: row.level2,
    level3Name: row.level3,
    level4Name: row.level4,
    processApplicability: true,
    centrallyGovernedProcess: true,
    sharedServiceProcess: false,
    customName: row.level4,
    customDescription:
      'Identify and define key indicators that may signal potential fraud within business processes, enabling early detection and response.',
    processDescription:
      'Identify and define key indicators that may signal potential fraud within business processes, enabling early detection and response.',
    responsibleBusinessFocalPoints: ['Ahmed Al Mansoori', 'Fatima Al Nuaimi'],
    responsibleDigitalFocalPoints: ['Saeed Al Dhaheri'],
    orgDataMapping: [
      { id: 'org-1', orgUnit: 'ADNOC HQ', subUnits: 'Finance, Procurement' },
      { id: 'org-2', orgUnit: 'ADNOC Onshore', subUnits: 'Operations' },
      { id: 'org-3', orgUnit: 'ADNOC Drilling', subUnits: 'HSE, Logistics' },
    ],
    lastPublishedDate: '15 Apr 2026',
    markedReviewDate: '10 Apr 2026',
    processCriticality: row.processCriticality,
    numberOfPeopleInvolved: row.numberOfPeopleInvolved,
    scaleOfProcess: row.scaleOfProcess,
    automationMaturityLevel: row.automationMaturityLevel,
    automationLevel: row.automationLevel,
    currentApplicationsSystems: row.currentApplicationsSystems,
    ongoingAutomation: row.ongoingAutomation,
    businessRecommendation: row.businessRecommendation,
    keyChallenges: row.keyChallenges,
    aiPowered: row.aiPowered,
    aiPoweredUseCase: row.aiPoweredUseCase,
    autonomousUseCaseEnabled: row.autonomousUseCaseEnabled,
    autonomousUseCaseDescription: row.autonomousUseCaseDescription,
    processCycle: row.processCycle,
    processRepetitionWithinCycle: row.processRepetitionWithinCycle,
    totalPersonnelFTE: row.totalPersonnelFTE,
    totalProcessDurationDays: row.totalProcessDurationDays,
    timeSpentManualPercent: row.timeSpentManualPercent,
    dailyRateCardAED: row.dailyRateCardAED,
    keyManualSteps: row.keyManualSteps,
    annualCostOfManualEffortAED: row.annualCostOfManualEffortAED,
    northStarTarget: row.northStarTarget,
    targetAutomationLevelPercent: row.targetAutomationLevelPercent,
    toBeAIPowered: row.toBeAIPowered,
    toBeAIPoweredComments: row.toBeAIPoweredComments,
    rateCardAED: row.rateCardAED,
    costOfManualEffortAED: row.costOfManualEffortAED,
    smeFeedback: row.smeFeedback,
    opportunities: MOCK_OPPORTUNITIES,
    recordedChanges: MOCK_RECORDED_CHANGES,
    comments: MOCK_COMMENTS,
  }
}

// ── SME Feedback ──────────────────────────────────────────────────────────────

export const saveSMEFeedback = async (
  processId: string,
  feedback: string,
): Promise<{ success: boolean }> => {
  await delay(SIMULATED_LATENCY_MS)
  // In real implementation: PUT /api/automation-targets/:processId/sme-feedback
  const row = AUTOMATION_TARGETS_DATA.find((r) => r.id === processId)
  if (row) row.smeFeedback = feedback
  return { success: true }
}

// ── Comments ──────────────────────────────────────────────────────────────────

export const getComments = async (processId: string): Promise<CommentEntry[]> => {
  await delay(SIMULATED_LATENCY_MS)
  // In real implementation: GET /api/automation-targets/:processId/comments
  return MOCK_COMMENTS
}

export const postComment = async (
  processId: string,
  payload: { text: string; author: string; role: string },
): Promise<CommentEntry> => {
  await delay(SIMULATED_LATENCY_MS)
  // In real implementation: POST /api/automation-targets/:processId/comments
  const newComment: CommentEntry = {
    id: `cmt-${Date.now()}`,
    author: payload.author,
    role: payload.role,
    text: payload.text,
    timestamp: new Date().toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
    statusLabel: 'Draft',
  }
  MOCK_COMMENTS.unshift(newComment)
  return newComment
}

// ── Submit for approval ───────────────────────────────────────────────────────

export const submitForApproval = async (
  processIds: string[],
): Promise<{ success: boolean; count: number }> => {
  await delay(SIMULATED_LATENCY_MS)
  // In real implementation: POST /api/automation-targets/submit
  return { success: true, count: processIds.length }
}

// ── Opportunities ─────────────────────────────────────────────────────────────

export const getOpportunities = async (processId: string): Promise<OpportunityItem[]> => {
  await delay(SIMULATED_LATENCY_MS)
  // In real implementation: GET /api/automation-targets/:processId/opportunities
  void processId
  return MOCK_OPPORTUNITIES
}

// ── Recorded changes ──────────────────────────────────────────────────────────

export const getRecordedChanges = async (processId: string): Promise<RecordedChange[]> => {
  await delay(SIMULATED_LATENCY_MS)
  // In real implementation: GET /api/automation-targets/:processId/recorded-changes
  void processId
  return MOCK_RECORDED_CHANGES
}

// ── Target recommendations ────────────────────────────────────────────────────

export const saveTargetRecommendations = async (
  processId: string,
  payload: {
    targetAutomationLevelPercent: string
    smeFeedback: string
    toBeAIPowered: string
    toBeAIPoweredComments: string
  },
): Promise<{ success: boolean }> => {
  await delay(SIMULATED_LATENCY_MS)
  // In real implementation: PATCH /api/automation-targets/:processId/target-recommendations
  const row = AUTOMATION_TARGETS_DATA.find((r) => r.id === processId)
  if (row) {
    row.targetAutomationLevelPercent = payload.targetAutomationLevelPercent
    row.smeFeedback = payload.smeFeedback
    row.toBeAIPowered = payload.toBeAIPowered
    row.toBeAIPoweredComments = payload.toBeAIPoweredComments
  }
  return { success: true }
}

// ── Mock data ─────────────────────────────────────────────────────────────────

const MOCK_OPPORTUNITIES: OpportunityItem[] = [
  {
    id: 'opp-001',
    code: 'AUD1',
    title: 'Continuous Control Monitoring System Implementation',
    description:
      'Implementing Continuous Control Monitoring (CCM) offers significant benefits by enabling ADNOC to manage risks proactively, enhance compliance, and improve operational efficiency. By providing real-time insights into control effectiveness, CCM helps in the early detection of issues, allowing for timely corrective actions and reducing the potential impact of control failures.',
    domain: 'Audit & Assurance',
    type: 'Process Automation',
    status: 'In Progress',
    priority: 'High',
    estimatedSavings: '1,200,000 AED',
  },
  {
    id: 'opp-002',
    code: 'AUD2',
    title: 'Integration of Digital Tools with Archer',
    description:
      'Integrating digital tools with the Archer GRC platform to streamline risk management, automate compliance workflows, and reduce manual audit effort across ADNOC operations.',
    domain: 'Audit & Assurance',
    type: 'AI/ML',
    status: 'Planned',
    priority: 'Medium',
    estimatedSavings: '800,000 AED',
  },
  {
    id: 'opp-003',
    code: 'AUD3',
    title: 'Predictive Maintenance Analytics',
    description:
      'Leverage sensor data and ML models to predict equipment failures before they occur, reducing unplanned downtime and improving asset reliability.',
    domain: 'Audit & Assurance',
    type: 'Analytics',
    status: 'Evaluation',
    priority: 'High',
    estimatedSavings: '2,500,000 AED',
  },
  {
    id: 'opp-004',
    code: 'AUD4',
    title: 'Audit Committee Management and Reporting',
    description:
      'Automating audit committee management and reporting processes to improve governance visibility and streamline board-level compliance reporting.',
    domain: 'Audit & Assurance',
    type: 'Process Automation',
    status: 'In Progress',
    priority: 'Medium',
    estimatedSavings: '600,000 AED',
  },
  {
    id: 'opp-005',
    code: 'AUD5',
    title: 'Automated Risk Assessment',
    description:
      'Deploying AI-powered automated risk assessment tools to continuously evaluate and score enterprise risks based on real-time data feeds.',
    domain: 'Audit & Assurance',
    type: 'AI/ML',
    status: 'Planned',
    priority: 'High',
    estimatedSavings: '1,800,000 AED',
  },
  {
    id: 'opp-006',
    code: 'AUD6',
    title: 'Automated Audit Trail Analysis',
    description:
      'Implementing automated audit trail analysis to detect anomalies and ensure regulatory compliance across financial and operational systems.',
    domain: 'Audit & Assurance',
    type: 'Analytics',
    status: 'Evaluation',
    priority: 'Medium',
    estimatedSavings: '950,000 AED',
  },
  {
    id: 'opp-007',
    code: 'AUD7',
    title: 'Automated Audit Trail Analysis',
    description:
      'Extending automated audit trail capabilities to encompass cross-departmental transaction monitoring and compliance reporting.',
    domain: 'Audit & Assurance',
    type: 'Process Automation',
    status: 'In Progress',
    priority: 'Low',
    estimatedSavings: '500,000 AED',
  },
]

const MOCK_RECORDED_CHANGES: RecordedChange[] = [
  {
    id: 'rc-001',
    fieldName: 'Automation Level (%)',
    oldValue: '25%',
    newValue: '35%',
    changedBy: 'Ahmed Al Mazrouei',
    changedOn: '12 Apr 2026',
  },
  {
    id: 'rc-002',
    fieldName: 'North Star Target',
    oldValue: 'Partially Automated',
    newValue: 'Fully Automated',
    changedBy: 'Sara Al Hammadi',
    changedOn: '10 Apr 2026',
  },
  {
    id: 'rc-003',
    fieldName: 'AI-Powered',
    oldValue: 'No',
    newValue: 'Yes',
    changedBy: 'Sara Al Hammadi',
    changedOn: '08 Apr 2026',
  },
]

const MOCK_COMMENTS: CommentEntry[] = [
  {
    id: 'cmt-001',
    author: 'Ahmed Al Mazrouei',
    role: 'Process Custodian',
    text: 'Updated automation level after Q1 assessment review.',
    timestamp: '12 Apr 2026 at 10:30',
    statusLabel: 'Draft',
  },
  {
    id: 'cmt-002',
    author: 'Sara Al Hammadi',
    role: 'BPA Program Manager',
    text: 'Approved the north star target change. Please ensure all stakeholders are informed.',
    timestamp: '10 Apr 2026 at 14:15',
    actionNote: 'Marked as reviewed',
    statusLabel: 'Published',
  },
]
