import { cn } from '@/shared/lib/utils'

/**
 * Outer card wrapper shared by all module tables.
 * Owns only the visual card frame — scroll strategy is left to each consumer.
 *
 * S — single responsibility: visual card shell, nothing else.
 * O — open for extension via className, closed for modification.
 */
interface TableShellProps {
  children: React.ReactNode
  className?: string
}

const TableShell = ({ children, className }: TableShellProps) => (
  <div className={cn('border-border bg-card overflow-hidden rounded-2xl border', className)}>
    {children}
  </div>
)

export default TableShell
