import { Square } from 'lucide-react'
import { AccessCard } from '@/features/module-dashboard'
const accessCardItems = [
  {
    title: 'Assesment Data L3 ',
    description: 'Review Assesment Data L3',
    icon: Square,
    to: '/reports-and-extracts/extracts_assessment_data_l3',
  },
  {
    title: 'Assesment Data L3 ',
    description: 'Review Assesment Data L3',
    icon: Square,
    to: '/reports-and-extracts/extracts_assessment_data_l3',
  },
  {
    title: 'Assesment Data L3 ',
    description: 'Review Assesment Data L3',
    icon: Square,
    to: '/reports-and-extracts/extracts_assessment_data_l3',
  },
]
const Extracts = () => {
  return (
    <div>
      <span className="text-base leading-6 font-normal tracking-[-0.312px] text-[#4A5565] not-italic">
        Download BPA datasets and reports for further analysis and external reporting.
      </span>

      <div className="flex gap-2 pt-3">
        {accessCardItems.map((item, index) => (
          <div key={index} className="h-full">
            <AccessCard
              title={item.title}
              description={item.description}
              icon={item.icon}
              to={item?.to}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default Extracts
