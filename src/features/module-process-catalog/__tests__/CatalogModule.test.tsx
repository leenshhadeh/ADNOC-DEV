import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

// ── Module mocks must be declared before the import under test ────────────────

// Mock heavy table components so tests stay fast and focused on CatalogModule logic
vi.mock('../components/data-table/DataTable', () => ({
  default: ({ data }: { data: unknown[] }) => (
    <div data-testid="process-table" data-rows={data.length} />
  ),
}))

vi.mock('../components/tables/MyTasksTable', () => ({
  default: () => <div data-testid="my-tasks-table" />,
}))

vi.mock('../components/tables/SubmittedRequestsTable', () => ({
  default: () => <div data-testid="submitted-requests-table" />,
}))

// svgr SVG used in ModuleToolbar (inside CatalogHeader)
vi.mock('@/assets/Shape.svg?react', () => ({ default: () => <svg data-testid="shape-icon" /> }))

// Capture rowActions so tests can open the modal programmatically
// (avoids needing real row selections which require unmocked DataTable)
type RowActions = { onAddL2: (item: unknown) => void; onRename: (item: unknown) => void }
let capturedRowActions: RowActions | undefined
vi.mock('../components/catalog-columns', async (importOriginal) => {
  const original = await importOriginal<typeof import('../components/catalog-columns')>()
  return {
    ...original,
    buildCatalogColumns: vi.fn((actions?: RowActions) => {
      capturedRowActions = actions
      return []
    }),
  }
})

import { act } from 'react'
import CatalogModule from '../components/CatalogModule'

