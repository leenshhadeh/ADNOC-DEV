import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach, afterAll } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

// ── Stub child components ─────────────────────────────────────────────────────

vi.mock('../components/processDetails/components/ProcessDetails', () => ({
  default: () => <div data-testid="process-details" />,
}))

vi.mock('../components/processDetails/tabs/GeneralInfoTab', () => ({
  default: () => <div data-testid="general-info-tab" />,
}))

vi.mock('../components/processDetails/tabs/AutomationParameterTab', () => ({
  default: () => <div data-testid="automation-tab" />,
}))

vi.mock('../components/processDetails/tabs/ManualParametersTab', () => ({
  default: () => <div data-testid="manual-tab" />,
}))

vi.mock('../components/processDetails/tabs/TargerRecommendationsTab', () => ({
  default: () => <div data-testid="target-tab" />,
}))

vi.mock('../components/processDetails/tabs/OpprtunitiesTab', () => ({
  default: () => <div data-testid="opportunities-tab" />,
}))

vi.mock('../components/processDetails/tabs/RecordedChangesTab', () => ({
  default: () => <div data-testid="recorded-changes-tab" />,
}))

vi.mock('../components/processDetails/tabs/CommentsTab', () => ({
  default: () => <div data-testid="comments-tab" />,
}))

vi.mock('@/shared/components/Breadcrumb', () => ({
  default: () => <nav data-testid="breadcrumb" />,
}))

// Stub DOMAINS_DATA so domain lookup doesn't fail
vi.mock('@features/module-process-catalog/constants/domains-data', () => ({
  DOMAINS_DATA: [],
}))

// ── Stub ModuleToolbar: renders action buttons so we can click them ────────────

type ToolbarActionStub = {
  id: string
  label: string
  onClick?: () => void
  active?: boolean
}

vi.mock('@/shared/components/ModuleToolbar', () => ({
  default: ({ actions }: { actions?: ToolbarActionStub[] }) => (
    <div data-testid="module-toolbar">
      {actions?.map((a) => (
        <button
          key={a.id}
          onClick={a.onClick}
          data-active={String(a.active ?? false)}
          aria-label={a.label}
        >
          {a.label}
        </button>
      ))}
    </div>
  ),
}))

// ── Stub FieldCommentSheet with controllable open/close ───────────────────────

vi.mock('../components/sidePanels/FieldCommentSheet', () => ({
  default: ({
    open,
    fieldName,
    onOpenChange,
  }: {
    open: boolean
    fieldName: string
    onOpenChange?: (open: boolean) => void
  }) =>
    open ? (
      <div data-testid="field-comment-sheet">
        <span data-testid="sheet-fieldname">{fieldName}</span>
        <button onClick={() => onOpenChange?.(false)}>Close sheet</button>
      </div>
    ) : null,
}))

// ── Mock useGetProcessDetails ─────────────────────────────────────────────────
// IMPORTANT: the data array must be a STABLE reference.
// `ProcessDetailsPage` has `useEffect(..., [data])` — if we return a new array
// each render the effect fires on every render, causing an infinite loop.

vi.mock('@features/module-assessment-data/hooks/useGetProcessDetails', () => {
  const stableData = [
    {
      id: 'proc-1',
      name: 'Test Assessment Process',
      groupCompany: 'ADNOC',
      domain: 'domain-1',
      code: 'AD-001',
      status: 'Draft',
      stageTotal: 3,
      stageCurrent: 1,
      processApplicapility: true,
      lastPublishedDate: '01 Jan 2024',
      markedReviewDate: '01 Feb 2024',
      level1Name: 'L1',
      level2Name: 'L2',
      level3Name: 'L3',
      level4Name: 'L4',
      centrallyGovernedProcess: false,
      sharedServiceProcess: false,
      comments: [],
    },
  ]
  return {
    useGetProcessDetails: () => ({ data: stableData, isLoading: false, isError: false }),
  }
})

// ── Imports AFTER vi.mock declarations ────────────────────────────────────────

import { useUserStore } from '@/shared/auth/useUserStore'
import { useProcessDetailActionsStore } from '../store/processDetailActionsStore'
import ProcessDetailsPage from '../components/ProcessDetailsPage'

// ── Helpers ───────────────────────────────────────────────────────────────────

