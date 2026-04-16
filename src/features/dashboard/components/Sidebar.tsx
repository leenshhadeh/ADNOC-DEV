import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  BriefcaseBusiness,
  ChevronLeft,
  ChevronRight,
  Files,
  LayoutGrid,
  LogOut,
  Settings,
  Sparkles,
  Table2,
  Target,
} from 'lucide-react'

import { cn } from '@/shared/lib/utils'
import sidebarIcon from '@/assets/SidebarIcon.svg'

const menuItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutGrid },
  { to: '/assessment-data', label: 'Assessment Data', icon: Table2 },
  { to: '/automation-targets', label: 'Automation Targets', icon: Target },
  { to: '/process-catalog', label: 'Process Catalog', icon: Files },
  { to: '/opportunities', label: 'Opportunities', icon: BriefcaseBusiness },
]

const bottomItems = [
  { to: '/settings', label: 'Admin Settings', icon: Settings },
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
        'border-border bg-sidebar relative flex h-full shrink-0 flex-col rounded-2xl border transition-all duration-300',
        isCollapsed ? 'w-14' : 'w-[320px]',
      )}
    >
      <button
        type="button"
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={cn(
          'text-foreground hover:bg-sidebar-accent absolute top-5 z-10 inline-flex h-10 w-10 items-center justify-center rounded-xl',
          isCollapsed ? 'left-1/2 -translate-x-1/2' : 'right-5',
        )}
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? <ChevronRight className="size-5" /> : <ChevronLeft className="size-5" />}
      </button>

      <div className={cn('pt-20')}>
        <div className={cn('mb-8', isCollapsed ? 'flex justify-center' : '')}>
          <img
            src={sidebarIcon}
            alt="ADNOC"
            className="h-10 w-10 object-contain md:h-12 md:w-12 lg:h-14 lg:w-14"
          />
        </div>

        <nav className="space-y-1">
          {menuItems.map(({ to, label, icon: Icon }) => {
            const active = isActive(to)

            return (
              <NavLink
                key={to}
                to={to}
                className={cn(
                  'flex h-12 items-center rounded-none px-4 transition-colors',
                  isCollapsed && 'justify-center px-0',
                  active
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                )}
              >
                <Icon className="size-5 shrink-0" />
                {!isCollapsed && <span className="ml-3">{label}</span>}
              </NavLink>
            )
          })}
        </nav>
      </div>

      <div className={cn('mt-auto', isCollapsed ? 'px-2' : 'px-5')}>
        <div className={cn('mb-4', isCollapsed ? 'flex justify-center' : 'px-2')}>
          <div className="bg-muted text-foreground flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold">
            MA
          </div>
          {!isCollapsed && (
            <span className="text-md/none text-foreground ml-3 self-center">Maryam Al Shamsi</span>
          )}
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
                    : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                )
              }
            >
              <Icon className="size-5 shrink-0" />
              {!isCollapsed && <span className="ml-3">{label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="border-sidebar-border border-t py-4">
          <div
            className={cn(
              'from-sidebar to-sidebar-accent flex h-20 items-center rounded-2xl bg-gradient-to-r',
              isCollapsed ? 'justify-center' : 'px-4',
            )}
          >
            <Sparkles className="text-primary size-5" />
            {!isCollapsed && <span className="text-foreground ml-3 text-lg/none">Ask AI</span>}
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
