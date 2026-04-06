import { Badge } from '@/shared/components/ui/badge'
import { cn } from '@/shared/lib/utils'
import { useCurrentUser } from '@/shared/auth/useUserStore'

export type CatalogStatus =
  | 'Pending approval'
  | 'Pending signoff'
  | 'Pending updates'
  | 'Returned draft'
  | 'Published'
  | 'Draft'
  | '-'

interface StatusBadgeCellProps {
  status: CatalogStatus
}

const statusStyles: Record<CatalogStatus, string> = {
  'Pending approval': 'border-transparent bg-[#F8E7DA] text-[#6E4C33]',
  'Pending signoff': 'border-transparent bg-[#F4EEBE] text-[#5E570C]',
  'Pending updates': 'border-transparent bg-[#F8E7DA] text-[#6E4C33]',
  'Returned draft': 'border-transparent bg-[#F9D4E0] text-[#5E2A3A]',
  'Draft':'border-transparent bg-[#eee] text-[#151718]',
  Published: 'border-transparent bg-[#E8F0FF] text-[#0047BB]',
  '-': 'border-transparent bg-[#eee]',
}

// Highlighted colours shown to BPA Program Manager so pending items stand out
const bpaPmStatusOverrides: Partial<Record<CatalogStatus, string>> = {
  'Pending approval': 'border-transparent bg-[#FEE5D3] text-[#6E4C33]',
  'Pending signoff': 'border-transparent bg-[#FFFAC7] text-[#5E570C]',
}

const StatusBadgeCell = ({ status }: StatusBadgeCellProps) => {
  const { role } = useCurrentUser()
  const isBpaPm = role === 'BPA Program Manager'

  const style = (isBpaPm && bpaPmStatusOverrides[status]) || statusStyles[status] || 'bg-[#eee]'

  return (
    <Badge
      className={cn(
        'flex h-7 min-w-[120px] items-center justify-center px-5 text-sm font-medium whitespace-nowrap',
        style,
      )}
    >
      {status}
    </Badge>
  )
}

export default StatusBadgeCell
