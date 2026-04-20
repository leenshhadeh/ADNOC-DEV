import {
  Bar,
  BarChart,
  CartesianGrid,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

type DomainProcessItem = {
  id: string
  domainKey: string
  domainLabel: string
  l3: number
  l4: number
}

type StatusItem = {
  id: string
  key: string
  label: string
  value: number
  color: string
}

type PendingAction = {
  total: number
  l3: number
  l4: number
}

export type ProcessesSummaryData = {
  totalDomainsAssigned: number
  totalProcesses: number
  processesBreakdown: {
    l3: number
    l4: number
  }
  domainProcesses: DomainProcessItem[]
  statusSummary: StatusItem[]
  pendingAction: PendingAction
}

const mockData: ProcessesSummaryData = {
  totalDomainsAssigned: 4,
  totalProcesses: 24,
  processesBreakdown: {
    l3: 25,
    l4: 89,
  },
  domainProcesses: [
    { id: 'domain-1', domainKey: 'ITM', domainLabel: 'ITM', l3: 36, l4: 58 },
    { id: 'domain-2', domainKey: 'OPS', domainLabel: 'OPS', l3: 28, l4: 42 },
    { id: 'domain-3', domainKey: 'FINH', domainLabel: 'FINH', l3: 44, l4: 65 },
    { id: 'domain-4', domainKey: 'UPE', domainLabel: 'UPE', l3: 20, l4: 73 },
  ],
  statusSummary: [
    { id: 'status-1', key: 'drafts', label: 'Drafts', value: 3, color: '#687076' },
    {
      id: 'status-2',
      key: 'qualityReview',
      label: 'Under Quality review',
      value: 10,
      color: '#5878E8',
    },
    {
      id: 'status-3',
      key: 'digitalVpReview',
      label: 'Under Digital VP review',
      value: 7,
      color: '#6D57CA',
    },
    {
      id: 'status-4',
      key: 'published',
      label: 'Published',
      value: 4,
      color: '#4EF1E4',
    },
  ],
  pendingAction: {
    total: 0,
    l3: 0,
    l4: 0,
  },
}

type ProcessesSummaryProps = {
  data?: ProcessesSummaryData
  loading?: boolean
}

const CustomBarTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-[12px] border border-[#E5E7EB] bg-white px-3 py-2 shadow-md">
      <p className="mb-1 text-[13px] font-[600] text-[#151718]">{label}</p>
      {payload.map((entry: any) => (
        <div key={entry.dataKey} className="text-[12px] text-[#6B7280]">
          {entry.name}: <span className="font-[600] text-[#151718]">{entry.value}</span>
        </div>
      ))}
    </div>
  )
}

