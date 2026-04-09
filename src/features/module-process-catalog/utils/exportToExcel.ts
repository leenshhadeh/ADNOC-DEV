/**
 * exportToExcel
 *
 * Process Catalog Excel export — column definitions, data flattening, and
 * async L4 fetching. All workbook/worksheet/styling boilerplate lives in the
 * shared engine at `src/shared/lib/excel.ts`.
 *
 * Data flow:
 *   1. Fetch all L4 rows in parallel (full-report mode only)
 *   2. Flatten ProcessItem[] + L4 data + dynamic entity cols → CatalogFlatRow[]
 *   3. Call exportSheet with catalog-specific columns and per-row style hooks
 *
 * Row background palette:
 *   L3 base rows     — #FFFFFF (white)
 *   L4 continuation  — #FAFAFA (near-white)
 *   (Header is handled by the engine: #003087 ADNOC blue)
 */

import type { ExcelSheetRow, SheetColumn } from '@/shared/lib/excel'
import { exportSheet, ADNOC_EXCEL_COLORS } from '@/shared/lib/excel'
import { getLevel4ByParent } from '../api/level4Service'
import type { GroupCompany, Level4Item, ProcessItem } from '../types'

// ── Catalog-specific colours ──────────────────────────────────────────────────

const CATALOG_COLORS = {
  l3Bg: 'FFFFFF',
  l4Bg: 'FAFAFA',
} as const

const STATUS_COLORS: Record<string, string> = {
  Published: '16A34A',
  Draft: 'F59E0B',
  'Pending approval': '3B82F6',
  'Ready for Submission': '8B5CF6',
  'Quality Review': 'F97316',
  'Digital VP Review': '0EA5E9',
  Returned: 'EF4444',
  Rejected: 'DC2626',
}

// ── Flattened row type ────────────────────────────────────────────────────────
//
// One CatalogFlatRow maps to exactly one Excel row.
// `isFirstSubrow` is a metadata flag used by the styling hooks — it is never
// registered as a SheetColumn so it never appears in the spreadsheet.
// The index signature allows dynamic entity×site string columns.

interface CatalogFlatRow {
  domain: string
  l1Code: string
  l1Name: string
  l2Code: string
  l2Name: string
  l3Code: string
  l3Name: string
  status: string
  description: string
  l4Code: string
  l4Name: string
  l4Desc: string
  isFirstSubrow: boolean
  [entityCol: string]: string | boolean
}

// ── Base column definitions (L4 and entity cols are added dynamically) ────────

const BASE_COLUMNS: SheetColumn<CatalogFlatRow>[] = [
  { header: 'Domain', key: 'domain', width: 20 },
  { header: 'L1 Code', key: 'l1Code', width: 14, codeStyle: true },
  { header: 'Level 1', key: 'l1Name', width: 28 },
  { header: 'L2 Code', key: 'l2Code', width: 14, codeStyle: true },
  { header: 'Level 2', key: 'l2Name', width: 28 },
  { header: 'L3 Code', key: 'l3Code', width: 16, codeStyle: true },
  { header: 'Level 3', key: 'l3Name', width: 32 },
  { header: 'Status', key: 'status', width: 22 },
  { header: 'Description', key: 'description', width: 50 },
]

const L4_COLUMNS: SheetColumn<CatalogFlatRow>[] = [
  { header: 'L4 Code', key: 'l4Code', width: 16, codeStyle: true },
  { header: 'Level 4', key: 'l4Name', width: 32 },
  { header: 'L4 Description', key: 'l4Desc', width: 50 },
]

// ── Data helpers ──────────────────────────────────────────────────────────────

async function fetchL4Map(rows: ProcessItem[]): Promise<Map<string, Level4Item[]>> {
  const l4Map = new Map<string, Level4Item[]>()
  await Promise.all(
    rows.map(async (row) => {
      try {
        const l4s = await getLevel4ByParent(row.id)
        if (l4s.length > 0) l4Map.set(row.id, l4s)
      } catch {
        // Non-critical — missing L4s leave cells blank
      }
    }),
  )
  return l4Map
}

type EntityColDef = { entity: string; site: string; header: string }

function buildEntityColDefs(groupCompanies: GroupCompany[]): EntityColDef[] {
  return groupCompanies.flatMap((gc) =>
    gc.sites.map((site) => ({ entity: gc.name, site, header: `${gc.name}: ${site}` })),
  )
}