const renderPage = () =>
  render(
    <MemoryRouter initialEntries={['/assessment-data/process/proc-1']}>
      <Routes>
        <Route path="/assessment-data/process/:processId" element={<ProcessDetailsPage />} />
      </Routes>
    </MemoryRouter>,
  )

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('ProcessDetailsPage', () => {
  beforeEach(() => {
    // Reset role to Quality Manager (default reviewer role)
    useUserStore.getState().setRole('Quality Manager')
    // Reset comment mode store
    useProcessDetailActionsStore.getState().setIsCommentMode(false)
    useProcessDetailActionsStore.getState().clearField()
  })

  afterAll(() => {
    useUserStore.getState().setRole('Quality Manager')
  })

  // ── Rendering ──────────────────────────────────────────────────────────────

  it('renders the process name', () => {
    renderPage()
    expect(screen.getByText('Test Assessment Process')).toBeInTheDocument()
  })

  it('renders the breadcrumb', () => {
    renderPage()
    expect(screen.getByTestId('breadcrumb')).toBeInTheDocument()
  })

  // ── Role-based toolbar actions ─────────────────────────────────────────────

  it('shows "Comment on field" button for Quality Manager', () => {
    useUserStore.getState().setRole('Quality Manager')
    renderPage()
    expect(screen.getByRole('button', { name: /comment on field/i })).toBeInTheDocument()
  })

  it('does not show "Comment on field" button for Business Focal Point', () => {
    useUserStore.getState().setRole('Business Focal Point')
    renderPage()
    expect(screen.queryByRole('button', { name: /comment on field/i })).not.toBeInTheDocument()
  })

  it('does not show "Comment on field" button for Digital Focal Point', () => {
    useUserStore.getState().setRole('Digital Focal Point')
    renderPage()
    expect(screen.queryByRole('button', { name: /comment on field/i })).not.toBeInTheDocument()
  })

  // ── FieldCommentSheet visibility ───────────────────────────────────────────

  it('does not render FieldCommentSheet by default', () => {
    renderPage()
    expect(screen.queryByTestId('field-comment-sheet')).not.toBeInTheDocument()
  })

  it('renders FieldCommentSheet when comment mode is active', () => {
    // Pre-activate comment mode so the sheet renders immediately
    useProcessDetailActionsStore.getState().setIsCommentMode(true)
    renderPage()
    expect(screen.getByTestId('field-comment-sheet')).toBeInTheDocument()
  })

  it('passes empty fieldName to sheet when no field selected', () => {
    useProcessDetailActionsStore.getState().setIsCommentMode(true)
    renderPage()
    expect(screen.getByTestId('sheet-fieldname')).toHaveTextContent('')
  })

  it('passes selectedField.fieldName to FieldCommentSheet', () => {
    useProcessDetailActionsStore.getState().setIsCommentMode(true)
    useProcessDetailActionsStore
      .getState()
      .selectField('automation-complexity', 'Automation Complexity')
    renderPage()
    expect(screen.getByTestId('sheet-fieldname')).toHaveTextContent('Automation Complexity')
  })

  // ── Comment mode toggle ────────────────────────────────────────────────────

  it('activates comment mode when "Comment on field" is clicked', async () => {
    renderPage()
    await userEvent.click(screen.getByRole('button', { name: /comment on field/i }))
    await waitFor(() => expect(screen.getByTestId('field-comment-sheet')).toBeInTheDocument())
  })

  it('deactivates comment mode when clicked again', async () => {
    renderPage()
    const btn = screen.getByRole('button', { name: /comment on field/i })

    await userEvent.click(btn) // enable
    await waitFor(() => expect(screen.getByTestId('field-comment-sheet')).toBeInTheDocument())

    await userEvent.click(btn) // disable
    await waitFor(() => expect(screen.queryByTestId('field-comment-sheet')).not.toBeInTheDocument())
  })

  it('clears selectedField when comment mode is toggled off', async () => {
    useProcessDetailActionsStore.getState().selectField('some-field', 'Some Field')
    renderPage()

    const btn = screen.getByRole('button', { name: /comment on field/i })
    await userEvent.click(btn) // enable
    await userEvent.click(btn) // disable → should clearField

    expect(useProcessDetailActionsStore.getState().selectedField).toBeNull()
  })

  // ── Sheet close ────────────────────────────────────────────────────────────

  it('closes FieldCommentSheet and resets store when close button is clicked', async () => {
    renderPage()
    await userEvent.click(screen.getByRole('button', { name: /comment on field/i }))
    await waitFor(() => expect(screen.getByTestId('field-comment-sheet')).toBeInTheDocument())

    await userEvent.click(screen.getByRole('button', { name: /close sheet/i }))
    await waitFor(() => expect(screen.queryByTestId('field-comment-sheet')).not.toBeInTheDocument())
    expect(useProcessDetailActionsStore.getState().isCommentMode).toBe(false)
  })

  it('clears selectedField when sheet is closed', async () => {
    useProcessDetailActionsStore.getState().selectField('field-id', 'Field Name')
    useProcessDetailActionsStore.getState().setIsCommentMode(true)
    renderPage()

    await userEvent.click(screen.getByRole('button', { name: /close sheet/i }))
    await waitFor(() => expect(screen.queryByTestId('field-comment-sheet')).not.toBeInTheDocument())
    expect(useProcessDetailActionsStore.getState().selectedField).toBeNull()
  })

  // ── Active state on toolbar button ─────────────────────────────────────────

  it('marks the "Comment on field" button as active when comment mode is on', async () => {
    renderPage()
    const btn = screen.getByRole('button', { name: /comment on field/i })
    expect(btn).toHaveAttribute('data-active', 'false')

    await userEvent.click(btn)
    await waitFor(() => expect(btn).toHaveAttribute('data-active', 'true'))
  })

  it('marks the "Comment on field" button as inactive after toggling off', async () => {
    renderPage()
    const btn = screen.getByRole('button', { name: /comment on field/i })
    await userEvent.click(btn) // on
    await userEvent.click(btn) // off
    await waitFor(() => expect(btn).toHaveAttribute('data-active', 'false'))
  })
})