const ProcessesSummary = ({ data = mockData, loading = false }: ProcessesSummaryProps) => {
  const pendingMax = Math.max(data.pendingAction.l3, data.pendingAction.l4, 1)
  const pieChartData = data.statusSummary.map((item) => ({
    ...item,
    fill: item.color,
  }))

  if (loading) {
    return (
      <div className="h-full w-full rounded-[24px] bg-gradient-to-r from-[#4EF1E4]/40 to-[#151718]/40 p-[0.5px] shadow-[0_4px_12px_0_#D1D5DF80]">
        <div className="h-full rounded-[23px] bg-white px-8 py-7">
          <span className="text-[18px] font-[500] text-[#151718]">Processes summary</span>
          <div className="mt-8 h-[400px] animate-pulse rounded-[20px] bg-[#F3F4F6]" />
        </div>
      </div>
    )
  }

  return (
    <div className="h-full w-full rounded-[24px] bg-gradient-to-r from-[#4EF1E4]/40 to-[#151718]/40 p-[0.5px] shadow-[0_4px_12px_0_#D1D5DF80]">
      <div className="h-full rounded-[23px] bg-white px-4 py-5 sm:px-5 sm:py-6 md:px-6 md:py-6 lg:px-7 lg:py-7 xl:px-8 xl:py-7">
        <div className="mb-8">
          <span className="text-[18px] font-[500] text-[#151718]">Processes summary</span>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-1 sm:gap-8 md:grid-cols-1 md:gap-8 lg:grid-cols-1 lg:gap-6 xl:grid-cols-[minmax(0,1.9fr)_minmax(320px,1fr)] xl:gap-5">
          <div className="flex min-h-0 flex-col">
            <h3 className="text-[14px] font-[500] text-[#151718]">Total domains assigned</h3>
            <div className="mt-2 text-[84px] leading-none font-[700] text-[#151718]">
              {data.totalDomainsAssigned}
            </div>

            <div className="mb- mt-2 flex flex-col items-end gap-3">
              <div className="flex items-center gap-3">
                <span className="h-[10px] w-[10px] rounded-full bg-[#336CC8]" />
                <span className="text-[14px] text-[#6B7280]">L3 processes</span>
                <span className="text-[16px] font-[700] text-[#151718]">
                  {data.processesBreakdown.l3}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="h-[10px] w-[10px] rounded-full bg-[#4EF1E4]" />
                <span className="text-[14px] text-[#6B7280]">L4 processes</span>
                <span className="text-[16px] font-[700] text-[#151718]">
                  {data.processesBreakdown.l4}
                </span>
              </div>
            </div>

            <div className="mt-2 min-h-0 flex-1">
              <div className="h-full w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={data.domainProcesses}
                    margin={{ top: 20, right: 10, left: -20, bottom: 10 }}
                    barGap={5}
                  >
                    <CartesianGrid stroke="#E5E7EB" vertical={false} />
                    <XAxis
                      dataKey="domainLabel"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#6B7280', fontSize: 14 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#6B7280', fontSize: 12 }}
                    />
                    <Tooltip content={<CustomBarTooltip />} cursor={{ fill: 'transparent' }} />
                    <Bar
                      dataKey="l3"
                      name="L3 processes"
                      fill="#336CC8"
                      radius={[8, 8, 0, 0]}
                      barSize={12}
                    />
                    <Bar
                      dataKey="l4"
                      name="L4 processes"
                      fill="#4EF1E4"
                      radius={[8, 8, 0, 0]}
                      barSize={12}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="border-t border-[#E5E7EB] pt-8 sm:border-t sm:pt-8 md:border-t md:pt-8 lg:border-t lg:pt-8 xl:border-t-0 xl:border-l xl:pt-0 xl:pl-10">
            <h3 className="text-[14px] font-[500] text-[#151718]">Total processes</h3>

            <div className="mt-4 flex items-start justify-between gap-4">
              <div className="text-[48px] leading-none font-[700] text-[#151718]">
                {data.totalProcesses}
              </div>

              <div className="h-[160px] w-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      dataKey="value"
                      nameKey="label"
                      innerRadius={59}
                      outerRadius={70}
                      paddingAngle={6}
                      cornerRadius={18}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="mt-2 space-y-5">
              {data.statusSummary.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <span
                    className="h-[10px] w-[10px] rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="min-w-[44px] text-[14px] font-[600] text-[#4B5563]">
                    {String(item.value).padStart(2, '0')}
                  </span>
                  <span className="text-[14px] text-[#6B7280]">{item.label}</span>
                </div>
              ))}
            </div>

            <div className="my-10 border-t border-[#E5E7EB]" />

            <h3 className="text-[14px] font-[500] text-[#151718]">Pending your action</h3>

            <div className="mt-6 flex items-start justify-between gap-8">
              <div className="text-[48px] leading-none font-[700] text-[#151718]">
                {data.pendingAction.total}
              </div>

              <div className="w-full-[100%] max-w-full space-y-3">
                <div>
                  <div className="mb-3 text-[14px] text-[#6B7280]">L3 processes</div>
                  <div className="flex items-center gap-4">
                    <div className="h-[7px] w-[100px] overflow-hidden rounded-full bg-[#DCE5F8]">
                      <div
                        className="h-full rounded-full bg-[#C7D4F3]"
                        style={{
                          width: `${(data.pendingAction.l3 / pendingMax) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-[18px] font-[600] text-[#151718]">
                      {data.pendingAction.l3}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="mb-3 text-[14px] text-[#6B7280]">L4 processes</div>
                  <div className="flex items-center gap-4">
                    <div className="h-[7px] w-[100px] overflow-hidden rounded-full bg-[#DCE5F8]">
                      <div
                        className="h-full rounded-full bg-[#C7D4F3]"
                        style={{
                          width: `${(data.pendingAction.l4 / pendingMax) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-[18px] font-[600] text-[#151718]">
                      {data.pendingAction.l4}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProcessesSummary
