import { useEffect, useRef, useState } from 'react'
import type { CellContext, ColumnDef } from '@tanstack/react-table'
import { ChevronDown, Eye, MoreHorizontal, Pencil, Plus, RotateCcw } from 'lucide-react'

import { EditLevel4sModal } from './EditLevel4sModal'
import { useGetLevel4s } from '@features/module-process-catalog/hooks/useGetLevel4s'
import { PermissionGuard } from '@/shared/components/PermissionGuard'

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
import type { ProcessItem, YesNo } from '@features/module-process-catalog/types'
import type { GroupCompany } from '@features/module-process-catalog/types'

// Augment TanStack Table meta so isBulkMode is type-safe.
declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface TableMeta<TData> {
    isBulkMode?: boolean
    onUpdateDraftRow?: (id: string, field: 'level3Name' | 'description', value: string) => void
    draftRowIds?: Set<string>
    firstDraftRowId?: string
  }
}
// ─── DraftNameInput ──────────────────────────────────────────────────────────
const DraftNameInput = ({
  rowId,
  autoFocus,
  onUpdate,
}: {
  rowId: string
  autoFocus: boolean
  onUpdate: (id: string, field: 'level3Name' | 'description', value: string) => void
}) => {
  const [value, setValue] = useState('')
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (autoFocus) {
      // slight delay so the row is painted before focusing
      const t = setTimeout(() => ref.current?.focus(), 50)
      return () => clearTimeout(t)
    }
  }, [autoFocus])

  return (
    <input
      ref={ref}
      type="text"
      value={value}
      placeholder="Enter process name"
      onChange={(e) => {
        setValue(e.target.value)
        onUpdate(rowId, 'level3Name', e.target.value)
      }}
      className="text-foreground placeholder:text-muted-foreground/60 border-border focus:border-primary caret-primary w-full border-b bg-transparent text-sm outline-none"
    />
  )
}

// ─── DraftDescriptionInput ────────────────────────────────────────────────────
const DraftDescriptionInput = ({
  rowId,
  onUpdate,
}: {
  rowId: string
  onUpdate: (id: string, field: 'level3Name' | 'description', value: string) => void
}) => {
  const [value, setValue] = useState('')
  return (
    <textarea
      rows={2}
      value={value}
      placeholder="Enter description"
      onChange={(e) => {
        setValue(e.target.value)
        onUpdate(rowId, 'description', e.target.value)
      }}
      className="text-foreground placeholder:text-muted-foreground/60 border-border focus:border-primary caret-primary w-full resize-none border-b bg-transparent text-sm outline-none"
    />
  )
}
// ─── Entity Site Cell ─────────────────────────────────────────────────────────

