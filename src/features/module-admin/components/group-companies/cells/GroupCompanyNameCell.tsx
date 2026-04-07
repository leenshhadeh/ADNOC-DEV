import type { GroupCompanyRow } from '../types'

type Props = {
  row: GroupCompanyRow
  onChange?: (rowId: string, field: 'groupCompany', value: string) => void
}

const GroupCompanyNameCell = ({ row, onChange }: Props) => {
  return (
    <input
      value={row.groupCompany}
      onChange={(e) => onChange?.(row.id, 'groupCompany', e.target.value)}
      className="w-full border-0 bg-transparent text-[16px] font-medium text-[#151718] outline-none"
    />
  )
}

export default GroupCompanyNameCell
