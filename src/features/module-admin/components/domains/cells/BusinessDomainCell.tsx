import type { DomainRow } from '../types'

type Props = {
  row: DomainRow
  onChange?: (rowId: string, field: 'businessDomain', value: string) => void
}

const BusinessDomainCell = ({ row, onChange }: Props) => {
  return (
    <input
      value={row.businessDomain}
      onChange={(e) => onChange?.(row.id, 'businessDomain', e.target.value)}
      className="w-full border-0 bg-transparent text-[16px] font-medium text-[#151718] outline-none"
    />
  )
}

export default BusinessDomainCell