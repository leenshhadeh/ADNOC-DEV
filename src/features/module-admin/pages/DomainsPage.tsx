import { useState } from 'react'
import AdminToolbar from '../components/AdminToolbar'
import { DOMAINS_ACTIONS } from '../constants/admin-actions'

const DomainsPage = () => {
  const [searchValue, setSearchValue] = useState('')
  return (
    <div>
      <AdminToolbar
        title="Manage business domains used across the BPA process hierarchy."
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Search"
        actions={DOMAINS_ACTIONS}
      />
    </div>
  )
}
export default DomainsPage
