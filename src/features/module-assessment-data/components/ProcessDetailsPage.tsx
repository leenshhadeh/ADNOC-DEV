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
// import { useGetProcessDetails } from '@features/module-assessment-data/hooks/useGetMyTasks'

// Genaral info about the process, can be fetched from API using processId
const processDetails = {
  name: 'Define basin framework',
  groupCompany: '12345',
  domain: 'Process 1',
  code: 'SGSAUD.1.1.3.1',
  status: 'Draft',
  stageCurrent: '1',
  stageTotal: '3',
  processApplicapility: true,
  lastPublishedDate: '2024-01-01',
  markedReviewDate: '2024-12-31',
  level1Name: 'Exploration',
  level2Name: 'Regional studies',
  level3Name: 'Basin Modeling',
  level4Name: 'Define basin framework',
  centrallyGovernedProcess: 'yes',
  sharedServiceProcess: 'no',
  customName: 'Default Name',
  customDescription: 'Default Description',
  processDescription: 'Default Process Description',
  responsibleBusinessFocalPoint: [
    {
      id: 'user1',
      name: 'Fatima Al Nuaimi',
      img: 'https://t4.ftcdn.net/jpg/06/45/77/79/360_F_645777959_fNnaNoeVO4qxCNPW9MWr3gQlPFSGA9yL.jpg',
    },
  ],
  responsibleDigitalFocalPoint: [
    {
      id: 'user12',
      name: 'Ahmed Al Mansoori',
      img: 'https://t4.ftcdn.net/jpg/06/45/77/79/360_F_645777959_fNnaNoeVO4qxCNPW9MWr3gQlPFSGA9yL.jpg',
    },
  ],
  numberOfPeopleInvolved: 'High (500-1000)',
  scaleOfProcess: 'Medium: (bigger team within one department)',
  automationMaturityLevel: 'Fully Automated',
  automationLevel: '10%',
  currentApplicationsSystems: ['Microsot Excel', 'Petrel'],
  OngoingAutomationDigitalInitiatives: 'N/A',
  businessRecommendationForAutomation: 'Should be kept as is',
  keyChallengesAutomationNeeds: 'none',
  AIPowered: 'No',
  AIPoweredUseCase: '',
  autonomousUseCaseEnabled: 'No',
  AutonomousUseCaseDescriptionComment: 'N/A',
  processCriticality:'Standard',
  keyManualSteps:'1.Data collection, model setup, result interpretation',

}

const ProcessDetailsPage = () => {
  const { processId } = useParams<{ processId: string }>()
  const [activeTab, setActiveTab] = useState('GeneralInfo')
  //  const { data: processDetails, isLoading, isError } = useGetProcessDetails()

  useEffect(() => {
    //TODO: call getProcessDetails(processId) API
  })

  const processData = [
    { label: 'Group Company', value: processDetails.groupCompany },
    { label: 'Domain', value: processDetails.domain },
    { label: 'Process Code', value: processDetails.code, canCopy: true },
    {
      label: 'Status',
      value: processDetails.status,
    },
    {
      label: 'Process stage',
      value: 'Quality review',
      stageTotal: processDetails.stageTotal,
      stageCurrent: processDetails.stageCurrent,
    },
    { label: 'Process Applicapility', value: processDetails.processApplicapility ? 'Yes' : 'No' },
    { label: 'Last Published Date', value: processDetails.lastPublishedDate },
    { label: 'Marked Review Date', value: processDetails.markedReviewDate },
  ]
  const processGeneralInfo = [
    { label: 'Process Level 1', value: processDetails.level1Name },
    { label: 'Process Level 2', value: processDetails.level2Name },
    { label: 'Process Level 3', value: processDetails.level3Name },
    {
      label: 'Process Level 4',
      value: processDetails.level4Name,
    },
    {
      label: 'Centrally Governed Process',
      value: processDetails.centrallyGovernedProcess ? 'Yes' : 'No',
      isEditable: true,
    },
    {
      label: 'Shared Service process',
      value: processDetails.sharedServiceProcess ? 'Yes' : 'No',
      isEditable: true,
    },
  ]

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
          <h1 className="text-foreground text-2xl font-bold">{processDetails.name}</h1>
        </div>

        <ProcessDetails data={processData} />
        <div className="mb-[24px]"></div>
        <ModuleToolbar
          //   { value: 'processes', label: 'Processes' },
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
                  process={processDetails}
                  onFormSubmit={() => {}}
                />
              )}
              {activeTab == 'AutomationParameters' && <AutomationParameterTab  process={processDetails}/>}
              {activeTab=='ManualParameters'&& <ManualParametersTab process={processDetails} />}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default ProcessDetailsPage
