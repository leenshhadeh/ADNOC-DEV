import { ArrowDown, Lock, Loader2 } from 'lucide-react'
import { useGetRecordedChanges } from '../../../hooks/useGetRecordedChanges'

interface RecordedChangesTabProps {
  processId: string
}

const RecordedChangesTab = ({ processId }: RecordedChangesTabProps) => {
  const { data: recordedChanges = [], isLoading } = useGetRecordedChanges(processId)

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader2 className="text-muted-foreground size-6 animate-spin" />
      </div>
    )
  }

  return (
    <div className="border-border bg-card relative rounded-3xl p-6 shadow-[0px_4px_8px_0px_rgba(209,213,223,0.5)]">
      {recordedChanges.length === 0 ? (
        <p className="text-muted-foreground py-8 text-center text-sm">No recorded changes yet.</p>
      ) : (
        <div className="overflow-auto">
          <table className="w-full">
            {/* Header */}
            <thead>
              <tr className="border-border border-b">
                <th className="text-muted-foreground px-4 py-4 text-left text-xs font-normal tracking-wider uppercase">
                  Field name
                </th>
                <th className="text-muted-foreground px-4 py-4 text-left text-xs font-normal tracking-wider uppercase">
                  Change Type
                </th>
                <th className="text-muted-foreground px-4 py-4 text-left text-xs font-normal tracking-wider uppercase">
                  Old Value
                </th>
                <th className="text-muted-foreground px-4 py-4 text-left text-xs font-normal tracking-wider uppercase">
                  New Value
                </th>
                <th className="text-muted-foreground px-4 py-4 text-left text-xs font-normal tracking-wider uppercase">
                  Modified by
                </th>
                <th className="text-muted-foreground px-4 py-4 text-left text-xs font-normal tracking-wider uppercase">
                  <span className="inline-flex items-center gap-1">
                    Modified on
                    <ArrowDown className="size-3.5" />
                  </span>
                </th>
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              {recordedChanges.map((change) => (
                <tr key={change.id} className="border-border border-b last:border-b-0">
                  <td className="text-foreground px-4 py-4 text-base font-medium">
                    {change.fieldName}
                  </td>
                  <td className="text-muted-foreground px-4 py-4 text-sm">{change.changeType}</td>
                  <td className="text-muted-foreground px-4 py-4 text-sm">{change.oldValue}</td>
                  <td className="text-muted-foreground px-4 py-4 text-sm">{change.newValue}</td>
                  <td className="px-4 py-4">
                    <span className="border-border bg-accent text-muted-foreground inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium">
                      {change.changedBy}
                    </span>
                  </td>
                  <td className="text-muted-foreground px-4 py-4 text-sm">{change.changedOn}</td>
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
