import type { ColumnDef } from '@tanstack/react-table'
import type { DraftVersionData, FlatAssessmentRow } from '../../types/process'
import CellMenuOptions from '../CellMenuOptions'
import { Checkbox } from '@/shared/components/ui/checkbox'
import { StatusBadgeCell } from '@/shared/components/cells'
import { EditableCell, RadioCell } from '@/shared/components/table-primitives'
import TagsList from '@/shared/components/table-primitives/TagsList'
import SelectCell from '@/shared/components/table-primitives/SelectCell'
import { ASSESSMENT_APPLICATIONS, DIGITAL_FP_USERS } from '../../constants/CurrentApplication'
import MarkedAsReviewCell from '../cells/MarkedAsReviewCell'
import TagsSelectCell from '../cells/TagsSelectCell'
import { DOMAINS_DATA } from '@/features/module-process-catalog/constants/domains-data'
import SharedServices from '../cells/SharedServices'
import {
  AUTOMATION_LEVEL,
  AUTOMATION_MATURITY_LEVEL,
  BUSINESS_RECOMMENDATION_FOR_AUTOMATION,
  NORTH_STAR_TARGET_AUTOMATION,
  NUMBER_OF_PEOPLE_IMPACTED,
  PROCESS_CRITICALITY,
  PROCESS_CYCLE,
  SCALE_OF_PROCESS,
} from '@/constants/dropdownOptions'
import { InfoTooltip } from '@/shared/components/InfoTooltip'

export function getDraftVersion(row: any, field: keyof FlatAssessmentRow) {
  return row.draftVersion ? row.draftVersion[field] || row[field] : row[field]
}

const getResolvedValue = <T,>(
  row: FlatAssessmentRow,
  field: keyof FlatAssessmentRow,
  isDraftMode: boolean,
  draftField?: keyof DraftVersionData,
) => {
  if (!isDraftMode || !row.draftVersion) return row[field] as T
  if (draftField) return (row.draftVersion[draftField] as T | undefined) ?? (row[field] as T)
  return getDraftVersion(row, field) as T
}

