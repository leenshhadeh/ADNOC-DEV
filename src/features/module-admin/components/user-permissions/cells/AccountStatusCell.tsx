type Props = {
  status: 'Active' | 'Deactivated'
}

const AccountStatusCell = ({ status }: Props) => {
  const isActive = status === 'Active'

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-[12px] font-[400] text-[#151718] ${
        isActive ? 'bg-[#DCFCE7]' : 'bg-[#E0E0E0]'
      }`}
    >
      {status}
    </span>
  )
}

export default AccountStatusCell
