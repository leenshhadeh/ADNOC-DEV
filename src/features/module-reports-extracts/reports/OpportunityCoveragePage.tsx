import opportunityCoverageData from '../data/opportunity_coverage.json'
import { ChevronLeft } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SummaryCard } from '../componenets/SummaryCard'
import { ProgressBar } from '../componenets/ProgressBar'
import CircularProgressCard from '../componenets/CircularProgressCard'
import CompanyFilterMenu from '../componenets/CompanyFilterMenu'
import { exportToExcel } from '../utils/exportToExcel'
import { formatPercentFromDecimal } from '../utils/exportFormatters'
import excelSvg from '../../../assets/icons/excel.svg'

type RawOpportunityRow = {
  GC: string | null
  Domain: string | null
  'Num of Not Fully Automated Business Processes': number | null
  'Num of L3 Process Covered by Opportunities': number | null
  '% of L3 Process Covered by Opportunities': number | null
}

type OpportunityCoverageJson = {
  workbook_name: string
  worksheet_name: string
  title: string
  purpose: string
  filters: string
  record_count: number
  data: RawOpportunityRow[]
}

type OpportunityRow = {
  gc: string
  domain: string
  notFullyAutomated: number
  coveredByOpportunities: number
  coverageRate: number
}

const report = opportunityCoverageData as OpportunityCoverageJson

const avg = (arr: number[]) =>
  arr.length ? arr.reduce((sum, value) => sum + value, 0) / arr.length : 0

const percent = (value: number) => `${Math.round(value * 100)}%`

const formatNumber = (value: number) => new Intl.NumberFormat().format(value)

const isValidDataRow = (row: RawOpportunityRow) => {
  return (
    typeof row.GC === 'string' &&
    row.GC.trim() !== '' &&
    typeof row.Domain === 'string' &&
    row.Domain.trim() !== '' &&
    typeof row['Num of Not Fully Automated Business Processes'] === 'number' &&
    typeof row['Num of L3 Process Covered by Opportunities'] === 'number' &&
    typeof row['% of L3 Process Covered by Opportunities'] === 'number'
  )
}

const normalizeRow = (row: RawOpportunityRow): OpportunityRow => ({
  gc: row.GC?.trim() || '',
  domain: row.Domain?.trim() || '',
  notFullyAutomated: Number(row['Num of Not Fully Automated Business Processes'] || 0),
  coveredByOpportunities: Number(row['Num of L3 Process Covered by Opportunities'] || 0),
  coverageRate: Number(row['% of L3 Process Covered by Opportunities'] || 0),
})

const getCoverageBadgeStyles = (rate: number) => {
  const percentage = rate * 100

  if (percentage >= 70) return 'bg-[#ECFDF3] text-[#027A48]'
  if (percentage >= 50) return 'bg-[#FFFAEB] text-[#B54708]'
  return 'bg-[#FEF3F2] text-[#B42318]'
}

