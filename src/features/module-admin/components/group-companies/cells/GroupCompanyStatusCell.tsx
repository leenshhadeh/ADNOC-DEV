import type { GroupCompanyRow } from '../types'

type Props = {
  row: GroupCompanyRow
}

const GroupCompanyStatusCell = ({ row }: Props) => {
  const isActive = row.status === 'Active'

  return (
    <span
      className={[
        'inline-flex rounded-full px-2.5 py-1 text-xs font-medium',
        isActive ? 'bg-[#E8FDF3] text-[#027A48]' : 'bg-[#F2F4F7] text-[#344054]',
      ].join(' ')}
    >
      {row.status}
    </span>
  )
}

export default GroupCompanyStatusCell
