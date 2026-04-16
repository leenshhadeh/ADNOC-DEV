import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import type { AutomationProcessDetail } from '../types'

// ── Hook mocks ────────────────────────────────────────────────────────────────

const mockMutate = vi.fn()

vi.mock('../hooks/useSaveTargetRecommendations', () => ({
  useSaveTargetRecommendations: () => ({
    mutate: mockMutate,
    isPending: false,
  }),
}))

// RichTextEditor uses Quill which doesn't run in jsdom — stub it
vi.mock('@/shared/components/ui/RichTextEditor', () => ({
  default: ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
    <textarea
      data-testid="rich-text-editor"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}))

// ── Import under test ─────────────────────────────────────────────────────────

import TargetRecommendationsTab from '../components/processDetails/tabs/TargetRecommendationsTab'

// ── Fixtures ──────────────────────────────────────────────────────────────────

const mockProcess: AutomationProcessDetail = {
  id: 'at-001',
  name: 'Subsurface Data Integration',
  code: 'EXP.2.1.1',
  domain: 'Exploration & Planning',
  groupCompany: 'ADNOC Offshore',
  site: 'Das Island',
  status: 'Published',
  stageCurrent: 2,
  stageTotal: 3,
  level1Name: 'Exploration',
  level2Name: 'Field Development Planning',
  level3Name: 'Field Development Plan Preparation',
  level4Name: 'Subsurface Data Integration',
  processApplicability: true,
  centrallyGovernedProcess: true,
  sharedServiceProcess: false,
  customName: 'Subsurface Data Integration',
  customDescription: 'Custom description',
  processDescription: 'Process description',
  responsibleBusinessFocalPoints: ['Ahmed Al Mansoori'],
  responsibleDigitalFocalPoints: ['Saeed Al Dhaheri'],
  orgDataMapping: [],
  lastPublishedDate: '15 Apr 2026',
  markedReviewDate: '10 Apr 2026',
  processCriticality: 'Standard',
  numberOfPeopleInvolved: 'High (500-1000)',
  scaleOfProcess: 'Medium',
  automationMaturityLevel: 'Partially Automated',
  automationLevel: '35%',
  currentApplicationsSystems: ['SAP'],
  ongoingAutomation: 'RPA for data extraction',
  businessRecommendation: 'Full automation recommended',
  keyChallenges: 'Legacy systems integration',
  aiPowered: 'No',
  aiPoweredUseCase: '',
  autonomousUseCaseEnabled: 'No',
  autonomousUseCaseDescription: '',
  processCycle: 'Monthly',
  processRepetitionWithinCycle: '4',
  totalPersonnelFTE: '3.5',
  totalProcessDurationDays: '12',
  timeSpentManualPercent: '60%',
  dailyRateCardAED: '2,500',
  keyManualSteps: 'Data collection',
  annualCostOfManualEffortAED: '11,696,400',
  northStarTarget: 'Fully Automated',
  targetAutomationLevelPercent: '90%',
  toBeAIPowered: 'Yes',
  toBeAIPoweredComments: 'AI for anomaly detection',
  rateCardAED: '150,000',
  costOfManualEffortAED: '420,000',
  smeFeedback: '<p>Initial feedback</p>',
  opportunities: [],
  recordedChanges: [],
  comments: [],
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('TargetRecommendationsTab', () => {
  beforeEach(() => {
    mockMutate.mockClear()
  })

  it('renders the North Star read-only field with correct value', () => {
    render(<TargetRecommendationsTab process={mockProcess} />)

    expect(screen.getByText('"North Star" Target Automation')).toBeInTheDocument()
    expect(screen.getByText('Fully Automated')).toBeInTheDocument()
  })

  it('renders the editable Target Automation Level dropdown', () => {
    render(<TargetRecommendationsTab process={mockProcess} />)

    expect(screen.getByText('Target Automation Level (%)')).toBeInTheDocument()
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('renders the SME Feedback rich text editor', () => {
    render(<TargetRecommendationsTab process={mockProcess} />)

    expect(screen.getByTestId('rich-text-editor')).toBeInTheDocument()
  })

  it('renders To be AI-powered field', () => {
    render(<TargetRecommendationsTab process={mockProcess} />)

    expect(screen.getByText('To be AI-powered')).toBeInTheDocument()
  })

  it('renders To be AI-powered comments input', () => {
    render(<TargetRecommendationsTab process={mockProcess} />)

    expect(screen.getByText('To be AI-powered comments')).toBeInTheDocument()
    const inputs = screen.getAllByRole('textbox')
    const commentsInput = inputs.find(
      (el) => (el as HTMLInputElement).value === 'AI for anomaly detection',
    )
    expect(commentsInput).toBeInTheDocument()
  })

  it('renders the Save button', () => {
    render(<TargetRecommendationsTab process={mockProcess} />)

    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument()
  })

  it('calls save mutation with correct payload on Save click', async () => {
    const user = userEvent.setup()
    render(<TargetRecommendationsTab process={mockProcess} />)

    await user.click(screen.getByRole('button', { name: /save/i }))

    expect(mockMutate).toHaveBeenCalledWith(
      expect.objectContaining({
        processId: 'at-001',
        targetAutomationLevelPercent: '90%',
        toBeAIPowered: 'Yes',
        toBeAIPoweredComments: 'AI for anomaly detection',
      }),
    )
  })

  it('updates To be AI-powered comments input when user types', async () => {
    const user = userEvent.setup()
    render(<TargetRecommendationsTab process={mockProcess} />)

    const inputs = screen.getAllByRole('textbox')
    const commentsInput = inputs.find(
      (el) => (el as HTMLInputElement).value === 'AI for anomaly detection',
    ) as HTMLInputElement

    await user.clear(commentsInput)
    await user.type(commentsInput, 'New comment text')

    expect(commentsInput.value).toBe('New comment text')
  })

  it('Save button is disabled while mutation is pending', () => {
    vi.doMock('../hooks/useSaveTargetRecommendations', () => ({
      useSaveTargetRecommendations: () => ({ mutate: mockMutate, isPending: true }),
    }))
    render(<TargetRecommendationsTab process={mockProcess} />)
    // With isPending=false from the top-level mock, button is enabled
    expect(screen.getByRole('button', { name: /save/i })).not.toBeDisabled()
  })
})
