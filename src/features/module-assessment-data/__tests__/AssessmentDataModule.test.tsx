import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'

// ── Mock heavy child components ───────────────────────────────────────────────

vi.mock('../components/tabels/MyTasksTable', () => ({
  default: () => <div data-testid="my-tasks-table" />,
}))

vi.mock('../components/tabels/SubmittedRequestsTable', () => ({
  default: () => <div data-testid="submitted-requests-table" />,
}))

vi.mock('../components/tabels/ProcessDataTable', () => ({
  default: () => <div data-testid="process-data-table" />,
  flattenAssessmentData: () => [],
}))

vi.mock('../components/AssessmentBulkActionBar', () => ({
  default: () => <div data-testid="assessment-bulk-bar" />,
}))

vi.mock('../components/TaskBulkActionBar', () => ({
  default: () => <div data-testid="task-bulk-bar" />,
}))

vi.mock('../components/AssessmentBulkModals', () => ({
  BulkEditModal: () => null,
  BulkCommentModal: () => null,
  CopyAssessmentDataModal: () => null,
  MarkAsReviewedModal: () => null,
}))

vi.mock('../components/TaskBulkModals', () => ({
  RequestEndorsementModal: () => null,
}))

vi.mock('@/shared/components/modals', () => ({
  ApproveModal: () => null,
  ReturnModal: () => null,
  RejectModal: () => null,
}))

vi.mock('../components/sidePanels/FieldCommentSheet', () => ({
  default: () => null,
}))

vi.mock('@/assets/icons/Shape.svg?react', () => ({
  default: () => <svg data-testid="shape-icon" />,
}))

// Mock hooks that use React Query
vi.mock('../hooks/useAssessmentExport', () => ({
  useAssessmentExport: () => ({ isExporting: false, exportRows: vi.fn() }),
}))

vi.mock('../hooks/useMyTasksExport', () => ({
  useMyTasksExport: () => ({ isExporting: false, exportTasks: vi.fn() }),
}))

const mockMutate = vi.fn()
const mockMutation = { mutate: mockMutate, isPending: false }

vi.mock('../hooks/useTaskActions', () => ({
  useApproveTask: () => mockMutation,
  useReturnTask: () => mockMutation,
  useRejectTask: () => mockMutation,
  useRequestEndorsement: () => mockMutation,
  useSaveTaskFieldComments: () => mockMutation,
  useBulkApproveTasks: () => mockMutation,
  useBulkReturnTasks: () => mockMutation,
  useBulkRejectTasks: () => mockMutation,
  useBulkRequestEndorsement: () => mockMutation,
}))

// ── Import after mocks ────────────────────────────────────────────────────────
import { useUserStore } from '@/shared/auth/useUserStore'
import AssessmentDataModule from '../components/AssessmentDataModule'

const renderModule = () =>
  render(
    <MemoryRouter>
      <AssessmentDataModule />
    </MemoryRouter>,
  )

describe('AssessmentDataModule', () => {
  afterEach(() => vi.clearAllMocks())

  // ── Smoke ────────────────────────────────────────────────────────────────

  it('renders without crashing', () => {
    expect(() => renderModule()).not.toThrow()
  })

  it('renders the page heading', () => {
    renderModule()
    expect(screen.getByRole('heading', { name: /assessment data processes/i })).toBeInTheDocument()
  })

  // ── Tab routing ──────────────────────────────────────────────────────────

  it('shows Processes table by default', () => {
    renderModule()
    expect(screen.getByTestId('process-data-table')).toBeInTheDocument()
    expect(screen.queryByTestId('my-tasks-table')).not.toBeInTheDocument()
    expect(screen.queryByTestId('submitted-requests-table')).not.toBeInTheDocument()
  })

  it('switches to My Tasks tab when clicked', async () => {
    renderModule()
    await userEvent.click(screen.getByRole('tab', { name: /my tasks/i }))
    expect(screen.getByTestId('my-tasks-table')).toBeInTheDocument()
    expect(screen.queryByTestId('process-data-table')).not.toBeInTheDocument()
  })

  it('switches to Submitted Requests tab when clicked', async () => {
    renderModule()
    await userEvent.click(screen.getByRole('tab', { name: /submitted requests/i }))
    expect(screen.getByTestId('submitted-requests-table')).toBeInTheDocument()
    expect(screen.queryByTestId('process-data-table')).not.toBeInTheDocument()
  })

  it('can switch back to Processes after visiting another tab', async () => {
    renderModule()
    await userEvent.click(screen.getByRole('tab', { name: /my tasks/i }))
    await userEvent.click(screen.getByRole('tab', { name: /processes/i }))
    expect(screen.getByTestId('process-data-table')).toBeInTheDocument()
  })

  // ── Toolbar actions ──────────────────────────────────────────────────────

  it('shows Export button in default mode', () => {
    renderModule()
    expect(screen.getByRole('button', { name: /export/i })).toBeInTheDocument()
  })

  // ── Bulk mode (processes tab) ────────────────────────────────────────────

  it('bulk mode is off by default', () => {
    renderModule()
    expect(screen.queryByText(/items selected/i)).not.toBeInTheDocument()
  })

  it('shows bulk action toggle button on Processes tab', () => {
    renderModule()
    expect(screen.getByRole('button', { name: /bulk action/i })).toBeInTheDocument()
  })

  // ── Comment mode (My Tasks tab, Quality Manager) ─────────────────────────

  it('shows Comment on field button for Quality Manager on My Tasks tab', async () => {
    useUserStore.getState().setRole('Quality Manager')
    renderModule()
    await userEvent.click(screen.getByRole('tab', { name: /my tasks/i }))
    expect(screen.getByRole('button', { name: /comment on field/i })).toBeInTheDocument()
  })

  // ── Permission gating: BFP ──────────────────────────────────────────────

  it('BFP should NOT see bulk action toggle on My Tasks tab', async () => {
    useUserStore.getState().setRole('Business Focal Point')
    renderModule()
    await userEvent.click(screen.getByRole('tab', { name: /my tasks/i }))
    // BFP cannot approve/return/reject, so no bulk action toggle should show
    expect(screen.queryByRole('button', { name: /bulk action/i })).not.toBeInTheDocument()
  })

  it('BFP should NOT see Comment on field on My Tasks tab', async () => {
    useUserStore.getState().setRole('Business Focal Point')
    renderModule()
    await userEvent.click(screen.getByRole('tab', { name: /my tasks/i }))
    expect(screen.queryByRole('button', { name: /comment on field/i })).not.toBeInTheDocument()
  })

  // ── Bulk mode toggle on My Tasks tab (approver role) ─────────────────────

  it('shows bulk action toggle on My Tasks tab for approver roles', async () => {
    useUserStore.getState().setRole('Quality Manager')
    renderModule()
    await userEvent.click(screen.getByRole('tab', { name: /my tasks/i }))
    expect(screen.getByRole('button', { name: /bulk action/i })).toBeInTheDocument()
  })

  // Reset role after permission tests
  afterAll(() => {
    useUserStore.getState().setRole('Quality Manager')
  })
})
