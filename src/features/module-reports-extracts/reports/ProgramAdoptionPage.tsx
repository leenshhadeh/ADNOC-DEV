import programAdoptionData from '../data/program_adoption.json'
import { ChevronLeft, Users, Briefcase } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SummaryCard } from '../componenets/SummaryCard'
import { ProgressBar } from '../componenets/ProgressBar'
import CircularProgressCard from '../componenets/CircularProgressCard'
import CompanyFilterMenu from '../componenets/CompanyFilterMenu'
import { exportToExcel } from '../utils/exportToExcel'
import { formatPercentFromDecimal } from '../utils/exportFormatters'
import excelSvg from '../../../assets/icons/excel.svg'
type RawProgramAdoptionRow = {
  column_1: string | null
  GC: string | null
  Domain: string | null
  'Num of Targeted digital Stakeholders': number | null
  'Num of Engaged Digital  Stakeholders': number | null
  '% of Digital Stakeholders Engaged': number | null
  'Num of Targeted Business Stakeholders': number | null
  'Num of Engaged Business  Stakeholders': number | null
  '% of Business Stakeholders Engaged': number | null
}

type ProgramAdoptionJson = {
  workbook_name: string
  worksheet_name: string
  title: string
  purpose: string
  filters: {
    Purpose: string
    Filters: string
  }
  record_count: number
  columns: string[]
  rows: RawProgramAdoptionRow[]
}

type ProgramAdoptionRow = {
  gc: string
  domain: string
  targetedDigital: number
  engagedDigital: number
  digitalEngagementRate: number
  targetedBusiness: number
  engagedBusiness: number
  businessEngagementRate: number
}

const report = programAdoptionData as ProgramAdoptionJson

const percent = (value: number) => `${Math.round(value * 100)}%`

const formatNumber = (value: number) => new Intl.NumberFormat().format(value)

const avg = (arr: number[]) =>
  arr.length ? arr.reduce((sum, value) => sum + value, 0) / arr.length : 0

const isValidDataRow = (row: RawProgramAdoptionRow) => {
  return (
    typeof row.GC === 'string' &&
    row.GC.trim() !== '' &&
    typeof row.Domain === 'string' &&
    row.Domain.trim() !== '' &&
    typeof row['Num of Targeted digital Stakeholders'] === 'number' &&
    typeof row['Num of Engaged Digital  Stakeholders'] === 'number' &&
    typeof row['% of Digital Stakeholders Engaged'] === 'number' &&
    typeof row['Num of Targeted Business Stakeholders'] === 'number' &&
    typeof row['Num of Engaged Business  Stakeholders'] === 'number' &&
    typeof row['% of Business Stakeholders Engaged'] === 'number'
  )
}

const normalizeRow = (row: RawProgramAdoptionRow): ProgramAdoptionRow => ({
  gc: row.GC?.trim() || '',
  domain: row.Domain?.trim() || '',
  targetedDigital: Number(row['Num of Targeted digital Stakeholders'] || 0),
  engagedDigital: Number(row['Num of Engaged Digital  Stakeholders'] || 0),
  digitalEngagementRate: Number(row['% of Digital Stakeholders Engaged'] || 0),
  targetedBusiness: Number(row['Num of Targeted Business Stakeholders'] || 0),
  engagedBusiness: Number(row['Num of Engaged Business  Stakeholders'] || 0),
  businessEngagementRate: Number(row['% of Business Stakeholders Engaged'] || 0),
})

const getAdoptionBadgeStyles = (rate: number) => {
  const percentage = rate * 100

  if (percentage >= 75) return 'bg-[#ECFDF3] text-[#027A48]'
  if (percentage >= 50) return 'bg-[#FFFAEB] text-[#B54708]'
  return 'bg-[#FEF3F2] text-[#B42318]'
}

