import qualityReportData from '../data/data_quality_report.json'
import { ChevronLeft } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SummaryCard } from '../componenets/SummaryCard'
import { ProgressBar } from '../componenets/ProgressBar'
import CircularProgressCard from '../componenets/CircularProgressCard'
import CompanyFilterMenu from '../componenets/CompanyFilterMenu'
import { exportToExcel } from '../utils/exportToExcel'
import excelSvg from '../../../assets/icons/excel.svg'

type QualitySummary = {
  last_quality_review_date: string
  number_of_processes_reviewed: number
  data_quality_score: string
  fully_populated_processes: string
  processes_with_accurate_data: string
  processes_without_inconsistencies: string
  top_3_domains_with_most_issues: string[]
  top_3_domains_with_least_issues: string[]
}

type QualityTableRow = {
  Domain: string
  'Processes Reviewed': number
  '% Of Fully Populated Processes': string
  '% of Processes with Accurate Data': string
  '% of Processes without Inconsistencies': string
  'Data Quality Score': string
}

type QualityReportJson = {
  title: string
  company: string
  summary: QualitySummary
  table: {
    columns: string[]
    rows: QualityTableRow[]
  }
  ui_filters: {
    company_selector_button: string
    dropdown_value: string
  }
  footer: string
}

type DomainQualityRow = {
  domain: string
  processesReviewed: number
  fullyPopulated: number
  accurateData: number
  withoutInconsistencies: number
  qualityScore: number
}

const report = qualityReportData as QualityReportJson

const parsePercent = (value: string) => Number(String(value).replace('%', '').trim() || 0)

const formatPercent = (value: number) => `${Math.round(value)}%`

const avg = (arr: number[]) =>
  arr.length ? arr.reduce((sum, value) => sum + value, 0) / arr.length : 0

const normalizeRow = (row: QualityTableRow): DomainQualityRow => ({
  domain: row.Domain,
  processesReviewed: Number(row['Processes Reviewed'] || 0),
  fullyPopulated: parsePercent(row['% Of Fully Populated Processes']),
  accurateData: parsePercent(row['% of Processes with Accurate Data']),
  withoutInconsistencies: parsePercent(row['% of Processes without Inconsistencies']),
  qualityScore: parsePercent(row['Data Quality Score']),
})

const getScoreBadgeStyles = (score: number) => {
  if (score >= 75) return 'bg-[#ECFDF3] text-[#027A48]'
  if (score >= 60) return 'bg-[#FFFAEB] text-[#B54708]'
  return 'bg-[#FEF3F2] text-[#B42318]'
}

