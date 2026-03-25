import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  ChevronsLeft,
  ChevronsRight,
  LogOut,
  Settings,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import sidebarIcon from '@/assets/Logo.svg'
import dashboardIcon from '@/assets/icons/dashboard.svg';
import assessmentDataIcon from '@/assets/icons/assesment.svg';
import automationTargetsIcon from '@/assets/icons/target.svg';
import processCatalogIcon from '@/assets/icons/paper.svg';
import opportunitiesIcon from '@/assets/icons/bag.svg';

const menuItems = [
  { to: '/dashboard', label: 'Dashboard', icon: dashboardIcon },
  { to: '/assessment-data', label: 'Assessment Data', icon: assessmentDataIcon },
  { to: '/automation-targets', label: 'Automation Targets', icon: automationTargetsIcon },
  { to: '/process-catalog', label: 'Process Catalog', icon: processCatalogIcon },
  { to: '/opportunities', label: 'Opportunities', icon: opportunitiesIcon },
]

const bottomItems = [
  { to: '/settings', label: 'Settings', icon: Settings },
  { to: '/logout', label: 'Log out', icon: LogOut },
]

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { pathname } = useLocation()

  const isActive = (to: string) => {
    if (to === '/assessment-data') {
      return pathname === '/' || pathname === '/assessment-data'
    }

    return pathname === to
  }

  return (
    <aside
      className={cn(
        'relative flex h-[95vh] shrink-0 flex-col rounded-2xl  bg-white transition-all duration-300 mb-32 ',
        'shadow-[0px_4px_8px_0px_rgba(0,0,0,0.1)]',
        isCollapsed ? 'w-14' : 'w-[320px]'
      )}
    >
      <button
        type="button"
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={cn(
          'absolute top-5 z-10 inline-flex h-10 w-10 items-center justify-center rounded-xl text-foreground hover:bg-sidebar-accent',
          isCollapsed ? 'left-1/2 -translate-x-1/2' : 'right-5'
        )}
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? <ChevronsRight className="size-9"strokeWidth={1}  /> : <ChevronsLeft className="size-7" strokeWidth={1} />}
      </button>
 
 {/* Dashboard and modules */}
      <div className={cn('pt-20 mb-5')}>
        <div className={cn('mb-8', isCollapsed ? 'flex justify-center' : '')}>
          <img src={sidebarIcon} alt="ADNOC" className="h-10 w-10 md:h-12 md:w-12 lg:h-14 lg:w-14 object-contain" />
        </div>

        <nav className="space-y-1">
          {menuItems.map(({ to, label, icon: Icon }) => {
            const active = isActive(to)

            return (
              <NavLink
                key={to}
                to={to}
                className={cn(
                  'flex h-12 items-center rounded-none px-4  transition-colors',
                  isCollapsed && 'justify-center px-0',
                  active
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                )}
              >
                <img src={Icon} alt={`${label} icon`} className="size-5 shrink-0" 
                  style={{ filter: active ? 'brightness(0) invert(1)' : 'none' }}
                
                />
                {!isCollapsed && <span className="ml-3">{label}</span>}
              </NavLink>
            )
          })}
        </nav>
      </div>

      

{/* profile and settings */}
      <div className={cn('mt-auto', isCollapsed ? 'px-2' : 'px-0')}>


        {/* profile: */}
        <div className={cn('mb-4', isCollapsed ? 'flex justify-center' : 'px-4 inline-flex items-center')}>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
            alt="Profile"
            className="h-5 w-5 rounded-full object-cover"
          />
          {!isCollapsed && <span className="ml-3 self-center text-md/none text-foreground">Maryam Al Shamsi</span>}
        </div>    


        <nav className="space-y-1 pb-4">
          {bottomItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive: routeActive }) =>
                cn(
                  'flex h-12 items-center px-4 text-lg transition-colors',
                  isCollapsed && 'justify-center px-0',
                  routeActive
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                )
              }
            >
              <Icon className="size-5 shrink-0" />
              {!isCollapsed && <span className="ml-3">{label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-sidebar-border py-4">
          <div
            className={cn(
              'flex h-20 items-center rounded-2xl bg-gradient-to-r from-sidebar to-sidebar-accent',
              isCollapsed ? 'justify-center' : 'px-4'
            )}
          >
            <Sparkles className="size-5 text-primary" />
            {!isCollapsed && <span className="ml-3 text-lg/none text-foreground">Ask AI</span>}
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
