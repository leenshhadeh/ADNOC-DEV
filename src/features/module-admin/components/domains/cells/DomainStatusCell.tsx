import type { DomainRow } from '../types'

type Props = {
  row: DomainRow
}

const DomainStatusCell = ({ row }: Props) => {
  const isActivated = row.status === 'Activated'

  return (
    <span
      className={[
        'inline-flex rounded-full px-2.5 py-1 text-xs font-medium',
        isActivated ? 'bg-[#E8FDF3] text-[#027A48]' : 'bg-[#F2F4F7] text-[#344054]',
      ].join(' ')}
    >
      {row.status}
    </span>
  )
}

export default DomainStatusCell