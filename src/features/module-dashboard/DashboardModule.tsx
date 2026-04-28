import { BookOpen, FolderOpen } from 'lucide-react'
import cards from '../../assets/icons/cards.svg'
import AccessCard from './components/AccessCard'
import ProcessesSummary from './components/ProcessesSummary'
import MyTasks from './components/MyTasks'
import HeaderActions from './components/HeaderActions'
import { useUserStore } from '@/shared/auth/useUserStore'
import { getRuntimeConfig } from '@/shared/lib/runtimeConfig'

const DashboardModule = () => {
  const usr = useUserStore()
  const { SERVICENOW_URL } = getRuntimeConfig()

  const accessCardItems = [
    {
      title: 'BPA Help & Guidelines',
      description: 'Review guidance for completing assessment fields.',
      icon: BookOpen,
      to: '/bpa-help-and-guidelines',
    },
    {
      title: 'Reports & Extracts',
      description: 'Download reports and data extracts from the system',
      icon: cards,
      to: '/reports-and-extracts',
    },
    {
      title: 'Service Now Support',
      description: 'Track assessment progress for your domains.',
      icon: FolderOpen,
      redirect: SERVICENOW_URL,
    },
  ]

  return (
    <div className="flex min-h-full flex-col px-3 pb-3">
      <div className="flex w-full justify-between">
        <div className="flex items-center gap-2 pb-5">
          <h1 className="text-foreground text-2xl font-semibold">Hello {usr.user.name}</h1>
          <span className="text-foreground/60 text-sm">- {usr.user.role}</span>
        </div>

        <HeaderActions />
      </div>

      <div className="pb-5">
        <span className="text-[18px] font-[500]">Quick access</span>

        <div className="grid grid-cols-3 items-stretch gap-5 pt-3">
          {accessCardItems.map((item, index) => (
            <div key={index} className="h-full">
              <AccessCard
                title={item.title}
                description={item.description}
                icon={item.icon}
                to={item?.to}
                redirect={item?.redirect}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="grid flex-1 grid-cols-3 items-stretch gap-5">
        <div className="col-span-2 h-full">
          <ProcessesSummary />
        </div>

        <div className="col-span-1 h-full">
          <MyTasks />
        </div>
      </div>
    </div>
  )
}

export default DashboardModule
