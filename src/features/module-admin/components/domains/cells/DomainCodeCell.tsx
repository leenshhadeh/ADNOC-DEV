import type { DomainRow } from '../types'

type Props = {
  row: DomainRow
  onChange?: (rowId: string, field: 'code', value: string) => void
}

const DomainCodeCell = ({ row, onChange }: Props) => {
  return (
    <input
      value={row.code}
      onChange={(e) => onChange?.(row.id, 'code', e.target.value.toUpperCase())}
      className="w-full border-0 bg-transparent text-[16px] text-[#151718] outline-none"
    />
  )
}

export default DomainCodeCell
