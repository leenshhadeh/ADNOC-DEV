type Props = {
  status: 'Active' | 'Deactivated'
}

const AccountStatusCell = ({ status }: Props) => {
  const isActive = status === 'Active'

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
        isActive ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'
      }`}
    >
      {status}
    </span>
  )
}

export default AccountStatusCell