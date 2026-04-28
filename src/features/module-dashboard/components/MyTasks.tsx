import { useMemo, useState } from 'react'
import { Maximize2, ListFilter } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import ProcessFilterSheet from '../../module-process-catalog/components/modals/ProcessFilterSheet'
import { useAssessmentNavStore } from '../../module-assessment-data/store/useAssessmentNavStore'
import { useCatalogNavStore } from '../../module-process-catalog/store/useCatalogNavStore'
import { useProcessFilters } from '@features/module-process-catalog/hooks/useProcessFilters'
import type { FilterDefinition } from '@/shared/types/filters'
import NoTasks from './NoTasks'
import ViewAll from './ViewAll'
const Modules = {
  AssessmentData: { title: 'Assessment Data', url: '/assessment-data' },
  AutomationTargets: { title: 'Automation Targets', url: '/automation-targets' },
  ProcessCatalog: { title: 'Process Catalog', url: '/process-catalog' },
  Opportunities: { title: 'Opportunities', url: '/opportunities' },
} as const

const MY_TASK_FILTER_DEFINITIONS: FilterDefinition[] = [
  {
    id: 'module',
    label: 'Modules',
    options: Object.values(Modules).map((module) => ({
      id: module.title,
      label: module.title,
    })),
  },
]

const taskGroups = [
  {
    module: Modules.AssessmentData,
    items: [
      {
        title: 'Pending review: Budgeting and Forecasting',
        description:
          'Assessment change requests submitted by Digital Focal Points awaiting your approval.',
        time: '24m',
      },
    ],
  },
  {
    module: Modules.ProcessCatalog,
    items: [
      {
        title: 'Request returned: Financial Reporting and Co...',
        description: 'The Digital VP returned your request. Updates are required.',
        time: '1h',
      },
      {
        title: 'Request returned: Financial Reporting and Co...',
        description: 'The Digital VP returned your request. Updates are required.',
        time: '1h',
      },
    ],
  },
]

const MyTasks = () => {
  const navigate = useNavigate()
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isViewAllOpen, setIsViewAllOpen] = useState(false)
  const filterSectionIds = MY_TASK_FILTER_DEFINITIONS.map((f) => f.id)
  const { pending, applied, toggle, apply, reset } = useProcessFilters(filterSectionIds)

  const filteredTaskGroups = useMemo(() => {
    const selectedModules = applied.module ?? []

    if (selectedModules.length === 0) return taskGroups

    return taskGroups.filter((group) => selectedModules.includes(group.module.title))
  }, [applied])

  const totalCount = filteredTaskGroups.reduce((sum, group) => sum + group.items.length, 0)

  const handleViewAll = (moduleTitle: string, moduleUrl: string) => {
    if (moduleTitle === Modules.ProcessCatalog.title) {
      useCatalogNavStore.getState().setActiveTab('myTasks')
    } else if (moduleTitle === Modules.AssessmentData.title) {
      useAssessmentNavStore.getState().setActiveTab('my-tasks')
    }

    navigate(moduleUrl)
  }

  return (
    <>
      <div className="h-full w-full rounded-[24px] bg-gradient-to-r from-[#4EF1E4]/40 to-[#111827]/40 p-[0.5px] shadow-[0_4px_12px_0_#D1D5DF80]">
        <div className="flex h-full flex-col rounded-[23px] bg-white px-8 py-7">
          <div className="flex items-center justify-between pb-8">
            <div className="flex items-center gap-3">
              <h2 className="text-[18px] leading-none font-semibold text-[#151718]">My tasks</h2>

              <span className="bg-accent flex h-6 min-w-6 items-center justify-center rounded-full px-2 text-[12px] font-semibold text-[#151718]">
                {totalCount}
              </span>

              <button
                type="button"
                onClick={() => setIsFilterOpen(true)}
                className="ml-2 inline-flex items-center justify-center rounded-md text-[#151718] transition hover:opacity-70"
              >
                <ListFilter className="h-4 w-4 cursor-pointer" strokeWidth={2} />
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsViewAllOpen(true)}
              className="text-brand-blue inline-flex items-center justify-center transition hover:opacity-70"
            >
              <Maximize2 className="h-4 w-4 cursor-pointer" strokeWidth={2} />
            </button>
          </div>

          <div className="flex min-h-0 flex-1 flex-col">
            {totalCount === 0 ? (
              <div className="min-h-full">
                <NoTasks />
              </div>
            ) : (
              filteredTaskGroups.map((group, groupIndex) => (
                <div key={group.module.title}>
                  <div className="flex items-center justify-between pb-6">
                    <div className="flex items-center gap-2">
                      <h3 className="text-[14px] font-medium text-[#687076]">
                        {group.module.title}
                      </h3>
                      <span className="bg-accent flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-medium text-[#687076]">
                        {group.items.length}
                      </span>
                    </div>

                    <button
                      type="button"
                      className="text-brand-blue cursor-pointer text-[14px] font-semibold transition hover:opacity-70"
                      onClick={() => handleViewAll(group.module.title, group.module.url)}
                    >
                      View all
                    </button>
                  </div>

                  <div className="flex flex-col gap-6">
                    {group.items.map((item, index) => {
                      return (
                        // eslint-disable-next-line react/no-array-index-key
                        <div key={`${group.module}-${index}`} className="flex items-stretch gap-4">
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

                  {groupIndex !== filteredTaskGroups.length - 1 && (
                    <div className="my-8 border-t border-[#E6E8EB]" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <ProcessFilterSheet
        open={isFilterOpen}
        onOpenChange={setIsFilterOpen}
        filters={MY_TASK_FILTER_DEFINITIONS}
        pending={pending}
        onToggle={toggle}
        onApply={apply}
        onReset={reset}
      />
      <ViewAll
        open={isViewAllOpen}
        onOpenChange={setIsViewAllOpen}
        taskGroups={filteredTaskGroups}
        onViewAll={handleViewAll}
      />
    </>
  )
}

export default MyTasks
