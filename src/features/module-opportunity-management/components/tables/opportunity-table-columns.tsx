import { ChevronDown } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
import type { Opportunity } from '../../types'
import { StatusBadgeCell } from '@/shared/components/cells'
import OpportunityNameCell from '../cells/OpportunityNameCell'
import OpportunityApplicabilityCell from '../cells/OpportunityApplicabilityCell'
import type { CatalogStatus } from '@/shared/components/cells'
import SelectCell from '@/shared/components/table-primitives/SelectCell'
import NumericEditCell from '@/shared/components/table-primitives/NumericEditCell'

const HIGH_MEDIUM_LOW = ['High', 'Medium', 'Low']

const LIFECYCLE_STAGE_OPTIONS = [
  'Draft',
  'Proposed',
  'In Review',
  'Approved',
  'Rejected',
  'Completed',
]

const SOLUTION_TYPE_OPTIONS = [
  'Process Automation',
  'Integration',
  'Analytics & Reporting',
  'AI/ML Solution',
  'Document & Workflow Management',
  'Platform Consolidation',
  'Cloud Platform',
  'Predictive Maintenance',
  'Contract Management',
  'Compliance Management',
  'Vendor Management',
]

const IMPACT_TYPE_OPTIONS = [
  'Cost Reduction',
  'Efficiency',
  'Governance',
  'Risk Reduction',
  'Revenue Generation',
  'Compliance',
]

const IMPACT_REASON_OPTIONS = [
  'Manual Process Elimination',
  'Integration & Automation',
  'Data Quality Improvement',
  'Compliance & Governance',
  'Cost Optimization',
  'Resource Efficiency',
  'AI/ML Implementation',
  'Platform Consolidation',
  'Workflow Digitisation',
  'Predictive Analytics',
]

const OPPORTUNITY_STATUS_MAP: Record<string, CatalogStatus> = {
  Draft: 'Draft',
  Proposed: 'Pending approval',
  Accepted: 'Published',
  Rejected: 'Returned draft',
  'In Progress': 'Pending updates',
  Completed: 'Published',
}

