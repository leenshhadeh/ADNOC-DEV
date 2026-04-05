import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/shared/components/ui/breadcrumb'
import ProcessDetails from './processDetailsComponents/ProcessDetails'
import ModuleToolbar from '@/shared/components/ModuleToolbar'
import { useParams } from 'react-router-dom'
import { Label } from '@radix-ui/react-dropdown-menu'
import GeneralInfoForm from './processDetailsComponents/GeneralInfoForm'

// Genaral info about the process, can be fetched from API using processId
const processDetails = {
  groupCompany: '12345',
  domain: 'Process 1',
  code: 'SGSAUD.1.1.3.1',
  status: 'Draft',
  stageCurrent: '1',
  stageTotal: '3',
  processApplicapility: true,
  lastPublishedDate: '2024-01-01',
  markedReviewDate: '2024-12-31',
}

const ProcessDetailsPage = () => {
  const { processId } = useParams<{ processId: string }>()
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
    { label: 'Process Level 1', value: processDetails.groupCompany },
    { label: 'Process Level 2', value: processDetails.domain },
    { label: 'Process Level 3', value: processDetails.code },
    {
      label: 'Process Level 4',
      value: processDetails.status,
    },
    {
      label: 'Centrally Governed Process',
      value: processDetails.processApplicapility ? 'Yes' : 'No',
      isEditable: true,
    },
    {
      label: 'Shared Service process',
      value: processDetails.lastPublishedDate ? 'Yes' : 'No',
      isEditable: true,
    },
  ]

  return (
    <div className="flex h-full flex-col gap-0 overflow-hidden px-6">
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
              <BreadcrumbPage>{`Process ${processId}`}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="mb-[24px] flex items-center py-3">
        <h1 className="text-foreground text-2xl font-bold">{`Process ${processId} Details`}</h1>
      </div>

      <ProcessDetails data={processData} />
      <div className="mb-[24px]"></div>
      <ModuleToolbar
        tabs={[
          { label: 'General Info', value: 'General Info' },
          { label: 'Automation parameters', value: 'Automation parameters' },
          {
            label: 'Manual operations volume parameters',
            value: 'Manual operations volume parameters',
          },
        ]}
        activeTab={'General Info'}
        onTabChange={() => {}}
        showFilter={false}
        showSearch={false}
      />

      <div className="mt-[24px] rounded-2xl bg-[linear-gradient(90.49deg,rgba(78,241,228,0.1)_0.03%,rgba(17,24,39,0.1)_99.89%)] p-[1px]">
        <div className="rounded-2xl bg-white p-[24px]">
          <ProcessDetails data={processGeneralInfo} />

          {/* Form: */}
          <GeneralInfoForm />
        </div>
      </div>
    </div>
  )
}
export default ProcessDetailsPage
