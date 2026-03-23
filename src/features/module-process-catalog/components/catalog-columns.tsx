import { useState } from 'react'
import type { CellContext, ColumnDef } from '@tanstack/react-table'
import { ChevronDown, MoreHorizontal } from 'lucide-react'

import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/components/ui/button'
import { Checkbox } from '@/shared/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
import StatusBadgeCell, { type CatalogStatus } from './cells/StatusBadgeCell'
import type { ProcessItem, YesNo } from '../types'
import { ENTITY_CONFIG } from '../types'

// Augment TanStack Table meta so isBulkMode is type-safe.
declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface TableMeta<TData> {
    isBulkMode?: boolean
  }
}

// ─── Shared Service Toggle ────────────────────────────────────────────────────

const SharedServiceToggle = ({ defaultValue }: { defaultValue: boolean }) => {
  const [enabled, setEnabled] = useState(defaultValue)
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        onClick={() => setEnabled(v => !v)}
        className={cn(
          'relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          enabled ? 'bg-primary' : 'bg-input',
        )}
      >
        <span
          className={cn(
            'pointer-events-none block h-4 w-4 rounded-full bg-background shadow-md ring-0 transition-transform',
            enabled ? 'translate-x-4' : 'translate-x-0',
          )}
        />
      </button>
      <span className="text-sm text-foreground">{enabled ? 'Yes' : 'No'}</span>
    </div>
  )
}

// ─── Entity Site Cell ─────────────────────────────────────────────────────────

