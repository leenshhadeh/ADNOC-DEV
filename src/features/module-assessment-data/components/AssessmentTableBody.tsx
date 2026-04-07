import React from 'react'
import { EditableCell, RadioCell } from '@/shared/components/table-primitives'
import { StatusBadgeCell } from '@/features/module-process-catalog/components/cells'
import { ChevronDown, Maximize2, Tally1 } from 'lucide-react'
import SelectCell from '@/shared/components/table-primitives/SelectCell'
import TagsList from '@/shared/components/table-primitives/TagsList'
import MarkedAsReviewCell from './cells/MarkedAsReviewCell'
import { ASSESSMENT_APPLICATIONS, DIGITAL_FP_USERS } from '../constants/CurrentApplication'
import TagsSelect from '@/shared/components/table-primitives/TagsSelect'

const AssessmentTableBody = (props: any) => {
  const { row, onExpandSharedServices } = props

  const getSharedCellValue = (item: any) => {
    let parsedValue: any
    try {
      parsedValue = {
        services: item?.services ?? 0,
        shared: item?.shared ?? 0,
      }
    } catch {
      parsedValue = {}
    }
    if (parsedValue.services && parsedValue.shared) {
      return (
        <div className="flex items-center justify-between">
          <span className="pe-[7px]">{parsedValue.services}</span>
          <Tally1 className="mt-[7px] rotate-[25deg] text-[#DFE3E6]" />
          <span className="text-muted-foreground pe-[7px]">{parsedValue.shared} Shared</span>
          <Tally1 className="text-[#DFE3E6]" />
          <Maximize2
            className="size-4 cursor-pointer"
            strokeWidth={2}
            onClick={onExpandSharedServices}
          />
        </div>
      )
    }
    return <></>
  }
  const getCellValueOptions = (fieldName: string) => {
    const optionsMap: any = {
      AutomationLevel: ['0%', '10%', '20%', '25%', '50%', '80%', '90%', '100%'],
      ScaleOfProcess: [
        'Small (1-5)',
        'Medium: (bigger team within one department)',
        'Large (500+)',
      ],
      processCriticality: ['Low', 'Standard', 'Critical'],
      UsersImpacted: ['Small (1-50)', 'Medium (50-500)', 'High (500-1000)'],
      automationMaturityLevel: ['Low', 'Medium', 'Fully Automated'],
      BusinessRecommendationForAutomation: [
        'Should be automated',
        'Should be kept as is',
        'Should not be automated',
      ],
      NorthStarTargetAutomation: ['Keep as is', 'To be fully automated', 'To be intelligent'],
    }
    return optionsMap[fieldName] || []
  }

  const entityCells = (row: any) => [
    {
      key: 'site',
      content: (
        <td style={{ width: 160 }}>
          <EditableCell
            value={row.l4Item?.site || row.level3Cell?.data.site || ''}
            onChange={() => {}}
          />
        </td>
      ),
    },
    {
      key: 'status',
      content: (
        <td style={{ width: 160 }}>
          <StatusBadgeCell status={row.l4Item?.status || row.level3Cell?.data.status || ''} />
        </td>
      ),
    },
    {
      key: 'desc',
      content: (
        <td style={{ width: 160 }}>
          <EditableCell
            value={row.l4Item?.description || row.level3Cell?.data.description || ''}
            onChange={() => {}}
            type={'textArea'}
          />
        </td>
      ),
    },
    {
      key: 'centrallyGovernedProcess',
      content: (
        <td style={{ width: 160 }}>
          <RadioCell
            name={`${row.l4Item?.id}__centrallyGovernedProcess`}
            value={
              row.l4Item?.centrallyGovernedProcess ||
              row.level3Cell?.data.centrallyGovernedProcess ||
              ''
            }
            options={[
              { label: 'Yes', value: 'yes' },
              { label: 'No', value: 'no' },
            ]}
            onChange={() => {}}
          />
        </td>
      ),
    },
    {
      key: 'sharedService',
      content: (
        <td style={{ width: 190 }}>
          {getSharedCellValue(row.l4Item?.sharedService || row.level3Cell?.data.sharedService)}
        </td>
      ),
    },
    {
      key: 'businessUnit',
      content: (
        <td style={{ width: 350 }}>
          <div className="flex items-center justify-between">
            <div className="max-w-[290px] overflow-hidden">
              <TagsList
                tags={(row.l4Item?.businessUnit || row.level3Cell?.data.businessUnit || []).map(
                  (bu: string, index: number) => ({
                    id: `${row.l4Item?.id || row.level3Cell?.data.id}__businessUnit__${index}`,
                    text: bu,
                  }),
                )}
                onRemoveTag={() => {}}
                allTags={[]}
              />
            </div>

            <Maximize2 className="size-4" strokeWidth={2} />
          </div>
        </td>
      ),
    },
    {
      key: 'ResponsibleDigitalTeam',
      content: (
        <td style={{ width: 160 }}>
          <TagsList
            tags={(
              row.l4Item?.ResponsibleDigitalTeam ||
              row.level3Cell?.data.ResponsibleDigitalTeam ||
              []
            ).map((team: string, index: number) => ({
              id: `${row.l4Item?.id || row.level3Cell?.data.id}__ResponsibleDigitalTeam__${index}`,
              text: team,
            }))}
            onRemoveTag={() => {}}
            allTags={[]}
          />
        </td>
      ),
    },
    {
      key: 'processCriticality',
      content: (
        <td style={{ width: 200 }}>
          <SelectCell
            defaultValue={
              row.l4Item?.processCriticality ||
              row.level3Cell?.data.processCriticality ||
              'Standard'
            }
            options={getCellValueOptions('processCriticality')}
            onValueChange={() => {}}
          />
        </td>
      ),
    },
    {
      key: 'NumberOfPeopleImpacted',
      content: (
        <td style={{ width: 200 }}>
          <SelectCell
            defaultValue={
              row.l4Item?.UsersImpacted || row.level3Cell?.data.UsersImpacted || 'Select'
            }
            options={getCellValueOptions('UsersImpacted')}
            onValueChange={() => {}}
          />
        </td>
      ),
    },
    {
      key: 'ScaleOfProcess',
      content: (
        <td style={{ width: 250 }}>
          <SelectCell
            defaultValue={
              row.l4Item?.scaleOfProcess || row.level3Cell?.data.scaleOfProcess || 'Select'
            }
            options={getCellValueOptions('ScaleOfProcess')}
            onValueChange={() => {}}
          />
        </td>
      ),
    },
    {
      key: 'AutomationMaturityLevel',
      content: (
        <td style={{ width: 200 }}>
          <SelectCell
            defaultValue={
              row.l4Item?.automationMaturityLevel ||
              row.level3Cell?.data.automationMaturityLevel ||
              'Select'
            }
            options={getCellValueOptions('automationMaturityLevel')}
            onValueChange={() => {}}
          />
        </td>
      ),
    },
    {
      key: 'AutomationLevel',
      content: (
        <td style={{ width: 100 }}>
          <SelectCell
            defaultValue={
              row.l4Item?.automationLevel || row.level3Cell?.data.automationLevel || 'Select'
            }
            options={getCellValueOptions('AutomationLevel')}
            onValueChange={() => {}}
          />
        </td>
      ),
    },
    {
      key: 'CurrentApplications',
      content: (
        <td style={{ width: 200 }}>
          <div className="flex items-center justify-between">
            <div className="max-w-[200px] overflow-hidden">
              <TagsSelect
                tags={(
                  row.l4Item?.currentApplicationsSystems ||
                  row.level3Cell?.data.currentApplicationsSystems ||
                  []
                ).map((app: string, index: number) => ({
                  id: `${app}_${index}`,
                  name: app,
                }))}
                allTags={ASSESSMENT_APPLICATIONS}
              />
            </div>
            <ChevronDown className="text-muted-foreground size-4" />
          </div>
        </td>
      ),
    },
    {
      key: 'OngoingAutomation',
      content: (
        <td style={{ width: 200 }}>
          <EditableCell
            value={row.l4Item?.OngoingAutomation || row.level3Cell?.data.OngoingAutomation || 'N/A'}
            onChange={() => {}}
          />
        </td>
      ),
    },
    {
      key: 'BusinessRecommendationForAutomation',
      content: (
        <td style={{ width: 150 }}>
          <SelectCell
            defaultValue={
              row.l4Item?.businessRecommendationForAutomation ||
              row.level3Cell?.data.businessRecommendationForAutomation ||
              'Select'
            }
            options={getCellValueOptions('BusinessRecommendationForAutomation')}
            onValueChange={() => {}}
          />
        </td>
      ),
    },
    {
      key: 'KeyChallengesAutomationNeeds',
      content: (
        <td style={{ width: 250 }}>
          <EditableCell
            value={
              row.l4Item?.keyChallengesAutomationNeeds ||
              row.level3Cell?.data.keyChallengesAutomationNeeds ||
              'N/A'
            }
            onChange={() => {}}
          />
        </td>
      ),
    },
    {
      key: 'AIPowered',
      content: (
        <td style={{ width: 150 }}>
          <RadioCell
            name={`${row.l4Item?.id}__AIPowered`}
            value={row.l4Item?.AIPowered || row.level3Cell?.data.AIPowered || ''}
            options={[
              { label: 'Yes', value: 'yes' },
              { label: 'No', value: 'no' },
            ]}
            onChange={() => {}}
          />
        </td>
      ),
    },
    {
      key: 'AIPoweredUseCase',
      content: (
        <td style={{ width: 250 }}>
          <EditableCell
            value={row.l4Item?.AIPoweredUseCase || row.level3Cell?.data.AIPoweredUseCase || '-'}
            onChange={() => {}}
          />
        </td>
      ),
    },
    {
      key: 'AutonomousUseCaseEnabled',
      content: (
        <td style={{ width: 150 }}>
          <RadioCell
            name={`${row.l4Item?.id}__AutonomousUseCaseEnabled`}
            value={
              row.l4Item?.autonomousUseCaseEnabled ||
              row.level3Cell?.data.autonomousUseCaseEnabled ||
              ''
            }
            options={[
              { label: 'Yes', value: 'yes' },
              { label: 'No', value: 'no' },
            ]}
            onChange={() => {}}
          />
        </td>
      ),
    },
    {
      key: 'AutonomousUseCaseDescriptionComment',
      content: (
        <td style={{ width: 250 }}>
          <EditableCell
            value={
              row.l4Item?.autonomousUseCaseDescriptionComment ||
              row.level3Cell?.data.autonomousUseCaseDescriptionComment ||
              'N/A'
            }
            onChange={() => {}}
          />
        </td>
      ),
    },
    {
      key: 'ProcessCycle',
      content: (
        <td style={{ width: 250 }}>
          <SelectCell
            defaultValue={row.l4Item?.ProcessCycle || row.level3Cell?.data.ProcessCycle || 'Select'}
            options={['Daily', 'Weekly', 'Monthly', 'Annually']}
            onValueChange={() => {}}
          />
        </td>
      ),
    },
    {
      key: 'ProcessRepetitionWithinCycle',
      content: (
        <td style={{ width: 250 }}>
          <EditableCell
            value={row.l4Item?.n || row.level3Cell?.data.processRepetitionWithinCycle || 'N/A'}
            onChange={() => {}}
          />
        </td>
      ),
    },
    {
      key: 'TotalPersonnelExecutingFTE',
      content: (
        <td style={{ width: 170 }}>
          <EditableCell
            value={
              row.l4Item?.totalPersonnelExecutingFTE ||
              row.level3Cell?.data.totalPersonnelExecutingFTE ||
              'N/A'
            }
            onChange={() => {}}
          />
        </td>
      ),
    },
    {
      key: 'TotalProcessDurationDays',
      content: (
        <td style={{ width: 170 }}>
          <EditableCell
            value={
              row.l4Item?.totalProcessDurationDays ||
              row.level3Cell?.data.totalProcessDurationDays ||
              'N/A'
            }
            onChange={() => {}}
          />
        </td>
      ),
    },
    {
      key: 'TimeSpentOnManualTasksPercent',
      content: (
        <td style={{ width: 250 }}>
          <SelectCell
            defaultValue={
              row.l4Item?.timeSpentOnManualTasksPercent ||
              row.level3Cell?.data.timeSpentOnManualTasksPercent ||
              'Select'
            }
            options={getCellValueOptions('AutomationLevel')}
            onValueChange={() => {}}
          />
        </td>
      ),
    },
    {
      key: 'KeyManualSteps',
      content: (
        <td style={{ width: 280 }}>
          <EditableCell
            value={row.l4Item?.keyManualSteps || row.level3Cell?.data.keyManualSteps || 'N/A'}
            type={'textArea'}
            onChange={() => {}}
          />
        </td>
      ),
    },
    {
      key: 'NorthStarTargetAutomation',
      content: (
        <td style={{ width: 250 }}>
          <SelectCell
            defaultValue={
              row.l4Item?.northStarTargetAutomation ||
              row.level3Cell?.data.northStarTargetAutomation ||
              'Select'
            }
            options={getCellValueOptions('NorthStarTargetAutomation')}
            onValueChange={() => {}}
          />
        </td>
      ),
    },
    {
      key: 'TargetAutomationLevelPercent',
      content: (
        <td style={{ width: 250 }}>
          <SelectCell
            defaultValue={
              row.l4Item?.targetAutomationLevelPercent ||
              row.level3Cell?.data.targetAutomationLevelPercent ||
              'Select'
            }
            options={getCellValueOptions('AutomationLevel')}
            onValueChange={() => {}}
          />
        </td>
      ),
    },
    {
      key: 'SMEFeedback',
      content: (
        <td style={{ width: 250 }}>
          <EditableCell
            value={row.l4Item?.SMEFeedback || row.level3Cell?.data.SMEFeedback || 'N/A'}
            type={'textArea'}
            onChange={() => {}}
          />
        </td>
      ),
    },
    {
      key: 'ToBeAIPowered',
      content: (
        <td style={{ width: 150 }}>
          <RadioCell
            name={`${row.l4Item?.id}__toBeAIPowered`}
            value={row.l4Item?.toBeAIPowered || row.level3Cell?.data.toBeAIPowered || ''}
            options={[
              { label: 'Yes', value: 'yes' },
              { label: 'No', value: 'no' },
            ]}
            onChange={() => {}}
          />
        </td>
      ),
    },
    {
      key: 'ToBeAIPoweredComments',
      content: (
        <td style={{ width: 250 }}>
          <EditableCell
            value={
              row.l4Item?.toBeAIPoweredComments ||
              row.level3Cell?.data.toBeAIPoweredComments ||
              'N/A'
            }
            type={'textArea'}
            onChange={() => {}}
          />
        </td>
      ),
    },
    {
      key: 'RateCardAED',
      content: (
        <td style={{ width: 150 }}>
          <EditableCell
            value={row.l4Item?.rateCardAED || row.level3Cell?.data.rateCardAED || 'N/A'}
            onChange={() => {}}
          />
        </td>
      ),
    },
    {
      key: 'CostOfManualEffortAED',
      content: (
        <td style={{ width: 170 }}>
          <EditableCell
            value={
              row.l4Item?.costOfManualEffortAED ||
              row.level3Cell?.data.costOfManualEffortAED ||
              'N/A'
            }
            onChange={() => {}}
          />
        </td>
      ),
    },
    {
      key: 'MarkedAsReviewed',
      content: (
        <td style={{ width: 200 }}>
          <MarkedAsReviewCell
            marked={row.l4Item?.markedAsReviewed || row.level3Cell?.data.markedAsReviewed || false}
            date={row.l4Item?.reviewedOn || row.level3Cell?.data.reviewedOn || ''}
            id={row.l4Item?.id || row.level3Cell?.data?.id || ''}
            handleMarkAsReviewed={() => {}}
          />
        </td>
      ),
    },
    {
      key: 'BusinessFocalPoint',
      content: (
        <td style={{ width: 200 }}>
          <div className="flex items-center justify-between">
            <div className="max-w-[200px] overflow-hidden">
              <TagsSelect
                tags={(
                  row.l4Item?.businessFocalPoint ||
                  row.level3Cell?.data.businessFocalPoint ||
                  []
                ).map((focal: string, index: number) => ({
                  id: `${row.l4Item?.id || row.level3Cell?.data.id}__businessFocalPoint__${index}`,
                  name: focal,
                }))}
                allTags={DIGITAL_FP_USERS}
                isUsers={true}
              />
            </div>
            <ChevronDown className="text-muted-foreground size-4" />
          </div>
        </td>
      ),
    },
    {
      key: 'digitalFocalPoint',
      content: (
        <td style={{ width: 200 }}>
          <div className="flex items-center justify-between">
            <div className="max-w-[200px] overflow-hidden">
              <TagsSelect
                tags={(
                  row.l4Item?.digitalFocalPoint ||
                  row.level3Cell?.data.digitalFocalPoint ||
                  []
                ).map((focal: string, index: number) => ({
                  id: `${row.l4Item?.id || row.level3Cell?.data.id}__digitalFocalPoint__${index}`,
                  name: focal,
                }))}
                allTags={DIGITAL_FP_USERS}
                isUsers={true}
              />
            </div>
            <ChevronDown className="text-muted-foreground size-4" />
          </div>
        </td>
      ),
    },
    {
      key: 'publishedDate',
      content: (
        <td style={{ width: 150 }}>
          {row.l4Item?.publishedDate || row.level3Cell?.data.publishedDate || 'N/A'}
        </td>
      ),
    },
    {
      key: 'submittedBy',
      content: (
        <td style={{ width: 150 }}>
          <div className="text-muted-foreground rounded-[99px] bg-[#F1F3F5] p-1 text-center">
            {row.l4Item?.submittedBy || row.level3Cell?.data.submittedBy || 'N/A'}
          </div>
        </td>
      ),
    },
    {
      key: 'submittedOn',
      content: (
        <td style={{ width: 150 }}>
          {row.l4Item?.submittedOn || row.level3Cell?.data.submittedOn || 'N/A'}
        </td>
      ),
    },
  ]

  return (
    <>
      {entityCells(row).map((cell) => (
        <React.Fragment key={cell.key}>{cell.content}</React.Fragment>
      ))}
    </>
  )
}

export default AssessmentTableBody
