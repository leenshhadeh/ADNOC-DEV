import ProcessDetails from '../components/ProcessDetails'
import GeneralInfoForm from '../components/GeneralInfoForm'
import { Separator } from '@/shared/components/ui/separator'
import TreeIcon from '@/assets/icons/treeIcon.svg'
import { useEffect, useMemo, useState } from 'react'
import OrgMappingSheet from '../../sidePanels/OrgMappingSheet'
import TagsList from '@/shared/components/table-primitives/TagsList'
import DataTable from '@/shared/components/data-table/DataTable'
import type { ColumnDef } from '@tanstack/react-table'

const GeneralInfoTab = (props: any) => {
  const { processGeneralInfo ,process , onFormSubmit} = props
  const [openBUSheet, setOpenBUSheet] = useState(false)
  const [orgData, setOrgData] = useState<any>(null)

  
  useEffect(() => {
    // TODO Call API to return Process org
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
  }, [openBUSheet])

  const columnsBU = useMemo<ColumnDef<any, unknown>[]>(() => [
    {
      id: 'unit',
      accessorKey: 'unit',
      header: 'ORG UNIT',
      size: 250,
      enableSorting: false,
      meta: { isDivider: true },
      cell: (info) => <p>{info.row.original.unit}</p>,
    },
    {
      id: 'subUnit',
      accessorKey: 'subUnit',
      header: 'SUB UNIT',
      size: 250,
      enableSorting: false,
      meta: { isDivider: true },
      cell: (info) => (
        <TagsList
          tags={
            info.row.original?.subUnit?.map((unit: string, teamIndex: number) => ({
              id: `${unit}-${teamIndex}`,
              text: unit,
            })) || []
          }
          readOnly
        />
      ),
    },
  ])
  const columnsTeam = useMemo<ColumnDef<any, unknown>[]>(() => [
    {
      id: 'unit',
      accessorKey: 'unit',
      header: 'Responsible Digital Department',
      size: 250,
      enableSorting: false,
      cell: (info) => <p>{info.row.original.unit}</p>,
    },
    {
      id: 'team',
      accessorKey: 'team',
      header: 'Team',
      size: 250,
      enableSorting: false,
      cell: (info) => (
        <TagsList
          tags={
            info.row.original?.team?.map((unit: string, teamIndex: number) => ({
              id: `${unit}-${teamIndex}`,
              text: unit,
            })) || []
          }
          readOnly
        />
      ),
    },
  ])

  return (
    <>
      <ProcessDetails data={processGeneralInfo} />

      {/* Form: */}
      <GeneralInfoForm 
      initialData={process}
      onFormSubmit={onFormSubmit}
      />
      <div className="mt-9 flex items-center gap-3">
        <p className="text-foreground text-md shrink-0 font-normal">Organization data mapping</p>
        <Separator className="flex-1" />
      </div>

      {/* tabels for BU and TEam  */}
      {orgData && (
        <div className="table-light my-9">
          {orgData && orgData.orgUnit && (
            <div className="my-4">
              <DataTable columns={columnsBU} data={orgData.orgUnit} />
            </div>
          )}

          {/* digital dept */}
          {orgData && orgData.digitalDept && (
            <div className="table-light my-9">
              <DataTable columns={columnsTeam} data={orgData.digitalDept} />
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
        handleOpenChange={() => setOpenBUSheet(false)}
        handleOnSubmitData={(valuse: any) => {
          setOpenBUSheet(false)
          // TODO: call API to update org mappaing based on selected valuse
          console.log('updated Organization mapping data=', valuse)
        }}
      />
    </>
  )
}
export default GeneralInfoTab
