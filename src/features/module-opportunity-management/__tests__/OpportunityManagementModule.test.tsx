import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'

// ── Mock heavy child components ───────────────────────────────────────────────

vi.mock('../components/tables/OpportunitiesTable', () => ({
  default: () => <div data-testid="opportunities-table" />,
}))

vi.mock('../components/ManageColumnsSheet', () => ({
  default: () => null,
}))

vi.mock('@/assets/icons/Shape.svg?react', () => ({
  default: () => <svg data-testid="shape-icon" />,
}))

vi.mock('../hooks/useGetOpportunities', () => ({
  useGetOpportunities: () => ({ data: [], isLoading: false }),
}))

// ── Import after mocks ────────────────────────────────────────────────────────
import OpportunityManagementModule from '../components/OpportunityManagementModule'

const renderModule = () =>
  render(
    <MemoryRouter>
      <OpportunityManagementModule />
    </MemoryRouter>,
  )

describe('OpportunityManagementModule', () => {
  afterEach(() => vi.clearAllMocks())

  it('renders without crashing', () => {
    expect(() => renderModule()).not.toThrow()
  })

  it('renders the page heading', () => {
    renderModule()
    expect(screen.getByRole('heading', { name: /opportunities management/i })).toBeInTheDocument()
  })

  it('shows Opportunities table by default', () => {
    renderModule()
    expect(screen.getByTestId('opportunities-table')).toBeInTheDocument()
  })

  it('switches to My Tasks tab when clicked', async () => {
    renderModule()
    await userEvent.click(screen.getByRole('tab', { name: /my tasks/i }))
    expect(screen.queryByTestId('opportunities-table')).not.toBeInTheDocument()
    expect(screen.getByText(/no tasks assigned/i)).toBeInTheDocument()
  })

  it('switches to Submitted Requests tab when clicked', async () => {
    renderModule()
    await userEvent.click(screen.getByRole('tab', { name: /submitted requests/i }))
    expect(screen.queryByTestId('opportunities-table')).not.toBeInTheDocument()
    expect(screen.getByText(/no submitted requests/i)).toBeInTheDocument()
  })

  it('can switch back to Opportunities after visiting another tab', async () => {
    renderModule()
    await userEvent.click(screen.getByRole('tab', { name: /my tasks/i }))
    await userEvent.click(screen.getByRole('tab', { name: /opportunities/i }))
    expect(screen.getByTestId('opportunities-table')).toBeInTheDocument()
  })

  it('shows bulk action toggle button on Opportunities tab', () => {
    renderModule()
    expect(screen.getByRole('button', { name: /bulk action/i })).toBeInTheDocument()
  })

  it('bulk mode is off by default', () => {
    renderModule()
    expect(screen.queryByText(/selected/i)).not.toBeInTheDocument()
  })
})
