import { useState } from 'react'
import AdminToolbar from '../components/AdminToolbar'
import { EMAIL_NOTIFICATION_ACTIONS } from '../constants/admin-actions'

const EmailNotificationPage = () => {
  const [searchValue, setSearchValue] = useState('')
  return (
    <div>
      <AdminToolbar
        title="Enable or disable daily email notifications by module and event type."
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Search"
        actions={EMAIL_NOTIFICATION_ACTIONS}
      />
    </div>
  )
}
export default EmailNotificationPage
