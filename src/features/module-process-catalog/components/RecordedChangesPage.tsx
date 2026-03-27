import { useNavigate, useParams } from 'react-router-dom'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/shared/components/ui/breadcrumb'
import { CATALOG_DATA } from '@features/module-process-catalog/constants/catalog-data'

// ── Types ─────────────────────────────────────────────────────────────────────

type ChangeSection = 'parent' | 'this' | 'child'

interface ChangeLogEntry {
  id: string
  processName: string
  levelLabel: string
  levelNum: number
  changeType: 'Update' | 'Create'
  changedItem: string
  groupCompany: string
  oldValue: string
  newValue: string
  modifiedBy: string
  modifiedOn: string
  section: ChangeSection
}

// ── Mock data builder ─────────────────────────────────────────────────────────

function buildMockEntries(processId: string): ChangeLogEntry[] {
  const process = CATALOG_DATA.find((r) => r.id === processId)
  if (!process) return []

  return [
    {
      id: 'c1',
      section: 'parent',
      processName: process.level1Name,
      levelLabel: 'L 1',
      levelNum: 1,
      changeType: 'Update',
      changedItem: 'Process Name',
      groupCompany: '-',
      oldValue: process.level1Name,
      newValue: process.domain,
      modifiedBy: 'Dania Al Farsi',
      modifiedOn: '04 Apr 2024, 3:33PM',
    },
    {
      id: 'c2',
      section: 'parent',
      processName: process.level2Name,
      levelLabel: 'L 2',
      levelNum: 2,
      changeType: 'Update',
      changedItem: 'Process Name',
      groupCompany: '-',
      oldValue: process.level2Name,
      newValue: 'Studies',
      modifiedBy: 'Dania Al Farsi',
      modifiedOn: '04 Apr 2024, 4:21PM',
    },
    {
      id: 'c3',
      section: 'this',
      processName: process.level3Name,
      levelLabel: 'L 3',
      levelNum: 3,
      changeType: 'Update',
      changedItem: 'Process Name',
      groupCompany: '-',
      oldValue: `${process.level3Name} 2`,
      newValue: process.level3Name,
      modifiedBy: 'Mohammed Al Hajeri',
      modifiedOn: '05 Apr 2024, 1:03PM',
    },
    {
      id: 'c4',
      section: 'this',
      processName: process.level3Name,
      levelLabel: 'L 3',
      levelNum: 3,
      changeType: 'Update',
      changedItem: 'Applicability',
      groupCompany: '-',
      oldValue: 'ADNOC Sour Gas',
      newValue: 'ADNOC Sour Gas, ADNOC Onshore - Sit...',
      modifiedBy: 'Dania Al Farsi',
      modifiedOn: '06 Apr 2024, 2:24PM',
    },
    {
      id: 'c5',
      section: 'this',
      processName: process.level3Name,
      levelLabel: 'L 3',
      levelNum: 3,
      changeType: 'Update',
      changedItem: 'Shared service',
      groupCompany: '-',
      oldValue: 'Yes',
      newValue: 'No',
      modifiedBy: 'Dania Al Farsi',
      modifiedOn: '04 Apr 2024, 6:09PM',
    },
    {
      id: 'c6',
      section: 'child',
      processName: 'Define basin framework',
      levelLabel: 'L 4',
      levelNum: 4,
      changeType: 'Create',
      changedItem: 'Process Name',
      groupCompany: 'Sour Gas',
      oldValue: '-',
      newValue: 'Define basin framework',
      modifiedBy: 'Dania Al Farsi',
      modifiedOn: '03 Apr 2024, 1:11PM',
    },
    {
      id: 'c7',
      section: 'child',
      processName: 'Define basin framework',
      levelLabel: 'L 4',
      levelNum: 4,
      changeType: 'Update',
      changedItem: 'Description',
      groupCompany: 'Sour Gas',
      oldValue: '-',
      newValue: 'Defines the structural and stratigraphic fra...',
      modifiedBy: 'Dania Al Farsi',
      modifiedOn: '04 Apr 2024, 2:13PM',
    },
  ]
}

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
    <td
      colSpan={colSpan}
      className="bg-muted/40 text-muted-foreground px-4 py-2 text-xs font-medium"
    >
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
  const navigate = useNavigate()

  const process = CATALOG_DATA.find((r) => r.id === processId)
  const entries = buildMockEntries(processId ?? '')

  const parentEntries = entries.filter((e) => e.section === 'parent')
  const thisEntries = entries.filter((e) => e.section === 'this')
  const childEntries = entries.filter((e) => e.section === 'child')

  return (
    <section className="space-y-5 pb-10">
      {/* ── Breadcrumb ── */}
      <Breadcrumb>
        <BreadcrumbList className="text-xs">
          <BreadcrumbItem>
            <BreadcrumbLink href="/" className="text-primary hover:text-primary/80 font-medium">
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink
              onClick={() => navigate('/process-catalog')}
              className="text-primary hover:text-primary/80 cursor-pointer font-medium"
            >
              Process Catalog Ma...
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-muted-foreground">Recorded changes</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

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
