import { File } from 'lucide-react'
import { AccessCard } from '@/features/module-dashboard'

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

const Reports = () => {
  return (
    <div>
      <span className="text-base leading-6 font-normal tracking-[-0.312px] text-[#4A5565] not-italic">
        View analytics and insights from BPA assessments, including progress, data quality, and
        program adoption.
      </span>

      <div className="grid grid-cols-1 gap-4 pt-3 md:grid-cols-2 xl:grid-cols-3">
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
