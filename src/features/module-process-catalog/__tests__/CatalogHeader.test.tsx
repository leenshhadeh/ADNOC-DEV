import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

// Shape.svg is used inside ModuleToolbar via svgr — mock it so jsdom doesn't choke
vi.mock('@/assets/icons/Shape.svg?react', () => ({
  default: () => <svg data-testid="shape-icon" />,
}))

import CatalogHeader from '../components/CatalogHeader'

const noop = vi.fn()

const defaultProps = {
  activeTab: 'processes' as const,
  onTabChange: noop,
}

describe('CatalogHeader', () => {
  afterEach(() => vi.clearAllMocks())

  it('renders the page title', () => {
    render(<CatalogHeader {...defaultProps} />)
    expect(screen.getByRole('heading', { name: /process catalog/i })).toBeInTheDocument()
  })

  it('renders all three tabs', () => {
    render(<CatalogHeader {...defaultProps} />)
    expect(screen.getByRole('tab', { name: /processes/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /my tasks/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /submitted requests/i })).toBeInTheDocument()
  })

  it('marks the active tab as selected', () => {
    render(<CatalogHeader {...defaultProps} activeTab="myTasks" />)
    expect(screen.getByRole('tab', { name: /my tasks/i })).toHaveAttribute('data-state', 'active')
    expect(screen.getByRole('tab', { name: /processes/i })).not.toHaveAttribute(
      'data-state',
      'active',
    )
  })

  it('calls onTabChange with the correct value when a tab is clicked', async () => {
    const onTabChange = vi.fn()
    render(<CatalogHeader {...defaultProps} onTabChange={onTabChange} />)

    await userEvent.click(screen.getByRole('tab', { name: /submitted requests/i }))

    expect(onTabChange).toHaveBeenCalledWith('submittedRequests')
  })

  it('renders the breadcrumb with Home and Process Catalog', () => {
    render(<CatalogHeader {...defaultProps} />)
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument()
    // BreadcrumbPage renders as role="link" with aria-current="page"
    expect(screen.getByRole('link', { name: /process catalog/i })).toBeInTheDocument()
  })

  it('shows Import and Export action buttons', () => {
    render(<CatalogHeader {...defaultProps} />)
    expect(screen.getByRole('button', { name: /import/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /export/i })).toBeInTheDocument()
  })

  describe('bulk mode', () => {
    it('shows the bulk mode toggle button when onToggleBulkMode is provided', () => {
      render(<CatalogHeader {...defaultProps} onToggleBulkMode={noop} />)
      // "Bulk Action" or a button to enable bulk mode should be present
      expect(screen.getByRole('button', { name: /bulk action/i })).toBeInTheDocument()
    })

    it('calls onToggleBulkMode when the bulk action button is clicked', async () => {
      const onToggle = vi.fn()
      render(<CatalogHeader {...defaultProps} onToggleBulkMode={onToggle} />)

      await userEvent.click(screen.getByRole('button', { name: /bulk action/i }))

      expect(onToggle).toHaveBeenCalledTimes(1)
    })

    it('shows Save and Validate actions when bulk mode is active', () => {
      render(
        <CatalogHeader
          {...defaultProps}
          isBulkMode={true}
          selectedCount={3}
          onToggleBulkMode={noop}
        />,
      )
      expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /validate/i })).toBeInTheDocument()
    })

    it('hides the bulk pill and add-multiple button in bulk mode', () => {
      render(
        <CatalogHeader
          {...defaultProps}
          isBulkMode={true}
          selectedCount={2}
          onToggleBulkMode={noop}
          onBulkAddProcesses={noop}
        />,
      )
      expect(screen.queryByText(/selected/i)).not.toBeInTheDocument()
      expect(
        screen.queryByRole('button', { name: /add multiple processes/i }),
      ).not.toBeInTheDocument()
    })
  })
})