const EntitySiteCell = ({ initialValue }: { initialValue: YesNo }) => {
  const [value, setValue] = useState<YesNo>(initialValue)
  return (
    <div className="flex items-center gap-1.5">
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="inline-flex h-7 min-w-[52px] items-center justify-between gap-1 rounded-md px-1.5 text-sm text-foreground outline-none hover:bg-muted/60 focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span>{value}</span>
            <ChevronDown className="size-3 text-muted-foreground" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          sideOffset={4}
          className="w-24 overflow-hidden rounded-xl border p-0 shadow-md"
        >
          {(['Yes', 'No'] as const).map(opt => (
            <DropdownMenuItem
              key={opt}
              onSelect={() => setValue(opt)}
              className={cn('rounded-none px-3 py-2 text-sm font-normal', value === opt && 'bg-accent')}
            >
              {opt}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      {value === 'Yes' && (
        <button type="button" className="whitespace-nowrap text-xs font-medium text-primary hover:underline">
          Edit L4s
        </button>
      )}
    </div>
  )
}

// ─── Inline Row Actions ───────────────────────────────────────────────────────

type CatalogRowAction = {
  id: string
  label: string
  onSelect: (item: ProcessItem) => void
}

const CellRowActions = ({ item, actions }: { item: ProcessItem; actions: CatalogRowAction[] }) => (
  <DropdownMenu modal={false}>
    <DropdownMenuTrigger asChild>
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        className="ml-auto shrink-0 opacity-0 transition-opacity group-hover/cell:opacity-100 text-muted-foreground"
        aria-label="Row actions"
      >
        <MoreHorizontal className="size-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent
      align="end"
      sideOffset={4}
      className="w-52 overflow-hidden rounded-2xl border p-0 shadow-lg"
    >
      {actions.map(a => (
        <DropdownMenuItem
          key={a.id}
          onSelect={() => a.onSelect(item)}
          className="rounded-none px-4 py-2.5 text-sm"
        >
          {a.label}
        </DropdownMenuItem>
      ))}
    </DropdownMenuContent>
  </DropdownMenu>
)

// ─── Entity matrix column group builder ──────────────────────────────────────

function buildEntityColumns(): ColumnDef<ProcessItem, unknown>[] {
  return ENTITY_CONFIG.map(entity => ({
    id: `entity__${entity.name}`,
    header: entity.name,
    meta: { isEntityGroup: true },
    columns: entity.sites.map(site => ({
      id: `entity__${entity.name}__${site}`,
      header: site,
      size: 200,
      enableSorting: false,
      cell: (info: CellContext<ProcessItem, unknown>) => {
        const siteValue = (info.row.original.entities[entity.name]?.[site] ?? 'No') as YesNo
        return <EntitySiteCell initialValue={siteValue} />
      },
    })),
  }))
}

// ─── Public exports ───────────────────────────────────────────────────────────

export type CatalogColumnActions = {
  onAddL2: (item: ProcessItem) => void
  onViewChanges: (item: ProcessItem) => void
  onRename: (item: ProcessItem) => void
}

/** Column IDs to pin to the left — pass directly to DataTable's initialColumnPinning. */
export const CATALOG_PINNED_LEFT = ['domain', 'level1', 'level2', 'level3'] as const

/**
 * Wraps a leaf column in a single-column group so it participates in the
 * two-tier header symmetrically with entity groups. The group header (depth 0)
 * renders empty; the leaf header (depth 1) renders the column name + sort icon.
 * isDivider meta is propagated from the leaf to the wrapper group.
 */
function wrap<T>(leaf: ColumnDef<T, unknown>): ColumnDef<T, unknown> {
  const leafMeta = (leaf as { meta?: Record<string, unknown> }).meta ?? {}
  const groupId = `grp__${(leaf as { id?: string; accessorKey?: string }).id ?? (leaf as { accessorKey?: string }).accessorKey}`
  return {
    id: groupId,
    header: '',
    meta: { isDivider: leafMeta.isDivider },
    columns: [leaf],
  }
}

export function buildCatalogColumns(rowActions?: CatalogColumnActions): ColumnDef<ProcessItem, unknown>[] {
  const actions: CatalogRowAction[] = rowActions
    ? [
        { id: 'add-l2', label: 'Add L2 processes', onSelect: rowActions.onAddL2 },
        { id: 'view-changes', label: 'View recorded changes', onSelect: rowActions.onViewChanges },
        { id: 'rename', label: 'Rename', onSelect: rowActions.onRename },
      ]
    : []

  // ── Flat leaf column defs ──────────────────────────────────────────────────
  const domainCol: ColumnDef<ProcessItem, unknown> = {
    id: 'domain',
    accessorKey: 'domain',
    header: 'Domain',
    size: 180,
    enableSorting: false,
    cell: (info: CellContext<ProcessItem, unknown>) => {
      const rows = info.table.getRowModel().rows
      const prev = info.row.index > 0 ? rows[info.row.index - 1] : null
      if (prev?.original.domain === info.row.original.domain) return null
      return (
        <div className="flex w-full min-w-0 items-center gap-1">
          <span className="flex-1 truncate text-sm font-medium text-foreground">
            {info.row.original.domain}
          </span>
          {actions.length > 0 && <CellRowActions item={info.row.original} actions={actions} />}
        </div>
      )
    },
  }

  const level1Col: ColumnDef<ProcessItem, unknown> = {
    id: 'level1',
    header: 'Level 1',
    size: 200,
    enableSorting: false,
    cell: (info: CellContext<ProcessItem, unknown>) => {
      const rows = info.table.getRowModel().rows
      const prev = info.row.index > 0 ? rows[info.row.index - 1] : null
      if (
        prev?.original.domain === info.row.original.domain &&
        prev?.original.level1Code === info.row.original.level1Code
      )
        return null
      return (
        <div className="flex flex-col gap-0.5">
          <span className="truncate text-sm font-medium text-foreground leading-tight">
            {info.row.original.level1Name}
          </span>
          <span className="text-xs text-muted-foreground">{info.row.original.level1Code}</span>
        </div>
      )
    },
  }

  const level2Col: ColumnDef<ProcessItem, unknown> = {
    id: 'level2',
    header: 'Level 2',
    size: 200,
    enableSorting: false,
    cell: (info: CellContext<ProcessItem, unknown>) => {
      const rows = info.table.getRowModel().rows
      const prev = info.row.index > 0 ? rows[info.row.index - 1] : null
      if (
        prev?.original.level1Code === info.row.original.level1Code &&
        prev?.original.level2Code === info.row.original.level2Code
      )
        return null
      return (
        <div className="flex flex-col gap-0.5">
          <span className="truncate text-sm font-medium text-foreground leading-tight">
            {info.row.original.level2Name}
          </span>
          <span className="text-xs text-muted-foreground">{info.row.original.level2Code}</span>
        </div>
      )
    },
  }

  const level3Col: ColumnDef<ProcessItem, unknown> = {
    id: 'level3',
    header: 'Level 3',
    size: 240,
    enableSorting: false,
    cell: (info: CellContext<ProcessItem, unknown>) => {
      const isBulkMode = info.table.options.meta?.isBulkMode ?? false
      const isSelected = info.row.getIsSelected()
      return (
        <div className="flex w-full items-center gap-2">
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className="truncate text-sm font-medium text-foreground leading-tight">
              {info.row.original.level3Name}
            </span>
            <span className="text-xs text-muted-foreground">{info.row.original.level3Code}</span>
          </div>
          {isBulkMode && (
            <Checkbox
              checked={isSelected}
              onCheckedChange={checked => info.row.toggleSelected(!!checked)}
              aria-label={`Select ${info.row.original.level3Name}`}
              className="ms-auto shrink-0"
              onClick={e => e.stopPropagation()}
            />
          )}
        </div>
      )
    },
  }

  const level3StatusCol: ColumnDef<ProcessItem, unknown> = {
    id: 'level3Status',
    accessorKey: 'level3Status',
    header: 'Level 3 Status',
    size: 170,
    enableSorting: false,
    cell: (info: CellContext<ProcessItem, unknown>) => (
      <StatusBadgeCell status={info.getValue() as CatalogStatus} />
    ),
  }

  const descriptionCol: ColumnDef<ProcessItem, unknown> = {
    id: 'description',
    accessorKey: 'description',
    header: 'Description',
    size: 480,
    enableSorting: false,
    cell: (info: CellContext<ProcessItem, unknown>) => (
      <span className="line-clamp-3 whitespace-normal text-sm text-foreground">
        {String(info.getValue())}
      </span>
    ),
  }

  const sharedServiceCol: ColumnDef<ProcessItem, unknown> = {
    id: 'sharedService',
    accessorKey: 'isSharedService',
    header: 'Shared Service Process?',
    size: 160,
    enableSorting: false,
    meta: { isDivider: true },
    cell: (info: CellContext<ProcessItem, unknown>) => (
      <SharedServiceToggle defaultValue={Boolean(info.getValue())} />
    ),
  }

  return [
    // Each flat column is wrapped so all columns participate in the same two-tier
    // header structure. The wrapper group emits an empty depth-0 header cell;
    // the leaf emits the real column name at depth-1 (aligned with site sub-headers).
    wrap(domainCol),
    wrap(level1Col),
    wrap(level2Col),
    wrap(level3Col),
    wrap(level3StatusCol),
    wrap(descriptionCol),
    wrap(sharedServiceCol),
    // Entity matrix groups — top-tier shows entity name, bottom-tier shows site names.
    ...buildEntityColumns(),
  ]
}