const DataQualityReportPage = () => {
  const navigate = useNavigate()

  const rows = useMemo(() => (report.table.rows || []).map(normalizeRow), [])

  const [selectedDomain, setSelectedDomain] = useState<string>('All')

  const domains = useMemo(() => {
    const unique = [...new Set(rows.map((item) => item.domain))].filter(Boolean)
    return ['All', ...unique]
  }, [rows])

  const filteredRows = useMemo(() => {
    if (selectedDomain === 'All') return rows
    return rows.filter((item) => item.domain === selectedDomain)
  }, [rows, selectedDomain])

  const summary = useMemo(() => {
    const totalReviewed = filteredRows.reduce((sum, row) => sum + row.processesReviewed, 0)
    const avgFullyPopulated = avg(filteredRows.map((row) => row.fullyPopulated))
    const avgAccurateData = avg(filteredRows.map((row) => row.accurateData))
    const avgWithoutInconsistencies = avg(filteredRows.map((row) => row.withoutInconsistencies))
    const avgQualityScore = avg(filteredRows.map((row) => row.qualityScore))

    const strongestDomain = [...filteredRows].sort((a, b) => b.qualityScore - a.qualityScore)[0]
    const weakestDomain = [...filteredRows].sort((a, b) => a.qualityScore - b.qualityScore)[0]

    return {
      totalReviewed,
      avgFullyPopulated,
      avgAccurateData,
      avgWithoutInconsistencies,
      avgQualityScore,
      strongestDomain,
      weakestDomain,
    }
  }, [filteredRows])

  const strongestDomains = useMemo(() => {
    return [...filteredRows].sort((a, b) => b.qualityScore - a.qualityScore).slice(0, 3)
  }, [filteredRows])

  const weakestDomains = useMemo(() => {
    return [...filteredRows].sort((a, b) => a.qualityScore - b.qualityScore).slice(0, 3)
  }, [filteredRows])

  const handleExport = async () => {
    await exportToExcel({
      fileName: 'data-quality-report',
      sheetName: 'Data Quality',
      title: report.title,
      data: filteredRows,
      columns: [
        { header: 'Domain', key: 'domain', width: 36 },
        { header: 'Processes Reviewed', key: 'processesReviewed', width: 20 },
        {
          header: 'Fully Populated Processes',
          key: 'fullyPopulated',
          width: 22,
          formatter: (value) => formatPercent(value),
        },
        {
          header: 'Processes with Accurate Data',
          key: 'accurateData',
          width: 24,
          formatter: (value) => formatPercent(value),
        },
        {
          header: 'Processes without Inconsistencies',
          key: 'withoutInconsistencies',
          width: 28,
          formatter: (value) => formatPercent(value),
        },
        {
          header: 'Data Quality Score',
          key: 'qualityScore',
          width: 18,
          formatter: (value) => formatPercent(value),
        },
      ],
    })
  }

  return (
    <div className="min-h-screen p-6">
      <div className="align-center mx-auto max-w-[1440px]">
        <div className="mb-6 flex items-center justify-between">
          <div className="mb-6 flex w-full items-center justify-between">
            <div className="flex w-full items-center justify-between gap-5">
              <div className="flex items-center gap-3">
                <button onClick={() => navigate('/reports-and-extracts')}>
                  <ChevronLeft className="h-5 w-5 text-[#344054]" />
                </button>
                <h1 className="text-[24px] font-[700] tracking-[-0.5px] text-[#101828]">
                  {report.title}
                </h1>
                <CompanyFilterMenu
                  options={domains}
                  value={selectedDomain}
                  onChange={setSelectedDomain}
                />
              </div>
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
            title="Last Quality Review"
            value={report.summary.last_quality_review_date}
            subtitle={`${report.company}`}
          />
          <SummaryCard
            title="Processes Reviewed"
            value={summary.totalReviewed}
            subtitle={`${filteredRows.length} domain(s)`}
          />
          <SummaryCard
            title="Overall Data Quality Score"
            value={formatPercent(summary.avgQualityScore)}
            subtitle="Average for selected view"
          />
          <SummaryCard
            title="Fully Populated Processes"
            value={formatPercent(summary.avgFullyPopulated)}
            subtitle="Average completeness"
          />
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 xl:grid-cols-4">
          <CircularProgressCard
            title="Data Quality Score"
            value={Math.round(summary.avgQualityScore)}
            color="#5878E8"
          />
          <CircularProgressCard
            title="Accurate Data"
            value={Math.round(summary.avgAccurateData)}
            color="#12B76A"
          />
          <CircularProgressCard
            title="Without Inconsistencies"
            value={Math.round(summary.avgWithoutInconsistencies)}
            color="#4EF1E4"
          />
          <CircularProgressCard
            title="Fully Populated"
            value={Math.round(summary.avgFullyPopulated)}
            color="#6D57CA"
          />
        </div>

        <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
          <div className="rounded-3xl border border-[#E6EAF0] bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-[#101828]">Quality Dimensions</h2>
              <span className="rounded-full bg-[#F2F4F7] px-3 py-1 text-xs font-medium text-[#344054]">
                Selected view
              </span>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl bg-[#F8FAFC] p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm text-[#667085]">Fully Populated Processes</span>
                  <span className="text-sm font-medium text-[#101828]">
                    {formatPercent(summary.avgFullyPopulated)}
                  </span>
                </div>
                <ProgressBar value={summary.avgFullyPopulated} />
              </div>

              <div className="rounded-2xl bg-[#F8FAFC] p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm text-[#667085]">Processes with Accurate Data</span>
                  <span className="text-sm font-medium text-[#101828]">
                    {formatPercent(summary.avgAccurateData)}
                  </span>
                </div>
                <ProgressBar value={summary.avgAccurateData} />
              </div>

              <div className="rounded-2xl bg-[#F8FAFC] p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm text-[#667085]">Processes without Inconsistencies</span>
                  <span className="text-sm font-medium text-[#101828]">
                    {formatPercent(summary.avgWithoutInconsistencies)}
                  </span>
                </div>
                <ProgressBar value={summary.avgWithoutInconsistencies} />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-[#E6EAF0] bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-[#101828]">Quality Highlights</h2>

            <div className="space-y-4">
              <div className="rounded-2xl border border-[#D1FADF] bg-[#F6FEF9] p-4">
                <p className="mb-1 text-sm text-[#027A48]">Strongest domain</p>
                <p className="text-base font-semibold text-[#101828]">
                  {summary.strongestDomain?.domain || '-'}
                </p>
                <p className="mt-1 text-sm text-[#667085]">
                  Score: {formatPercent(summary.strongestDomain?.qualityScore || 0)}
                </p>
              </div>

              <div className="rounded-2xl border border-[#FECACA] bg-[#FEF3F2] p-4">
                <p className="mb-1 text-sm text-[#B42318]">Weakest domain</p>
                <p className="text-base font-semibold text-[#101828]">
                  {summary.weakestDomain?.domain || '-'}
                </p>
                <p className="mt-1 text-sm text-[#667085]">
                  Score: {formatPercent(summary.weakestDomain?.qualityScore || 0)}
                </p>
              </div>

              <div className="rounded-2xl bg-[#F8FAFC] p-4">
                <p className="mb-2 text-sm font-medium text-[#344054]">
                  Top 3 domains with most issues
                </p>
                <div className="flex flex-wrap gap-2">
                  {report.summary.top_3_domains_with_most_issues.map((domain) => (
                    <span
                      key={domain}
                      className="rounded-full bg-[#FEF3F2] px-3 py-1 text-xs font-medium text-[#B42318]"
                    >
                      {domain}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl bg-[#F8FAFC] p-4">
                <p className="mb-2 text-sm font-medium text-[#344054]">
                  Top 3 domains with least issues
                </p>
                <div className="flex flex-wrap gap-2">
                  {report.summary.top_3_domains_with_least_issues.map((domain) => (
                    <span
                      key={domain}
                      className="rounded-full bg-[#ECFDF3] px-3 py-1 text-xs font-medium text-[#027A48]"
                    >
                      {domain}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
          <div className="rounded-3xl border border-[#E6EAF0] bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-[#101828]">Top Performing Domains</h2>

            <div className="space-y-3">
              {strongestDomains.map((item, index) => (
                <div
                  key={item.domain}
                  className="flex items-center justify-between rounded-2xl border border-[#EAECF0] p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ECFDF3] font-semibold text-[#027A48]">
                      {index + 1}
                    </div>

                    <div>
                      <p className="font-medium text-[#101828]">{item.domain}</p>
                      <p className="text-sm text-[#667085]">
                        {item.processesReviewed} processes reviewed
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-semibold text-[#101828]">
                      {formatPercent(item.qualityScore)}
                    </p>
                    <p className="text-sm text-[#98A2B3]">quality score</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-[#E6EAF0] bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-[#101828]">Domains Needing Attention</h2>

            <div className="space-y-3">
              {weakestDomains.map((item, index) => (
                <div
                  key={item.domain}
                  className="flex items-center justify-between rounded-2xl border border-[#EAECF0] p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FEF3F2] font-semibold text-[#B42318]">
                      {index + 1}
                    </div>

                    <div>
                      <p className="font-medium text-[#101828]">{item.domain}</p>
                      <p className="text-sm text-[#667085]">
                        {item.processesReviewed} processes reviewed
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-semibold text-[#101828]">
                      {formatPercent(item.qualityScore)}
                    </p>
                    <p className="text-sm text-[#98A2B3]">quality score</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-[#E6EAF0] bg-white shadow-sm">
          <div className="border-b border-[#EAECF0] px-6 py-5">
            <h2 className="text-xl font-semibold text-[#101828]">Domain Quality Breakdown</h2>
            <p className="mt-1 text-sm text-[#667085]">
              Detailed view of domain-level quality review results for completeness, accuracy,
              consistency, and overall quality score.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-[#F8FAFC]">
                <tr className="text-left text-sm text-[#667085]">
                  <th className="px-6 py-4 font-medium">Domain</th>
                  <th className="px-6 py-4 font-medium">Processes Reviewed</th>
                  <th className="px-6 py-4 font-medium">Fully Populated</th>
                  <th className="px-6 py-4 font-medium">Accurate Data</th>
                  <th className="px-6 py-4 font-medium">No Inconsistencies</th>
                  <th className="px-6 py-4 font-medium">Quality Score</th>
                </tr>
              </thead>

              <tbody>
                {filteredRows.map((row) => (
                  <tr key={row.domain} className="border-t border-[#EAECF0] text-sm text-[#101828]">
                    <td className="px-6 py-4 font-medium">{row.domain}</td>
                    <td className="px-6 py-4">{row.processesReviewed}</td>

                    <td className="px-6 py-4">
                      <div className="min-w-[140px]">
                        <div className="mb-1 text-xs text-[#667085]">
                          {formatPercent(row.fullyPopulated)}
                        </div>
                        <ProgressBar value={row.fullyPopulated} />
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="min-w-[140px]">
                        <div className="mb-1 text-xs text-[#667085]">
                          {formatPercent(row.accurateData)}
                        </div>
                        <ProgressBar value={row.accurateData} />
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="min-w-[140px]">
                        <div className="mb-1 text-xs text-[#667085]">
                          {formatPercent(row.withoutInconsistencies)}
                        </div>
                        <ProgressBar value={row.withoutInconsistencies} />
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getScoreBadgeStyles(
                          row.qualityScore,
                        )}`}
                      >
                        {formatPercent(row.qualityScore)}
                      </span>
                    </td>
                  </tr>
                ))}

                {!filteredRows.length && (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-sm text-[#667085]">
                      No data available for the selected filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="border-t border-[#EAECF0] px-6 py-4 text-xs text-[#98A2B3]">
            {report.footer}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DataQualityReportPage
