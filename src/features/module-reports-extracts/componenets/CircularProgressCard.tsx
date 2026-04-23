import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

type CircularProgressCardProps = {
  title: string
  value: number
  color?: string
}

const CircularProgressCard = ({
  title,
  value,
  color = '#1554C0',
}: CircularProgressCardProps) => {
  const safeValue = Math.max(0, Math.min(100, value))

  const data = [
    { name: 'value', value: safeValue },
    { name: 'remaining', value: 100 - safeValue },
  ]

  return (
    <div className="rounded-3xl border border-[#E6EAF0] bg-white p-5 shadow-sm">
      <p className="text-sm text-[#667085]">{title}</p>

      <div className="mt-4 flex items-center justify-between gap-4">
        <div className="h-[120px] w-[120px] shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
                innerRadius={38}
                outerRadius={44}
                cornerRadius={8}
                stroke="none"
              >
                <Cell fill={color} />
                <Cell fill="#E9EEF5" />
              </Pie>
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-[#101828] text-sm font-semibold"
              >
                {`${safeValue}%`}
              </text>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex-1">
          <h3 className="text-2xl font-semibold text-[#101828]">{safeValue}%</h3>
          <p className="mt-1 text-sm text-[#98A2B3]">Completion status</p>
        </div>
      </div>
    </div>
  )
}

export default CircularProgressCard
