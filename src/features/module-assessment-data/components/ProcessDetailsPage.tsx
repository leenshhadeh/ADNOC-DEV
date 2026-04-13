import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/shared/components/ui/breadcrumb'
import ProcessDetails from './processDetails/components/ProcessDetails'
import ModuleToolbar from '@/shared/components/ModuleToolbar'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import GeneralInfoTab from './processDetails/tabs/GeneralInfoTab'
import AutomationParameterTab from './processDetails/tabs/AutomationParameterTab'
import ManualParametersTab from './processDetails/tabs/ManualParametersTab'
import { useGetProcessDetails } from '@features/module-assessment-data/hooks/useGetProcessDetails'
import { DOMAINS_DATA } from '@features/module-process-catalog/constants/domains-data'

// Genaral info about the process, can be fetched from API using processId

const ProcessDetailsPage = () => {
  const { processId } = useParams<{ processId: string }>()
  const [activeTab, setActiveTab] = useState('GeneralInfo')
  const { data, isLoading, isError } = useGetProcessDetails(processId || '')
  const [processData, setProcessData] = useState([{}])
  const [processGeneralInfo, setProcessGeneralInfo] = useState([{}])

  useEffect(() => {
    if (data) {
      const domainName = DOMAINS_DATA.find((d) => d.id === data[0]?.domain)?.name ?? data[0]?.domain
      setProcessData([
        { label: 'Group Company', value: data[0]?.groupCompany },
        { label: 'Domain', value: domainName },
        { label: 'Process Code', value: data[0]?.code, canCopy: true },
        {
          label: 'Status',
          value: data[0]?.status,
        },
        {
          label: 'Process stage',
          value: 'Quality review',
          stageTotal: data[0]?.stageTotal,
          stageCurrent: data[0]?.stageCurrent,
        },
        { label: 'Process Applicapility', value: data[0]?.processApplicapility ? 'Yes' : 'No' },
        { label: 'Last Published Date', value: data[0]?.lastPublishedDate },
        { label: 'Marked Review Date', value: data[0]?.markedReviewDate },
      ])
      setProcessGeneralInfo([
        { label: 'Process Level 1', value: data[0]?.level1Name },
        { label: 'Process Level 2', value: data[0]?.level2Name },
        { label: 'Process Level 3', value: data[0]?.level3Name },
        {
          label: 'Process Level 4',
          value: data[0]?.level4Name,
        },
        {
          label: 'Centrally Governed Process',
          value: data[0]?.centrallyGovernedProcess ? 'Yes' : 'No',
          isEditable: true,
        },
        {
          label: 'Shared Service process',
          value: data[0]?.sharedServiceProcess ? 'Yes' : 'No',
          isEditable: true,
        },
      ])
    }
  }, [data])

  return (
    <>
      <div className="flex flex-col gap-0 overflow-hidden px-6">
        {/* ── Breadcrumb ─────────────────────────────────────────────────── */}
        <div className="pt-5 pb-1">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/assessment-data">Assessment Data Processes</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Process Details</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="mb-[24px] flex items-center py-3">
          {!isLoading && data && (
            <h1 className="text-foreground text-2xl font-bold">{data[0].name}</h1>
          )}
        </div>

        {isLoading ? (
          <>Loading data...</>
        ) : (
          <>
            {data && (
              <>
                <ProcessDetails data={processData} />
                <div className="mb-[24px]"></div>
                <ModuleToolbar
                  tabs={[
                    { label: 'General Info', value: 'GeneralInfo' },
                    { label: 'Automation Parameters', value: 'AutomationParameters' },
                    {
                      label: 'Manual operations volume parameters',
                      value: 'ManualParameters',
                    },
                  ]}
                  activeTab={activeTab}
                  onTabChange={(newActiveTab) => {
                    setActiveTab(newActiveTab)
                  }}
                  showFilter={false}
                  showSearch={false}
                />

                <div className="flex flex-col gap-0 overflow-hidden">
                  <div className="mt-[24px] rounded-2xl bg-[linear-gradient(90.49deg,rgba(78,241,228,0.1)_0.03%,rgba(17,24,39,0.1)_99.89%)] p-[1px]">
                    <div className="rounded-2xl bg-white p-[24px]">
                      {activeTab == 'GeneralInfo' && (
                        <GeneralInfoTab
                          processGeneralInfo={processGeneralInfo}
                          process={data[0]}
                          onFormSubmit={() => {}}
                        />
                      )}
                      {activeTab == 'AutomationParameters' && (
                        <AutomationParameterTab process={data[0]} />
                      )}
                      {activeTab == 'ManualParameters' && <ManualParametersTab process={data[0]} />}
                    </div>
                  </div>
                </div>
              </>
            )}

            {isError && <> Somthing went wrong</>}
          </>
        )}
      </div>
    </>
  )
}
export default ProcessDetailsPage
