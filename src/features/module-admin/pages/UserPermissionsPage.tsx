import { useState } from 'react'
import AdminToolbar from '../components/AdminToolbar'
import { USER_PERMISSONS_ACTIONS } from '../constants/admin-actions'

const UserPermissionsPage = () => {
  const [searchValue, setSearchValue] = useState('')
  return (
    <div>
      <AdminToolbar
        title="Manage user roles and configure access rights per group company and its domains."
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Search"
        actions={USER_PERMISSONS_ACTIONS}
      />
    </div>
  )
}
export default UserPermissionsPage
