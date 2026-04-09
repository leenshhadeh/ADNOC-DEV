import ProcessDetails from '../components/ProcessDetails'
import GeneralInfoForm from '../components/GeneralInfoForm'
import { Separator } from '@/shared/components/ui/separator'
import TreeIcon from '@/assets/icons/treeIcon.svg'
import { useState } from 'react'
import OrgMappingSheet from '../../sidePanels/OrgMappingSheet'
import TagsList from '@/shared/components/table-primitives/TagsList'

const GeneralInfoTab = (props: any) => {
  const { processGeneralInfo } = props
  const [openBUSheet, setOpenBUSheet] = useState(false)
  const [orgData, setOrgData] = useState<any>(null)

  return (
    <>
      <ProcessDetails data={processGeneralInfo} />

      {/* Form: */}
      <GeneralInfoForm />
      <div className="mt-9 flex items-center gap-3">
        <p className="text-foreground text-md shrink-0 font-normal">Organization data mapping</p>
        <Separator className="flex-1" />
      </div>

      {/* tabels for BU and TEam  */}
      {orgData && (
        <div className="my-9">
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
                    <tr key={index} className="border-b border-gray-200 last:border-0">
                      <td className="border-none px-4 py-2" width={'500px'}>
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
            <div className="my-8">
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
                      <td className="border-none px-4 py-2" width={'500px'}>
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
        <p className="font-[14px] text-blue-600">{orgData ? 'Edit Mapping' : 'Start mapping'}</p>
      </div>

      <OrgMappingSheet
        title="Organization mapping"
        open={openBUSheet}
        handleOpenChange={(open: boolean) => {
          setOrgData({
            orgUnit: [
              {
                unit: 'Finance & Accounting - Payment Processing',
                subUnit: ['Invoice Processing', 'Vendor Reconciliation'],
              },
              { unit: 'Finance & Accounting', subUnit: ['Contract Negotiation'] },
            ],
            digitalDept: [{ unit: 'dept1', team: ['team1', 'team2'] }],
          })
          setOpenBUSheet(false)
        }}
      />
    </>
  )
}
export default GeneralInfoTab
