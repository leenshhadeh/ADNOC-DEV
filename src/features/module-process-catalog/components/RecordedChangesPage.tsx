import { useParams } from 'react-router-dom'

import { useGetRecordedChanges } from '@features/module-process-catalog/hooks/useGetRecordedChanges'
import { useGetProcessCatalogRows } from '@features/module-process-catalog/hooks/useGetProcessCatalogRows'
import type { ChangeLogEntry } from '@features/module-process-catalog/types'
import Breadcrumb from '@/shared/components/Breadcrumb'

// ── Sub-components ────────────────────────────────────────────────────────────

/** Stacked bar chart icon matching the screenshot's level indicator */
const LevelBars = ({ num }: { num: number }) => (
  <span className="flex items-end gap-[2px]">
    {Array.from({ length: Math.min(num, 4) }, (_, i) => (
      <span
        key={i}
        className="bg-muted-foreground/50 inline-block w-[3px] rounded-sm"
        style={{ height: `${6 + i * 3}px` }}
      />
    ))}
  </span>
)

const SectionHeaderRow = ({ label, colSpan }: { label: string; colSpan: number }) => (
  <tr>
    <td colSpan={colSpan} className="text-muted-foreground bg-accent px-4 py-2 text-xs font-medium">
      {label}
    </td>
  </tr>
)

const EntryRow = ({ entry }: { entry: ChangeLogEntry }) => (
  <tr className="border-border hover:bg-muted/20 border-b last:border-0">
    <td className="text-foreground px-4 py-3 text-sm font-medium">{entry.processName}</td>
    <td className="px-4 py-3">
      <div className="flex items-center gap-1.5">
        <LevelBars num={entry.levelNum} />
        <span className="text-foreground text-sm">{entry.levelLabel}</span>
      </div>
    </td>
    <td className="text-foreground px-4 py-3 text-sm">{entry.changeType}</td>
    <td className="text-foreground px-4 py-3 text-sm">{entry.changedItem}</td>
    <td className="text-muted-foreground px-4 py-3 text-sm">{entry.groupCompany}</td>
    <td className="text-muted-foreground max-w-[160px] truncate px-4 py-3 text-sm">
      {entry.oldValue}
    </td>
    <td className="text-foreground max-w-[200px] truncate px-4 py-3 text-sm">{entry.newValue}</td>
    <td className="px-4 py-3">
      <span className="border-border bg-muted text-muted-foreground inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium">
        {entry.modifiedBy}
      </span>
    </td>
    <td className="text-muted-foreground px-4 py-3 text-xs">{entry.modifiedOn}</td>
  </tr>
)

// ── Columns config ────────────────────────────────────────────────────────────

const COLUMNS: Array<{ id: string; label: string; minWidth: number }> = [
  { id: 'processName', label: 'Process Name', minWidth: 160 },
  { id: 'level', label: 'Level', minWidth: 70 },
  { id: 'changeType', label: 'Change Type', minWidth: 110 },
  { id: 'changedItem', label: 'Changed Item', minWidth: 120 },
  { id: 'groupCompany', label: 'Group Compa...', minWidth: 110 },
  { id: 'oldValue', label: 'Old Value', minWidth: 160 },
  { id: 'newValue', label: 'New Value', minWidth: 180 },
  { id: 'modifiedBy', label: 'Modified By', minWidth: 140 },
  { id: 'modifiedOn', label: 'Modified On', minWidth: 130 },
]

// ── Page ──────────────────────────────────────────────────────────────────────

const RecordedChangesPage = () => {
  const { processId } = useParams<{ processId: string }>()

  const { data: rows } = useGetProcessCatalogRows()
  const process = rows?.find((r) => r.id === processId)

  const { data: entries = [] } = useGetRecordedChanges(processId)

  const parentEntries = entries.filter((e) => e.section === 'parent')
  const thisEntries = entries.filter((e) => e.section === 'this')
  const childEntries = entries.filter((e) => e.section === 'child')

  return (
    <section className="space-y-5 pb-10">
      {/* ── Breadcrumb ── */}
      <Breadcrumb
        links={[
          { title: 'Process Catalog  Management', url: '/process-catalog' },
          { title: 'Recorded changes', isCurrentPage: true },
        ]}
      />

      {/* ── Title ── */}
      <div>
        <h1 className="text-foreground text-4xl font-semibold">Recorded Changes</h1>
        {process && (
          <p className="text-muted-foreground mt-1 text-sm">
            {process.level3Name}{' '}
            <span className="text-foreground font-medium">— {process.level3Code}</span>
          </p>
        )}
      </div>

      {/* ── Table card ── */}
      <div className="border-border bg-card overflow-hidden rounded-2xl border shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-0 text-sm">
            <thead>
              <tr>
                {COLUMNS.map((col) => (
                  <th
                    key={col.id}
                    style={{ minWidth: col.minWidth }}
                    className="bg-muted/40 border-border text-muted-foreground border-b px-4 py-3 text-start text-xs font-medium tracking-wide uppercase"
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {parentEntries.length > 0 && (
                <>
                  <SectionHeaderRow label="Parent processes" colSpan={COLUMNS.length} />
                  {parentEntries.map((e) => (
                    <EntryRow key={e.id} entry={e} />
                  ))}
                </>
              )}

              {thisEntries.length > 0 && (
                <>
                  <SectionHeaderRow label="This process" colSpan={COLUMNS.length} />
                  {thisEntries.map((e) => (
                    <EntryRow key={e.id} entry={e} />
                  ))}
                </>
              )}

              {childEntries.length > 0 && (
                <>
                  <SectionHeaderRow label="Child processes" colSpan={COLUMNS.length} />
                  {childEntries.map((e) => (
                    <EntryRow key={e.id} entry={e} />
                  ))}
                </>
              )}

              {entries.length === 0 && (
                <tr>
                  <td
                    colSpan={COLUMNS.length}
                    className="text-muted-foreground px-4 py-10 text-center text-sm"
                  >
                    No recorded changes found for this process.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

export default RecordedChangesPage
