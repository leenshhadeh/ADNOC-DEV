import { useState } from 'react'
import AdminToolbar from '../components/AdminToolbar'
import { GROUP_COMPANIES_ACTIONS } from '../constants/admin-actions'

const GroupCompaniesPage = () => {
  const [searchValue, setSearchValue] = useState('')
  return (
    <div>
      <AdminToolbar
        title="Manage group companies and their associated sites within the BPA structure."
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Search"
        actions={GROUP_COMPANIES_ACTIONS}
      />
    </div>
  )
}
export default GroupCompaniesPage
