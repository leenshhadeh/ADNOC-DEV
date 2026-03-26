import { Badge } from "@/shared/components/ui/badge"
import { cn } from "@/shared/lib/utils"

export type CatalogStatus = "Pending approval" | "Pending signoff" | "Pending updates" | "Returned draft" | "Published" | "-"

interface StatusBadgeCellProps {
  status: CatalogStatus
}

const statusStyles: Record<CatalogStatus, string> = {
  "Pending approval": "border-transparent bg-[#F8E7DA] text-[#6E4C33]",
  "Pending signoff": "border-transparent bg-[#F4EEBE] text-[#5E570C]",
  "Pending updates": "border-transparent bg-[#F8E7DA] text-[#6E4C33]",
  "Returned draft": "border-transparent bg-[#F9D4E0] text-[#5E2A3A]",
  "Published": "border-transparent bg-[#E8F0FF] text-[#0047BB]",
  "-":"border-transparent bg-[#eee]"
}

const StatusBadgeCell = ({ status }: StatusBadgeCellProps) => {
  return (
    <Badge
      className={cn(
        "min-w-[120px] h-7 px-5 text-sm font-medium flex items-center justify-center whitespace-nowrap",
        statusStyles[status] || 'bg-[#eee]'
      )}
    >
      {status}
    </Badge>
  )
}

export default StatusBadgeCell
