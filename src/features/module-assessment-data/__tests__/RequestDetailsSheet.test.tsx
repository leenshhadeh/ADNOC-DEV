import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'

// ── Mocks ─────────────────────────────────────────────────────────────────────

vi.mock('@/shared/components/WorkFlowStepper', () => ({
  default: () => <div data-testid="workflow-stepper" />,
}))

vi.mock('@features/module-process-catalog/constants/domains-data', () => ({
  DOMAINS_DATA: [{ id: 'dom-005', name: 'Exploration' }],
}))

import RequestDetailsSheet from '../components/sidePanels/RequestDetailsSheet'

const MOCK_REQUEST = {
  id: 'request-1',
  processId: 'r4',
  processName: 'Play-based exploration',
  requestId: '9377353',
  requester: 'Maryam Al Shamsi',
  status: 'Pending approval',
  stageCurrent: 2,
  stageTotal: 4,
  stageText: 'Pending custodian approval',
  submittedOn: '08 Apr 2024',
  processCategory: 'Dashboard',
  domain: 'dom-005',
  processLevel: 'Level 3',
  level1: 'Exploration',
  level2: 'Regional studies',
  businessFocalPoint: 'Mohammed Al Hajeri',
  returnComment: undefined as string | undefined,
  rejectComment: undefined as string | undefined,
  workflowHistory: [
    {
      id: 'wh-1',
      action: 'Submitted',
      date: '22 Apr 2025 at 10:14 AM',
      userName: 'Fatma Al Shamsi',
      userRole: 'Opportunity Manager',
    },
  ],
  changes: [
    { id: 'description', label: 'Process description', oldValue: '-', newValue: 'Updated text' },
    {
      id: 'parent-name',
      label: 'Process parent name (L2)',
      oldValue: 'Regional studies',
      newValue: 'Studies',
    },
  ],
}

const MOCK_REQUEST_WITH_RETURN = {
  ...MOCK_REQUEST,
  id: 'request-2',
  returnComment: 'Process description needs more detail',
}

const MOCK_REQUEST_WITH_REJECT = {
  ...MOCK_REQUEST,
  id: 'request-3',
  rejectComment: 'Does not align with governance framework',
}

const renderSheet = (request = MOCK_REQUEST, open = true) => {
  const onOpenChange = vi.fn()
  const result = render(
    <MemoryRouter>
      <RequestDetailsSheet request={request} open={open} onOpenChange={onOpenChange} />
    </MemoryRouter>,
  )
  return { ...result, onOpenChange }
}

describe('RequestDetailsSheet', () => {
  afterEach(() => vi.clearAllMocks())

  it('renders request details when open', () => {
    renderSheet()
    expect(screen.getByText('Play-based exploration')).toBeInTheDocument()
    expect(screen.getByText(/stage 2\/4/i)).toBeInTheDocument()
  })

  it('renders nothing meaningful when closed', () => {
    renderSheet(MOCK_REQUEST, false)
    expect(screen.queryByText(/stage 2\/4/i)).not.toBeInTheDocument()
  })

  it('shows workflow stepper', () => {
    renderSheet()
    expect(screen.getByTestId('workflow-stepper')).toBeInTheDocument()
  })

  it('shows return reason box when returnComment present', () => {
    renderSheet(MOCK_REQUEST_WITH_RETURN)
    expect(screen.getByText('Reason for return')).toBeInTheDocument()
    expect(screen.getByText('Process description needs more detail')).toBeInTheDocument()
  })

  it('does not show return reason when no returnComment', () => {
    renderSheet()
    expect(screen.queryByText('Reason for return')).not.toBeInTheDocument()
  })

  it('shows reject reason box when rejectComment present', () => {
    renderSheet(MOCK_REQUEST_WITH_REJECT)
    expect(screen.getByText('Reason for rejection')).toBeInTheDocument()
    expect(screen.getByText('Does not align with governance framework')).toBeInTheDocument()
  })

  it('does not show reject reason when no rejectComment', () => {
    renderSheet()
    expect(screen.queryByText('Reason for rejection')).not.toBeInTheDocument()
  })

  it('"View full card" link is present', () => {
    renderSheet()
    expect(screen.getByText('View full card')).toBeInTheDocument()
  })

  it('"View workflow history" button is present', () => {
    renderSheet()
    expect(screen.getByText('View workflow history')).toBeInTheDocument()
  })

  it('clicking "View workflow history" shows workflow history panel', async () => {
    renderSheet()
    await userEvent.click(screen.getByText('View workflow history'))
    expect(screen.getByText('Workflow History')).toBeInTheDocument()
  })

  it('shows change details section with accordion items', () => {
    renderSheet()
    expect(screen.getByText('Change details')).toBeInTheDocument()
    expect(screen.getByText('Process description')).toBeInTheDocument()
    expect(screen.getByText('Process parent name (L2)')).toBeInTheDocument()
  })

  it('shows process category badge', () => {
    renderSheet()
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
  })

  it('shows stage text badge', () => {
    renderSheet()
    expect(screen.getByText('Pending custodian approval')).toBeInTheDocument()
  })
})