const ProgramAdoptionPage = () => {
  const navigate = useNavigate()

  const rows = useMemo(() => (report.rows || []).filter(isValidDataRow).map(normalizeRow), [])

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
    const totalTargetedDigital = filteredRows.reduce((sum, row) => sum + row.targetedDigital, 0)
    const totalEngagedDigital = filteredRows.reduce((sum, row) => sum + row.engagedDigital, 0)

    const totalTargetedBusiness = filteredRows.reduce((sum, row) => sum + row.targetedBusiness, 0)
    const totalEngagedBusiness = filteredRows.reduce((sum, row) => sum + row.engagedBusiness, 0)

    const avgDigitalEngagement = avg(filteredRows.map((row) => row.digitalEngagementRate))
    const avgBusinessEngagement = avg(filteredRows.map((row) => row.businessEngagementRate))

    const weightedDigitalEngagement =
      totalTargetedDigital > 0 ? totalEngagedDigital / totalTargetedDigital : 0

    const weightedBusinessEngagement =
      totalTargetedBusiness > 0 ? totalEngagedBusiness / totalTargetedBusiness : 0

    const totalTargeted = totalTargetedDigital + totalTargetedBusiness
    const totalEngaged = totalEngagedDigital + totalEngagedBusiness
    const weightedOverallEngagement = totalTargeted > 0 ? totalEngaged / totalTargeted : 0

    return {
      totalTargetedDigital,
      totalEngagedDigital,
      totalTargetedBusiness,
      totalEngagedBusiness,
      avgDigitalEngagement,
      avgBusinessEngagement,
      weightedDigitalEngagement,
      weightedBusinessEngagement,
      totalTargeted,
      totalEngaged,
      weightedOverallEngagement,
    }
  }, [filteredRows])

  const topBusinessDomains = useMemo(() => {
    return [...detailRows]
      .sort((a, b) => b.businessEngagementRate - a.businessEngagementRate)
      .slice(0, 3)
  }, [detailRows])

  const lowestAdoptionDomains = useMemo(() => {
    return [...detailRows]
      .sort((a, b) => {
        const aAvg = (a.digitalEngagementRate + a.businessEngagementRate) / 2
        const bAvg = (b.digitalEngagementRate + b.businessEngagementRate) / 2
        return aAvg - bAvg
      })
      .slice(0, 3)
  }, [detailRows])

  const handleExport = async () => {
    await exportToExcel({
      fileName: 'program-adoption',
      sheetName: 'Program Adoption',
      title: 'Program Adoption by Business and Digital Stakeholders',
      data: filteredRows,
      columns: [
        { header: 'GC', key: 'gc', width: 20 },
        { header: 'Domain', key: 'domain', width: 30 },
        { header: 'Targeted Digital Stakeholders', key: 'targetedDigital', width: 24 },
        { header: 'Engaged Digital Stakeholders', key: 'engagedDigital', width: 24 },
        {
          header: 'Digital Engagement Rate',
          key: 'digitalEngagementRate',
          width: 20,
          formatter: (value) => formatPercentFromDecimal(value),
        },
        { header: 'Targeted Business Stakeholders', key: 'targetedBusiness', width: 26 },
        { header: 'Engaged Business Stakeholders', key: 'engagedBusiness', width: 26 },
        {
          header: 'Business Engagement Rate',
          key: 'businessEngagementRate',
          width: 22,
          formatter: (value) => formatPercentFromDecimal(value),
        },
        {
          header: 'Overall Engagement Rate',
          key: 'businessEngagementRate',
          width: 22,
          formatter: (_, row) =>
            formatPercentFromDecimal((row.digitalEngagementRate + row.businessEngagementRate) / 2),
        },
      ],
    })
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6">
      <div className="align-center mx-auto max-w-[1440px]">
        <div className="mb-6 flex items-center justify-between">
          <div className="mb-6 flex w-full items-center justify-between">
            <div className="flex items-center justify-between gap-5">
              <div className="flex items-center gap-3">
                <button onClick={() => navigate('/reports-and-extracts')}>
                  <ChevronLeft className="h-5 w-5 text-[#344054]" />
                </button>
                <h1 className="text-[24px] font-[700] tracking-[-0.5px] text-[#101828]">
                  Program Adoption by Business and Digital Stakeholders
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
            title="Total Targeted Stakeholders"
            value={formatNumber(summary.totalTargeted)}
            subtitle={`${filteredRows.length} row(s) shown`}
          />
          <SummaryCard
            title="Total Engaged Stakeholders"
            value={formatNumber(summary.totalEngaged)}
            subtitle={percent(summary.weightedOverallEngagement)}
          />
          <SummaryCard
            title="Targeted Digital Stakeholders"
            value={formatNumber(summary.totalTargetedDigital)}
            subtitle={`${formatNumber(summary.totalEngagedDigital)} engaged`}
          />
          <SummaryCard
            title="Targeted Business Stakeholders"
            value={formatNumber(summary.totalTargetedBusiness)}
            subtitle={`${formatNumber(summary.totalEngagedBusiness)} engaged`}
          />
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 xl:grid-cols-4">
          <CircularProgressCard
            title="Overall Engagement"
            value={Math.round(summary.weightedOverallEngagement * 100)}
            color="#5878E8"
          />
          <CircularProgressCard
            title="Digital Engagement"
            value={Math.round(summary.weightedDigitalEngagement * 100)}
            color="#4EF1E4"
          />
          <CircularProgressCard
            title="Business Engagement"
            value={Math.round(summary.weightedBusinessEngagement * 100)}
            color="#6D57CA"
          />
          <CircularProgressCard
            title="Average Domain Adoption"
            value={Math.round(
              ((summary.avgDigitalEngagement + summary.avgBusinessEngagement) / 2) * 100,
            )}
            color="#12B76A"
          />
        </div>

        <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
          <div className="rounded-3xl border border-[#E6EAF0] bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-[#5878E8]" />
              <h2 className="text-xl font-semibold text-[#101828]">Engagement Overview</h2>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl bg-[#F8FAFC] p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm text-[#667085]">Digital Stakeholders Engaged</span>
                  <span className="text-sm font-medium text-[#101828]">
                    {formatNumber(summary.totalEngagedDigital)} /{' '}
                    {formatNumber(summary.totalTargetedDigital)}
                  </span>
                </div>
                <ProgressBar value={summary.weightedDigitalEngagement * 100} />
              </div>

              <div className="rounded-2xl bg-[#F8FAFC] p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm text-[#667085]">Business Stakeholders Engaged</span>
                  <span className="text-sm font-medium text-[#101828]">
                    {formatNumber(summary.totalEngagedBusiness)} /{' '}
                    {formatNumber(summary.totalTargetedBusiness)}
                  </span>
                </div>
                <ProgressBar value={summary.weightedBusinessEngagement * 100} />
              </div>

              <div className="rounded-2xl border border-dashed border-[#D0D5DD] bg-white p-4">
                <p className="text-sm text-[#667085]">
                  This report shows participation among targeted stakeholder groups and helps
                  identify domains where adoption is strong or needs support.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-[#E6EAF0] bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-[#12B76A]" />
              <h2 className="text-xl font-semibold text-[#101828]">Adoption Highlights</h2>
            </div>

            <div className="space-y-4">
              <div>
                <p className="mb-3 text-sm font-medium text-[#344054]">
                  Top Business Adoption Domains
                </p>
                <div className="space-y-3">
                  {topBusinessDomains.map((item, index) => (
                    <div
                      key={`business-${item.gc}-${item.domain}`}
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
                          {percent(item.businessEngagementRate)}
                        </p>
                        <p className="text-sm text-[#98A2B3]">business</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-3 text-sm font-medium text-[#344054]">
                  Lowest Overall Adoption Domains
                </p>
                <div className="space-y-3">
                  {lowestAdoptionDomains.map((item, index) => {
                    const overall = (item.digitalEngagementRate + item.businessEngagementRate) / 2

                    return (
                      <div
                        key={`lowest-${item.gc}-${item.domain}`}
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
                          <p className="text-lg font-semibold text-[#101828]">{percent(overall)}</p>
                          <p className="text-sm text-[#98A2B3]">overall</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-[#E6EAF0] bg-white shadow-sm">
          <div className="border-b border-[#EAECF0] px-6 py-5">
            <h2 className="text-xl font-semibold text-[#101828]">Stakeholder Adoption Breakdown</h2>
            <p className="mt-1 text-sm text-[#667085]">
              Domain-level view of targeted and engaged business and digital stakeholders, with
              adoption rates for each stakeholder group.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-[#F8FAFC]">
                <tr className="text-left text-sm text-[#667085]">
                  <th className="px-6 py-4 font-medium">Domain</th>
                  <th className="px-6 py-4 font-medium">GC</th>
                  <th className="px-6 py-4 font-medium">Digital</th>
                  <th className="px-6 py-4 font-medium">Digital Rate</th>
                  <th className="px-6 py-4 font-medium">Business</th>
                  <th className="px-6 py-4 font-medium">Business Rate</th>
                  <th className="px-6 py-4 font-medium">Overall</th>
                </tr>
              </thead>

              <tbody>
                {filteredRows.map((row) => {
                  const overallRate = (row.digitalEngagementRate + row.businessEngagementRate) / 2

                  return (
                    <tr
                      key={`${row.gc}-${row.domain}`}
                      className="border-t border-[#EAECF0] text-sm text-[#101828]"
                    >
                      <td className="px-6 py-4 font-medium">{row.domain}</td>
                      <td className="px-6 py-4">{row.gc}</td>

                      <td className="px-6 py-4">
                        {formatNumber(row.engagedDigital)} / {formatNumber(row.targetedDigital)}
                      </td>

                      <td className="px-6 py-4">
                        <div className="min-w-[140px]">
                          <div className="mb-1 text-xs text-[#667085]">
                            {percent(row.digitalEngagementRate)}
                          </div>
                          <ProgressBar value={row.digitalEngagementRate * 100} />
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        {formatNumber(row.engagedBusiness)} / {formatNumber(row.targetedBusiness)}
                      </td>

                      <td className="px-6 py-4">
                        <div className="min-w-[140px]">
                          <div className="mb-1 text-xs text-[#667085]">
                            {percent(row.businessEngagementRate)}
                          </div>
                          <ProgressBar value={row.businessEngagementRate * 100} />
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getAdoptionBadgeStyles(
                            overallRate,
                          )}`}
                        >
                          {percent(overallRate)}
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

export default ProgramAdoptionPage
