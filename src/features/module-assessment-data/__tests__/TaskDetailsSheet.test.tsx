import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'

// ── Mocks ─────────────────────────────────────────────────────────────────────

vi.mock('@/shared/components/WorkFlowStepper', () => ({
  default: () => <div data-testid="workflow-stepper" />,
}))

vi.mock('@/shared/components/WorkflowHistoryPanel', () => ({
  default: ({ onClose }: { onClose: () => void }) => (
    <div data-testid="workflow-history-panel">
      <button onClick={onClose}>Close workflow history</button>
    </div>
  ),
}))

vi.mock('@/shared/components/TaskActionFooter', () => ({
  default: ({
    onApprove,
    onReturn,
    onReject,
    onCancel,
  }: {
    onApprove: () => void
    onReturn: () => void
    onReject: () => void
    onCancel: () => void
  }) => (
    <div data-testid="task-action-footer">
      <button onClick={onApprove}>Approve</button>
      <button onClick={onReturn}>Return</button>
      <button onClick={onReject}>Reject</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  ),
}))

vi.mock('@/shared/components/modals/ApproveModal', () => ({
  ApproveModal: ({ open }: { open: boolean }) =>
    open ? <div data-testid="approve-modal" /> : null,
}))

vi.mock('@/shared/components/modals/ReturnModal', () => ({
  ReturnModal: ({ open }: { open: boolean }) => (open ? <div data-testid="return-modal" /> : null),
}))

vi.mock('@/shared/components/modals/RejectModal', () => ({
  RejectModal: ({ open }: { open: boolean }) => (open ? <div data-testid="reject-modal" /> : null),
}))

vi.mock('@features/module-assessment-data/api/processAssesmentService', () => ({
  approveTask: vi.fn().mockResolvedValue({ success: true }),
  returnTask: vi.fn().mockResolvedValue({ success: true }),
  rejectTask: vi.fn().mockResolvedValue({ success: true }),
  getTaskWorkflowHistory: vi.fn().mockResolvedValue([]),
}))

vi.mock('@features/module-assessment-data/hooks/useFieldComments', () => ({
  useFieldComments: () => ({ data: [], isLoading: false }),
  useAddFieldComment: () => ({ mutate: vi.fn(), isPending: false }),
}))

vi.mock('@features/module-process-catalog/constants/domains-data', () => ({
  DOMAINS_DATA: [{ id: 'dom-011', name: 'Exploration' }],
}))

vi.mock('@/shared/components/cells', () => ({
  StatusBadgeCell: ({ status }: { status: string }) => <span>{status}</span>,
}))

import TaskDetailsSheet from '../components/sidePanels/TaskDetailsSheet'
import { useUserStore } from '@/shared/auth/useUserStore'
import type { TaskItem } from '../types/my-tasks'

const MOCK_TASK: TaskItem = {
  id: 'task-1',
  processId: 'r1',
  processName: 'Establish fraud risk indicators',
  processCode: 'EXP.1.1.3',
  requestId: '9377353',
  groupCompany: 'ADNOC Onshore',
  domain: 'dom-011',
  stageCurrent: 1,
  stageTotal: 3,
  stageText: 'Pending updates',
  requester: 'Maryam Al Shamsi',
  status: 'Returned draft',
  returnComment: 'Please revise section 2',
  rejectComment: undefined,
  submittedOn: '08 Apr 2024',
  changes: [
    {
      id: 'c1-0',
      name: 'Automation level',
      comment: 'Low automation',
      oldValue: '10%',
      newValue: '40%',
    },
  ],
}

const MOCK_TASK_WITH_REJECT: TaskItem = {
  ...MOCK_TASK,
  id: 'task-2',
  returnComment: undefined,
  rejectComment: 'Rejected for compliance reasons',
}

const renderSheet = (task: TaskItem | null = MOCK_TASK, open = true) => {
  const onOpenChange = vi.fn()
  const result = render(
    <MemoryRouter>
      <TaskDetailsSheet task={task} open={open} onOpenChange={onOpenChange} />
    </MemoryRouter>,
  )
  return { ...result, onOpenChange }
}

describe('TaskDetailsSheet', () => {
  beforeEach(() => {
    useUserStore.getState().setRole('Quality Manager')
  })
  afterEach(() => vi.clearAllMocks())

  it('renders task details when open', () => {
    renderSheet()
    expect(screen.getByText('Establish fraud risk indicators')).toBeInTheDocument()
    expect(screen.getByText(/stage 1\/3/i)).toBeInTheDocument()
  })

  it('renders nothing when closed', () => {
    renderSheet(MOCK_TASK, false)
    // Sheet is closed — title should not be visible
    // ActionSheet renders via a Sheet which doesn't mount content when closed
    expect(screen.queryByText('Stage 1/3')).not.toBeInTheDocument()
  })

  it('shows workflow stepper', () => {
    renderSheet()
    expect(screen.getByTestId('workflow-stepper')).toBeInTheDocument()
  })

  it('shows return reason box when returnComment present', () => {
    renderSheet()
    expect(screen.getByText('Reason for return')).toBeInTheDocument()
    expect(screen.getByText('Please revise section 2')).toBeInTheDocument()
  })

  it('shows reject reason box when rejectComment present', () => {
    renderSheet(MOCK_TASK_WITH_REJECT)
    expect(screen.getByText('Reason for rejection')).toBeInTheDocument()
    expect(screen.getByText('Rejected for compliance reasons')).toBeInTheDocument()
  })

  it('does not show return reason when no returnComment', () => {
    renderSheet(MOCK_TASK_WITH_REJECT)
    expect(screen.queryByText('Reason for return')).not.toBeInTheDocument()
  })

  it('shows approver footer for approver roles', () => {
    useUserStore.getState().setRole('Quality Manager')
    renderSheet()
    expect(screen.getByTestId('task-action-footer')).toBeInTheDocument()
  })

  it('does not show approver footer for BFP', () => {
    useUserStore.getState().setRole('Business Focal Point')
    renderSheet()
    expect(screen.queryByTestId('task-action-footer')).not.toBeInTheDocument()
  })

  it('"View full card" link is present', () => {
    renderSheet()
    expect(screen.getByText('View full card')).toBeInTheDocument()
  })

  it('"View workflow history" button is present', () => {
    renderSheet()
    expect(screen.getByText('View workflow history')).toBeInTheDocument()
  })

  it('clicking "View workflow history" shows the workflow history panel', async () => {
    renderSheet()
    await userEvent.click(screen.getByText('View workflow history'))
    expect(screen.getByTestId('workflow-history-panel')).toBeInTheDocument()
  })

  it('shows change details section', () => {
    renderSheet()
    expect(screen.getByText('Change details')).toBeInTheDocument()
    expect(screen.getByText('Automation level')).toBeInTheDocument()
  })

  afterAll(() => {
    useUserStore.getState().setRole('Quality Manager')
  })
})
