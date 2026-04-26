import assessmentData from '../data/assessment_progress_detailed_l4.json'
import { ChevronLeft } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SummaryCard } from '../componenets/SummaryCard'
import { ProgressBar } from '../componenets/ProgressBar'
import CircularProgressCard from '../componenets/CircularProgressCard'
import CompanyFilterMenu from '../componenets/CompanyFilterMenu'
import { exportToExcel } from '../utils/exportToExcel'
import { formatNumber, formatPercentFromDecimal } from '../utils/exportFormatters'
import excelSvg from '../../../assets/icons/excel.svg'
type RawAssessmentRow = {
  'Group Company': string | null
  'Business Domain': string | null
  'Number of Applicable L4 Business Processes': number | null
  'Number of L4 Business Processes in Draft State': number | null
  'Number of L4 Processes in Quality Review State': number | null
  'Number of L4 Processes in Digital VP Sign-Off State': number | null
  'Number of processes  Reviewed (Since date selected)': number | null
  'Number of processes  Re-assesed (Since date selected)': number | null
  'Number of Processes with Target Automation update (Since date Selected)': number | null
  'Automation Parameters Data Completion (%)': number | null
  'Manual Operations Parameters Data Completion (%)': number | null
  'Automation Level (%)': number | null
  'Target Automation Level (%)': number | null
  'Cost of Manual effort , kAED': number | null
  'Number of L3 Processes detailed with L4 Processes': number | null
}

type AssessmentJson = {
  workbook: string
  worksheet: string
  title: string
  purpose: string
  filters: string
  data_start_row: number
  record_count: number
  records: RawAssessmentRow[]
}

type AssessmentRow = {
  groupCompany: string
  businessDomain: string
  applicableL4: number
  draft: number
  qualityReview: number
  vpSignOff: number
  reviewedSinceDate: number
  reassessedSinceDate: number
  targetAutomationUpdatedSinceDate: number
  automationParamsCompletion: number
  manualOpsCompletion: number
  automationLevel: number
  targetAutomationLevel: number
  manualEffortCost: number
  l3ProcessesDetailedWithL4: number
}

const report = assessmentData as AssessmentJson

const avg = (arr: number[]) =>
  arr.length ? arr.reduce((sum, value) => sum + value, 0) / arr.length : 0

const percent = (value: number) => `${Math.round(value * 100)}%`

const isValidDataRow = (row: RawAssessmentRow) => {
  const groupCompany = row['Group Company']
  const businessDomain = row['Business Domain']
  const applicable = row['Number of Applicable L4 Business Processes']

  return (
    typeof groupCompany === 'string' &&
    groupCompany.trim() !== '' &&
    typeof businessDomain === 'string' &&
    businessDomain.trim() !== '' &&
    typeof applicable === 'number'
  )
}

const normalizeRow = (row: RawAssessmentRow): AssessmentRow => ({
  groupCompany: row['Group Company']?.trim() || '',
  businessDomain: row['Business Domain']?.trim() || '',
  applicableL4: Number(row['Number of Applicable L4 Business Processes'] || 0),
  draft: Number(row['Number of L4 Business Processes in Draft State'] || 0),
  qualityReview: Number(row['Number of L4 Processes in Quality Review State'] || 0),
  vpSignOff: Number(row['Number of L4 Processes in Digital VP Sign-Off State'] || 0),
  reviewedSinceDate: Number(row['Number of processes  Reviewed (Since date selected)'] || 0),
  reassessedSinceDate: Number(row['Number of processes  Re-assesed (Since date selected)'] || 0),
  targetAutomationUpdatedSinceDate: Number(
    row['Number of Processes with Target Automation update (Since date Selected)'] || 0,
  ),
  automationParamsCompletion: Number(row['Automation Parameters Data Completion (%)'] || 0),
  manualOpsCompletion: Number(row['Manual Operations Parameters Data Completion (%)'] || 0),
  automationLevel: Number(row['Automation Level (%)'] || 0),
  targetAutomationLevel: Number(row['Target Automation Level (%)'] || 0),
  manualEffortCost: Number(row['Cost of Manual effort , kAED'] || 0),
  l3ProcessesDetailedWithL4: Number(row['Number of L3 Processes detailed with L4 Processes'] || 0),
})

