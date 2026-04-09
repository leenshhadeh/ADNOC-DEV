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
import GeneralInfoForm from './processDetailsComponents/GeneralInfoForm'
import { Separator } from '@/shared/components/ui/separator'
import TreeIcon from '@/assets/icons/treeIcon.svg'
import { useState } from 'react'
import OrgMappingSheet from './sidePanels/OrgMappingSheet'
import TagsList from '@/shared/components/table-primitives/TagsList'

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
}

const ProcessDetailsPage = () => {
  const { processId } = useParams<{ processId: string }>()
  const [openBUSheet, setOpenBUSheet] = useState(false)
  const [orgData, setOrgData] = useState<any>(null)

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
            <div className="mt-9 flex items-center gap-3">
              <p className="text-foreground text-md shrink-0 font-normal">
                Organization data mapping
              </p>
              <Separator className="flex-1" />
            </div>

            {/* tabels for BU and TEam  */}
            {orgData && (
              <div className="mb-9">
                {orgData && orgData.orgUnit && (
                  <div className="my-4">
                    <table className="w-full table-auto border-none">
                      <thead>
                        <tr className="border-b border-gray-300">
                          <th className="text-muted-foreground border-none px-4 py-2 text-left text-sm font-normal uppercase">
                            Org Unit
                          </th>
                          <th className="text-muted-foreground border-none px-4 py-2 text-left text-sm font-normal uppercase">
                            Sub Unit
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {orgData.orgUnit.map((item: any, index: number) => (
                          <tr key={index}>
                            <td className="border-none px-4 py-2" width={'400px'}>
                              {item.unit}
                            </td>
                            <td className="border-none px-4 py-2">
                              <TagsList
                                tags={item.subUnit?.map((unit: string, teamIndex: number) => ({
                                  id: `${index}-${teamIndex}`,
                                  text: unit,
                                }))}
                                readOnly
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {orgData && orgData.digitalDept && (
                  <div className="my-4">
                    <table className="w-full table-auto border-none">
                      <thead>
                        <tr className="border-b border-gray-300">
                          <th className="text-muted-foreground border-none px-4 py-2 text-left text-sm font-normal uppercase">
                            Responsible Digital Department
                          </th>
                          <th className="text-muted-foreground border-none px-4 py-2 text-left text-sm font-normal uppercase">
                            Team
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {orgData.digitalDept.map((item: any, index: number) => (
                          <tr key={index}>
                            <td className="border-none px-4 py-2" width={'400px'}>
                              {item.unit}
                            </td>
                            <td className="border-none px-4 py-2">
                              <TagsList
                                tags={item.team.map((team: string, teamIndex: number) => ({
                                  id: `${index}-${teamIndex}`,
                                  text: team,
                                }))}
                                readOnly
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* link with icon */}
            <div
              className="my-4 flex items-center gap-2"
              onClick={() => {
                setOpenBUSheet(true)
              }}
            >
              <img src={TreeIcon} alt="link icon" className="h-4 w-4" />
              <p className="font-[14px] text-blue-600">
                {orgData ? 'Edit Mapping' : 'Start mapping'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <OrgMappingSheet
        title="Organization mapping"
        open={openBUSheet}
        handleOpenChange={(open: boolean) => {
          setOrgData({
            orgUnit: [{ unit: 'unt1', subUnit: ['sub1'] }],
            digitalDept: [{ unit: 'dept1', team: ['team1', 'team2'] }],
          })
          setOpenBUSheet(false)
        }}
      />
    </>
  )
}
export default ProcessDetailsPage