export const getProcessTableColumns = ({
  onBUExpand,
  onDigitalTeamExpand,
  onExpandSharedServices,
  onSwitchToDraft,
  isBulkMode = false,
  isValidateMode = false,
  isDraftMode = false,
  selectedL3Ids,
  onL3SelectionChange,
}: {
  onDescChanged: (v: string) => void
  onBUExpand: (rowId: string) => void
  onDigitalTeamExpand: (rowId: string) => void
  onExpandSharedServices: (rowId: string, list: string[]) => void
  onSwitchToDraft: (item: FlatAssessmentRow) => void
  isBulkMode?: boolean
  isDraftMode?: boolean
  isValidateMode?: boolean
  selectedL3Ids?: Set<string>
  onL3SelectionChange?: (l3GroupId: string, checked: boolean) => void
}): ColumnDef<FlatAssessmentRow, unknown>[] => [
  {
    id: 'domain',
    accessorKey: 'domain',
    header: 'Domain',
    size: 250,
    enableSorting: false,
    meta: { isDivider: true },
    cell: (info) => {
      const domainId = info.row.original.displayDomain
      const domainName = DOMAINS_DATA.find((d) => d.id === domainId)?.name ?? domainId
      return <p className={domainName ? '' : 'rowspan'}>{domainName}</p>
    },
  },
  {
    id: 'l1',
    accessorKey: 'l1',
    header: 'Level 1',
    size: 220,
    enableSorting: false,
    cell: (info) => (
      <div className={info.row.original.displayL1 ? 'flex flex-col gap-0.5' : 'rowspan'}>
        <span className="text-foreground text-sm font-medium">{info.row.original.displayL1}</span>
        <span className="text-muted-foreground text-xs">
          {info.row.original.displayL1 ? info.row.original.l1Code : ''}
        </span>
      </div>
    ),
  },
  {
    id: 'l2',
    accessorKey: 'l2',
    header: 'Level 2',
    size: 220,
    enableSorting: false,
    cell: (info) => (
      <div className={info.row.original.displayL2 ? 'flex flex-col gap-0.5' : 'rowspan'}>
        <span className="text-foreground text-sm font-medium">{info.row.original.displayL2}</span>
        <span className="text-muted-foreground text-xs">
          {info.row.original.displayL2 ? info.row.original.l2Code : ''}
        </span>
      </div>
    ),
  },
  {
    id: 'l3',
    accessorKey: 'l3',
    header: 'Level 3',
    size: 300,
    enableSorting: false,
    meta: { pinnedCol: true },
    cell: (info) => (
      <div
        className={
          info.row.original.displayL3 ? 'flex items-center justify-between gap-2' : 'rowspan'
        }
      >
        <div className="flex min-w-0 flex-col gap-0.5">
          <span className="text-foreground text-sm font-medium">{info.row.original.displayL3}</span>
          <span className="text-muted-foreground text-xs">
            {info.row.original.displayL3 ? info.row.original.l3Code : ''}
          </span>
        </div>
        {isBulkMode && info.row.original.displayL3 ? (
          <Checkbox
            className="shrink-0"
            checked={selectedL3Ids?.has(info.row.original.l3GroupId) ?? false}
            onCheckedChange={(checked) =>
              onL3SelectionChange?.(info.row.original.l3GroupId, !!checked)
            }
            aria-label={`Select ${info.row.original.l3}`}
          />
        ) : (
          /* if there is l4, remove the menu actions */
          !info.row.original.l4Code &&
          !isBulkMode && (
            <CellMenuOptions item={info.row.original} onSwitchToDraft={onSwitchToDraft} />
          )
        )}
      </div>
    ),
  },
  {
    id: 'l4',
    accessorKey: 'l4',
    header: 'Level 4',
    size: 300,
    enableSorting: false,
    meta: { pinnedCol: true, offset: 300 },
    cell: (info) => (
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 flex-col gap-0.5">
          <span className="text-foreground text-sm font-medium">{info.getValue<string>()}</span>
          {info.getValue<string>() ? (
            <span className="text-muted-foreground text-xs">{info.row.original.l4Code}</span>
          ) : (
            <span className="text-muted-foreground text-sm italic">No Level 4 processes</span>
          )}
        </div>
        {isBulkMode && !!info.row.original.l4Code ? (
          <Checkbox
            className="shrink-0"
            checked={info.row.getIsSelected()}
            onCheckedChange={info.row.getToggleSelectedHandler()}
            aria-label={`Select ${info.row.original.l4}`}
          />
        ) : (
          info.getValue<string>() &&
          !isBulkMode && (
            <CellMenuOptions item={info.row.original} onSwitchToDraft={onSwitchToDraft} />
          )
        )}
      </div>
    ),
  },
  {
    id: 'groupCompany',
    accessorKey: 'groupCompany',
    header: 'Group Company',
    size: 250,
    enableSorting: false,
    cell: (info) => <p>{info.row.original.groupCompany}</p>,
  },
  {
    id: 'Site',
    accessorKey: 'Site',
    header: 'Site',
    size: 120,
    enableSorting: false,
    cell: (info) => <p>{info.row.original.Site}</p>,
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: 'Status',
    size: 180,
    enableSorting: false,
    cell: (info) => {
      const val = isDraftMode
        ? getDraftVersion(info.row.original, 'status')
        : info.getValue<string>()
      return <StatusBadgeCell status={val} />
    },
  },
  {
    id: 'description',
    accessorKey: 'description',
    header: 'Description',
    size: 320,
    enableSorting: false,
    cell: (info) => {
      const val = info.row.original.description
      return <div className="line-clamp-2 text-wrap">{val}</div>
    },
  },
  {
    id: 'centrallyGovernedProcess',
    accessorKey: 'centrallyGovernedProcess',
    header: 'Centrally Governed Process',
    size: 250,
    enableSorting: false,
    cell: (info) => {
      const onUpdate = info.table.options.meta?.onUpdateDraftRow
      const value = getResolvedValue<string>(
        info.row.original,
        'centrallyGovernedProcess',
        isDraftMode,
      )
      return (
        <RadioCell
          name={`${info.row.original.l4Code}__centrallyGovernedProcess`}
          value={value == 'yes' ? true : false}
          options={[
            { label: 'Yes', value: 'yes' },
            { label: 'No', value: 'no' },
          ]}
          onValChange={(newValue: string) =>
            onUpdate && onUpdate(info.row.original.id, 'centrallyGovernedProcess', newValue)
          }
        />
      )
    },
  },
  {
    id: 'sharedService',
    accessorKey: 'sharedService',
    header: 'Shared Service',
    size: 250,
    enableSorting: false,
    cell: (info) => {
      const value = isDraftMode
        ? (info.row.original.draftVersion?.sharedService ?? info.row.original.SharedServiceDisply)
        : info.row.original.SharedServiceDisply
      return (
        <>
          <SharedServices
            val={value}
            onExpand={(processSharedServices: any) =>
              onExpandSharedServices(info.row.original.id, processSharedServices)
            }
          />
        </>
      )
    },
  },
  {
    id: 'businessUnit',
    accessorKey: 'businessUnit',
    header: 'Business Unit',
    size: 250,
    enableSorting: false,
    cell: (info) => {
      const value = getResolvedValue<string[]>(
        info.row.original,
        'businessUnit',
        isDraftMode,
        'businessUnit',
      )
      if (isValidateMode) {
        debugger
      }
      const hasErr = (isValidateMode && value == undefined) || value.length < 1

      return (
        <div className={hasErr ? 'invalid-field flex justify-between' : ''}>
          <div className="max-w-[290px] overflow-hidden">
            <TagsList
              tags={(value || []).map((bu: string, index: number) => ({
                id: `${info.row.original.l4Code || info.row.original.l3Code}__businessUnit__${index}`,
                text: bu,
              }))}
              onExpand={() => {
                onBUExpand(info.row.original.id)
              }}
            />
          </div>
          {hasErr && <InfoTooltip text={'this field is requied'} />}
        </div>
      )
    },
  },
  {
    id: 'responsibleDigitalTeam',
    accessorKey: 'responsibleDigitalTeam',
    header: 'Responsible Digital Team',
    size: 250,
    enableSorting: false,
    cell: (info) => {
      const value = getResolvedValue<string[]>(
        info.row.original,
        'responsibleDigitalTeam',
        isDraftMode,
        'ResponsibleDigitalTeam',
      )

      return (
        <div className="max-w-[290px] overflow-hidden">
          <TagsList
            tags={(value || []).map((team: string, index: number) => ({
              id: `${info.row.original.l4Code || info.row.original.l3Code}_responsibleDigitalTeam${index}`,
              text: team,
            }))}
            onExpand={() => {
              onDigitalTeamExpand(info.row.original.id)
            }}
          />
        </div>
      )
    },
  },
  {
    id: 'processCriticality',
    accessorKey: 'processCriticality',
    header: 'Process Criticality',
    size: 250,
    enableSorting: false,
    cell: (info) => {
      const onUpdate = info.table.options.meta?.onUpdateDraftRow
      const value = getResolvedValue<string>(info.row.original, 'processCriticality', isDraftMode)
      return (
        <SelectCell
          defaultValue={value}
          options={PROCESS_CRITICALITY}
          onValueChange={(newValue: string) => {
            if (onUpdate) {
              onUpdate(info.row.original.id, 'processCriticality', newValue)
            }
          }}
        />
      )
    },
  },
  {
    id: 'usersImpacted',
    accessorKey: 'usersImpacted',
    header: 'Number of People/Users Impacted',
    size: 250,
    enableSorting: false,
    cell: (info) => {
      const onUpdate = info.table.options.meta?.onUpdateDraftRow
      const value = getResolvedValue<string>(info.row.original, 'usersImpacted', isDraftMode)
      return (
        <SelectCell
          defaultValue={value}
          options={NUMBER_OF_PEOPLE_IMPACTED}
          onValueChange={(newValue: string) => {
            if (onUpdate) onUpdate(info.row.original.id, 'usersImpacted', newValue)
          }}
        />
      )
    },
  },
  {
    id: 'scaleOfProcess',
    accessorKey: 'scaleOfProcess',
    header: 'Scale of the Process',
    size: 250,
    enableSorting: false,
    cell: (info) => {
      const onUpdate = info.table.options.meta?.onUpdateDraftRow
      const value = getResolvedValue<string>(info.row.original, 'scaleOfProcess', isDraftMode)
      return (
        <SelectCell
          defaultValue={value}
          options={SCALE_OF_PROCESS}
          onValueChange={(newValue: string) => {
            onUpdate && onUpdate(info.row.original.id, 'scaleOfProcess', newValue)
          }}
        />
      )
    },
  },
  {
    id: 'automationMaturityLevel',
    accessorKey: 'automationMaturityLevel',
    header: 'Automation Maturity Level',
    size: 250,
    enableSorting: false,
    cell: (info) => {
      const onUpdate = info.table.options.meta?.onUpdateDraftRow
      const value = getResolvedValue<string>(
        info.row.original,
        'automationMaturityLevel',
        isDraftMode,
      )
      return (
        <SelectCell
          defaultValue={value}
          options={AUTOMATION_MATURITY_LEVEL}
          onValueChange={(newValue: string) => {
            onUpdate && onUpdate(info.row.original.id, 'scaleOfProcess', newValue)
          }}
        />
      )
    },
  },
  {
    id: 'automationLevel',
    accessorKey: 'automationLevel',
    header: 'Automation Level (%)',
    size: 180,
    enableSorting: false,
    cell: (info) => {
      const onUpdate = info.table.options.meta?.onUpdateDraftRow
      const value = getResolvedValue<string>(info.row.original, 'automationLevel', isDraftMode)

      return (
        <SelectCell
          defaultValue={value}
          options={AUTOMATION_LEVEL}
          onValueChange={(newValue: string) => {
            onUpdate && onUpdate(info.row.original.id, 'automationLevel', newValue)
          }}
        />
      )
    },
  },
  {
    id: 'currentApplicationsSystems',
    accessorKey: 'currentApplicationsSystems',
    header: 'Current Applications/Systems',
    size: 260,
    enableSorting: false,
    cell: (info) => {
      const onUpdate = info.table.options.meta?.onUpdateDraftRow
      const value = getResolvedValue<any[]>(
        info.row.original,
        'currentApplicationsSystems',
        isDraftMode,
        'currentApplicationsSystems',
      )
      return (
        <TagsSelectCell
          list={value}
          allTags={ASSESSMENT_APPLICATIONS}
          isUsers={false}
          onUpdate={(newTags: any) => {
            const newValue = newTags.map((tag: any) => tag.name)
            if (onUpdate) {
              onUpdate(info.row.original.id, 'currentApplicationsSystems', newValue || [])
            }
          }}
        />
      )
    },
  },
  {
    id: 'ongoingAutomationDigitalInitiatives',
    accessorKey: 'ongoingAutomationDigitalInitiatives',
    header: 'Ongoing Automation / Digital Initiatives',
    size: 320,
    enableSorting: false,
    cell: (info) => {
      const onUpdate = info.table.options.meta?.onUpdateDraftRow
      const value = getResolvedValue<string>(
        info.row.original,
        'ongoingAutomationDigitalInitiatives',
        isDraftMode,
        'OngoingAutomationDigitalInitiatives',
      )

      return (
        <EditableCell
          value={value}
          onChange={(newValue) => {
            if (onUpdate) {
              onUpdate(info.row.original.id, 'ongoingAutomationDigitalInitiatives', newValue || '')
            }
          }}
          type={'textArea'}
        />
      )
    },
  },
  {
    id: 'businessRecommendationForAutomation',
    accessorKey: 'businessRecommendationForAutomation',
    header: 'Business Recommendation for Automation',
    size: 320,
    enableSorting: false,
    cell: (info) => {
      const onUpdate = info.table.options.meta?.onUpdateDraftRow
      const value = getResolvedValue<string>(
        info.row.original,
        'businessRecommendationForAutomation',
        isDraftMode,
      )
      return (
        <SelectCell
          defaultValue={value}
          options={BUSINESS_RECOMMENDATION_FOR_AUTOMATION}
          onValueChange={(newValue: string) => {
            if (onUpdate) {
              onUpdate(info.row.original.id, 'businessRecommendationForAutomation', newValue || '')
            }
          }}
        />
      )
    },
  },
  {
    id: 'keyChallengesAutomationNeeds',
    accessorKey: 'keyChallengesAutomationNeeds',
    header: 'Key Challenges & Automation Needs',
    size: 300,
    enableSorting: false,
    cell: (info) => {
      const onUpdate = info.table.options.meta?.onUpdateDraftRow
      const value = getResolvedValue<string>(
        info.row.original,
        'keyChallengesAutomationNeeds',
        isDraftMode,
      )
      return (
        <EditableCell
          value={value}
          onChange={(newValue) => {
            if (onUpdate) {
              onUpdate(info.row.original.id, 'keyChallengesAutomationNeeds', newValue || '')
            }
          }}
          type={'textArea'}
        />
      )
    },
  },
  {
    id: 'aiPowered',
    accessorKey: 'aiPowered',
    header: 'AI-Powered - Y/N',
    size: 160,
    enableSorting: false,
    cell: (info) => {
      const onUpdate = info.table.options.meta?.onUpdateDraftRow

      const value = getResolvedValue<string>(
        info.row.original,
        'aiPowered',
        isDraftMode,
        'AIPowered',
      )
      return (
        <RadioCell
          name={`${info.row.original.l4Code}__aiPowered`}
          value={value ? true : false}
          options={[
            { label: 'Yes', value: 'yes' },
            { label: 'No', value: 'no' },
          ]}
          onValChange={(newValue: string) => {
            if (onUpdate) {
              onUpdate(info.row.original.id, 'aiPowered', newValue || '')
            }
          }}
        />
      )
    },
  },
  {
    id: 'aiPoweredUseCase',
    accessorKey: 'aiPoweredUseCase',
    header: 'AI-Powered Use Case',
    size: 250,
    enableSorting: false,
    cell: (info) => {
      const onUpdate = info.table.options.meta?.onUpdateDraftRow
      const value = getResolvedValue<string>(
        info.row.original,
        'aiPoweredUseCase',
        isDraftMode,
        'AIPoweredUseCase',
      )
      return (
        <EditableCell
          value={value}
          onChange={(newValue) => {
            if (onUpdate) {
              onUpdate(info.row.original.id, 'aiPoweredUseCase', newValue || '')
            }
          }}
          type={'textArea'}
        />
      )
    },
  },
  {
    id: 'autonomousUseCaseEnabled',
    accessorKey: 'autonomousUseCaseEnabled',
    header: 'Autonomous Use Case Enabled',
    size: 250,
    enableSorting: false,
    cell: (info) => {
      const onUpdate = info.table.options.meta?.onUpdateDraftRow
      const value = getResolvedValue<string>(
        info.row.original,
        'autonomousUseCaseEnabled',
        isDraftMode,
      )
      return (
        <RadioCell
          name={`${info.row.original.l4Code}__autonomousUseCaseEnabled`}
          value={value ? true : false}
          options={[
            { label: 'Yes', value: 'yes' },
            { label: 'No', value: 'no' },
          ]}
          onChange={(val: string) => {
            if (onUpdate) {
              onUpdate(info.row.original.id, 'autonomousUseCaseEnabled', val || '')
            }
          }}
        />
      )
    },
  },
  {
    id: 'autonomousUseCaseDescriptionComment',
    accessorKey: 'autonomousUseCaseDescriptionComment',
    header: 'Autonomous Use Case Description/Comment',
    size: 320,
    enableSorting: false,
    cell: (info) => {
      const onUpdate = info.table.options.meta?.onUpdateDraftRow
      const value = getResolvedValue<string>(
        info.row.original,
        'autonomousUseCaseDescriptionComment',
        isDraftMode,
        'AutonomousUseCaseDescriptionComment',
      )
      return (
        <EditableCell
          value={value}
          onChange={(newValue) => {
            if (onUpdate) {
              onUpdate(info.row.original.id, 'autonomousUseCaseDescriptionComment', newValue || '')
            }
          }}
          type={'textArea'}
        />
      )
    },
  },
  {
    id: 'processCycle',
    accessorKey: 'processCycle',
    header: 'How Often the Process Happens (Cycle)',
    size: 280,
    enableSorting: false,
    cell: (info) => {
      const onUpdate = info.table.options.meta?.onUpdateDraftRow
      const value = getResolvedValue<string>(
        info.row.original,
        'processCycle',
        isDraftMode,
        'ProcessCycle',
      )
      return (
        <SelectCell
          defaultValue={value}
          options={PROCESS_CYCLE}
          onValueChange={(newValue: string) => {
            if (onUpdate) {
              onUpdate(info.row.original.id, 'processCycle', newValue || '')
            }
          }}
        />
      )
    },
  },
  {
    id: 'processRepetitionWithinCycle',
    accessorKey: 'processRepetitionWithinCycle',
    header: 'Number of Times Repeated within Selected Cycle',
    size: 320,
    enableSorting: false,
    cell: (info) => {
      const onUpdate = info.table.options.meta?.onUpdateDraftRow
      const value = getResolvedValue<string>(
        info.row.original,
        'processRepetitionWithinCycle',
        isDraftMode,
      )
      return (
        <SelectCell
          defaultValue={value}
          options={['1-5 times', '6-10 times', '11-20 times', 'More than 20 times']}
          onValueChange={(newValue: string) => {
            if (onUpdate) {
              onUpdate(info.row.original.id, 'processRepetitionWithinCycle', newValue || '')
            }
          }}
        />
      )
    },
  },
  {
    id: 'totalPersonnelExecutingFTE',
    accessorKey: 'totalPersonnelExecutingFTE',
    header: 'Total Personnel Executing (FTE)',
    size: 240,
    enableSorting: false,
    cell: (info) => {
      const onUpdate = info.table.options.meta?.onUpdateDraftRow
      const value = getResolvedValue<string>(
        info.row.original,
        'totalPersonnelExecutingFTE',
        isDraftMode,
      )
      return (
        <SelectCell
          defaultValue={value}
          options={['10', '20', '50', '100', 'More than 100']}
          onValueChange={(newValue: string) => {
            if (onUpdate) {
              onUpdate(info.row.original.id, 'totalPersonnelExecutingFTE', newValue || '')
            }
          }}
        />
      )
    },
  },

  {
    id: 'totalProcessDurationDays',
    accessorKey: 'totalProcessDurationDays',
    header: 'Total Process Duration (Days)',
    size: 220,
    enableSorting: false,
    cell: (info) => {
      const onUpdate = info.table.options.meta?.onUpdateDraftRow
      const value = getResolvedValue<string>(
        info.row.original,
        'totalProcessDurationDays',
        isDraftMode,
      )
      return (
        <SelectCell
          defaultValue={value}
          options={['10', '20', '50', '100', 'More than 100']}
          onValueChange={(newValue: string) => {
            if (onUpdate) {
              onUpdate(info.row.original.id, 'totalPersonnelExecutingFTE', newValue || '')
            }
          }}
        />
      )
    },
  },
  {
    id: 'timeSpentOnManualTasksPercent',
    accessorKey: 'timeSpentOnManualTasksPercent',
    header: 'Time Spent on Manual Tasks (%)',
    size: 240,
    enableSorting: false,
    cell: (info) => {
      const onUpdate = info.table.options.meta?.onUpdateDraftRow
      const value = getResolvedValue<string>(
        info.row.original,
        'timeSpentOnManualTasksPercent',
        isDraftMode,
      )

      return (
        <SelectCell
          defaultValue={value}
          options={['10%', '20%', '50%', '100%']}
          onValueChange={(newValue: string) => {
            if (onUpdate) {
              onUpdate(info.row.original.id, 'totalPersonnelExecutingFTE', newValue || '')
            }
          }}
        />
      )
    },
  },
  {
    id: 'keyManualSteps',
    accessorKey: 'keyManualSteps',
    header: 'Key Manual Steps',
    size: 260,
    enableSorting: false,
    cell: (info) => {
      const onUpdate = info.table.options.meta?.onUpdateDraftRow
      const value = getResolvedValue<string>(info.row.original, 'keyManualSteps', isDraftMode)

      return (
        <EditableCell
          value={value}
          onChange={(newValue) => {
            // Handle the change, e.g., update the data source or state
            if (onUpdate) {
              onUpdate(info.row.original.id, 'keyManualSteps', newValue || '')
            }
          }}
          type={'textArea'}
        />
      )
    },
  },
  {
    id: 'northStarTargetAutomation',
    accessorKey: 'northStarTargetAutomation',
    header: '"North Star" Target Automation',
    size: 240,
    enableSorting: false,
    cell: (info) => {
      const onUpdate = info.table.options.meta?.onUpdateDraftRow
      const value = getResolvedValue<string>(
        info.row.original,
        'northStarTargetAutomation',
        isDraftMode,
      )
      return (
        <SelectCell
          defaultValue={value}
          options={NORTH_STAR_TARGET_AUTOMATION}
          onValueChange={(newValue: string) => {
            onUpdate && onUpdate(info.row.original.id, 'northStarTargetAutomation', newValue || '')
          }}
        />
      )
    },
  },
  {
    id: 'targetAutomationLevelPercent',
    accessorKey: 'targetAutomationLevelPercent',
    header: 'Target Automation Level (%)',
    size: 220,
    enableSorting: false,
    cell: (info) => {
      const onUpdate = info.table.options.meta?.onUpdateDraftRow
      const value = getResolvedValue<string>(
        info.row.original,
        'targetAutomationLevelPercent',
        isDraftMode,
      )
      return (
        <SelectCell
          defaultValue={value}
          options={['10%', '20%', '50%', '100%']}
          onValueChange={(newValue: string) => {
            onUpdate &&
              onUpdate(info.row.original.id, 'targetAutomationLevelPercent', newValue || '')
          }}
        />
      )
    },
  },
  {
    id: 'smeFeedback',
    accessorKey: 'smeFeedback',
    header: 'SME Feedback',
    size: 280,
    enableSorting: false,
    cell: (info) => {
      const onUpdate = info.table.options.meta?.onUpdateDraftRow
      const value = getResolvedValue<string>(
        info.row.original,
        'smeFeedback',
        isDraftMode,
        'SMEFeedback',
      )
      return (
        <EditableCell
          value={value}
          onChange={(newValue) => {
            // Handle the change, e.g., update the data source or state
            onUpdate && onUpdate(info.row.original.id, 'smeFeedback', newValue || '')
          }}
          type={'textArea'}
        />
      )
    },
  },
  {
    id: 'toBeAIPowered',
    accessorKey: 'toBeAIPowered',
    header: 'To be AI Powered - Y/N',
    size: 220,
    enableSorting: false,
    cell: (info) => {
      const onUpdate = info.table.options.meta?.onUpdateDraftRow
      const value = getResolvedValue<string>(info.row.original, 'toBeAIPowered', isDraftMode)
      return (
        <RadioCell
          name={`${value}__toBeAIPowered`}
          value={value}
          options={[
            { label: 'Yes', value: 'yes' },
            { label: 'No', value: 'no' },
          ]}
          onChange={(newValue: any) => {
            onUpdate && onUpdate(info.row.original.id, 'toBeAIPowered', newValue || '')
          }}
        />
      )
    },
  },
  {
    id: 'toBeAIPoweredComments',
    accessorKey: 'toBeAIPoweredComments',
    header: 'To be AI Powered - Comments',
    size: 260,
    enableSorting: false,
    cell: (info) => {
      const onUpdate = info.table.options.meta?.onUpdateDraftRow
      const value = getResolvedValue<string>(
        info.row.original,
        'toBeAIPoweredComments',
        isDraftMode,
      )
      return (
        <EditableCell
          value={value}
          onChange={(newValue) => {
            // Handle the change, e.g., update the data source or state
            onUpdate && onUpdate(info.row.original.id, 'toBeAIPoweredComments', newValue || '')
          }}
          type={'textArea'}
        />
      )
    },
  },
  {
    id: 'rateCardAED',
    accessorKey: 'rateCardAED',
    header: 'Rate Card (AED)',
    size: 180,
    enableSorting: false,
    cell: (info) => (
      <p>{getResolvedValue<string>(info.row.original, 'rateCardAED', isDraftMode)}</p>
    ),
  },
  {
    id: 'costOfManualEffortAED',
    accessorKey: 'costOfManualEffortAED',
    header: 'Cost of Manual Effort (AED)',
    size: 220,
    enableSorting: false,
    cell: (info) => (
      <p>{getResolvedValue<string>(info.row.original, 'costOfManualEffortAED', isDraftMode)}</p>
    ),
  },
  {
    id: 'markedAsReviewed',
    accessorKey: 'markedAsReviewed',
    header: 'Marked as Reviewed?',
    size: 180,
    enableSorting: false,
    cell: (info) => {
      const onUpdate = info.table.options.meta?.onUpdateDraftRow

      return (
        <MarkedAsReviewCell
          date={getResolvedValue<string>(info.row.original, 'reviewedOn', isDraftMode)}
          id={info.row.original.id}
          handleMarkAsReviewed={(rowId) => {
            if (onUpdate) {
              onUpdate(rowId, 'markedAsReviewed', 'true')
              onUpdate(rowId, 'reviewedOn', new Date().toISOString())
            }
          }}
        />
      )
    },
  },
  {
    id: 'businessFocalPoint',
    accessorKey: 'businessFocalPoint',
    header: 'Business Focal Point',
    size: 220,
    enableSorting: false,
    cell: (info) => {
      const onUpdate = info.table.options.meta?.onUpdateDraftRow
      const value = getResolvedValue<string[]>(info.row.original, 'businessFocalPoint', isDraftMode)
      return (
        <TagsSelectCell
          list={value?.map((app: string) => ({
            id: `${app?.trim()}`,
            name: app?.trim(),
          }))}
          allTags={DIGITAL_FP_USERS}
          isUsers={false}
          onUpdate={(newTags: any) => {
            const newValue = newTags.map((tag: any) => tag.name)
            if (onUpdate) {
              onUpdate(info.row.original.id, 'businessFocalPoint', newValue)
            }
          }}
        />
      )
    },
  },
  {
    id: 'digitalFocalPoint',
    accessorKey: 'digitalFocalPoint',
    header: 'Digital Focal Point',
    size: 220,
    enableSorting: false,
    cell: (info) => {
      const onUpdate = info.table.options.meta?.onUpdateDraftRow
      const value = getResolvedValue<string[]>(info.row.original, 'digitalFocalPoint', isDraftMode)
      return (
        <TagsSelectCell
          list={value?.map((app: string) => ({
            id: `${app?.trim()}`,
            name: app?.trim(),
          }))}
          allTags={DIGITAL_FP_USERS}
          isUsers={true}
          onUpdate={(newTags: any) => {
            const newValue = newTags.map((tag: any) => tag.name)
            if (onUpdate) {
              onUpdate(info.row.original.id, 'digitalFocalPoint', newValue || [])
            }
          }}
        />
      )
    },
  },
  {
    id: 'publishedDate',
    accessorKey: 'publishedDate',
    header: 'Published Date',
    size: 180,
    enableSorting: false,
    cell: (info) => <p>{info.getValue<string>()}</p>,
  },
  {
    id: 'submittedBy',
    accessorKey: 'submittedBy',
    header: 'Submitted By',
    size: 180,
    enableSorting: false,
    cell: (info) => (
      <div className="text-muted-foreground bg-accent rounded-[99px] p-1 text-center">
        {info.getValue<string>()}
      </div>
    ),
  },
  {
    id: 'submittedOn',
    accessorKey: 'submittedOn',
    header: 'Submitted On',
    size: 180,
    enableSorting: false,
    cell: (info) => <p>{info.getValue<string>()}</p>,
  },
]