/** Simulate a row action calling onAddL2 — this sets isAddL2ModalOpen to true */
const openModalViaRowAction = () => {
  act(() => {
    capturedRowActions?.onAddL2({
      id: 'r1',
      domain: 'Test Domain',
      level1Name: 'L1',
      level1Code: 'L1.1',
      level2Name: 'L2 Name',
      level2Code: 'L2.1',
      level3Name: 'L3',
      level3Code: 'L3.1',
      level3Status: 'Published',
      description: 'desc',
      isSharedService: false,
      entities: {},
    })
  })
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const renderModule = () => render(<CatalogModule />)

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('CatalogModule', () => {
  afterEach(() => vi.clearAllMocks())

  // ── Smoke ────────────────────────────────────────────────────────────────

  it('renders without crashing', () => {
    expect(() => renderModule()).not.toThrow()
  })

  it('renders the page heading', () => {
    renderModule()
    expect(screen.getByRole('heading', { name: /process catalog/i })).toBeInTheDocument()
  })

  // ── Tab routing ──────────────────────────────────────────────────────────

  it('shows the Processes table on initial render', () => {
    renderModule()
    expect(screen.getByTestId('process-table')).toBeInTheDocument()
    expect(screen.queryByTestId('my-tasks-table')).not.toBeInTheDocument()
    expect(screen.queryByTestId('submitted-requests-table')).not.toBeInTheDocument()
  })

  it('passes CATALOG_DATA rows to the Processes table', () => {
    renderModule()
    const table = screen.getByTestId('process-table')
    // CATALOG_DATA has 9 entries — just verify it's non-zero
    expect(Number(table.getAttribute('data-rows'))).toBeGreaterThan(0)
  })

  it('switches to My Tasks table when that tab is clicked', async () => {
    renderModule()
    await userEvent.click(screen.getByRole('tab', { name: /my tasks/i }))

    expect(screen.getByTestId('my-tasks-table')).toBeInTheDocument()
    expect(screen.queryByTestId('process-table')).not.toBeInTheDocument()
  })

  it('switches to Submitted Requests table when that tab is clicked', async () => {
    renderModule()
    await userEvent.click(screen.getByRole('tab', { name: /submitted requests/i }))

    expect(screen.getByTestId('submitted-requests-table')).toBeInTheDocument()
    expect(screen.queryByTestId('process-table')).not.toBeInTheDocument()
  })

  it('can switch back to Processes after visiting another tab', async () => {
    renderModule()
    await userEvent.click(screen.getByRole('tab', { name: /my tasks/i }))
    await userEvent.click(screen.getByRole('tab', { name: /processes/i }))

    expect(screen.getByTestId('process-table')).toBeInTheDocument()
    expect(screen.queryByTestId('my-tasks-table')).not.toBeInTheDocument()
  })

  // ── Bulk mode ────────────────────────────────────────────────────────────

  it('bulk mode is off by default', () => {
    renderModule()
    // When bulk mode is inactive, no selected-count pill should be visible
    expect(screen.queryByText(/selected/i)).not.toBeInTheDocument()
  })

  it('enables bulk mode when the toggle button is clicked', async () => {
    renderModule()
    await userEvent.click(screen.getByRole('button', { name: /bulk action/i }))

    // The "Add multiple processes" action button should now be visible
    expect(screen.getByRole('button', { name: /add multiple processes/i })).toBeInTheDocument()
  })

  it('disables bulk mode when Exit bulk selection is clicked', async () => {
    renderModule()
    await userEvent.click(screen.getByRole('button', { name: /bulk action/i }))
    await userEvent.click(screen.getByRole('button', { name: /exit bulk selection/i }))

    // Bulk pill and its buttons are gone; "Bulk Action" toggle is back
    expect(screen.queryByRole('button', { name: /exit bulk selection/i })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /bulk action/i })).toBeInTheDocument()
  })

  // ── Add L2 modal ─────────────────────────────────────────────────────────

  it('modal is hidden on initial render', () => {
    renderModule()
    expect(
      screen.queryByRole('heading', { name: /add multiple processes/i }),
    ).not.toBeInTheDocument()
  })

  it('opens the modal when a row action triggers onAddL2', () => {
    renderModule()
    openModalViaRowAction()

    expect(screen.getByRole('heading', { name: /add multiple processes/i })).toBeInTheDocument()
  })

  it('shows the target row name in the modal when onAddL2 fires', () => {
    renderModule()
    openModalViaRowAction()

    expect(screen.getByText('L2 Name')).toBeInTheDocument()
  })

  it('closes the modal when the Cancel button is clicked', async () => {
    renderModule()
    openModalViaRowAction()

    await userEvent.click(screen.getByRole('button', { name: /cancel/i }))

    expect(
      screen.queryByRole('heading', { name: /add multiple processes/i }),
    ).not.toBeInTheDocument()
  })

  it('closes the modal when the Close (X) button is clicked', async () => {
    renderModule()
    openModalViaRowAction()

    await userEvent.click(screen.getByRole('button', { name: /close/i }))

    expect(
      screen.queryByRole('heading', { name: /add multiple processes/i }),
    ).not.toBeInTheDocument()
  })

  it('closes the modal and confirms when Add button is clicked', async () => {
    renderModule()
    openModalViaRowAction()

    await userEvent.click(screen.getByRole('button', { name: /^add$/i }))

    expect(
      screen.queryByRole('heading', { name: /add multiple processes/i }),
    ).not.toBeInTheDocument()
  })

  // ── Process count select ─────────────────────────────────────────────────

  it('modal shows a process-count select with default value of 1', () => {
    renderModule()
    openModalViaRowAction()

    expect(screen.getByLabelText(/how many processes/i)).toHaveValue('1')
  })

  it('process-count select offers options 1 through 5', () => {
    renderModule()
    openModalViaRowAction()

    const options = screen.getAllByRole('option')
    expect(options.map((o) => o.textContent)).toEqual(['1', '2', '3', '4', '5'])
  })

  it('updates the select value when the user picks a different count', async () => {
    renderModule()
    openModalViaRowAction()

    await userEvent.selectOptions(screen.getByLabelText(/how many processes/i), '3')

    expect(screen.getByLabelText(/how many processes/i)).toHaveValue('3')
  })
})
