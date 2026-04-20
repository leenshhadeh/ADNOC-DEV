import Breadcrumb from '@/shared/components/Breadcrumb'
import ModuleToolbar from '@/shared/components/ModuleToolbar'
import { RE_TABS } from './constants'
import { useState } from 'react'
import Reports from './componenets/Reports'
import Extracts from './componenets/Extracts'

const ReportsAndExtracts = () => {
  const [activeTab, setActiveTab] = useState('reports')
  return (
    <div>
      <div className="pb-3">
        <Breadcrumb links={[{ title: 'Reports & Extracts', isCurrentPage: true }]} />
      </div>
      <span className="text-[24px] font-[700] text-[#111827]">Reports & Extracts</span>
      <div className="pt-3 pb-3">
        <ModuleToolbar
          showSearch={false}
          showFilter={false}
          activeTab={activeTab}
          tabs={RE_TABS}
          onTabChange={setActiveTab}
        />
      </div>
      <div className="flex-1 overflow-auto px-6 py-1">
        {activeTab === 'reports' ? (
          <Reports />
        ) : activeTab === 'extracts' ? (
          <Extracts />
        ) : (
          <>something went wrong</>
        )}
      </div>
    </div>
  )
}
export default ReportsAndExtracts
