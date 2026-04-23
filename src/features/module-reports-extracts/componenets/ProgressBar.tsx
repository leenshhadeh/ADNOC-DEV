import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Cell } from 'recharts'

interface ProgressBarProps {
  value: number
}

export const ProgressBar = ({ value }: ProgressBarProps) => {
  const safeValue = Math.max(0, Math.min(100, value))

  const data = [
    {
      name: 'progress',
      value: safeValue,
      remaining: 100 - safeValue,
    },
  ]

  return (
    <div className="h-2.5 w-full overflow-hidden rounded-full bg-transparent">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
          barCategoryGap={0}
          barGap={0}
        >
          <XAxis type="number" domain={[0, 100]} hide />
          <YAxis type="category" dataKey="name" hide />
          <Bar dataKey="value" stackId="progress" radius={[999, 0, 0, 999]} barSize={10}>
            <Cell fill="#1554C0" />
          </Bar>
          <Bar dataKey="remaining" stackId="progress" radius={[0, 999, 999, 0]} barSize={10}>
            <Cell fill="#D9E2F2" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
