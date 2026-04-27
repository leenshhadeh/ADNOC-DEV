import ProcessDetails from '../components/ProcessDetails'
import GeneralInfoForm from '../components/GeneralInfoForm'
import { Separator } from '@/shared/components/ui/separator'
import TreeIcon from '@/assets/icons/treeIcon.svg'
import { useMemo, useState } from 'react'
import OrgMappingSheet from '../../sidePanels/OrgMappingSheet'
import TagsList from '@/shared/components/table-primitives/TagsList'
import DataTable from '@/shared/components/data-table/DataTable'
import type { ColumnDef } from '@tanstack/react-table'

interface orgRows {
  unit: string
  subUnits?: string[]
  team?: string[]
}
const GeneralInfoTab = (props: any) => {
  const {
    processGeneralInfo,
    process,
    onFormSubmit,
    onFormChanged,
    isEditable,
    canComment,
    onShowComment,
  } = props
  const [openBUSheet, setOpenBUSheet] = useState(false)
  const [orgData, setOrgData] = useState<any>(process.orgMapping)
  const [dataToSubmit, setDataToSubmit] = useState<any>([])

  const columnsBU = useMemo<ColumnDef<orgRows>[]>(
    () => [
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
        id: 'subUnits',
        accessorKey: 'subUnits',
        header: 'SUB UNIT',
        size: 250,
        enableSorting: false,
        meta: { isDivider: true },
        cell: (info) => (
          <TagsList
            tags={
              info.row.original?.subUnits?.map((unit: string, teamIndex: number) => ({
                id: `${unit}-${teamIndex}`,
                text: unit,
              })) || []
            }
            readOnly
          />
        ),
      },
    ],
    [],
  )

  const columnsTeam = useMemo<ColumnDef<orgRows, unknown>[]>(
    () => [
      {
        id: 'unit',
        accessorKey: 'unit',
        header: 'Responsible Digital Department',
        size: 250,
        enableSorting: false,
        cell: (info) => <p>{info.row.original.unit}</p>,
      },
      {
        id: 'subUnits',
        accessorKey: 'subUnits',
        header: 'Team',
        size: 250,
        enableSorting: false,
        cell: (info) => (
          <TagsList
            tags={
              info.row.original?.subUnits?.map((unit: string, teamIndex: number) => ({
                id: `${unit}-${teamIndex}`,
                text: unit,
              })) || []
            }
            readOnly
          />
        ),
      },
    ],
    [],
  )
  console.log('dsdsd')

  const formChangeHandler = (data: any, hasOrgData?: boolean) => {
    const formData = hasOrgData ? data : { ...data, dataorgMapping: orgData }
    setDataToSubmit(formData)
    onFormChanged(formData)
  }

  return (
    <>
      <ProcessDetails data={processGeneralInfo} isEditable={isEditable} />

      {/* Form: */}
      <GeneralInfoForm
        initialData={process}
        onFormSubmit={onFormSubmit}
        onFormChanged={formChangeHandler}
        isEditable={isEditable}
        canComment={canComment}
        showComments={onShowComment}
      />

      <div className="mt-9 flex items-center gap-3">
        <p className="text-foreground text-md shrink-0 font-normal">Organization data mapping</p>
        <Separator className="flex-1" />
      </div>

      {/* tabels for BU and TEam ----------------------------------------------------- */}
      {orgData && (
        <div className="table-light my-9">
          {orgData && orgData.BU && (
            <div className="my-4">
              <DataTable columns={columnsBU} data={orgData.BU} />
            </div>
          )}

          {/* digital dept */}
          {orgData && orgData.DT && (
            <div className="table-light my-9">
              <DataTable columns={columnsTeam} data={orgData.DT} />
            </div>
          )}
        </div>
      )}

      {/* link with icon */}
      {isEditable && (
        <div
          className="my-4 flex items-center gap-2"
          onClick={() => {
            setOpenBUSheet(true)
          }}
        >
          <img src={TreeIcon} alt="link icon" className="h-4 w-4" />
          <p className="font-[14px] text-blue-600">{orgData ? 'Edit Mapping' : 'Start mapping'}</p>
        </div>
      )}

      <OrgMappingSheet
        title="Organization mapping"
        open={openBUSheet}
        handleOpenChange={() => setOpenBUSheet(false)}
        handleOnSubmitData={(valuse: any) => {
          setOpenBUSheet(false)
          setOrgData(valuse)
          const newChanges = { ...dataToSubmit, orgMapping: valuse }
          formChangeHandler(newChanges, true)
        }}
        currentOrgData={process.orgMapping || []}
      />
    </>
  )
}
export default GeneralInfoTab