function flattenCatalogRows(
  rows: ProcessItem[],
  l4Map: Map<string, Level4Item[]>,
  entityColDefs: EntityColDef[],
  includeL4: boolean,
): CatalogFlatRow[] {
  return rows.flatMap((item) => {
    const l4s = includeL4 ? (l4Map.get(item.id) ?? []) : []
    const rowCount = Math.max(l4s.length, 1)

    const entityValues = Object.fromEntries(
      entityColDefs.map((ec) => [ec.header, item.entities[ec.entity]?.[ec.site] ?? 'No']),
    )

    return Array.from({ length: rowCount }, (_, i) => {
      const l4 = l4s[i]
      const isFirstSubrow = i === 0
      return {
        domain: isFirstSubrow ? item.domain : '',
        l1Code: isFirstSubrow ? item.level1Code : '',
        l1Name: isFirstSubrow ? item.level1Name : '',
        l2Code: isFirstSubrow ? item.level2Code : '',
        l2Name: isFirstSubrow ? item.level2Name : '',
        l3Code: isFirstSubrow ? item.level3Code : '',
        l3Name: isFirstSubrow ? item.level3Name : '',
        status: isFirstSubrow ? item.level3Status : '',
        description: isFirstSubrow ? item.description : '',
        l4Code: l4?.processCode ?? '',
        l4Name: l4?.name ?? '',
        l4Desc: l4?.description ?? '',
        isFirstSubrow,
        ...(isFirstSubrow
          ? entityValues
          : Object.fromEntries(entityColDefs.map((ec) => [ec.header, '']))),
      }
    })
  })
}

// ── Per-row style hooks ───────────────────────────────────────────────────────

function catalogRowBg(row: CatalogFlatRow): string {
  return row.isFirstSubrow ? CATALOG_COLORS.l3Bg : CATALOG_COLORS.l4Bg
}

function catalogOnRowWritten(excelRow: ExcelSheetRow, row: CatalogFlatRow): void {
  if (!row.isFirstSubrow) return

  // Status cell — bold + colour-coded text
  const statusCell = excelRow.getCell('status')
  const color = STATUS_COLORS[row.status] ?? ADNOC_EXCEL_COLORS.codeFont
  statusCell.font = { bold: true, color: { argb: color }, size: 10 }

  // Hierarchy label cells — bold (spread to preserve Courier if already applied)
  for (const key of ['domain', 'l1Name', 'l2Name'] as const) {
    const cell = excelRow.getCell(key)
    cell.font = { ...(cell.font ?? {}), bold: true }
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

export interface ExportOptions {
  rows: ProcessItem[]
  groupCompanies: GroupCompany[]
  /** Filename without extension. Defaults to "process-catalog-full-report". */
  filename?: string
  /**
   * When true (default) L4 rows are fetched and written as child rows.
   * Pass false for a summary-only export that omits L4 columns entirely.
   */
  includeL4?: boolean
}

export async function exportToExcel({
  rows,
  groupCompanies,
  filename = 'process-catalog-full-report',
  includeL4 = true,
}: ExportOptions): Promise<void> {
  // 1. Async L4 fetch (parallel, errors swallowed per-row)
  const l4Map = includeL4 ? await fetchL4Map(rows) : new Map<string, Level4Item[]>()

  // 2. Build dynamic entity×site column definitions
  const entityColDefs = buildEntityColDefs(groupCompanies)
  const entityColumns: SheetColumn<CatalogFlatRow>[] = entityColDefs.map((ec) => ({
    header: ec.header,
    key: ec.header,
    width: 22,
  }))

  // 3. Assemble full column set
  const columns: SheetColumn<CatalogFlatRow>[] = [
    ...BASE_COLUMNS,
    ...(includeL4 ? L4_COLUMNS : []),
    ...entityColumns,
  ]

  // 4. Flatten data
  const flatRows = flattenCatalogRows(rows, l4Map, entityColDefs, includeL4)

  // 5. Export via shared engine
  await exportSheet({
    rows: flatRows,
    columns,
    sheetName: 'Process Catalog',
    filename,
    creator: 'ADNOC Process Catalog',
    rowBgColor: catalogRowBg,
    onRowWritten: catalogOnRowWritten,
  })
}
