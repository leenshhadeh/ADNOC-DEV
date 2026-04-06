import { useState } from 'react'
import AdminToolbar from '../components/AdminToolbar'
import { ASSESSMENT_CYCLE_ACTIONS } from '../constants/admin-actions'

const AssessmentCyclePage = () => {
  const [searchValue, setSearchValue] = useState('')
  return (
    <div>
      <AdminToolbar
        title="Create and manage assessment cycles with configurable dates per group company and its domains."
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Search"
        actions={ASSESSMENT_CYCLE_ACTIONS}
      />
    </div>
  )
}
export default AssessmentCyclePage
