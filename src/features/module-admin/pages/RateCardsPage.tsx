import { useState } from 'react'
import AdminToolbar from '../components/AdminToolbar'
import { RATE_CARDS_ACTIONS } from '../constants/admin-actions'

const RateCardsPage = () => {
  const [searchValue, setSearchValue] = useState('')
  return (
    <div>
      <AdminToolbar
        title="Manage rate values applied to manual effort calculations across L3 processes."
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Search"
        actions={RATE_CARDS_ACTIONS}
      />
    </div>
  )
}
export default RateCardsPage
