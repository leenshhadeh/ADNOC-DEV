import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { ASSESSMENT_DATA } from '../../constants/assessment-data'
import DataTable from '@/shared/components/data-table/DataTable'
import type { DomainItem, FlatAssessmentRow, SharedService } from '../../types/process'
import CellMenuOptions from '../CellMenuOptions'
import { StatusBadgeCell } from '@/features/module-process-catalog/components/cells'
import { EditableCell, RadioCell } from '@/shared/components/table-primitives'
import { Maximize2, Tally1 } from 'lucide-react'
import TagsList from '@/shared/components/table-primitives/TagsList'
import SharedServicesSheet from '../sidePanels/SharedServicesSheet'

import { useState } from 'react';

const ProcessDataTable = () => {
  const [isSharedServiceOpen, setIsSharedServiceOpen] = useState(false);
  const toText = (value: unknown): string => {
    if (value == null) return ''
    if (Array.isArray(value)) return value.filter(Boolean).join(', ')
    if (typeof value === 'object') return JSON.stringify(value)
    return String(value)
  }

  const formatSharedService = (value: SharedService): any => {
    if (!value) return ''
    if (typeof value === 'string') return value

    return { services: value.services, shared: value.shared }
  }
  const onExpandSharedServices = () => {
    // Implement the logic to expand and show shared services details
    setIsSharedServiceOpen(true);
  }

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
  const pickValue = <T,>(l4Value: T | undefined, l3Value: T | undefined): T | undefined =>
    l4Value ?? l3Value

  const flattenAssessmentData = (data: DomainItem[]): FlatAssessmentRow[] =>
    data.flatMap((domainItem) =>
      (domainItem.level1Items ?? []).flatMap((l1Item, l1Index) =>
        (l1Item.level2Items ?? []).flatMap((l2Item, l2Index) =>
          (l2Item.level3Items ?? []).flatMap((l3Item, l3Index) =>
            (l3Item.level4Items?.length ? l3Item.level4Items : [undefined]).map(
              (l4Item, l4Index) => ({
                rowId:
                  l4Item?.id ??
                  `${domainItem.id}-${l1Item.id}-${l2Item.id}-${l3Item.id}-${l4Index}`,
                id: `${domainItem.id}-${l1Item.id}-${l2Item.id}-${l3Item.id}-${l4Item?.id ?? '0'}`,
                domain:
                  l1Index === 0 && l2Index === 0 && l3Index === 0 && l4Index === 0
                    ? (domainItem.domain ?? '')
                    : '',

                l1:
                  l2Index === 0 && l3Index === 0 && l4Index === 0 ? (l1Item.level1Name ?? '') : '',
                l1Code: l1Item.level1Code,

                l2: l3Index === 0 && l4Index === 0 ? (l2Item.level2Name ?? '') : '',
                l2Code: l2Item.level2Code,

                l3: l4Index === 0 ? (l3Item.level3Name ?? '') : '',
                l3Code: l3Item.level3Code,

                l4: l4Item?.level4Name ?? '',
                l4Code: l4Item?.level4Code,
                groupCompany: toText(pickValue(l4Item?.groupCompany, l3Item.groupCompany)),
                Site: toText(pickValue(l4Item?.site, l3Item.site)),
                status: toText(pickValue(l4Item?.status, l3Item.status)),
                description: toText(pickValue(l4Item?.description, l3Item.description)),
                centrallyGovernedProcess: toText(
                  pickValue(l4Item?.centrallyGovernedProcess, l3Item.centrallyGovernedProcess),
                ),
                sharedService: formatSharedService(l4Item?.sharedService || l3Item.sharedService),
                businessUnit: l4Item?.businessUnit || l3Item.businessUnit || [],
                responsibleDigitalTeam:
                  l4Item?.ResponsibleDigitalTeam || l3Item.ResponsibleDigitalTeam || [],
                processCriticality: toText(
                  pickValue(l4Item?.processCriticality, l3Item.processCriticality),
                ),
                usersImpacted: toText(pickValue(l4Item?.UsersImpacted, l3Item.UsersImpacted)),
                scaleOfProcess: toText(pickValue(l4Item?.scaleOfProcess, l3Item.scaleOfProcess)),
                automationMaturityLevel: toText(
                  pickValue(l4Item?.automationMaturityLevel, l3Item.automationMaturityLevel),
                ),
                automationLevel: toText(pickValue(l4Item?.automationLevel, l3Item.automationLevel)),
                currentApplicationsSystems: toText(
                  pickValue(l4Item?.currentApplicationsSystems, l3Item.currentApplicationsSystems),
                ),
                ongoingAutomationDigitalInitiatives: toText(
                  pickValue(
                    l4Item?.OngoingAutomationDigitalInitiatives,
                    l3Item.OngoingAutomationDigitalInitiatives,
                  ),
                ),
                businessRecommendationForAutomation: toText(
                  pickValue(
                    l4Item?.businessRecommendationForAutomation,
                    l3Item.businessRecommendationForAutomation,
                  ),
                ),
                keyChallengesAutomationNeeds: toText(
                  pickValue(
                    l4Item?.keyChallengesAutomationNeeds,
                    l3Item.keyChallengesAutomationNeeds,
                  ),
                ),
                aiPowered: toText(pickValue(l4Item?.AIPowered, l3Item.AIPowered)),
                aiPoweredUseCase: toText(
                  pickValue(l4Item?.AIPoweredUseCase, l3Item.AIPoweredUseCase),
                ),
                autonomousUseCaseEnabled: toText(
                  pickValue(l4Item?.autonomousUseCaseEnabled, l3Item.autonomousUseCaseEnabled),
                ),
                autonomousUseCaseDescriptionComment: toText(
                  pickValue(
                    l4Item?.AutonomousUseCaseDescriptionComment,
                    l3Item.AutonomousUseCaseDescriptionComment,
                  ),
                ),
                processCycle: toText(pickValue(l4Item?.ProcessCycle, l3Item.ProcessCycle)),
                processRepetitionWithinCycle: toText(
                  pickValue(
                    l4Item?.processRepetitionWithinCycle,
                    l3Item.processRepetitionWithinCycle,
                  ),
                ),
                totalPersonnelExecutingFTE: toText(
                  pickValue(l4Item?.totalPersonnelExecutingFTE, l3Item.totalPersonnelExecutingFTE),
                ),
                totalProcessDurationDays: toText(
                  pickValue(l4Item?.totalProcessDurationDays, l3Item.totalProcessDurationDays),
                ),
                timeSpentOnManualTasksPercent: toText(
                  pickValue(
                    l4Item?.timeSpentOnManualTasksPercent,
                    l3Item.timeSpentOnManualTasksPercent,
                  ),
                ),
                keyManualSteps: toText(pickValue(l4Item?.keyManualSteps, l3Item.keyManualSteps)),
                northStarTargetAutomation: toText(
                  pickValue(l4Item?.northStarTargetAutomation, l3Item.northStarTargetAutomation),
                ),
                targetAutomationLevelPercent: toText(
                  pickValue(
                    l4Item?.targetAutomationLevelPercent,
                    l3Item.targetAutomationLevelPercent,
                  ),
                ),
                smeFeedback: toText(pickValue(l4Item?.SMEFeedback, l3Item.SMEFeedback)),
                toBeAIPowered: toText(pickValue(l4Item?.toBeAIPowered, l3Item.toBeAIPowered)),
                toBeAIPoweredComments: toText(
                  pickValue(l4Item?.toBeAIPoweredComments, l3Item.toBeAIPoweredComments),
                ),
                rateCardAED: toText(pickValue(l4Item?.rateCardAED, l3Item.rateCardAED)),
                costOfManualEffortAED: toText(
                  pickValue(l4Item?.costOfManualEffortAED, l3Item.costOfManualEffortAED),
                ),
                markedAsReviewed: toText(
                  pickValue(l4Item?.markedAsReviewed, l3Item.markedAsReviewed),
                ),
                businessFocalPoint: toText(
                  pickValue(l4Item?.businessFocalPoint, l3Item.businessFocalPoint),
                ),
                digitalFocalPoint: toText(
                  pickValue(l4Item?.digitalFocalPoint, l3Item.digitalFocalPoint),
                ),
                publishedDate: toText(pickValue(l4Item?.publishedDate, l3Item.publishedDate)),
                submittedBy: toText(pickValue(l4Item?.submittedBy, l3Item.submittedBy)),
                submittedOn: toText(pickValue(l4Item?.submittedOn, l3Item.submittedOn)),
              }),
            ),
          ),
        ),
      ),
    )

  const columns = useMemo<ColumnDef<FlatAssessmentRow, unknown>[]>(
    () => [
      {
        id: 'domain',
        accessorKey: 'domain',
        header: 'Domain',
        size: 250,
        enableSorting: false,
        meta: { isDivider: true },
        cell: (info) => <p>{info.getValue<string>()}</p>,
      },
      {
        id: 'l1',
        accessorKey: 'l1',
        header: 'Level 1',
        size: 220,
        enableSorting: false,
        cell: (info) => (
          <div className="flex flex-col gap-0.5">
            <span className="text-foreground text-sm font-medium">{info.getValue<string>()}</span>
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
          <div className="flex flex-col gap-0.5">
            <span className="text-foreground text-sm font-medium">{info.getValue<string>()}</span>
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
        pinnedCol: true,
        meta: { pinnedCol: true },
        cell: (info) => (
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-col gap-0.5">
              <span className="text-foreground text-sm font-medium">{info.getValue<string>()}</span>
              <span className="text-muted-foreground text-xs">
                {info.getValue<string>() ? info.row.original.l3Code : ''}
              </span>
            </div>
            {/* if there is l4 , remove the menu actins */}
            {!info.row.original.l4Code && <CellMenuOptions item={info.row.original} />}
          </div>
        ),
      },
      {
        id: 'l4',
        accessorKey: 'l4',
        header: 'Level 4',
        size: 300,
        pinnedCol: true,
        meta: { pinnedCol: true, offset: 256 },
        cell: (info) => (
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-col gap-0.5">
              <span className="text-foreground text-sm font-medium">{info.getValue<string>()}</span>
              {info.getValue<string>() ? (
                <span className="text-muted-foreground text-xs">{info.row.original.l4Code} </span>
              ) : (
                <span className="text-muted-foreground text-sm italic">No Level 4 processes</span>
              )}
            </div>
            {info.getValue<string>() && <CellMenuOptions item={info.row.original} />}
          </div>
        ),
      },
      {
        id: 'groupCompany',
        accessorKey: 'groupCompany',
        header: 'Group Company',
        size: 250,
        cell: (info) => <p>{info.getValue<string>()}</p>,
      },
      {
        id: 'Site',
        accessorKey: 'Site',
        header: 'Site',
        size: 120,
        cell: (info) => <p>{info.getValue<string>()}</p>,
      },
      {
        id: 'status',
        accessorKey: 'status',
        header: 'Status',
        size: 180,
        cell: (info) => <StatusBadgeCell status={info.getValue<string>() || '-'} />,
      },
      {
        id: 'description',
        accessorKey: 'description',
        header: 'Description',
        size: 320,
        cell: (info) => (
          <EditableCell
            value={info.getValue<string>()}
            onChange={(newValue) => {
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
        cell: (info) => (
          <RadioCell
            name={`${info.row.original.l4Code}__centrallyGovernedProcess`}
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
        id: 'sharedService',
        accessorKey: 'sharedService',
        header: 'Shared Service',
        size: 250,
        cell: (info) => <>{getSharedCellValue(info.getValue<string>())}</>,

      },
      {
        id: 'businessUnit',
        accessorKey: 'businessUnit',
        header: 'Business Unit',
        size: 250,
        cell: (info) => (
          <div className="max-w-[290px] overflow-hidden">
            <TagsList
              tags={(info.getValue<string>() || []).map((bu: string, index: number) => ({
                id: `${info.row.original.l4Code || info.row.original.l3Code}__businessUnit__${index}`,
                text: bu,
              }))}
              onRemoveTag={() => {}}
              allTags={[]}
            />
          </div>
        ),

      },
      {
        id: 'responsibleDigitalTeam',
        accessorKey: 'responsibleDigitalTeam',
        header: 'Responsible Digital Team',
        size: 250,
        cell: (info) => <p>{info.getValue<string>()}</p>,
      },
      {
        id: 'processCriticality',
        accessorKey: 'processCriticality',
        header: 'Process Criticality',
        size: 250,
        cell: (info) => <p>{info.getValue<string>()}</p>,
      },
      {
        id: 'usersImpacted',
        accessorKey: 'usersImpacted',
        header: 'Number of People/Users Impacted',
        size: 250,
        cell: (info) => <p>{info.getValue<string>()}</p>,
      },
      {
        id: 'scaleOfProcess',
        accessorKey: 'scaleOfProcess',
        header: 'Scale of the Process',
        size: 250,
        cell: (info) => <p>{info.getValue<string>()}</p>,
      },
      {
        id: 'automationMaturityLevel',
        accessorKey: 'automationMaturityLevel',
        header: 'Automation Maturity Level',
        size: 250,
        cell: (info) => <p>{info.getValue<string>()}</p>,
      },
      {
        id: 'automationLevel',
        accessorKey: 'automationLevel',
        header: 'Automation Level (%)',
        size: 180,
        cell: (info) => <p>{info.getValue<string>()}</p>,
      },
      {
        id: 'currentApplicationsSystems',
        accessorKey: 'currentApplicationsSystems',
        header: 'Current Applications/Systems',
        size: 260,
        cell: (info) => <p>{info.getValue<string>()}</p>,
      },
      {
        id: 'ongoingAutomationDigitalInitiatives',
        accessorKey: 'ongoingAutomationDigitalInitiatives',
        header: 'Ongoing Automation / Digital Initiatives',
        size: 320,
        cell: (info) => <p>{info.getValue<string>()}</p>,
      },
      {
        id: 'businessRecommendationForAutomation',
        accessorKey: 'businessRecommendationForAutomation',
        header: 'Business Recommendation for Automation',
        size: 320,
        cell: (info) => <p>{info.getValue<string>()}</p>,
      },
      {
        id: 'keyChallengesAutomationNeeds',
        accessorKey: 'keyChallengesAutomationNeeds',
        header: 'Key Challenges & Automation Needs',
        size: 300,
        cell: (info) => <p>{info.getValue<string>()}</p>,
      },
      {
        id: 'aiPowered',
        accessorKey: 'aiPowered',
        header: 'AI-Powered - Y/N',
        size: 160,
        cell: (info) => <p>{info.getValue<string>()}</p>,
      },
      {
        id: 'aiPoweredUseCase',
        accessorKey: 'aiPoweredUseCase',
        header: 'AI-Powered Use Case',
        size: 250,
        cell: (info) => <p>{info.getValue<string>()}</p>,
      },
      {
        id: 'autonomousUseCaseEnabled',
        accessorKey: 'autonomousUseCaseEnabled',
        header: 'Autonomous Use Case Enabled',
        size: 250,
        cell: (info) => <p>{info.getValue<string>()}</p>,
      },
      {
        id: 'autonomousUseCaseDescriptionComment',
        accessorKey: 'autonomousUseCaseDescriptionComment',
        header: 'Autonomous Use Case Description/Comment',
        size: 320,
        cell: (info) => <p>{info.getValue<string>()}</p>,
      },
      {
        id: 'processCycle',
        accessorKey: 'processCycle',
        header: 'How Often the Process Happens (Cycle)',
        size: 280,
        cell: (info) => <p>{info.getValue<string>()}</p>,
      },
      {
        id: 'processRepetitionWithinCycle',
        accessorKey: 'processRepetitionWithinCycle',
        header: 'Number of Times Repeated within Selected Cycle',
        size: 320,
        cell: (info) => <p>{info.getValue<string>()}</p>,
      },
      {
        id: 'totalPersonnelExecutingFTE',
        accessorKey: 'totalPersonnelExecutingFTE',
        header: 'Total Personnel Executing (FTE)',
        size: 240,
        cell: (info) => <p>{info.getValue<string>()}</p>,
      },
      {
        id: 'totalProcessDurationDays',
        accessorKey: 'totalProcessDurationDays',
        header: 'Total Process Duration (Days)',
        size: 220,
        cell: (info) => <p>{info.getValue<string>()}</p>,
      },
      {
        id: 'timeSpentOnManualTasksPercent',
        accessorKey: 'timeSpentOnManualTasksPercent',
        header: 'Time Spent on Manual Tasks (%)',
        size: 240,
        cell: (info) => <p>{info.getValue<string>()}</p>,
      },
      {
        id: 'keyManualSteps',
        accessorKey: 'keyManualSteps',
        header: 'Key Manual Steps',
        size: 260,
        cell: (info) => <p>{info.getValue<string>()}</p>,
      },
      {
        id: 'northStarTargetAutomation',
        accessorKey: 'northStarTargetAutomation',
        header: '"North Star" Target Automation',
        size: 240,
        cell: (info) => <p>{info.getValue<string>()}</p>,
      },
      {
        id: 'targetAutomationLevelPercent',
        accessorKey: 'targetAutomationLevelPercent',
        header: 'Target Automation Level (%)',
        size: 220,
        cell: (info) => <p>{info.getValue<string>()}</p>,
      },
      {
        id: 'smeFeedback',
        accessorKey: 'smeFeedback',
        header: 'SME Feedback',
        size: 280,
        cell: (info) => <p>{info.getValue<string>()}</p>,
      },
      {
        id: 'toBeAIPowered',
        accessorKey: 'toBeAIPowered',
        header: 'To be AI Powered - Y/N',
        size: 220,
        cell: (info) => <p>{info.getValue<string>()}</p>,
      },
      {
        id: 'toBeAIPoweredComments',
        accessorKey: 'toBeAIPoweredComments',
        header: 'To be AI Powered - Comments',
        size: 260,
        cell: (info) => <p>{info.getValue<string>()}</p>,
      },
      {
        id: 'rateCardAED',
        accessorKey: 'rateCardAED',
        header: 'Rate Card (AED)',
        size: 180,
        cell: (info) => <p>{info.getValue<string>()}</p>,
      },
      {
        id: 'costOfManualEffortAED',
        accessorKey: 'costOfManualEffortAED',
        header: 'Cost of Manual Effort (AED)',
        size: 220,
        cell: (info) => <p>{info.getValue<string>()}</p>,
      },
      {
        id: 'markedAsReviewed',
        accessorKey: 'markedAsReviewed',
        header: 'Marked as Reviewed?',
        size: 180,
        cell: (info) => <p>{info.getValue<string>()}</p>,
      },
      {
        id: 'businessFocalPoint',
        accessorKey: 'businessFocalPoint',
        header: 'Business Focal Point',
        size: 220,
        cell: (info) => <p>{info.getValue<string>()}</p>,
      },
      {
        id: 'digitalFocalPoint',
        accessorKey: 'digitalFocalPoint',
        header: 'Digital Focal Point',
        size: 220,
        cell: (info) => <p>{info.getValue<string>()}</p>,
      },
      {
        id: 'publishedDate',
        accessorKey: 'publishedDate',
        header: 'Published Date',
        size: 180,
        cell: (info) => <p>{info.getValue<string>()}</p>,
      },
      {
        id: 'submittedBy',
        accessorKey: 'submittedBy',
        header: 'Submitted By',
        size: 180,
        cell: (info) => <p>{info.getValue<string>()}</p>,
      },
      {
        id: 'submittedOn',
        accessorKey: 'submittedOn',
        header: 'Submitted On',
        size: 180,
        cell: (info) => <p>{info.getValue<string>()}</p>,
      },
    ],
    [],
  )

  const tableData = useMemo(() => flattenAssessmentData(ASSESSMENT_DATA), [])

  return (
    <>
      <DataTable
        columns={columns}
        data={tableData}
        density="compact"
        // enableColumnResizing
        // columnResizeMode="onChange"
        // getCommonCellStyles={getCommonPinningStyles}
      />

          {/* side panels */}
          <SharedServicesSheet
        open={isSharedServiceOpen}
        handleOpenChange={() => setIsSharedServiceOpen(false)}
      />
    </>
  )
}

export default ProcessDataTable
