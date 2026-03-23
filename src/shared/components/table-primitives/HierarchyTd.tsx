import { cn } from '@/shared/lib/utils'

/**
 * Sticky, rowSpan-aware <td> for pinned hierarchy columns.
 * Used wherever a table needs merged cells that span multiple rows.
 *
 * S — renders one sticky hierarchy cell, nothing else.
 * O — open for children composition; styling is encapsulated.
 * I — props contain only what this cell requires.
 * D — depends on cn utility abstraction, not on any specific module type.
 */
export interface HierarchyTdProps {
  children: React.ReactNode
  rowSpan: number
  /** Fixed pixel width for the column. */
  size: number
  leftOffset: number
  /** Apply right divider + shadow — mark true for the last pinned column. */
  isLast?: boolean
  /** Extra Tailwind classes for one-off overrides. */
  className?: string
}

const HierarchyTd = ({
  children,
  rowSpan,
  size,
  leftOffset,
  isLast,
  className,
}: HierarchyTdProps) => (
  <td
    rowSpan={rowSpan}
    style={{ width: size, minWidth: size, position: 'sticky', left: leftOffset, zIndex: 10 }}
    className={cn(
      'bg-card border-border border-b px-3 py-2 align-top text-sm',
      isLast && 'border-r-border/60 border-r-2 shadow-[2px_0_6px_-2px_rgba(0,0,0,0.07)]',
      className,
    )}
  >
    {children}
  </td>
)

export default HierarchyTd
