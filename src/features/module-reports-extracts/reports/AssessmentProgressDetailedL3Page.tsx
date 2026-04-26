import assessmentData from '../data/assessment_progress_detailed_l3.json'
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
type AssessmentRow = {
  group_company: string
  business_domain: string
  number_of_applicable_l3_business_processes: number
  number_of_l3_processes_detailed_with_l4_processes: number
  number_of_l3_business_processes_in_draft_state: number
  number_of_l3_processes_in_quality_review_state: number
  number_of_l3_processes_in_digital_vp_sign_off_state: number
  number_of_processes_reviewed_since_date_selected: number
  number_of_processes_re_assesed_since_date_selected: number
  number_of_processes_with_target_automation_update_since_date_selected: number
  automation_parameters_data_completion: number
  manual_operations_parameters_data_completion: number
  automation_level: number
  target_automation_level: number
  cost_of_manual_effort_kaed: number
}

type AssessmentJson = {
  sheet_name: string
  source_file: string
  record_count: number
  data: AssessmentRow[]
}

const report = assessmentData as AssessmentJson

const percent = (value: number) => `${Math.round(value * 100)}%`

const avg = (arr: number[]) =>
  arr.length ? arr.reduce((sum, value) => sum + value, 0) / arr.length : 0

const AssessmentProgressDetailedL3Page = () => {
  const navigate = useNavigate()
  const rows = report.data || []

  const [selectedCompany, setSelectedCompany] = useState<string>('All')

  const companies = useMemo(() => {
    const unique = [...new Set(rows.map((item) => item.group_company))].filter(Boolean)
    return ['All', ...unique]
  }, [rows])

  const filteredRows = useMemo(() => {
    if (selectedCompany === 'All') return rows
    return rows.filter((item) => item.group_company === selectedCompany)
  }, [rows, selectedCompany])

  const summary = useMemo(() => {
    const totalApplicable = filteredRows.reduce(
      (sum, row) => sum + row.number_of_applicable_l3_business_processes,
      0,
    )

    const totalDetailed = filteredRows.reduce(
      (sum, row) => sum + row.number_of_l3_processes_detailed_with_l4_processes,
      0,
    )

    const totalDraft = filteredRows.reduce(
      (sum, row) => sum + row.number_of_l3_business_processes_in_draft_state,
      0,
    )

    const totalQualityReview = filteredRows.reduce(
      (sum, row) => sum + row.number_of_l3_processes_in_quality_review_state,
      0,
    )

    const totalVpSignOff = filteredRows.reduce(
      (sum, row) => sum + row.number_of_l3_processes_in_digital_vp_sign_off_state,
      0,
    )

    const avgAutomationParams = avg(
      filteredRows.map((row) => row.automation_parameters_data_completion),
    )

    const avgManualOpsParams = avg(
      filteredRows.map((row) => row.manual_operations_parameters_data_completion),
    )

    const avgAutomationLevel = avg(filteredRows.map((row) => row.automation_level))
    const avgTargetAutomationLevel = avg(filteredRows.map((row) => row.target_automation_level))

    const totalCost = filteredRows.reduce((sum, row) => sum + row.cost_of_manual_effort_kaed, 0)

    const completionRate =
      totalApplicable > 0 ? Math.round((totalDetailed / totalApplicable) * 100) : 0

    return {
      totalApplicable,
      totalDetailed,
      totalDraft,
      totalQualityReview,
      totalVpSignOff,
      avgAutomationParams,
      avgManualOpsParams,
      avgAutomationLevel,
      avgTargetAutomationLevel,
      totalCost,
      completionRate,
    }
  }, [filteredRows])

  const topDomainsByDetailed = useMemo(() => {
    return [...filteredRows]
      .sort(
        (a, b) =>
          b.number_of_l3_processes_detailed_with_l4_processes -
          a.number_of_l3_processes_detailed_with_l4_processes,
      )
      .slice(0, 3)
  }, [filteredRows])

  const handleExport = async () => {
    await exportToExcel({
      fileName: 'assessment-progress-detailed-l3',
      sheetName: 'Assessment Progress L3',
      title: 'Assessment Progress Detailed L3',
      data: filteredRows,
      columns: [
        { header: 'Business Domain', key: 'business_domain', width: 28 },
        { header: 'Group Company', key: 'group_company', width: 20 },
        {
          header: 'Applicable L3 Processes',
          key: 'number_of_applicable_l3_business_processes',
          width: 20,
        },
        {
          header: 'Detailed with L4 Processes',
          key: 'number_of_l3_processes_detailed_with_l4_processes',
          width: 24,
        },
        {
          header: 'Draft State Processes',
          key: 'number_of_l3_business_processes_in_draft_state',
          width: 18,
        },
        {
          header: 'Quality Review Processes',
          key: 'number_of_l3_processes_in_quality_review_state',
          width: 20,
        },
        {
          header: 'Digital VP Sign Off Processes',
          key: 'number_of_l3_processes_in_digital_vp_sign_off_state',
          width: 22,
        },
        {
          header: 'Processes Reviewed Since Selected Date',
          key: 'number_of_processes_reviewed_since_date_selected',
          width: 24,
        },
        {
          header: 'Processes Re-assessed Since Selected Date',
          key: 'number_of_processes_re_assesed_since_date_selected',
          width: 26,
        },
        {
          header: 'Processes with Target Automation Update',
          key: 'number_of_processes_with_target_automation_update_since_date_selected',
          width: 28,
        },
        {
          header: 'Automation Parameters Completion',
          key: 'automation_parameters_data_completion',
          width: 22,
          formatter: (value) => formatPercentFromDecimal(value),
        },
        {
          header: 'Manual Operations Parameters Completion',
          key: 'manual_operations_parameters_data_completion',
          width: 24,
          formatter: (value) => formatPercentFromDecimal(value),
        },
        {
          header: 'Automation Level',
          key: 'automation_level',
          width: 18,
          formatter: (value) => formatPercentFromDecimal(value),
        },
        {
          header: 'Target Automation Level',
          key: 'target_automation_level',
          width: 20,
          formatter: (value) => formatPercentFromDecimal(value),
        },
        {
          header: 'Cost of Manual Effort (kAED)',
          key: 'cost_of_manual_effort_kaed',
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
                Assessment Progress Detailed L3
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
            title="Applicable L3 Processes"
            value={summary.totalApplicable}
            subtitle={`${filteredRows.length} domain(s)`}
          />
          <SummaryCard
            title="Detailed with L4 Processes"
            value={summary.totalDetailed}
            subtitle={`${summary.completionRate}% completion`}
          />
          <SummaryCard title="Draft State Processes" value={summary.totalDraft} />
          <SummaryCard title="Manual Effort Cost (kAED)" value={summary.totalCost} />
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 xl:grid-cols-4">
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
          <CircularProgressCard
            title="Target Automation Level"
            value={Math.round(summary.avgTargetAutomationLevel * 100)}
          />
        </div>

        <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
          <div className="rounded-3xl border border-[#E6EAF0] bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-[#101828]">Workflow Status</h2>

            <div className="space-y-4">
              <div className="rounded-2xl bg-[#F8FAFC] p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm text-[#667085]">In Draft</span>
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
                  <span className="text-sm text-[#667085]">Digital VP Sign Off</span>
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
              Top Domains by L4 Detailed Processes
            </h2>

            <div className="space-y-3">
              {topDomainsByDetailed.map((item, index) => (
                <div
                  key={`${item.group_company}-${item.business_domain}`}
                  className="flex items-center justify-between rounded-2xl border border-[#EAECF0] p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F2F4F7] font-semibold text-[#344054]">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-[#101828]">{item.business_domain}</p>
                      <p className="text-sm text-[#667085]">{item.group_company}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-[#101828]">
                      {item.number_of_l3_processes_detailed_with_l4_processes}
                    </p>
                    <p className="text-sm text-[#98A2B3]">detailed</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-[#E6EAF0] bg-white shadow-sm">
          <div className="border-b border-[#EAECF0] px-6 py-5">
            <h2 className="text-xl font-semibold text-[#101828]">Domain Breakdown</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-[#F8FAFC]">
                <tr className="text-left text-sm text-[#667085]">
                  <th className="px-6 py-4 font-medium">Business Domain</th>
                  <th className="px-6 py-4 font-medium">Group Company</th>
                  <th className="px-6 py-4 font-medium">Applicable</th>
                  <th className="px-6 py-4 font-medium">Detailed</th>
                  <th className="px-6 py-4 font-medium">Draft</th>
                  <th className="px-6 py-4 font-medium">Quality Review</th>
                  <th className="px-6 py-4 font-medium">VP Sign Off</th>
                  <th className="px-6 py-4 font-medium">Automation</th>
                  <th className="px-6 py-4 font-medium">Target</th>
                  <th className="px-6 py-4 font-medium">Effort Cost</th>
                </tr>
              </thead>

              <tbody>
                {filteredRows.map((row) => (
                  <tr
                    key={`${row.group_company}-${row.business_domain}`}
                    className="border-t border-[#EAECF0] text-sm text-[#101828]"
                  >
                    <td className="px-6 py-4 font-medium">{row.business_domain}</td>
                    <td className="px-6 py-4">{row.group_company}</td>
                    <td className="px-6 py-4">{row.number_of_applicable_l3_business_processes}</td>
                    <td className="px-6 py-4">
                      {row.number_of_l3_processes_detailed_with_l4_processes}
                    </td>
                    <td className="px-6 py-4">
                      {row.number_of_l3_business_processes_in_draft_state}
                    </td>
                    <td className="px-6 py-4">
                      {row.number_of_l3_processes_in_quality_review_state}
                    </td>
                    <td className="px-6 py-4">
                      {row.number_of_l3_processes_in_digital_vp_sign_off_state}
                    </td>
                    <td className="px-6 py-4">
                      <div className="min-w-[140px]">
                        <div className="mb-1 flex justify-between text-xs text-[#667085]">
                          <span>{percent(row.automation_level)}</span>
                        </div>
                        <ProgressBar value={row.automation_level * 100} />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="min-w-[140px]">
                        <div className="mb-1 flex justify-between text-xs text-[#667085]">
                          <span>{percent(row.target_automation_level)}</span>
                        </div>
                        <ProgressBar value={row.target_automation_level * 100} />
                      </div>
                    </td>
                    <td className="px-6 py-4">{row.cost_of_manual_effort_kaed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AssessmentProgressDetailedL3Page