export const getOpportunityTableColumns = (): ColumnDef<Opportunity, unknown>[] => [
  {
    id: 'name',
    accessorKey: 'name',
    header: 'Name',
    size: 356,
    enableSorting: true,
    meta: { pinnedCol: true },
    cell: (info) => (
      <OpportunityNameCell
        id={info.row.original.id}
        name={info.row.original.name}
        code={info.row.original.code}
      />
    ),
  },
  {
    id: 'domain',
    accessorKey: 'domain',
    header: 'Domain',
    size: 204,
    enableSorting: true,
    cell: (info) => (
      <div className="flex w-full items-center justify-between gap-2">
        <span className="text-foreground min-w-0 truncate text-sm">{info.getValue<string>()}</span>
        <ChevronDown className="text-muted-foreground size-4 shrink-0" />
      </div>
    ),
  },
  {
    id: 'gcOwner',
    accessorKey: 'gcOwner',
    header: 'GC Owner',
    size: 133,
    enableSorting: true,
    cell: (info) => (
      <div className="flex w-full items-center justify-between gap-2">
        <span className="text-foreground min-w-0 truncate text-sm">{info.getValue<string>()}</span>
        <ChevronDown className="text-muted-foreground size-4 shrink-0" />
      </div>
    ),
  },
  {
    id: 'applicability',
    accessorKey: 'applicability',
    header: 'Opportunity Applicability',
    size: 332,
    enableSorting: false,
    cell: (info) => (
      <OpportunityApplicabilityCell applicability={info.row.original.applicability} />
    ),
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: 'Status',
    size: 126,
    enableSorting: true,
    cell: (info) => {
      const status = info.getValue<string>()
      const mappedStatus = OPPORTUNITY_STATUS_MAP[status] ?? 'Draft'
      return <StatusBadgeCell status={mappedStatus} isSmall />
    },
  },
  {
    id: 'workflowStatus',
    accessorKey: 'workflowStatus',
    header: 'Lifecycle Stage',
    size: 163,
    enableSorting: true,
    cell: (info) => (
      <SelectCell defaultValue={info.getValue<string>() ?? ''} options={LIFECYCLE_STAGE_OPTIONS} />
    ),
  },
  {
    id: 'description',
    accessorKey: 'description',
    header: 'Description',
    size: 350,
    enableSorting: false,
    cell: (info) => (
      <span className="text-muted-foreground line-clamp-2 text-sm">{info.getValue<string>()}</span>
    ),
  },
  {
    id: 'functionalCapabilities',
    accessorKey: 'functionalCapabilities',
    header: 'Functional Capabilities',
    size: 350,
    enableSorting: false,
    cell: (info) => (
      <span className="text-muted-foreground line-clamp-2 text-sm">
        {info.getValue<string>() ?? '—'}
      </span>
    ),
  },
  {
    id: 'keyPrerequisites',
    accessorKey: 'keyPrerequisites',
    header: 'Key Pre-requisites',
    size: 350,
    enableSorting: false,
    cell: (info) => (
      <span className="text-muted-foreground line-clamp-2 text-sm">
        {info.getValue<string>() ?? '—'}
      </span>
    ),
  },
  {
    id: 'keyBusinessBenefits',
    accessorKey: 'keyBusinessBenefits',
    header: 'Key Business Benefits',
    size: 350,
    enableSorting: false,
    cell: (info) => (
      <span className="text-muted-foreground line-clamp-2 text-sm">
        {info.getValue<string>() ?? '—'}
      </span>
    ),
  },
  {
    id: 'solutionType',
    accessorKey: 'solutionType',
    header: 'Solution Type',
    size: 281,
    enableSorting: true,
    cell: (info) => (
      <SelectCell defaultValue={info.getValue<string>() ?? ''} options={SOLUTION_TYPE_OPTIONS} />
    ),
  },
  {
    id: 'illustrativePlatform',
    accessorKey: 'illustrativePlatform',
    header: 'Illustrative Platform/Vendor/Software',
    size: 279,
    enableSorting: false,
    cell: (info) => (
      <span className="text-muted-foreground text-sm">{info.getValue<string>() ?? '—'}</span>
    ),
  },
  {
    id: 'aiApplicability',
    accessorKey: 'aiApplicability',
    header: 'AI Applicability',
    size: 157,
    enableSorting: true,
    cell: (info) => (
      <SelectCell
        defaultValue={info.getValue<string>() ?? ''}
        options={['Yes', 'No', 'Possible']}
      />
    ),
  },
  {
    id: 'impactedBusinessProcesses',
    accessorKey: 'impactedBusinessProcesses',
    header: 'Impacted Business Processes',
    size: 260,
    enableSorting: false,
    cell: (info) => (
      <span className="text-muted-foreground text-sm">{info.getValue<string>() ?? '—'}</span>
    ),
  },
  {
    id: 'estimatedImplementationDuration',
    accessorKey: 'estimatedImplementationDuration',
    header: 'Estimated Implementation Duration (months)',
    size: 220,
    enableSorting: true,
    cell: (info) => <NumericEditCell value={info.getValue<number | undefined>()} />,
  },
  {
    id: 'estimatedImplementationCost',
    accessorKey: 'estimatedImplementationCost',
    header: 'Estimated Implementation Cost (AED)',
    size: 220,
    enableSorting: true,
    cell: (info) => <NumericEditCell value={info.getValue<number | undefined>()} />,
  },
  {
    id: 'proposedPriority',
    accessorKey: 'proposedPriority',
    header: 'Proposed Priority',
    size: 157,
    enableSorting: true,
    cell: (info) => (
      <span className="text-foreground text-sm">{info.getValue<string>() ?? '—'}</span>
    ),
  },
  {
    id: 'effortManDays',
    accessorKey: 'effortManDays',
    header: 'Effort, Man-Days',
    size: 157,
    enableSorting: true,
    cell: (info) => (
      <SelectCell defaultValue={info.getValue<string>() ?? ''} options={HIGH_MEDIUM_LOW} />
    ),
  },
  {
    id: 'investmentCost',
    accessorKey: 'investmentCost',
    header: 'Investment Cost',
    size: 157,
    enableSorting: true,
    cell: (info) => (
      <SelectCell defaultValue={info.getValue<string>() ?? ''} options={HIGH_MEDIUM_LOW} />
    ),
  },
  {
    id: 'riskLevel',
    accessorKey: 'riskLevel',
    header: 'Risk Level',
    size: 157,
    enableSorting: true,
    cell: (info) => (
      <span className="text-foreground text-sm">{info.getValue<string>() ?? '—'}</span>
    ),
  },
  {
    id: 'technicalDifficulty',
    accessorKey: 'technicalDifficulty',
    header: 'Technical Difficulty',
    size: 157,
    enableSorting: true,
    cell: (info) => (
      <SelectCell defaultValue={info.getValue<string>() ?? ''} options={HIGH_MEDIUM_LOW} />
    ),
  },
  {
    id: 'resourceRequirements',
    accessorKey: 'resourceRequirements',
    header: 'Resource Requirements',
    size: 157,
    enableSorting: false,
    cell: (info) => (
      <SelectCell defaultValue={info.getValue<string>() ?? ''} options={HIGH_MEDIUM_LOW} />
    ),
  },
  {
    id: 'costSavingRevenuePotential',
    accessorKey: 'costSavingRevenuePotential',
    header: 'Cost Saving/Revenue Generation Potential',
    size: 157,
    enableSorting: false,
    cell: (info) => (
      <SelectCell defaultValue={info.getValue<string>() ?? ''} options={HIGH_MEDIUM_LOW} />
    ),
  },
  {
    id: 'customerSatisfactionIncrease',
    accessorKey: 'customerSatisfactionIncrease',
    header: 'Customer Satisfaction Increase',
    size: 157,
    enableSorting: false,
    cell: (info) => (
      <SelectCell defaultValue={info.getValue<string>() ?? ''} options={HIGH_MEDIUM_LOW} />
    ),
  },
  {
    id: 'businessRiskReduction',
    accessorKey: 'businessRiskReduction',
    header: 'Business Risk Reduction',
    size: 157,
    enableSorting: false,
    cell: (info) => (
      <SelectCell defaultValue={info.getValue<string>() ?? ''} options={HIGH_MEDIUM_LOW} />
    ),
  },
  {
    id: 'efficiencyImprovement',
    accessorKey: 'efficiencyImprovement',
    header: 'Efficiency Improvement',
    size: 157,
    enableSorting: false,
    cell: (info) => (
      <SelectCell defaultValue={info.getValue<string>() ?? ''} options={HIGH_MEDIUM_LOW} />
    ),
  },
  {
    id: 'impactType',
    accessorKey: 'impactType',
    header: 'Impact Type',
    size: 246,
    enableSorting: true,
    cell: (info) => (
      <SelectCell defaultValue={info.getValue<string>() ?? ''} options={IMPACT_TYPE_OPTIONS} />
    ),
  },
  {
    id: 'impactReason',
    accessorKey: 'impactReason',
    header: 'Impact Reason',
    size: 246,
    enableSorting: false,
    cell: (info) => (
      <SelectCell defaultValue={info.getValue<string>() ?? ''} options={IMPACT_REASON_OPTIONS} />
    ),
  },
  {
    id: 'drivers',
    accessorKey: 'drivers',
    header: 'Drivers',
    size: 178,
    enableSorting: false,
    cell: (info) => (
      <span className="text-muted-foreground text-sm">{info.getValue<string>() ?? '—'}</span>
    ),
  },
  {
    id: 'costValueEstimationAssumptions',
    accessorKey: 'costValueEstimationAssumptions',
    header: 'Cost / Value Estimation Assumptions',
    size: 350,
    enableSorting: false,
    cell: (info) => (
      <span className="text-muted-foreground line-clamp-2 text-sm">
        {info.getValue<string>() ?? '—'}
      </span>
    ),
  },
  {
    id: 'comments',
    accessorKey: 'comments',
    header: 'Comments',
    size: 200,
    enableSorting: false,
    cell: (info) => (
      <span className="text-muted-foreground text-sm">{info.getValue<string>() ?? '—'}</span>
    ),
  },
]
