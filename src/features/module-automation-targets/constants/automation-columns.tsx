import { createColumnHelper } from '@tanstack/react-table'
import StatusBadgeCell from '@/shared/components/cells/StatusBadgeCell'
import EditablePercentCell from '../components/cells/EditablePercentCell'
import EditableTextCell from '../components/cells/EditableTextCell'
import EditableSelectCell from '../components/cells/EditableSelectCell'
import type { AutomationTargetRow } from '../types'

const col = createColumnHelper<AutomationTargetRow>()

const TO_BE_AI_OPTIONS = ['Yes', 'No']

export interface AutomationTableMeta {
  onCellChange?: (rowId: string, field: string, value: string) => void
  onSmeFeedbackClick?: (row: AutomationTargetRow) => void
}

export const automationTargetColumns = [
  col.accessor('domain', {
    id: 'domain',
    header: 'Domain',
    size: 200,
    meta: { spanKey: 'domain' },
    cell: ({ row, table }) => {
      const allRows = table.getRowModel().rows
      const idx = allRows.findIndex((r) => r.id === row.id)
      if (idx > 0 && allRows[idx - 1].original.domain === row.original.domain) return null
      return <span className="text-sm font-medium">{row.original.domain}</span>
    },
  }),
  col.accessor('level1', {
    id: 'level1',
    header: 'Level 1',
    size: 200,
    cell: ({ row, table }) => {
      const allRows = table.getRowModel().rows
      const idx = allRows.findIndex((r) => r.id === row.id)
      if (
        idx > 0 &&
        allRows[idx - 1].original.level1 === row.original.level1 &&
        allRows[idx - 1].original.level1Code === row.original.level1Code
      )
        return null
      return (
        <div>
          <p className="text-foreground text-sm font-medium">{row.original.level1}</p>
          <p className="text-muted-foreground text-xs font-light">{row.original.level1Code}</p>
        </div>
      )
    },
  }),
  col.accessor('level2', {
    id: 'level2',
    header: 'Level 2',
    size: 220,
    cell: ({ row, table }) => {
      const allRows = table.getRowModel().rows
      const idx = allRows.findIndex((r) => r.id === row.id)
      if (
        idx > 0 &&
        allRows[idx - 1].original.level2 === row.original.level2 &&
        allRows[idx - 1].original.level2Code === row.original.level2Code
      )
        return null
      return (
        <div>
          <p className="text-foreground text-sm font-medium">{row.original.level2}</p>
          <p className="text-muted-foreground text-xs font-light">{row.original.level2Code}</p>
        </div>
      )
    },
  }),
  col.accessor('level3', {
    id: 'level3',
    header: 'Level 3',
    size: 240,
    cell: ({ row }) => {
      if (!row.original.isL3GroupHeader) return null
      return (
        <div>
          <p className="text-foreground text-sm font-medium">{row.original.level3}</p>
          <p className="text-muted-foreground text-xs font-light">{row.original.level3Code}</p>
        </div>
      )
    },
  }),
  col.accessor('level4', {
    id: 'level4',
    header: 'Level 4',
    size: 240,
    cell: ({ row }) => {
      if (row.original.isL3GroupHeader) return null
      return (
        <div>
          <p className="text-foreground text-sm font-medium">{row.original.level4}</p>
          <p className="text-muted-foreground text-xs font-light">{row.original.level4Code}</p>
        </div>
      )
    },
  }),
  col.accessor('groupCompany', {
    id: 'groupCompany',
    header: 'Group Company',
    size: 160,
    cell: ({ row }) => {
      if (row.original.isL3GroupHeader) return null
      return <span className="text-sm">{row.original.groupCompany}</span>
    },
  }),
  col.accessor('site', {
    id: 'site',
    header: 'Site',
    size: 140,
    cell: ({ row }) => {
      if (row.original.isL3GroupHeader) return null
      return <span className="text-sm">{row.original.site}</span>
    },
  }),
  col.accessor('status', {
    id: 'status',
    header: 'Status',
    size: 150,
    cell: ({ row, getValue }) => {
      if (row.original.isL3GroupHeader) return null
      return <StatusBadgeCell status={getValue()} />
    },
  }),
  col.accessor('processDescription', {
    id: 'processDescription',
    header: 'Process Description',
    size: 220,
    cell: ({ row, getValue }) => {
      if (row.original.isL3GroupHeader) return null
      const val = getValue()
      return <span className="text-sm">{val || '—'}</span>
    },
  }),
  col.accessor('automationMaturityLevel', {
    id: 'automationMaturityLevel',
    header: 'Automation Maturity Level',
    size: 200,
    cell: ({ row }) => {
      if (row.original.isL3GroupHeader) return null
      return <span className="text-sm">{row.original.automationMaturityLevel}</span>
    },
  }),
  col.display({
    id: 'currentApplicationsSystems',
    header: 'Current Applications / Systems',
    size: 220,
    cell: ({ row }) => {
      if (row.original.isL3GroupHeader) return null
      const apps = row.original.currentApplicationsSystems
      if (!apps?.length) return <span className="text-muted-foreground text-sm">—</span>
      return <span className="text-sm">{apps.join(', ')}</span>
    },
  }),
  col.accessor('northStarTarget', {
    id: 'northStarTarget',
    header: '"North Star" Target Automation',
    size: 200,
    cell: ({ row }) => {
      if (row.original.isL3GroupHeader) return null
      return <span className="text-sm">{row.original.northStarTarget}</span>
    },
  }),
  col.accessor('targetAutomationLevelPercent', {
    id: 'targetAutomationLevelPercent',
    header: 'Target Automation Level (%)',
    size: 200,
    cell: ({ row, table }) => {
      if (row.original.isL3GroupHeader) return null
      const meta = table.options.meta as AutomationTableMeta | undefined
      return (
        <EditablePercentCell
          value={row.original.targetAutomationLevelPercent}
          onChange={(val) =>
            meta?.onCellChange?.(row.original.id, 'targetAutomationLevelPercent', val)
          }
        />
      )
    },
  }),
  col.accessor('smeFeedback', {
    id: 'smeFeedback',
    header: 'SME Feedback',
    size: 200,
    cell: ({ row, table }) => {
      if (row.original.isL3GroupHeader) return null
      const meta = table.options.meta as AutomationTableMeta | undefined
      const value = row.original.smeFeedback
      return (
        <button
          type="button"
          className="w-full truncate text-left text-sm"
          onClick={() => meta?.onSmeFeedbackClick?.(row.original)}
        >
          {value ? (
            <span className="text-foreground">{value}</span>
          ) : (
            <span className="text-muted-foreground">Click to add...</span>
          )}
        </button>
      )
    },
  }),
  col.accessor('toBeAIPowered', {
    id: 'toBeAIPowered',
    header: 'To be AI Powered',
    size: 160,
    cell: ({ row, table }) => {
      if (row.original.isL3GroupHeader) return null
      const meta = table.options.meta as AutomationTableMeta | undefined
      return (
        <EditableSelectCell
          value={row.original.toBeAIPowered}
          options={TO_BE_AI_OPTIONS}
          placeholder="Select…"
          onChange={(val) => meta?.onCellChange?.(row.original.id, 'toBeAIPowered', val)}
        />
      )
    },
  }),
  col.accessor('toBeAIPoweredComments', {
    id: 'toBeAIPoweredComments',
    header: 'To be AI Powered Comments',
    size: 220,
    cell: ({ row, table }) => {
      if (row.original.isL3GroupHeader) return null
      const meta = table.options.meta as AutomationTableMeta | undefined
      return (
        <EditableTextCell
          value={row.original.toBeAIPoweredComments}
          placeholder="Click to add..."
          onChange={(val) => meta?.onCellChange?.(row.original.id, 'toBeAIPoweredComments', val)}
        />
      )
    },
  }),
  col.accessor('publishedDate', {
    id: 'publishedDate',
    header: 'Published Date',
    size: 140,
    cell: ({ row }) => {
      if (row.original.isL3GroupHeader) return null
      return <span className="text-sm">{row.original.publishedDate || '—'}</span>
    },
  }),
  col.accessor('submittedBy', {
    id: 'submittedBy',
    header: 'Submitted by',
    size: 160,
    cell: ({ row }) => {
      if (row.original.isL3GroupHeader) return null
      return <span className="text-sm">{row.original.submittedBy || '—'}</span>
    },
  }),
  col.accessor('submittedDate', {
    id: 'submittedDate',
    header: 'Submitted Date',
    size: 140,
    cell: ({ row }) => {
      if (row.original.isL3GroupHeader) return null
      return <span className="text-sm">{row.original.submittedDate || '—'}</span>
    },
  }),
]
