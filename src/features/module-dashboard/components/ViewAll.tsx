import { X } from 'lucide-react'
import clsx from 'clsx'
import NoTasks from './NoTasks'

interface TaskItem {
  title: string
  description: string
  time: string
}

interface TaskGroup {
  module: {
    title: string
    url: string
  }
  items: TaskItem[]
}

interface ViewAllProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  taskGroups: TaskGroup[]
  onViewAll: (moduleTitle: string, moduleUrl: string) => void
}

const ViewAll = ({ open, onOpenChange, taskGroups, onViewAll }: ViewAllProps) => {
  const totalCount = taskGroups.reduce((sum, group) => sum + group.items.length, 0)

  return (
    <div
      className={clsx(
        'fixed inset-0 z-50 flex justify-end transition-colors duration-300',
        open ? 'pointer-events-auto bg-black/20' : 'pointer-events-none bg-black/0',
      )}
      onClick={() => onOpenChange(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={clsx(
          'flex h-full w-full max-w-[520px] flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <div className="flex items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <h2 className="text-[26px] leading-none font-semibold text-[#151718]">My tasks</h2>
            <span className="bg-accent text-foreground flex h-8 min-w-8 items-center justify-center rounded-full px-2 text-[16px] font-semibold">
              {totalCount}
            </span>
          </div>

          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="text-foreground hover:bg-accent inline-flex h-10 w-10 items-center justify-center rounded-full transition"
            aria-label="Close"
          >
            <X className="h-5 w-5 cursor-pointer" />
          </button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col">
          {taskGroups.length === 0 ? (
            <div className="min-h-full">
              <NoTasks />
            </div>
          ) : (
            <div className="flex flex-col gap-8 px-6 py-5">
              {taskGroups.map((group, groupIndex) => (
                <div key={group.module.title}>
                  <div className="flex items-center justify-between pb-4">
                    <div className="flex items-center gap-2">
                      <h3 className="text-[14px] font-medium text-[#687076]">
                        {group.module.title}
                      </h3>
                      <span className="bg-accent text-muted-foreground flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-medium">
                        {group.items.length}
                      </span>
                    </div>

                    <button
                      type="button"
                      className="cursor-pointer text-[14px] font-semibold text-brand-blue transition hover:opacity-70"
                      onClick={() => {
                        onViewAll(group.module.title, group.module.url)
                        onOpenChange(false)
                      }}
                    >
                      View all
                    </button>
                  </div>

                  <div className="flex flex-col gap-6">
                    {group.items.map((item, index) => {
                      return (
                        <div
                          key={`${group.module.title}-${index}`}
                          className="flex items-stretch gap-4"
                        >
                          <div className="flex flex-col items-center self-stretch">
                            <div className="mt-1 h-3 w-3 rounded-full bg-[#336CC8]" />
                            <div className="mt-2 w-[1px] flex-1 bg-gradient-to-t from-[#7D40FF12] via-[#7D40FF] to-[#02A4FF]" />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-3">
                              <h4 className="truncate text-[16px] leading-[1.25] font-semibold text-[#151718]">
                                {item.title}
                              </h4>
                              <span className="shrink-0 pt-[1px] text-[14px] font-normal text-[#8D959E]">
                                {item.time}
                              </span>
                            </div>

                            <p className="pt-2 text-[14px] leading-[1.4] text-[#8D959E]">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {groupIndex !== taskGroups.length - 1 && (
                    <div className="my-8 border-t border-[#E6E8EB]" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ViewAll
