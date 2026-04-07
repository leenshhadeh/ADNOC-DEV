import type { DomainRow } from '../types'

type Props = {
  row: DomainRow
  onChange?: (rowId: string, field: 'sortingIndex', value: string) => void
}

const SortingIndexCell = ({ row, onChange }: Props) => {
  return (
    <input
      type="number"
      value={row.sortingIndex}
      onChange={(e) => onChange?.(row.id, 'sortingIndex', e.target.value)}
      className="w-full border-0 bg-transparent text-[16px] text-[#151718] outline-none"
    />
  )
}

export default SortingIndexCell
