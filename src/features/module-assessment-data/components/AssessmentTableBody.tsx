import React from 'react'
import { EditableCell, RadioCell } from '@/shared/components/table-primitives'
import { StatusBadgeCell } from '@/features/module-process-catalog/components/cells'
import { Maximize2, Tally1 } from 'lucide-react'
import SelectCell from '@/shared/components/table-primitives/SelectCell'

const AssessmentTableBody = (props: any) => {
    const { row } = props;

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
          <Maximize2 className="size-4" strokeWidth={2} />
        </div>
      )
    }
    return <></>
  }

  const getCellValueOptions = (fieldName: string) => {
    const optionsMap: any = {
      AutomationLevel: ['0%', '10%', '15%','20%', '25%', '30%','35%','40%','45%','50%','55%','60%','65%','70%','75%','80%','85%','90%','95%','100%'],
      ScaleOfProcess: ['Small (1-5)', 'Medium: (bigger team within one department)', 'Large (500+)'],
      processCriticality: ['Low', 'Standard', 'Critical'],
      UsersImpacted: ['Small (1-50)', 'Medium (50-500)', 'High (500-1000)'],
      automationMaturityLevel: ['Low', 'Medium', 'Fully Automated'],
      BusinessRecommendationForAutomation: ['Should be automated', 'Should be kept as is', 'Should not be automated'],
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
          <StatusBadgeCell
            status={row.l4Item?.status || row.level3Cell?.data.status || ''} 
          />
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
        <td style={{ width: 160 }}>
          <SelectCell
            defaultValue={
              row.l4Item?.businessUnit?.join(', ') ||
              row.level3Cell?.data.businessUnit?.join(', ') ||
              'Select'
            }
            options={row.l4Item?.businessUnit || row.level3Cell?.data.businessUnit || []}
            onValueChange={() => {}}
          />
        </td>
      ),
    },
    {
      key: 'ResponsibleDigitalTeam',
      content: (
        <td style={{ width: 160 }}>
          <SelectCell
            defaultValue={
              row.l4Item?.ResponsibleDigitalTeam?.join(', ') ||
              row.level3Cell?.data.ResponsibleDigitalTeam?.join(', ') ||
              'Select'
            }
            options={
              row.l4Item?.ResponsibleDigitalTeam ||
              row.level3Cell?.data.ResponsibleDigitalTeam ||
              []
            }
            onValueChange={() => {}}
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
              row.l4Item?.UsersImpacted ||
              row.level3Cell?.data.UsersImpacted ||
              'Select'
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
              row.l4Item?.scaleOfProcess ||
              row.level3Cell?.data.scaleOfProcess ||
              'Select'
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
        <td style={{ width: 200 }}>
          <SelectCell
            defaultValue={
              row.l4Item?.automationLevel ||
              row.level3Cell?.data.automationLevel ||
              'Select'
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
          <EditableCell
            value={
              row.l4Item?.currentApplicationsSystems?.join(', ') ||
              row.level3Cell?.data.currentApplicationsSystems?.join(', ') ||
              ''
            }
            onChange={() => {}}
          />
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
        <td style={{ width: 250 }}>
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
            value={
              row.l4Item?.AIPowered ||
              row.level3Cell?.data.AIPowered ||
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
      key: 'AIPoweredUseCase',
      content: (
        <td style={{ width: 250 }}>
          <EditableCell
            value={
              row.l4Item?.AIPoweredUseCase ||
              row.level3Cell?.data.AIPoweredUseCase ||
              '-'
            }
            onChange={() => {}}
          />
        </td>
      ),
    }
    ,
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
            defaultValue={
              row.l4Item?.ProcessCycle ||
              row.level3Cell?.data.ProcessCycle ||
              'Select'
            }
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
            value={
              row.l4Item?.n ||
              row.level3Cell?.data.processRepetitionWithinCycle ||
              'N/A'
            }
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
    }
    ,{
      key: 'KeyManualSteps',
      content: (
        <td style={{ width: 280 }}>
          <EditableCell
            value={
              row.l4Item?.keyManualSteps ||
              row.level3Cell?.data.keyManualSteps ||
              'N/A'
            }
            type={'textArea'}
            onChange={() => {}}
          />
        </td>
      ),
    },{
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
            value={
              row.l4Item?.SMEFeedback ||
              row.level3Cell?.data.SMEFeedback ||
              'N/A'
            }
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
            value={
              row.l4Item?.toBeAIPowered ||
              row.level3Cell?.data.toBeAIPowered ||
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
            value={
              row.l4Item?.rateCardAED ||
              row.level3Cell?.data.rateCardAED ||
              'N/A'
            }
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
        <td style={{ width: 150 }}>
          <RadioCell
            name={`${row.l4Item?.id}__markedAsReviewed`}
            value={
              row.l4Item?.markedAsReviewed ||
              row.level3Cell?.data.markedAsReviewed ||
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
      key: 'BusinessFocalPoint',
      content: (
        <td style={{ width: 200 }}>
          <SelectCell
            defaultValue={
              row.l4Item?.businessFocalPoint?.join(', ') ||
              row.level3Cell?.data.businessFocalPoint?.join(', ') ||
              'Select'
            }
            options={row.l4Item?.businessFocalPoint || row.level3Cell?.data.businessFocalPoint || []}
            onValueChange={() => {}}
          />
        </td>
      ),
    },  
    {
      key: 'digitalFocalPoint',
      content: (
        <td style={{ width: 200 }}>
          <SelectCell
            defaultValue={
              row.l4Item?.digitalFocalPoint?.join(', ') ||
              row.level3Cell?.data.digitalFocalPoint?.join(', ') ||
              'Select'
            }
            options={row.l4Item?.digitalFocalPoint || row.level3Cell?.data.digitalFocalPoint || []}
            onValueChange={() => {}}
          />
        </td>
      ),  
    },
    {
      key: 'publishedDate',
      content: (
        <td style={{ width: 150 }}>
          <EditableCell
            value={
              row.l4Item?.publishedDate ||
              row.level3Cell?.data.publishedDate ||
              'N/A'
            }
            onChange={() => {}}
          />
        </td>
      ),
    },
    {
      key: 'submittedBy',
      content: (
        <td style={{ width: 150 }}>
          <EditableCell
            value={
              row.l4Item?.submittedBy ||
              row.level3Cell?.data.submittedBy ||
              'N/A'
            }
            onChange={() => {}}
          />
        </td>
      ),  

    },
    {
      key: 'submittedOn',
      content: (
        <td style={{ width: 150 }}>
          <EditableCell
            value={
              row.l4Item?.submittedOn ||
              row.level3Cell?.data.submittedOn ||
              'N/A'
            }
            onChange={() => {}}
          />
        </td>
      ),
    }

  
    
    
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
