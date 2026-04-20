import type { ColumnDef } from '@tanstack/react-table'
import type { FlatAssessmentRow } from '../../types/process'
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

export const getProcessTableColumns = ({
  onDescChanged,
  onCentrallyGovernedProcessChanged,
  onBUExpand,
  onDigitalTeamExpand,
  onExpandSharedServices,
  isBulkMode = false,
}: any): ColumnDef<FlatAssessmentRow, unknown>[] => [
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
          {info.getValue<string>() ? info.row.original.l1Code : ''}
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
          {info.getValue<string>() ? info.row.original.l2Code : ''}
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
        <div className="flex min-w-0 items-center gap-2">
          {isBulkMode && !info.row.original.l4Code && (
            <Checkbox
              className="shrink-0"
              checked={info.row.getIsSelected()}
              onCheckedChange={info.row.getToggleSelectedHandler()}
              aria-label={`Select ${info.row.original.l3}`}
            />
          )}
          <div className="flex min-w-0 flex-col gap-0.5">
            <span className="text-foreground text-sm font-medium">
              {info.row.original.displayL3}
            </span>
            <span className="text-muted-foreground text-xs">
              {info.getValue<string>() ? info.row.original.l3Code : ''}
            </span>
          </div>
        </div>
        {/* if there is l4, remove the menu actions */}
        {!info.row.original.l4Code && !isBulkMode && <CellMenuOptions item={info.row.original} />}
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
        <div className="flex min-w-0 items-center gap-2">
          {isBulkMode && !!info.row.original.l4Code && (
            <Checkbox
              className="shrink-0"
              checked={info.row.getIsSelected()}
              onCheckedChange={info.row.getToggleSelectedHandler()}
              aria-label={`Select ${info.row.original.l4}`}
            />
          )}
          <div className="flex min-w-0 flex-col gap-0.5">
            <span className="text-foreground text-sm font-medium">{info.getValue<string>()}</span>
            {info.getValue<string>() ? (
              <span className="text-muted-foreground text-xs">{info.row.original.l4Code} </span>
            ) : (
              <span className="text-muted-foreground text-sm italic">No Level 4 processes</span>
            )}
          </div>
        </div>
        {info.getValue<string>() && !isBulkMode && <CellMenuOptions item={info.row.original} />}
      </div>
    ),
  },
  {
    id: 'groupCompany',
    accessorKey: 'groupCompany',
    header: 'Group Company',
    size: 250,
    enableSorting: false,
    cell: (info) => <p>{info.getValue<string>()}</p>,
  },
  {
    id: 'Site',
    accessorKey: 'Site',
    header: 'Site',
    size: 120,
    enableSorting: false,
    cell: (info) => <p>{info.getValue<string>()}</p>,
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: 'Status',
    size: 180,
    enableSorting: false,
    cell: (info) => <StatusBadgeCell status={info.getValue<any>()} />,
  },
  {
    id: 'description',
    accessorKey: 'description',
    header: 'Description',
    size: 320,
    enableSorting: false,
    cell: (info) => (
      <EditableCell
        value={info.getValue<string>()}
        onChange={(newValue) => {
          onDescChanged(newValue)
          // Handle the change, e.g., update the data source or state
          console.log('New description:', newValue)
        }}
      />
    ),
  },
  {
    id: 'centrallyGovernedProcess',
    accessorKey: 'centrallyGovernedProcess',
    header: 'Centrally Governed Process',
    size: 250,
    enableSorting: false,
    cell: (info) => (
      <RadioCell
        name={`${info.row.original.l4Code}__centrallyGovernedProcess`}
        value={info.getValue<string>() ? true : false}
        options={[
          { label: 'Yes', value: 'yes' },
          { label: 'No', value: 'no' },
        ]}
        onChange={onCentrallyGovernedProcessChanged}
      />
    ),
  },
  {
    id: 'sharedService',
    accessorKey: 'sharedService',
    header: 'Shared Service',
    size: 250,
    enableSorting: false,
    cell: (info) => (
      <>
        <SharedServices
          val={info.getValue<string>()}
          onExpand={() => onExpandSharedServices(info.row.original.id)}
        />
      </>
    ),
  },
  {
    id: 'businessUnit',
    accessorKey: 'businessUnit',
    header: 'Business Unit',
    size: 250,
    enableSorting: false,
    cell: (info) => (
      <div className="max-w-[290px] overflow-hidden">
        <TagsList
          tags={(info.row.original.businessUnit || []).map((bu: string, index: number) => ({
            id: `${info.row.original.l4Code || info.row.original.l3Code}__businessUnit__${index}`,
            text: bu,
          }))}
          onExpand={() => {
            onBUExpand(info.row.original.id)
          }}
        />
      </div>
    ),
  },
  {
    id: 'responsibleDigitalTeam',
    accessorKey: 'responsibleDigitalTeam',
    header: 'Responsible Digital Team',
    size: 250,
    enableSorting: false,
    cell: (info) => (
      <div className="max-w-[290px] overflow-hidden">
        <TagsList
          tags={info.row.original.responsibleDigitalTeam.map((team: string, index: number) => ({
            id: `${info.row.original.l4Code || info.row.original.l3Code}_responsibleDigitalTeam${index}`,
            text: team,
          }))}
          onExpand={() => {
            onDigitalTeamExpand(info.row.original.id)
          }}
        />
      </div>
    ),
  },
  {
    id: 'processCriticality',
    accessorKey: 'processCriticality',
    header: 'Process Criticality',
    size: 250,
    enableSorting: false,
    cell: (info) => {
      const onUpdate = info.table.options.meta?.onUpdateDraftRow
      return (
        <SelectCell
          defaultValue={info.getValue<string>()}
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
      return (
        <SelectCell
          defaultValue={info.getValue<string>()}
          options={NUMBER_OF_PEOPLE_IMPACTED}
          onValueChange={(newValue: string) => {
            console.log('New users impacted:', newValue)
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
    cell: (info) => (
      <SelectCell
        defaultValue={info.getValue<string>()}
        options={SCALE_OF_PROCESS}
        onValueChange={(newValue: string) => {
          console.log('New scale of process:', newValue)
        }}
      />
    ),
  },
  {
    id: 'automationMaturityLevel',
    accessorKey: 'automationMaturityLevel',
    header: 'Automation Maturity Level',
    size: 250,
    enableSorting: false,
    cell: (info) => (
      <SelectCell
        defaultValue={info.getValue<string>()}
        options={AUTOMATION_MATURITY_LEVEL}
        onValueChange={(newValue: string) => {
          console.log('New automation maturity level:', newValue)
        }}
      />
    ),
  },
  {
    id: 'automationLevel',
    accessorKey: 'automationLevel',
    header: 'Automation Level (%)',
    size: 180,
    enableSorting: false,
    cell: (info) => (
      <SelectCell
        defaultValue={info.getValue<string>()}
        options={AUTOMATION_LEVEL}
        onValueChange={(newValue: string) => {
          console.log('New automation level:', newValue)
        }}
      />
    ),
  },
  {
    id: 'currentApplicationsSystems',
    accessorKey: 'currentApplicationsSystems',
    header: 'Current Applications/Systems',
    size: 260,
    enableSorting: false,
    cell: (info) => {
      const onUpdate = info.table.options.meta?.onUpdateDraftRow
      return (
        <TagsSelectCell
          list={info.row.original.currentApplicationsSystems}
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
    cell: (info) => <p>{info.getValue<string>()}</p>,
  },
  {
    id: 'businessRecommendationForAutomation',
    accessorKey: 'businessRecommendationForAutomation',
    header: 'Business Recommendation for Automation',
    size: 320,
    enableSorting: false,
    cell: (info) => (
      <SelectCell
        defaultValue={info.getValue<string>()}
        options={BUSINESS_RECOMMENDATION_FOR_AUTOMATION}
        onValueChange={(newValue: string) => {
          console.log('New business recommendation for automation:', newValue)
        }}
      />
    ),
  },
  {
    id: 'keyChallengesAutomationNeeds',
    accessorKey: 'keyChallengesAutomationNeeds',
    header: 'Key Challenges & Automation Needs',
    size: 300,
    enableSorting: false,
    cell: (info) => <p>{info.getValue<string>()}</p>,
  },
  {
    id: 'aiPowered',
    accessorKey: 'aiPowered',
    header: 'AI-Powered - Y/N',
    size: 160,
    enableSorting: false,
    cell: (info) => (
      <RadioCell
        name={`${info.row.original.l4Code}__aiPowered`}
        value={info.getValue<string>() ? true : false}
        options={[
          { label: 'Yes', value: 'yes' },
          { label: 'No', value: 'no' },
        ]}
        onChange={() => {}}
      />
    ),
  },
  {
    id: 'aiPoweredUseCase',
    accessorKey: 'aiPoweredUseCase',
    header: 'AI-Powered Use Case',
    size: 250,
    enableSorting: false,
    cell: (info) => <p>{info.getValue<string>()}</p>,
  },
  {
    id: 'autonomousUseCaseEnabled',
    accessorKey: 'autonomousUseCaseEnabled',
    header: 'Autonomous Use Case Enabled',
    size: 250,
    enableSorting: false,
    cell: (info) => (
      <RadioCell
        name={`${info.row.original.l4Code}__autonomousUseCaseEnabled`}
        value={info.getValue<string>() ? true : false}
        options={[
          { label: 'Yes', value: 'yes' },
          { label: 'No', value: 'no' },
        ]}
        onChange={() => {}}
      />
    ),
  },
  {
    id: 'autonomousUseCaseDescriptionComment',
    accessorKey: 'autonomousUseCaseDescriptionComment',
    header: 'Autonomous Use Case Description/Comment',
    size: 320,
    enableSorting: false,
    cell: (info) => (
      <EditableCell
        value={info.getValue<string>()}
        onChange={(newValue) => {
          // Handle the change, e.g., update the data source or state
          console.log('New autonomous use case description/comment:', newValue)
        }}
      />
    ),
  },
  {
    id: 'processCycle',
    accessorKey: 'processCycle',
    header: 'How Often the Process Happens (Cycle)',
    size: 280,
    enableSorting: false,
    cell: (info) => (
      <SelectCell
        defaultValue={info.getValue<string>()}
        options={PROCESS_CYCLE}
        onValueChange={(newValue: string) => {
          console.log('New process cycle:', newValue)
        }}
      />
    ),
  },
  {
    id: 'processRepetitionWithinCycle',
    accessorKey: 'processRepetitionWithinCycle',
    header: 'Number of Times Repeated within Selected Cycle',
    size: 320,
    enableSorting: false,
    cell: (info) => (
      <SelectCell
        defaultValue={info.getValue<string>()}
        options={['1-5 times', '6-10 times', '11-20 times', 'More than 20 times']}
        onValueChange={(newValue: string) => {
          console.log('New process repetition within cycle:', newValue)
        }}
      />
    ),
  },
  {
    id: 'totalPersonnelExecutingFTE',
    accessorKey: 'totalPersonnelExecutingFTE',
    header: 'Total Personnel Executing (FTE)',
    size: 240,
    enableSorting: false,
    cell: (info) => (
      <SelectCell
        defaultValue={info.getValue<string>()}
        options={['10', '20', '50', '100', 'More than 100']}
        onValueChange={(newValue: string) => {
          console.log('New total personnel executing (FTE):', newValue)
        }}
      />
    ),
  },

  {
    id: 'totalProcessDurationDays',
    accessorKey: 'totalProcessDurationDays',
    header: 'Total Process Duration (Days)',
    size: 220,
    enableSorting: false,
    cell: (info) => (
      <SelectCell
        defaultValue={info.getValue<string>()}
        options={['10', '20', '50', '100', 'More than 100']}
        onValueChange={(newValue: string) => {
          console.log('New total personnel executing (FTE):', newValue)
        }}
      />
    ),
  },
  {
    id: 'timeSpentOnManualTasksPercent',
    accessorKey: 'timeSpentOnManualTasksPercent',
    header: 'Time Spent on Manual Tasks (%)',
    size: 240,
    enableSorting: false,
    cell: (info) => (
      <SelectCell
        defaultValue={info.getValue<string>()}
        options={['10%', '20%', '50%', '100%']}
        onValueChange={(newValue: string) => {
          console.log('New total personnel executing (FTE):', newValue)
        }}
      />
    ),
  },
  {
    id: 'keyManualSteps',
    accessorKey: 'keyManualSteps',
    header: 'Key Manual Steps',
    size: 260,
    enableSorting: false,
    cell: (info) => (
      <EditableCell
        value={info.getValue<string>()}
        onChange={(newValue) => {
          // Handle the change, e.g., update the data source or state
          console.log('New key manual steps:', newValue)
        }}
        type={'textArea'}
      />
    ),
  },
  {
    id: 'northStarTargetAutomation',
    accessorKey: 'northStarTargetAutomation',
    header: '"North Star" Target Automation',
    size: 240,
    enableSorting: false,
    cell: (info) => (
      <SelectCell
        defaultValue={info.getValue<string>()}
        options={NORTH_STAR_TARGET_AUTOMATION}
        onValueChange={(newValue: string) => {
          console.log('New total personnel executing (FTE):', newValue)
        }}
      />
    ),
  },
  {
    id: 'targetAutomationLevelPercent',
    accessorKey: 'targetAutomationLevelPercent',
    header: 'Target Automation Level (%)',
    size: 220,
    enableSorting: false,
    cell: (info) => (
      <SelectCell
        defaultValue={info.getValue<string>()}
        options={['10%', '20%', '50%', '100%']}
        onValueChange={(newValue: string) => {
          console.log('New total personnel executing (FTE):', newValue)
        }}
      />
    ),
  },
  {
    id: 'smeFeedback',
    accessorKey: 'smeFeedback',
    header: 'SME Feedback',
    size: 280,
    enableSorting: false,
    cell: (info) => (
      <EditableCell
        value={info.getValue<string>()}
        onChange={(newValue) => {
          // Handle the change, e.g., update the data source or state
          console.log('New key manual steps:', newValue)
        }}
        type={'textArea'}
      />
    ),
  },
  {
    id: 'toBeAIPowered',
    accessorKey: 'toBeAIPowered',
    header: 'To be AI Powered - Y/N',
    size: 220,
    enableSorting: false,
    cell: (info) => (
      <RadioCell
        name={`${info.getValue<string>()}__toBeAIPowered`}
        value={info.getValue<string>()}
        options={[
          { label: 'Yes', value: 'yes' },
          { label: 'No', value: 'no' },
        ]}
        onChange={() => {}}
      />
    ),
  },
  {
    id: 'toBeAIPoweredComments',
    accessorKey: 'toBeAIPoweredComments',
    header: 'To be AI Powered - Comments',
    size: 260,
    enableSorting: false,
    cell: (info) => (
      <EditableCell
        value={info.getValue<string>()}
        onChange={(newValue) => {
          // Handle the change, e.g., update the data source or state
          console.log('New key manual steps:', newValue)
        }}
        type={'textArea'}
      />
    ),
  },
  {
    id: 'rateCardAED',
    accessorKey: 'rateCardAED',
    header: 'Rate Card (AED)',
    size: 180,
    enableSorting: false,
    cell: (info) => <p>{info.getValue<string>()}</p>,
  },
  {
    id: 'costOfManualEffortAED',
    accessorKey: 'costOfManualEffortAED',
    header: 'Cost of Manual Effort (AED)',
    size: 220,
    enableSorting: false,
    cell: (info) => <p>{info.getValue<string>()}</p>,
  },
  {
    id: 'markedAsReviewed',
    accessorKey: 'markedAsReviewed',
    header: 'Marked as Reviewed?',
    size: 180,
    enableSorting: false,
    cell: (info) => (
      <MarkedAsReviewCell
        marked={info.getValue<string>() === 'true' ? true : false}
        date={info.row.original.reviewedOn}
        id={`${info.row.original.l4Code}__markedAsReviewed`}
        onChange={() => {}}
      />
    ),
  },
  {
    id: 'businessFocalPoint',
    accessorKey: 'businessFocalPoint',
    header: 'Business Focal Point',
    size: 220,
    enableSorting: false,
    cell: (info) => {
      const onUpdate = info.table.options.meta?.onUpdateDraftRow
      return (
        <TagsSelectCell
          list={info.row.original.businessFocalPoint?.map((app: string) => ({
            id: `${app.trim()}`,
            name: app.trim(),
          }))}
          allTags={DIGITAL_FP_USERS}
          isUsers={false}
          onUpdate={(newTags: any) => {
            const newValue = newTags.map((tag: any) => tag.name)
            console.log('New current applications/systems:', newValue)
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
      return (
        <TagsSelectCell
          list={info.row.original.digitalFocalPoint?.map((app: string) => ({
            id: `${app.trim()}`,
            name: app.trim(),
          }))}
          allTags={DIGITAL_FP_USERS}
          isUsers={true}
          onUpdate={(newTags: any) => {
            const newValue = newTags.map((tag: any) => tag.name)
            console.log('New digitalFocalPoint:', newValue)
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
      <div className="text-muted-foreground rounded-[99px] bg-[#F1F3F5] p-1 text-center">
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
