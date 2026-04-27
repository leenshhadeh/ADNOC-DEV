export const SummaryCard = ({
  title,
  value,
  subtitle,
}: {
  title: string
  value: string | number
  subtitle?: string
}) => {
  return (
    <div className="rounded-3xl border border-[#E6EAF0] bg-white p-5 shadow-sm">
      <p className="text-sm text-[#667085]">{title}</p>
      <h3 className="pt-2 text-3xl font-semibold text-[#101828]">{value}</h3>
      {subtitle ? <p className="pt-2 text-sm text-[#98A2B3]">{subtitle}</p> : null}
    </div>
  )
}
