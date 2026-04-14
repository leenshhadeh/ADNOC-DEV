import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'

// ── Mock DataTable ────────────────────────────────────────────────────────────

vi.mock('@/shared/components/data-table/DataTable', () => ({
  default: ({ data, columns }: { data: unknown[]; columns: unknown[] }) => (
    <div data-testid="data-table" data-rows={(data as any[]).length}>
      {/* Render column headers for testing */}
      {(columns as any[]).map((col: any) => (
        <span key={col.id} data-testid={`col-${col.id}`}>
          {col.header}
        </span>
      ))}
    </div>
  ),
}))

// Mock RequestDetailsSheet
vi.mock('../sidePanels/RequestDetailsSheet', () => ({
  default: (props: any) =>
    props.open ? (
      <div data-testid="request-details-sheet">{props.request?.processName ?? ''}</div>
    ) : null,
}))

// Mock data returned by the hook
const MOCK_REQUESTS = [
  {
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
    domain: 'dom-005',
    changes: [
      { id: 'description', label: 'Process description', oldValue: '-', newValue: 'Updated' },
    ],
  },
  {
    id: 'request-2',
    processId: 'r5',
    processName: 'Define Budget and Schedule',
    requestId: '9377354',
    requester: 'Mohammed Al Hajeri',
    status: 'Returned draft',
    stageCurrent: 1,
    stageTotal: 4,
    stageText: 'Pending updates',
    submittedOn: '09 Apr 2024',
    domain: 'dom-005',
    returnComment: 'Needs more detail',
    changes: [],
  },
]

vi.mock('@features/module-assessment-data/hooks/useGetSubmittedRequests', () => ({
  useGetSubmittedRequests: () => ({ data: MOCK_REQUESTS, isLoading: false, isError: false }),
}))

vi.mock('@features/module-process-catalog/constants/domains-data', () => ({
  DOMAINS_DATA: [{ id: 'dom-005', name: 'Exploration' }],
}))

import SubmittedRequestsTable from '../components/tabels/SubmittedRequestsTable'

const renderTable = () =>
  render(
    <MemoryRouter>
      <SubmittedRequestsTable />
    </MemoryRouter>,
  )

describe('SubmittedRequestsTable', () => {
  afterEach(() => vi.clearAllMocks())

  it('renders the data table', () => {
    renderTable()
    expect(screen.getByTestId('data-table')).toBeInTheDocument()
  })

  it('passes requests data to DataTable', () => {
    renderTable()
    expect(screen.getByTestId('data-table')).toHaveAttribute('data-rows', '2')
  })

  it('has Process Name column', () => {
    renderTable()
    expect(screen.getByTestId('col-processName')).toBeInTheDocument()
  })

  it('has Domain column', () => {
    renderTable()
    expect(screen.getByTestId('col-domain')).toBeInTheDocument()
  })

  it('has Requester column', () => {
    renderTable()
    expect(screen.getByTestId('col-requester')).toBeInTheDocument()
  })

  it('has Status column', () => {
    renderTable()
    expect(screen.getByTestId('col-status')).toBeInTheDocument()
  })

  it('has Process Stage column', () => {
    renderTable()
    expect(screen.getByTestId('col-stage')).toBeInTheDocument()
  })

  it('has Submitted On column', () => {
    renderTable()
    expect(screen.getByTestId('col-submittedOn')).toBeInTheDocument()
  })

  it('does not show error message with valid data', () => {
    renderTable()
    expect(screen.queryByText(/failed to load/i)).not.toBeInTheDocument()
  })
})
