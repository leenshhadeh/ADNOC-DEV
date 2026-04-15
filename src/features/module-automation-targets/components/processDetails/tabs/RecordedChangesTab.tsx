import { ArrowRight } from 'lucide-react'
import type { AutomationProcessDetail } from '../../../types'

interface RecordedChangesTabProps {
  process: AutomationProcessDetail
}

const RecordedChangesTab = ({ process }: RecordedChangesTabProps) => {
  return (
    <div>
      <h3 className="text-foreground mb-4 text-lg font-semibold">Recorded Changes</h3>

      {process.recordedChanges.length === 0 ? (
        <p className="text-muted-foreground text-sm">No recorded changes yet.</p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-[#DFE3E6]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#DFE3E6] bg-[#F1F3F5]">
                <th className="px-4 py-3 text-left text-xs font-medium text-[#687076] uppercase">
                  Field
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#687076] uppercase">
                  Old Value
                </th>
                <th className="w-8 px-2 py-3" />
                <th className="px-4 py-3 text-left text-xs font-medium text-[#687076] uppercase">
                  New Value
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#687076] uppercase">
                  Changed By
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#687076] uppercase">
                  Changed On
                </th>
              </tr>
            </thead>
            <tbody>
              {process.recordedChanges.map((change) => (
                <tr key={change.id} className="border-b border-[#DFE3E6] last:border-b-0">
                  <td className="text-foreground px-4 py-3 font-medium">{change.fieldName}</td>
                  <td className="px-4 py-3 text-[#687076]">{change.oldValue}</td>
                  <td className="px-2 py-3">
                    <ArrowRight className="size-3.5 text-[#687076]" />
                  </td>
                  <td className="text-foreground px-4 py-3">{change.newValue}</td>
                  <td className="text-muted-foreground px-4 py-3">{change.changedBy}</td>
                  <td className="text-muted-foreground px-4 py-3">{change.changedOn}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default RecordedChangesTab
