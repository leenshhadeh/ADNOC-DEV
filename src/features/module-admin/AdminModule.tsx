import ModuleToolbar from '@/shared/components/ModuleToolbar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/shared/components/ui/breadcrumb'
import { ADMIN_TABS } from './constants/admin-toolbar'
import { useState } from 'react'
import UserPermissionsPage from './pages/UserPermissionsPage'
import GroupCompaniesPage from './pages/GroupCompaniesPage'
import DomainsPage from './pages/DomainsPage'
import RateCardsPage from './pages/RateCardsPage'

const AdminModule = () => {
  const [activeTab, setActiveTab] = useState('user-permissions')
  return (
    <div className="flex h-full flex-col gap-0 overflow-hidden">
      <div className="px-6 pt-5 pb-1">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Settings</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="flex items-center px-6 py-3">
        <h1 className="text-foreground text-2xl font-bold">Settings</h1>
      </div>
      <div className="px-6 py-3">
        <ModuleToolbar
          tabs={ADMIN_TABS}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          showFilter={false}
          showSearch={false}
        />
      </div>
      <div className="flex-1 overflow-auto px-6 py-1">
        {activeTab == 'user-permissions' ? (
          <UserPermissionsPage />
        ) : activeTab == 'group-companies' ? (
          <GroupCompaniesPage />
        ) : activeTab == 'domains' ? (
          <DomainsPage />
        ) : activeTab == 'rate-cards' ? (
          <RateCardsPage />
        ) : (
          <>something went wrong</>
        )}
      </div>
    </div>
  )
}
export default AdminModule
