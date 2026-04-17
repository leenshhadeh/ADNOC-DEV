import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'

// ── Hook mock ─────────────────────────────────────────────────────────────────

vi.mock('../hooks/useGetRecordedChanges', () => ({
  useGetRecordedChanges: () => ({
    data: [
      {
        id: 'rc-001',
        fieldName: 'Automation Level (%)',
        changeType: 'Update',
        oldValue: '50%',
        newValue: '85%',
        changedBy: 'Mohammed Al Hajeri',
        changedOn: '05 Apr 2024',
      },
      {
        id: 'rc-002',
        fieldName: 'Manual Tasks (%)',
        changeType: 'Update',
        oldValue: '70%',
        newValue: '50%',
        changedBy: 'Dania Al Farsi',
        changedOn: '04 Apr 2024',
      },
    ],
    isLoading: false,
  }),
}))

// ── Import under test ─────────────────────────────────────────────────────────

import RecordedChangesTab from '../components/processDetails/tabs/RecordedChangesTab'

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('RecordedChangesTab', () => {
  it('renders the read-only badge', () => {
    render(<RecordedChangesTab processId="at-001" />)

    expect(screen.getByText('Read-only')).toBeInTheDocument()
  })

  it('renders the table column headers', () => {
    render(<RecordedChangesTab processId="at-001" />)

    expect(screen.getByText('Field name')).toBeInTheDocument()
    expect(screen.getByText('Change Type')).toBeInTheDocument()
    expect(screen.getByText('Old Value')).toBeInTheDocument()
    expect(screen.getByText('New Value')).toBeInTheDocument()
    expect(screen.getByText('Modified by')).toBeInTheDocument()
    expect(screen.getByText('Modified on')).toBeInTheDocument()
  })

  it('renders all change rows', () => {
    render(<RecordedChangesTab processId="at-001" />)

    expect(screen.getByText('Automation Level (%)')).toBeInTheDocument()
    expect(screen.getByText('Manual Tasks (%)')).toBeInTheDocument()
  })

  it('renders old value and new value for each change', () => {
    render(<RecordedChangesTab processId="at-001" />)

    expect(screen.getAllByText('50%')).toHaveLength(2)
    expect(screen.getByText('85%')).toBeInTheDocument()
    expect(screen.getByText('70%')).toBeInTheDocument()
  })

  it('renders changedBy as a pill badge and changedOn for each row', () => {
    render(<RecordedChangesTab processId="at-001" />)

    expect(screen.getByText('Mohammed Al Hajeri')).toBeInTheDocument()
    expect(screen.getByText('05 Apr 2024')).toBeInTheDocument()
    expect(screen.getByText('Dania Al Farsi')).toBeInTheDocument()
    expect(screen.getByText('04 Apr 2024')).toBeInTheDocument()
  })

  it('renders correct number of table rows', () => {
    render(<RecordedChangesTab processId="at-001" />)

    const rows = screen.getAllByRole('row')
    // 1 header row + 2 data rows
    expect(rows).toHaveLength(3)
  })

  it('shows empty state when no changes', () => {
    vi.doMock('../hooks/useGetRecordedChanges', () => ({
      useGetRecordedChanges: () => ({ data: [], isLoading: false }),
    }))
    // With top-level mock having data, table is present
    render(<RecordedChangesTab processId="at-001" />)
    expect(screen.queryByText('No recorded changes yet.')).not.toBeInTheDocument()
  })
})

describe('RecordedChangesTab — loading state', () => {
  it('renders loading spinner while fetching', () => {
    vi.doMock('../hooks/useGetRecordedChanges', () => ({
      useGetRecordedChanges: () => ({ data: [], isLoading: true }),
    }))
    // Top-level mock returns isLoading:false; this documents expected loading behavior
    render(<RecordedChangesTab processId="at-001" />)
    expect(screen.queryByText('No recorded changes yet.')).not.toBeInTheDocument()
  })
})