const EntitySiteCell = ({
  initialValue,
  entityName,
  siteName,
  parentCode,
  parentId,
}: {
  initialValue: YesNo
  entityName: string
  siteName: string
  parentCode: string
  /** The Level 3 row id — used to fetch scoped L4 records from the query cache. */
  parentId: string
}) => {
  const [value, setValue] = useState<YesNo>(initialValue)
  const [editOpen, setEditOpen] = useState(false)

  // Fetch L4s scoped to this L3 row — only runs when the modal is open
  const { data: level4s, isLoading: isLoadingL4s } = useGetLevel4s(editOpen ? parentId : undefined)

  const initialRows = level4s?.map((l4) => ({
    processCode: l4.processCode,
    processName: l4.name,
    processDescription: l4.description,
  }))

  return (
    <div className="flex items-center gap-1.5">
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="text-foreground hover:bg-muted/60 focus-visible:ring-ring inline-flex h-7 min-w-[52px] items-center justify-between gap-1 rounded-md px-1.5 text-sm outline-none focus-visible:ring-2"
          >
            <span>{value}</span>
            <ChevronDown className="text-muted-foreground size-3" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          sideOffset={4}
          className="w-24 overflow-hidden rounded-xl border p-0 shadow-md"
        >
          {(['Yes', 'No'] as const).map((opt) => (
            <DropdownMenuItem
              key={opt}
              onSelect={() => setValue(opt)}
              className={cn(
                'rounded-none px-3 py-2 text-sm font-normal',
                value === opt && 'bg-accent',
              )}
            >
              {opt}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {value === 'Yes' && (
        <>
          <button
            type="button"
            className="text-primary text-xs font-medium whitespace-nowrap hover:underline"
            onClick={() => setEditOpen(true)}
          >
            Edit L4s
          </button>

          <EditLevel4sModal
            open={editOpen}
            onOpenChange={setEditOpen}
            parentLabel={`${entityName} - ${siteName}`}
            parentCode={parentCode}
            initialRows={initialRows}
            isLoading={isLoadingL4s}
          />
        </>
      )}
    </div>
  )
}

// ─── Inline Row Actions (L1/L2 columns) ──────────────────────────────────────

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
        className="text-muted-foreground ml-auto shrink-0 opacity-0 transition-opacity group-hover/cell:opacity-100"
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
      {actions.map((a) => (
        <DropdownMenuItem
          key={a.id}
          onSelect={() => a.onSelect(item)}
          className="rounded-none px-4 py-2.5 text-sm font-normal"
        >
          {a.label}
        </DropdownMenuItem>
      ))}
    </DropdownMenuContent>
  </DropdownMenu>
)

// ─── Level 3 Row Actions (with icons + bold Draft) ────────────────────────────

const Level3RowActions = ({
  item,
  onViewRecordedChanges,
  onSwitchToDraft,
  onAddL4s,
  onEditL4s,
  onRename,
}: {
  item: ProcessItem
  onViewRecordedChanges: (item: ProcessItem) => void
  onSwitchToDraft: (item: ProcessItem) => void
  onAddL4s: (item: ProcessItem) => void
  onEditL4s?: (item: ProcessItem) => void
  onRename: (item: ProcessItem) => void
}) => (
  <DropdownMenu modal={false}>
    <DropdownMenuTrigger asChild>
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        className="text-muted-foreground ml-auto shrink-0 opacity-0 transition-opacity group-hover/cell:opacity-100"
        aria-label="Row actions"
      >
        <MoreHorizontal className="size-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent
      align="end"
      sideOffset={4}
      className="w-56 overflow-hidden rounded-2xl border p-0 shadow-lg"
    >
      <DropdownMenuItem
        onSelect={() => onViewRecordedChanges(item)}
        className="flex items-center gap-3 rounded-none px-4 py-2.5 text-sm font-normal"
      >
        <Eye className="text-muted-foreground size-4 shrink-0" />
        View recorded changes
      </DropdownMenuItem>
      <DropdownMenuItem
        onSelect={() => onSwitchToDraft(item)}
        className="flex items-center gap-3 rounded-none px-4 py-2.5 text-sm font-normal"
      >
        <RotateCcw className="text-muted-foreground size-4 shrink-0" />
        <span>
          Switch to <strong className="font-semibold">Draft</strong> version
        </span>
      </DropdownMenuItem>
      <PermissionGuard action="ADD_LEVEL_4">
        <DropdownMenuItem
          onSelect={() => onAddL4s(item)}
          className="flex items-center gap-3 rounded-none px-4 py-2.5 text-sm font-normal"
        >
          <Plus className="text-muted-foreground size-4 shrink-0" />
          Add L4s
        </DropdownMenuItem>
      </PermissionGuard>
      {onEditL4s && (
        <DropdownMenuItem
          onSelect={() => onEditL4s(item)}
          className="flex items-center gap-3 rounded-none px-4 py-2.5 text-sm font-normal"
        >
          <Pencil className="text-muted-foreground size-4 shrink-0" />
          Edit L4s
        </DropdownMenuItem>
      )}
      <PermissionGuard action="RENAME_PROCESS">
        <DropdownMenuItem
          onSelect={() => onRename(item)}
          className="flex items-center gap-3 rounded-none px-4 py-2.5 text-sm font-normal"
        >
          <Pencil className="text-muted-foreground size-4 shrink-0" />
          Rename
        </DropdownMenuItem>
      </PermissionGuard>
    </DropdownMenuContent>
  </DropdownMenu>
)

// ─── Entity matrix column group builder ──────────────────────────────────────

function buildEntityColumns(groupCompanies: GroupCompany[]): ColumnDef<ProcessItem, unknown>[] {
  return groupCompanies.map((entity) => ({
    id: `entity__${entity.name}`,
    header: entity.name,
    meta: { isEntityGroup: true },
    columns: entity.sites.map((site) => ({
      id: `entity__${entity.name}__${site}`,
      header: site,
      size: 200,
      enableSorting: false,
      cell: (info: CellContext<ProcessItem, unknown>) => {
        const row = info.row.original
        const siteValue = (row.entities[entity.name]?.[site] ?? 'No') as YesNo
        // Use the row's level3Code as the parent code for Level 4 generation.
        // E.g. level3Code "EXP.1.1.1" → new L4 rows get "EXP.1.1.1.1", "EXP.1.1.1.2", …
        return (
          <EntitySiteCell
            initialValue={siteValue}
            entityName={entity.name}
            siteName={site}
            parentCode={row.level3Code}
            parentId={row.id}
          />
        )
      },
    })),
  }))
}

// ─── Public exports ───────────────────────────────────────────────────────────

export type CatalogColumnActions = {
  /** Opens 'Add L3 processes' modal from L2 column context menu */
  onAddL3: (item: ProcessItem) => void
  onRename: (item: ProcessItem) => void
  // ── L3 column context menu ──
  onViewRecordedChanges: (item: ProcessItem) => void
  onSwitchToDraft: (item: ProcessItem) => void
  onAddL4s: (item: ProcessItem) => void
  /** Opens EditLevel4sModal (Entry B) — optional, shown only when provided */
  onEditL4s?: (item: ProcessItem) => void
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

export function buildCatalogColumns(
  rowActions?: CatalogColumnActions,
  groupCompanies: GroupCompany[] = [],
): ColumnDef<ProcessItem, unknown>[] {
  // Actions for domain/level1/level2 column context menus
  const l2Actions: CatalogRowAction[] = rowActions
    ? [
        { id: 'add-l3', label: 'Add L3 processes', onSelect: rowActions.onAddL3 },
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
          <span className="text-foreground flex-1 truncate text-sm font-medium">
            {info.row.original.domain}
          </span>
          {l2Actions.length > 0 && <CellRowActions item={info.row.original} actions={l2Actions} />}
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
        <div className="flex w-full min-w-0 items-center gap-1">
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className="text-foreground truncate text-sm leading-tight font-medium">
              {info.row.original.level1Name}
            </span>
            <span className="text-muted-foreground text-xs">{info.row.original.level1Code}</span>
          </div>
          {l2Actions.length > 0 && <CellRowActions item={info.row.original} actions={l2Actions} />}
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
        <div className="flex w-full min-w-0 items-center gap-1">
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className="text-foreground truncate text-sm leading-tight font-medium">
              {info.row.original.level2Name}
            </span>
            <span className="text-muted-foreground text-xs">{info.row.original.level2Code}</span>
          </div>
          {l2Actions.length > 0 && <CellRowActions item={info.row.original} actions={l2Actions} />}
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
      const isDraft = info.row.original.level3Status === 'Draft'
      const isFirstDraft = info.table.options.meta?.firstDraftRowId === info.row.original.id
      const onUpdate = info.table.options.meta?.onUpdateDraftRow

      if (isDraft && onUpdate) {
        return (
          <div className="flex w-full items-center gap-2">
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <DraftNameInput
                rowId={info.row.original.id}
                autoFocus={!!isFirstDraft}
                onUpdate={onUpdate}
              />
              <span className="text-muted-foreground text-xs">{info.row.original.level3Code}</span>
            </div>
            {rowActions && !isBulkMode && (
              <Level3RowActions
                item={info.row.original}
                onViewRecordedChanges={rowActions.onViewRecordedChanges}
                onSwitchToDraft={rowActions.onSwitchToDraft}
                onAddL4s={rowActions.onAddL4s}
                onEditL4s={rowActions.onEditL4s}
                onRename={rowActions.onRename}
              />
            )}
          </div>
        )
      }

      return (
        <div className="flex w-full items-center gap-2">
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className="text-foreground truncate text-sm leading-tight font-medium">
              {info.row.original.level3Name}
            </span>
            <span className="text-muted-foreground text-xs">{info.row.original.level3Code}</span>
          </div>
          {rowActions && !isBulkMode && (
            <Level3RowActions
              item={info.row.original}
              onViewRecordedChanges={rowActions.onViewRecordedChanges}
              onSwitchToDraft={rowActions.onSwitchToDraft}
              onAddL4s={rowActions.onAddL4s}
              onEditL4s={rowActions.onEditL4s}
              onRename={rowActions.onRename}
            />
          )}
          {isBulkMode && (
            <Checkbox
              checked={isSelected}
              onCheckedChange={(checked) => info.row.toggleSelected(!!checked)}
              aria-label={`Select ${info.row.original.level3Name}`}
              className="ms-auto shrink-0"
              onClick={(e) => e.stopPropagation()}
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
    // Last static column — renders a right border divider before entity columns.
    meta: { isDivider: true },
    cell: (info: CellContext<ProcessItem, unknown>) => {
      const isDraft = info.row.original.level3Status === 'Draft'
      const onUpdate = info.table.options.meta?.onUpdateDraftRow
      if (isDraft && onUpdate) {
        return <DraftDescriptionInput rowId={info.row.original.id} onUpdate={onUpdate} />
      }
      return (
        <span className="text-foreground line-clamp-3 text-sm whitespace-normal">
          {String(info.getValue())}
        </span>
      )
    },
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
    // Entity matrix groups — top-tier shows group company name, bottom-tier shows sites.
    // Built dynamically from the user-scoped group companies lookup.
    ...buildEntityColumns(groupCompanies),
  ]
}
