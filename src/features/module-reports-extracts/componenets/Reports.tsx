import { File } from 'lucide-react'
import { AccessCard } from '@/features/module-dashboard'
import { exportToExcel } from '../utils/exportToExcel'
import { formatNumber, formatPercentFromDecimal } from '../utils/exportFormatters'
import excelSvg from '../../../assets/icons/excel.svg'

import assessmentL3Data from '../data/assessment_progress_detailed_l3.json'
import assessmentL4Data from '../data/assessment_progress_detailed_l4.json'
import qualityReportData from '../data/data_quality_report.json'
import opportunityCoverageData from '../data/opportunity_coverage.json'
import programAdoptionData from '../data/program_adoption.json'

const accessCardItems = [
  {
    title: 'Assessment Progress Detailed L3',
    description:
      'RL3 Report: The report tracks the percentage of business processes reassessed for automation; measures progress and displays the average automation level and manual effort costs for each GC and domain for Level 3 Processes.',
    icon: File,
    to: '/reports-and-extracts/assessment-progress-detailed-l3',
  },
  {
    title: 'Assessment Progress Detailed L4',
    description:
      'The report tracks the percentage of business processes reassessed for automation; measures progress and displays the average automation level and manual effort costs for each GC and domain for Level 4 processes.',
    icon: File,
    to: '/reports-and-extracts/assessment-progress-detailed-l4',
  },
  {
    title: 'Data Quality Report',
    description:
      'This report provides a comprehensive view of the quality of process data across different domains within each group company to monitor data completeness, accuracy, and consistency.',
    icon: File,
    to: '/reports-and-extracts/data-quality-report',
  },
  {
    title: 'Digital opportunities coverage',
    description:
      'The report measures the extent to which business processes are addressed/covered by proposed opportunities.',
    icon: File,
    to: '/reports-and-extracts/data-opportunity-coverage',
  },
  {
    title: 'Program Adoption by Business and Digital Stakeholders  ',
    description:
      'The report measures the engagement and activity of business and digital stakeholders with the BPA Program. It tracks who is participating in the BPA assessment process.',
    icon: File,
    to: '/reports-and-extracts/data-program-adoption',
  },
]
const handleExportAll = async () => {
  await exportToExcel({
    fileName: 'assessment-progress-detailed-l3',
    sheetName: 'Assessment Progress L3',
    title: 'Assessment Progress Detailed L3',
    data: assessmentL3Data.data || [],
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

  const isValidL4Row = (row: any) =>
    typeof row['Group Company'] === 'string' &&
    row['Group Company']?.trim() &&
    typeof row['Business Domain'] === 'string' &&
    row['Business Domain']?.trim() &&
    typeof row['Number of Applicable L4 Business Processes'] === 'number'

  const l4Rows = (assessmentL4Data.records || []).filter(isValidL4Row).map((row: any) => ({
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
    automationLevel: Number(row['Automation Level (%)'] || 0),
    targetAutomationLevel: Number(row['Target Automation Level (%)'] || 0),
    manualEffortCost: Number(row['Cost of Manual effort , kAED'] || 0),
  }))

  await exportToExcel({
    fileName: 'assessment-progress-detailed-l4',
    sheetName: 'Assessment Progress L4',
    title: 'Assessment Progress Detailed L4',
    data: l4Rows,
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
        header: 'Target Automation Updates',
        key: 'targetAutomationUpdatedSinceDate',
        width: 24,
      },
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

  const qualityRows = (qualityReportData.table.rows || []).map((row: any) => ({
    domain: row.Domain,
    processesReviewed: Number(row['Processes Reviewed'] || 0),
    fullyPopulated: Number(String(row['% Of Fully Populated Processes']).replace('%', '') || 0),
    accurateData: Number(String(row['% of Processes with Accurate Data']).replace('%', '') || 0),
    withoutInconsistencies: Number(
      String(row['% of Processes without Inconsistencies']).replace('%', '') || 0,
    ),
    qualityScore: Number(String(row['Data Quality Score']).replace('%', '') || 0),
  }))

  await exportToExcel({
    fileName: 'data-quality-report',
    sheetName: 'Data Quality',
    title: 'Data Quality Report',
    data: qualityRows,
    columns: [
      { header: 'Domain', key: 'domain', width: 36 },
      { header: 'Processes Reviewed', key: 'processesReviewed', width: 20 },
      {
        header: 'Fully Populated Processes',
        key: 'fullyPopulated',
        width: 22,
        formatter: (value) => `${value}%`,
      },
      {
        header: 'Processes with Accurate Data',
        key: 'accurateData',
        width: 24,
        formatter: (value) => `${value}%`,
      },
      {
        header: 'Processes without Inconsistencies',
        key: 'withoutInconsistencies',
        width: 28,
        formatter: (value) => `${value}%`,
      },
      {
        header: 'Data Quality Score',
        key: 'qualityScore',
        width: 18,
        formatter: (value) => `${value}%`,
      },
    ],
  })

  const isValidOpportunityRow = (row: any) =>
    typeof row.GC === 'string' &&
    row.GC?.trim() &&
    typeof row.Domain === 'string' &&
    row.Domain?.trim() &&
    typeof row['Num of Not Fully Automated Business Processes'] === 'number' &&
    typeof row['Num of L3 Process Covered by Opportunities'] === 'number' &&
    typeof row['% of L3 Process Covered by Opportunities'] === 'number'

  const opportunityRows = (opportunityCoverageData.data || [])
    .filter(isValidOpportunityRow)
    .map((row: any) => ({
      gc: row.GC?.trim() || '',
      domain: row.Domain?.trim() || '',
      notFullyAutomated: Number(row['Num of Not Fully Automated Business Processes'] || 0),
      coveredByOpportunities: Number(row['Num of L3 Process Covered by Opportunities'] || 0),
      coverageRate: Number(row['% of L3 Process Covered by Opportunities'] || 0),
    }))

  await exportToExcel({
    fileName: 'opportunity-coverage',
    sheetName: 'Opportunity Coverage',
    title: 'Opportunity Coverage of Business Processes',
    data: opportunityRows,
    columns: [
      { header: 'GC', key: 'gc', width: 20 },
      { header: 'Domain', key: 'domain', width: 30 },
      { header: 'Not Fully Automated Processes', key: 'notFullyAutomated', width: 24 },
      { header: 'Covered by Opportunities', key: 'coveredByOpportunities', width: 24 },
      {
        header: 'Uncovered Processes',
        key: 'coveredByOpportunities',
        width: 20,
        formatter: (_, row: any) => row.notFullyAutomated - row.coveredByOpportunities,
      },
      {
        header: 'Coverage Rate',
        key: 'coverageRate',
        width: 16,
        formatter: (value) => formatPercentFromDecimal(value),
      },
    ],
  })

  const isValidProgramRow = (row: any) =>
    typeof row.GC === 'string' &&
    row.GC?.trim() &&
    typeof row.Domain === 'string' &&
    row.Domain?.trim() &&
    typeof row['Num of Targeted digital Stakeholders'] === 'number' &&
    typeof row['Num of Engaged Digital  Stakeholders'] === 'number' &&
    typeof row['% of Digital Stakeholders Engaged'] === 'number' &&
    typeof row['Num of Targeted Business Stakeholders'] === 'number' &&
    typeof row['Num of Engaged Business  Stakeholders'] === 'number' &&
    typeof row['% of Business Stakeholders Engaged'] === 'number'

  const programRows = (programAdoptionData.rows || [])
    .filter(isValidProgramRow)
    .map((row: any) => ({
      gc: row.GC?.trim() || '',
      domain: row.Domain?.trim() || '',
      targetedDigital: Number(row['Num of Targeted digital Stakeholders'] || 0),
      engagedDigital: Number(row['Num of Engaged Digital  Stakeholders'] || 0),
      digitalEngagementRate: Number(row['% of Digital Stakeholders Engaged'] || 0),
      targetedBusiness: Number(row['Num of Targeted Business Stakeholders'] || 0),
      engagedBusiness: Number(row['Num of Engaged Business  Stakeholders'] || 0),
      businessEngagementRate: Number(row['% of Business Stakeholders Engaged'] || 0),
    }))

  await exportToExcel({
    fileName: 'program-adoption',
    sheetName: 'Program Adoption',
    title: 'Program Adoption by Business and Digital Stakeholders',
    data: programRows,
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
    ],
  })
}

const Reports = () => {
  return (
    <div>
      <div className="flex justify-between pb-3">
        <span className="text-base leading-6 font-normal tracking-[-0.312px] text-[#4A5565] not-italic">
          View analytics and insights from BPA assessments, including progress, data quality, and
          program adoption.
        </span>
        <button
          onClick={handleExportAll}
          className="flex items-center gap-2 text-sm font-medium text-[#0047BA] hover:underline"
        >
          <img src={excelSvg} alt="excel" className="h-4 w-4" />
          Export All
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {accessCardItems.map((item, index) => (
          <AccessCard
            key={index}
            title={item.title}
            description={item.description}
            icon={item.icon}
            to={item.to}
          />
        ))}
      </div>
    </div>
  )
}

export default Reports
