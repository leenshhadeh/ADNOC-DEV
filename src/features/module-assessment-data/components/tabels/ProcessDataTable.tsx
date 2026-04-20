import { useCallback, useEffect, useMemo, useState } from 'react'
import DataTable from '@/shared/components/data-table/DataTable'
import type { DomainItem, FlatAssessmentRow, SharedService } from '../../types/process'
import SharedServicesSheet from '../sidePanels/SharedServicesSheet'
import BUSheet from '../sidePanels/BUSheet'
import DigitalTeamSheet from '../sidePanels/DigitalTeamSheet'
import { getProcessTableColumns } from './process-table-columns'

const toText = (value: unknown): string => {
  if (value == null) return ''
  if (Array.isArray(value)) return value.filter(Boolean).join(', ')
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}

const formatSharedService = (value: SharedService): any => {
  if (!value) return ''
  if (typeof value === 'string') return value

  return { services: value?.services, shared: value?.shared }
}

const pickValue = <T,>(l4Value: T | undefined, l3Value: T | undefined): T | undefined =>
  l4Value ?? l3Value

export const flattenAssessmentData = (data: DomainItem[]): FlatAssessmentRow[] =>
  data.flatMap((domainItem) =>
    (domainItem.level1Items ?? []).flatMap((l1Item, l1Index) =>
      (l1Item.level2Items ?? []).flatMap((l2Item, l2Index) =>
        (l2Item.level3Items ?? []).flatMap((l3Item, l3Index) =>
          (l3Item.level4Items?.length ? l3Item.level4Items : [undefined]).map(
            (l4Item, l4Index) => ({
              rowId:
                l4Item?.id ?? `${domainItem.id}-${l1Item.id}-${l2Item.id}-${l3Item.id}-${l4Index}`,
              id: `${domainItem.id}-${l1Item.id}-${l2Item.id}-${l3Item.id}-${l4Item?.id ?? '0'}`,

              // ✅ REAL values (always filled)
              domain: domainItem.domain ?? '',
              l1: l1Item.level1Name ?? '',
              l2: l2Item.level2Name ?? '',
              l3: l3Item.level3Name ?? '',
              l4: l4Item?.level4Name ?? '',

              // ✅ DISPLAY values (only first occurrence)
              displayDomain:
                l1Index === 0 && l2Index === 0 && l3Index === 0 && l4Index === 0
                  ? (domainItem.domain ?? '')
                  : '',

              displayL1:
                l2Index === 0 && l3Index === 0 && l4Index === 0 ? (l1Item.level1Name ?? '') : '',

              displayL2: l3Index === 0 && l4Index === 0 ? (l2Item.level2Name ?? '') : '',

              displayL3: l4Index === 0 ? (l3Item.level3Name ?? '') : '',

              l4Code: l4Item?.level4Code,
              groupCompany: toText(pickValue(l4Item?.groupCompany, l3Item.groupCompany)),
              Site: toText(pickValue(l4Item?.site, l3Item.site)),
              status: l4Item?.status || l3Item.status || '',
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
              currentApplicationsSystems:
                l4Item?.currentApplicationsSystems || l3Item.currentApplicationsSystems || [],

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
              reviewedOn: toText(pickValue(l4Item?.reviewedOn, l3Item.reviewedOn)),
              businessFocalPoint: l4Item?.businessFocalPoint || l3Item.businessFocalPoint || [],
              digitalFocalPoint: l4Item?.digitalFocalPoint || l3Item.digitalFocalPoint || [],
              publishedDate: toText(pickValue(l4Item?.publishedDate, l3Item.publishedDate)),
              submittedBy: toText(pickValue(l4Item?.submittedBy, l3Item.submittedBy)),
              submittedOn: toText(pickValue(l4Item?.submittedOn, l3Item.submittedOn)),
            }),
          ),
        ),
      ),
    ),
  )

export type DisplayAssessmentRow = FlatAssessmentRow & {
  displayDomain: string
  displayL1: string
  displayL2: string
  displayL3: string
}

const ProcessDataTable = (props: any) => {
  const { data, isBulkMode = false, rowSelection, onRowSelectionChange } = props
  const [isSharedServiceOpen, setIsSharedServiceOpen] = useState(false)
  const [isBUOpen, setIsBUOpen] = useState(false)
  const [isDigitalTeamOpen, setIsDigitalTeamOpen] = useState(false)
  const [selectedRowId, setSelectedRowId] = useState('')

  const columns = useMemo(
    () =>
      getProcessTableColumns({
        onDescChanged: () => {},
        onCentrallyGovernedProcessChanged: () => {},
        onBUExpand: (rowId: string) => {
          setIsBUOpen(true)
          setSelectedRowId(rowId)
        },
        onDigitalTeamExpand: (rowId: string) => {
          setSelectedRowId(rowId)
          setIsDigitalTeamOpen(true)
        },
        onExpandSharedServices: (rowId: string) => {
          setSelectedRowId(rowId)
          setIsSharedServiceOpen(true)
        },
        isBulkMode,
      }),
    [isBulkMode],
  )
  const [updatedDataTable, setUpdatedDataTable] = useState(data) // changed every time user edit table values
  useEffect(() => {
    setUpdatedDataTable(data)
  }, [data])

  /** Updates a draft row field as the user types */
  const handleUpdateDraftRow = useCallback((id: string, field: string, value: string) => {
    setUpdatedDataTable((prev: any) =>
      prev.map((row: any) => (row.id === id ? { ...row, [field]: value } : row)),
    )
  }, [])

  return (
    <div className="table-hierarchy">
      <DataTable
        columns={columns}
        data={updatedDataTable}
        density="compact"
        rowSelection={isBulkMode ? rowSelection : undefined}
        onRowSelectionChange={isBulkMode ? onRowSelectionChange : undefined}
        getRowId={(row: any) => row.id}
        tableMeta={{
          onUpdateDraftRow: handleUpdateDraftRow,
        }}
      />

      {/* side panels */}
      <SharedServicesSheet
        open={isSharedServiceOpen}
        handleOpenChange={() => setIsSharedServiceOpen(false)}
      />

      <BUSheet
        open={isBUOpen}
        handleOpenChange={(newVal: any) => {
          setIsBUOpen(false)
          console.log('BU sheet open state changed:', newVal)
        }}
      />

      <DigitalTeamSheet
        open={isDigitalTeamOpen}
        handleOpenChange={(newVal: any) => {
          setIsDigitalTeamOpen(false)
          handleUpdateDraftRow(selectedRowId, 'responsibleDigitalTeam', newVal || [])
        }}
      />
    </div>
  )
}

export default ProcessDataTable
