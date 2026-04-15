import { createColumnHelper } from '@tanstack/react-table'
import StatusBadgeCell from '@/shared/components/cells/StatusBadgeCell'
import type { AutomationTargetRow } from '../types'

const col = createColumnHelper<AutomationTargetRow>()

export const automationTargetColumns = [
  col.accessor('domain', {
    id: 'domain',
    header: 'Domain',
    size: 180,
  }),
  col.accessor('level1', {
    id: 'level1',
    header: 'Level 1',
    size: 180,
    cell: ({ row }) => (
      <div>
        <p className="text-foreground text-sm font-medium">{row.original.level1}</p>
        <p className="text-muted-foreground text-xs font-light">{row.original.level1Code}</p>
      </div>
    ),
  }),
  col.accessor('level2', {
    id: 'level2',
    header: 'Level 2',
    size: 200,
    cell: ({ row }) => (
      <div>
        <p className="text-foreground text-sm font-medium">{row.original.level2}</p>
        <p className="text-muted-foreground text-xs font-light">{row.original.level2Code}</p>
      </div>
    ),
  }),
  col.accessor('level3', {
    id: 'level3',
    header: 'Level 3',
    size: 220,
    cell: ({ row }) => (
      <div>
        <p className="text-foreground text-sm font-medium">{row.original.level3}</p>
        <p className="text-muted-foreground text-xs font-light">{row.original.level3Code}</p>
      </div>
    ),
  }),
  col.accessor('level4', {
    id: 'level4',
    header: 'Level 4',
    size: 220,
    cell: ({ row }) => (
      <div>
        <p className="text-foreground text-sm font-medium">{row.original.level4}</p>
        <p className="text-muted-foreground text-xs font-light">{row.original.level4Code}</p>
      </div>
    ),
  }),
  col.accessor('groupCompany', {
    id: 'groupCompany',
    header: 'Group Company',
    size: 160,
  }),
  col.accessor('site', {
    id: 'site',
    header: 'Site',
    size: 140,
  }),
  col.accessor('status', {
    id: 'status',
    header: 'Status',
    size: 150,
    cell: ({ getValue }) => <StatusBadgeCell status={getValue()} />,
  }),
  col.accessor('smeFeedback', {
    id: 'smeFeedback',
    header: 'SME Feedback',
    size: 160,
    cell: ({ getValue }) => {
      const html = getValue()
      if (!html) return <span className="text-muted-foreground text-sm">—</span>
      return <div className="line-clamp-2 text-sm" dangerouslySetInnerHTML={{ __html: html }} />
    },
  }),
  col.accessor('automationMaturityLevel', {
    id: 'automationMaturityLevel',
    header: 'Automation Maturity Level',
    size: 200,
  }),
  col.accessor('automationLevel', {
    id: 'automationLevel',
    header: 'Automation Level (%)',
    size: 170,
  }),
  col.accessor('northStarTarget', {
    id: 'northStarTarget',
    header: 'North Star Target',
    size: 180,
  }),
  col.accessor('targetAutomationLevelPercent', {
    id: 'targetAutomationLevelPercent',
    header: 'Target Automation Level (%)',
    size: 200,
  }),
]
