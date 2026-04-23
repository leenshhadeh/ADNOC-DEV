import { TableHead } from '@/shared/components/ui/table'
import { cn } from '@/shared/lib/utils'
import FilterIcon from '@/assets/icons/Shape.svg?react'

/**
 * Reusable column header <th> for any module table.
 *
 * S — renders a single header cell, nothing else.
 * O — open for visual extension via className; API is stable.
 * I — only accepts props that a header cell actually needs.
 */
export interface ColHeadProps {
  label: string
  /** Fixed pixel width (ignored when colSpan is set). */
  size?: number
  colSpan?: number
  className?: string
  /** Show the sort icon. Defaults to true. */
  showSort?: boolean
  /** Pin this cell to the left via position:sticky. */
  isSticky?: boolean
  leftOffset?: number
}

const ColHead = ({
  label,
  size,
  colSpan,
  className,
  showSort = true,
  isSticky,
  leftOffset,
}: ColHeadProps) => (
  <TableHead
    colSpan={colSpan}
    style={{
      ...(size !== undefined && colSpan === undefined ? { width: size, minWidth: size } : {}),
      ...(isSticky ? { position: 'sticky', left: leftOffset ?? 0, zIndex: 20 } : {}),
    }}
    className={cn(
      'border-border text-muted-foreground sticky top-0 border-b bg-accent py-2 text-xs font-semibold tracking-wide uppercase',
      isSticky ? 'z-20' : 'z-10',
      className,
    )}
  >
    <div className="flex items-center gap-1">
      <span className="truncate">{label}</span>
      {showSort && <FilterIcon className="size-3 shrink-0 opacity-50" />}
    </div>
  </TableHead>
)

export default ColHead