const AssessmentProgressDetailedL4Page = () => {
  const navigate = useNavigate()

  const rows = useMemo(() => (report.records || []).filter(isValidDataRow).map(normalizeRow), [])

  const [selectedCompany, setSelectedCompany] = useState<string>('All')

  const companies = useMemo(() => {
    const unique = [...new Set(rows.map((item) => item.groupCompany))].filter(Boolean)
    return ['All', ...unique]
  }, [rows])

  const filteredRows = useMemo(() => {
    return rows.filter((item) => {
      const matchesCompany = selectedCompany === 'All' || item.groupCompany === selectedCompany

      return matchesCompany
    })
  }, [rows, selectedCompany])

  const summary = useMemo(() => {
    const totalApplicable = filteredRows.reduce((sum, row) => sum + row.applicableL4, 0)
    const totalDraft = filteredRows.reduce((sum, row) => sum + row.draft, 0)
    const totalQualityReview = filteredRows.reduce((sum, row) => sum + row.qualityReview, 0)
    const totalVpSignOff = filteredRows.reduce((sum, row) => sum + row.vpSignOff, 0)
    const totalReviewed = filteredRows.reduce((sum, row) => sum + row.reviewedSinceDate, 0)
    const totalReassessed = filteredRows.reduce((sum, row) => sum + row.reassessedSinceDate, 0)
    const totalTargetUpdated = filteredRows.reduce(
      (sum, row) => sum + row.targetAutomationUpdatedSinceDate,
      0,
    )
    const totalDetailedCoverage = filteredRows.reduce(
      (sum, row) => sum + row.l3ProcessesDetailedWithL4,
      0,
    )
    const totalCost = filteredRows.reduce((sum, row) => sum + row.manualEffortCost, 0)

    const avgAutomationParams = avg(filteredRows.map((row) => row.automationParamsCompletion))
    const avgManualOpsParams = avg(filteredRows.map((row) => row.manualOpsCompletion))
    const avgAutomationLevel = avg(filteredRows.map((row) => row.automationLevel))
    const avgTargetAutomationLevel = avg(filteredRows.map((row) => row.targetAutomationLevel))

    const coverageRate =
      totalApplicable > 0 ? Math.round((totalDetailedCoverage / totalApplicable) * 100) : 0

    const reassessmentRate =
      totalApplicable > 0 ? Math.round((totalReassessed / totalApplicable) * 100) : 0

    return {
      totalApplicable,
      totalDraft,
      totalQualityReview,
      totalVpSignOff,
      totalReviewed,
      totalReassessed,
      totalTargetUpdated,
      totalDetailedCoverage,
      totalCost,
      avgAutomationParams,
      avgManualOpsParams,
      avgAutomationLevel,
      avgTargetAutomationLevel,
      coverageRate,
      reassessmentRate,
    }
  }, [filteredRows])

  const topDomainsByReassessed = useMemo(() => {
    return [...filteredRows]
      .sort((a, b) => b.reassessedSinceDate - a.reassessedSinceDate)
      .slice(0, 5)
  }, [filteredRows])
  const handleExport = async () => {
    await exportToExcel({
      fileName: 'assessment-progress-detailed-l4',
      sheetName: 'Assessment Progress L4',
      title: 'Assessment Progress Detailed L4',
      data: filteredRows,
      columns: [
        { header: 'Business Domain', key: 'businessDomain', width: 28 },
        { header: 'Group Company', key: 'groupCompany', width: 20 },
        { header: 'Applicable L4', key: 'applicableL4', width: 18 },
        { header: 'Draft', key: 'draft', width: 14 },
        { header: 'Quality Review', key: 'qualityReview', width: 18 },
        { header: 'VP Sign-Off', key: 'vpSignOff', width: 16 },
        { header: 'Reviewed Since Date', key: 'reviewedSinceDate', width: 20 },
        { header: 'Reassessed Since Date', key: 'reassessedSinceDate', width: 22 },
        {
          header: 'Automation Level',
          key: 'automationLevel',
          width: 18,
          formatter: (value) => formatPercentFromDecimal(value),
        },
        {
          header: 'Target Automation Level',
          key: 'targetAutomationLevel',
          width: 22,
          formatter: (value) => formatPercentFromDecimal(value),
        },
        {
          header: 'Manual Effort Cost (kAED)',
          key: 'manualEffortCost',
          width: 22,
          formatter: (value) => formatNumber(value),
        },
      ],
    })
  }

  return (
    <div className="min-h-screen p-6">
      <div className="align-center mx-auto max-w-[1440px]">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex w-full items-center justify-between gap-5">
            <div className="flex items-center gap-3">
              <button onClick={() => navigate('/reports-and-extracts')}>
                <ChevronLeft className="h-5 w-5 text-[#344054]" />
              </button>
              <h1 className="text-[24px] font-[700] tracking-[-0.5px] text-[#101828]">
                Assessment Progress Detailed L4
              </h1>
              <CompanyFilterMenu
                options={companies}
                value={selectedCompany}
                onChange={(value) => {
                  setSelectedCompany(value)
                }}
              />
            </div>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 text-sm font-medium text-[#0047BA] hover:underline"
            >
              <img src={excelSvg} alt="excel" className="h-4 w-4" />
              Export
            </button>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            title="Applicable L4 Processes"
            value={formatNumber(summary.totalApplicable)}
            subtitle={`${filteredRows.length} row(s) shown`}
          />
          <SummaryCard
            title="Reassessed Since Date"
            value={formatNumber(summary.totalReassessed)}
            subtitle={`${summary.reassessmentRate}% of applicable`}
          />
          <SummaryCard
            title="Reviewed Since Date"
            value={formatNumber(summary.totalReviewed)}
            subtitle={`${formatNumber(summary.totalTargetUpdated)} target updates`}
          />
          <SummaryCard
            title="Manual Effort Cost (kAED)"
            value={formatNumber(summary.totalCost)}
            subtitle="Aggregated cost"
          />
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 xl:grid-cols-4">
          <CircularProgressCard
            title="L4 Coverage from L3"
            value={summary.coverageRate}
            color="#12B76A"
          />
          <CircularProgressCard
            title="Automation Parameters Completion"
            value={Math.round(summary.avgAutomationParams * 100)}
            color="#4EF1E4"
          />
          <CircularProgressCard
            title="Manual Operations Completion"
            value={Math.round(summary.avgManualOpsParams * 100)}
            color="#6D57CA"
          />
          <CircularProgressCard
            title="Current Automation Level"
            value={Math.round(summary.avgAutomationLevel * 100)}
            color="#5878E8"
          />
        </div>

        <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
          <div className="rounded-3xl border border-[#E6EAF0] bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-[#101828]">Workflow Status</h2>
              <p className="text-sm text-[#667085]">
                Target Avg: {Math.round(summary.avgTargetAutomationLevel * 100)}%
              </p>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl bg-[#F8FAFC] p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm text-[#667085]">Draft</span>
                  <span className="text-sm font-medium text-[#101828]">{summary.totalDraft}</span>
                </div>
                <ProgressBar
                  value={
                    summary.totalApplicable
                      ? (summary.totalDraft / summary.totalApplicable) * 100
                      : 0
                  }
                />
              </div>

              <div className="rounded-2xl bg-[#F8FAFC] p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm text-[#667085]">Quality Review</span>
                  <span className="text-sm font-medium text-[#101828]">
                    {summary.totalQualityReview}
                  </span>
                </div>
                <ProgressBar
                  value={
                    summary.totalApplicable
                      ? (summary.totalQualityReview / summary.totalApplicable) * 100
                      : 0
                  }
                />
              </div>

              <div className="rounded-2xl bg-[#F8FAFC] p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm text-[#667085]">Digital VP Sign-Off</span>
                  <span className="text-sm font-medium text-[#101828]">
                    {summary.totalVpSignOff}
                  </span>
                </div>
                <ProgressBar
                  value={
                    summary.totalApplicable
                      ? (summary.totalVpSignOff / summary.totalApplicable) * 100
                      : 0
                  }
                />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-[#E6EAF0] bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-[#101828]">
              Top Domains by Reassessed Processes
            </h2>

            <div className="space-y-3">
              {topDomainsByReassessed.map((item, index) => (
                <div
                  key={`${item.groupCompany}-${item.businessDomain}`}
                  className="flex items-center justify-between rounded-2xl border border-[#EAECF0] p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F2F4F7] font-semibold text-[#344054]">
                      {index + 1}
                    </div>

                    <div>
                      <p className="font-medium text-[#101828]">{item.businessDomain}</p>
                      <p className="text-sm text-[#667085]">{item.groupCompany}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-semibold text-[#101828]">
                      {item.reassessedSinceDate}
                    </p>
                    <p className="text-sm text-[#98A2B3]">reassessed</p>
                  </div>
                </div>
              ))}

              {!topDomainsByReassessed.length && (
                <div className="rounded-2xl border border-dashed border-[#D0D5DD] p-6 text-center text-sm text-[#667085]">
                  No rows available for the current filters.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-[#E6EAF0] bg-white shadow-sm">
          <div className="border-b border-[#EAECF0] px-6 py-5">
            <h2 className="text-xl font-semibold text-[#101828]">L4 Domain Breakdown</h2>
            <p className="mt-1 text-sm text-[#667085]">
              Detailed view of reassessment activity, workflow progress, automation levels, and
              manual effort by business domain.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-[#F8FAFC]">
                <tr className="text-left text-sm text-[#667085]">
                  <th className="px-6 py-4 font-medium">Business Domain</th>
                  <th className="px-6 py-4 font-medium">Group Company</th>
                  <th className="px-6 py-4 font-medium">Applicable L4</th>
                  <th className="px-6 py-4 font-medium">Reviewed</th>
                  <th className="px-6 py-4 font-medium">Reassessed</th>
                  <th className="px-6 py-4 font-medium">Target Updates</th>
                  <th className="px-6 py-4 font-medium">Draft</th>
                  <th className="px-6 py-4 font-medium">Q. Review</th>
                  <th className="px-6 py-4 font-medium">VP Sign-Off</th>
                  <th className="px-6 py-4 font-medium">Automation</th>
                  <th className="px-6 py-4 font-medium">Target</th>
                  <th className="px-6 py-4 font-medium">Cost</th>
                </tr>
              </thead>

              <tbody>
                {filteredRows.map((row) => (
                  <tr
                    key={`${row.groupCompany}-${row.businessDomain}`}
                    className="border-t border-[#EAECF0] text-sm text-[#101828]"
                  >
                    <td className="px-6 py-4 font-medium">{row.businessDomain}</td>
                    <td className="px-6 py-4">{row.groupCompany}</td>
                    <td className="px-6 py-4">{row.applicableL4}</td>
                    <td className="px-6 py-4">{row.reviewedSinceDate}</td>
                    <td className="px-6 py-4">{row.reassessedSinceDate}</td>
                    <td className="px-6 py-4">{row.targetAutomationUpdatedSinceDate}</td>
                    <td className="px-6 py-4">{row.draft}</td>
                    <td className="px-6 py-4">{row.qualityReview}</td>
                    <td className="px-6 py-4">{row.vpSignOff}</td>

                    <td className="px-6 py-4">
                      <div className="min-w-[140px]">
                        <div className="mb-1 text-xs text-[#667085]">
                          {percent(row.automationLevel)}
                        </div>
                        <ProgressBar value={row.automationLevel * 100} />
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="min-w-[140px]">
                        <div className="mb-1 text-xs text-[#667085]">
                          {percent(row.targetAutomationLevel)}
                        </div>
                        <ProgressBar value={row.targetAutomationLevel * 100} />
                      </div>
                    </td>

                    <td className="px-6 py-4">{formatNumber(row.manualEffortCost)}</td>
                  </tr>
                ))}

                {!filteredRows.length && (
                  <tr>
                    <td colSpan={12} className="px-6 py-10 text-center text-sm text-[#667085]">
                      No data available for the selected filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AssessmentProgressDetailedL4Page