const OpportunityCoveragePage = () => {
  const navigate = useNavigate()

  const rows = useMemo(() => (report.data || []).filter(isValidDataRow).map(normalizeRow), [])

  const [selectedCompany, setSelectedCompany] = useState<string>('All')
  const [selectedDomain, setSelectedDomain] = useState<string>('All')

  const companies = useMemo(() => {
    const unique = [...new Set(rows.map((item) => item.gc))].filter(Boolean)
    return ['All', ...unique]
  }, [rows])

  const filteredRows = useMemo(() => {
    return rows.filter((item) => {
      const matchesCompany = selectedCompany === 'All' || item.gc === selectedCompany
      const matchesDomain = selectedDomain === 'All' || item.domain === selectedDomain

      return matchesCompany && matchesDomain
    })
  }, [rows, selectedCompany, selectedDomain])

  const detailRows = useMemo(() => {
    return filteredRows.filter((row) => row.domain !== 'Aggregated')
  }, [filteredRows])

  const summary = useMemo(() => {
    const totalNotFullyAutomated = filteredRows.reduce((sum, row) => sum + row.notFullyAutomated, 0)

    const totalCovered = filteredRows.reduce((sum, row) => sum + row.coveredByOpportunities, 0)

    const avgCoverage = avg(filteredRows.map((row) => row.coverageRate))

    const weightedCoverage = totalNotFullyAutomated > 0 ? totalCovered / totalNotFullyAutomated : 0

    const uncoveredProcesses = totalNotFullyAutomated - totalCovered

    return {
      totalNotFullyAutomated,
      totalCovered,
      uncoveredProcesses,
      avgCoverage,
      weightedCoverage,
    }
  }, [filteredRows])

  const topCoveredDomains = useMemo(() => {
    return [...detailRows].sort((a, b) => b.coverageRate - a.coverageRate).slice(0, 3)
  }, [detailRows])

  const lowestCoveredDomains = useMemo(() => {
    return [...detailRows].sort((a, b) => a.coverageRate - b.coverageRate).slice(0, 3)
  }, [detailRows])

  const handleExport = async () => {
    await exportToExcel({
      fileName: 'opportunity-coverage',
      sheetName: 'Opportunity Coverage',
      title: 'Opportunity Coverage of Business Processes',
      data: filteredRows,
      columns: [
        { header: 'GC', key: 'gc', width: 20 },
        { header: 'Domain', key: 'domain', width: 30 },
        {
          header: 'Not Fully Automated Processes',
          key: 'notFullyAutomated',
          width: 24,
        },
        {
          header: 'Covered by Opportunities',
          key: 'coveredByOpportunities',
          width: 24,
        },
        {
          header: 'Uncovered Processes',
          key: 'coveredByOpportunities',
          width: 20,
          formatter: (_, row) => row.notFullyAutomated - row.coveredByOpportunities,
        },
        {
          header: 'Coverage Rate',
          key: 'coverageRate',
          width: 16,
          formatter: (value) => formatPercentFromDecimal(value),
        },
      ],
    })
  }

  return (
    <div className="min-h-screen p-6">
      <div className="align-center mx-auto max-w-[1440px]">
        <div className="mb-6 flex items-center justify-between">
          <div className="mb-6 flex w-full items-center justify-between">
            <div className="flex items-center justify-between gap-5">
              <div className="flex items-center gap-3">
                <button onClick={() => navigate('/reports-and-extracts')}>
                  <ChevronLeft className="h-5 w-5 text-[#344054]" />
                </button>
                <h1 className="text-[24px] font-[700] tracking-[-0.5px] text-[#101828]">
                  Opportunity Coverage of Business Processes
                </h1>

                <CompanyFilterMenu
                  options={companies}
                  value={selectedCompany}
                  onChange={(value) => {
                    setSelectedCompany(value)
                    setSelectedDomain('All')
                  }}
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
            title="Not Fully Automated Processes"
            value={formatNumber(summary.totalNotFullyAutomated)}
            subtitle={`${filteredRows.length} row(s) shown`}
          />
          <SummaryCard
            title="Processes Covered by Opportunities"
            value={formatNumber(summary.totalCovered)}
            subtitle={percent(summary.weightedCoverage)}
          />
          <SummaryCard
            title="Uncovered Processes"
            value={formatNumber(summary.uncoveredProcesses)}
            subtitle="Opportunity gap"
          />
          <SummaryCard
            title="Average Coverage"
            value={percent(summary.avgCoverage)}
            subtitle="Average of selected view"
          />
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 xl:grid-cols-4">
          <CircularProgressCard
            title="Weighted Coverage Rate"
            value={Math.round(summary.weightedCoverage * 100)}
            color="#5878E8"
          />
          <CircularProgressCard
            title="Average Domain Coverage"
            value={Math.round(summary.avgCoverage * 100)}
            color="#12B76A"
          />
          <CircularProgressCard
            title="Covered Processes Share"
            value={
              summary.totalNotFullyAutomated
                ? Math.round((summary.totalCovered / summary.totalNotFullyAutomated) * 100)
                : 0
            }
            color="#4EF1E4"
          />
          <CircularProgressCard
            title="Uncovered Processes Share"
            value={
              summary.totalNotFullyAutomated
                ? Math.round((summary.uncoveredProcesses / summary.totalNotFullyAutomated) * 100)
                : 0
            }
            color="#6D57CA"
          />
        </div>

        <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
          <div className="rounded-3xl border border-[#E6EAF0] bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-[#101828]">Coverage Overview</h2>

            <div className="space-y-4">
              <div className="rounded-2xl bg-[#F8FAFC] p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm text-[#667085]">Covered by Opportunities</span>
                  <span className="text-sm font-medium text-[#101828]">
                    {formatNumber(summary.totalCovered)}
                  </span>
                </div>
                <ProgressBar value={summary.weightedCoverage * 100} />
              </div>

              <div className="rounded-2xl bg-[#F8FAFC] p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm text-[#667085]">Not Yet Covered</span>
                  <span className="text-sm font-medium text-[#101828]">
                    {formatNumber(summary.uncoveredProcesses)}
                  </span>
                </div>
                <ProgressBar
                  value={
                    summary.totalNotFullyAutomated
                      ? (summary.uncoveredProcesses / summary.totalNotFullyAutomated) * 100
                      : 0
                  }
                />
              </div>

              <div className="rounded-2xl border border-dashed border-[#D0D5DD] bg-white p-4">
                <p className="text-sm text-[#667085]">
                  This report uses the latest available L3 data to show how much of the process
                  landscape is already mapped to opportunity initiatives.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-[#E6EAF0] bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-[#101828]">Coverage Highlights</h2>

            <div className="space-y-4">
              <div>
                <p className="mb-3 text-sm font-medium text-[#344054]">Best Covered Domains</p>
                <div className="space-y-3">
                  {topCoveredDomains.map((item, index) => (
                    <div
                      key={`${item.gc}-${item.domain}`}
                      className="flex items-center justify-between rounded-2xl border border-[#EAECF0] p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ECFDF3] font-semibold text-[#027A48]">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-[#101828]">{item.domain}</p>
                          <p className="text-sm text-[#667085]">{item.gc}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-lg font-semibold text-[#101828]">
                          {percent(item.coverageRate)}
                        </p>
                        <p className="text-sm text-[#98A2B3]">coverage</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-3 text-sm font-medium text-[#344054]">Lowest Covered Domains</p>
                <div className="space-y-3">
                  {lowestCoveredDomains.map((item, index) => (
                    <div
                      key={`${item.gc}-${item.domain}`}
                      className="flex items-center justify-between rounded-2xl border border-[#EAECF0] p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FEF3F2] font-semibold text-[#B42318]">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-[#101828]">{item.domain}</p>
                          <p className="text-sm text-[#667085]">{item.gc}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-lg font-semibold text-[#101828]">
                          {percent(item.coverageRate)}
                        </p>
                        <p className="text-sm text-[#98A2B3]">coverage</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-[#E6EAF0] bg-white shadow-sm">
          <div className="border-b border-[#EAECF0] px-6 py-5">
            <h2 className="text-xl font-semibold text-[#101828]">Coverage Breakdown</h2>
            <p className="mt-1 text-sm text-[#667085]">
              Detailed domain-level view of non-fully-automated processes, opportunity coverage, and
              uncovered process gaps.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-[#F8FAFC]">
                <tr className="text-left text-sm text-[#667085]">
                  <th className="px-6 py-4 font-medium">Domain</th>
                  <th className="px-6 py-4 font-medium">GC</th>
                  <th className="px-6 py-4 font-medium">Not Fully Automated</th>
                  <th className="px-6 py-4 font-medium">Covered by Opportunities</th>
                  <th className="px-6 py-4 font-medium">Uncovered</th>
                  <th className="px-6 py-4 font-medium">Coverage Progress</th>
                  <th className="px-6 py-4 font-medium">Coverage Rate</th>
                </tr>
              </thead>

              <tbody>
                {filteredRows.map((row) => {
                  const uncovered = row.notFullyAutomated - row.coveredByOpportunities

                  return (
                    <tr
                      key={`${row.gc}-${row.domain}`}
                      className="border-t border-[#EAECF0] text-sm text-[#101828]"
                    >
                      <td className="px-6 py-4 font-medium">{row.domain}</td>
                      <td className="px-6 py-4">{row.gc}</td>
                      <td className="px-6 py-4">{formatNumber(row.notFullyAutomated)}</td>
                      <td className="px-6 py-4">{formatNumber(row.coveredByOpportunities)}</td>
                      <td className="px-6 py-4">{formatNumber(uncovered)}</td>

                      <td className="px-6 py-4">
                        <div className="min-w-[180px]">
                          <div className="mb-1 text-xs text-[#667085]">
                            {percent(row.coverageRate)}
                          </div>
                          <ProgressBar value={row.coverageRate * 100} />
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getCoverageBadgeStyles(
                            row.coverageRate,
                          )}`}
                        >
                          {percent(row.coverageRate)}
                        </span>
                      </td>
                    </tr>
                  )
                })}

                {!filteredRows.length && (
                  <tr>
                    <td colSpan={7} className="px-6 py-10 text-center text-sm text-[#667085]">
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

export default OpportunityCoveragePage
