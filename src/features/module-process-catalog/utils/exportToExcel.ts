/**
 * exportToExcel
 *
 * Generates a styled .xlsx report from the current Process Catalog table data.
 * Level 4 rows are fetched in-parallel (one request per L3 row) then folded
 * into the sheet as child rows directly below their parent L3.
 *
 * Colour palette:
 *   Header row       — #003087 (dark ADNOC blue), white bold text
 *   Domain rows      — #E5E9ED (light grey-blue)
 *   L1 rows          — #F0F4FF (very light lavender)
 *   L2 rows          — #F7F9FF
 *   L3 rows          — white
 *   L4 child rows    — #FAFAFA (near-white, indented code)
 *   Alternating tint — every other block gets a subtle +4% lightness tint
 */

import ExcelJS from 'exceljs'
import { getLevel4ByParent } from '../api/level4Service'
import type { GroupCompany, Level4Item, ProcessItem } from '../types'

// ── Colours ───────────────────────────────────────────────────────────────────

const COLORS = {
  headerBg: '003087',
  headerFg: 'FFFFFFFF',
  domainBg: 'E5E9ED',
  l1Bg: 'EEF2FF',
  l2Bg: 'F5F7FF',
  l3Bg: 'FFFFFF',
  l4Bg: 'FAFAFA',
  borderColor: 'D0D5E8',
  statusColors: {
    Published: '16A34A',
    Draft: 'F59E0B',
    'Pending approval': '3B82F6',
    'Ready for Submission': '8B5CF6',
    'Quality Review': 'F97316',
    'Digital VP Review': '0EA5E9',
    Returned: 'EF4444',
    Rejected: 'DC2626',
  } as Record<string, string>,
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function applyFill(cell: ExcelJS.Cell, argb: string) {
  cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb } }
}

function applyBorder(row: ExcelJS.Row, colCount: number) {
  for (let c = 1; c <= colCount; c++) {
    const cell = row.getCell(c)
    cell.border = {
      bottom: { style: 'thin', color: { argb: COLORS.borderColor } },
    }
  }
}

function bold(cell: ExcelJS.Cell) {
  cell.font = { ...(cell.font ?? {}), bold: true }
}

// ── Main export function ──────────────────────────────────────────────────────

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
  // ── 1. Fetch all Level 4 data in parallel (full-report only) ────────────
  const l4Map = new Map<string, Level4Item[]>()

  if (includeL4) {
    await Promise.all(
      rows.map(async (row) => {
        try {
          const l4s = await getLevel4ByParent(row.id)
          if (l4s.length > 0) l4Map.set(row.id, l4s)
        } catch {
          // Non-critical — missing L4s just leave the cell blank
        }
      }),
    )
  }

  // ── 2. Build a flat list of entity site column headers ───────────────────
  // Each GroupCompany → Site pair gets its own column (e.g. "ADNOC HQ: Site A").
  const entityCols: Array<{ entity: string; site: string; header: string }> =
    groupCompanies.flatMap((gc) =>
      gc.sites.map((site) => ({ entity: gc.name, site, header: `${gc.name}: ${site}` })),
    )

  // ── 3. Set up workbook + worksheet ──────────────────────────────────────
  const workbook = new ExcelJS.Workbook()
  workbook.creator = 'ADNOC Process Catalog'
  workbook.created = new Date()

  const ws = workbook.addWorksheet('Process Catalog', {
    views: [{ state: 'frozen', ySplit: 1 }],
    pageSetup: { orientation: 'landscape', fitToPage: true, fitToWidth: 1 },
  })

  // ── 4. Define columns ────────────────────────────────────────────────────
  const baseFixedCols: ExcelJS.Column[] = [
    { header: 'Domain', key: 'domain', width: 20 },
    { header: 'L1 Code', key: 'l1Code', width: 14 },
    { header: 'Level 1', key: 'l1Name', width: 28 },
    { header: 'L2 Code', key: 'l2Code', width: 14 },
    { header: 'Level 2', key: 'l2Name', width: 28 },
    { header: 'L3 Code', key: 'l3Code', width: 16 },
    { header: 'Level 3', key: 'l3Name', width: 32 },
    { header: 'Status', key: 'status', width: 22 },
    { header: 'Description', key: 'description', width: 50 },
  ] as ExcelJS.Column[]

  const l4Cols: ExcelJS.Column[] = [
    { header: 'L4 Code', key: 'l4Code', width: 16 },
    { header: 'Level 4', key: 'l4Name', width: 32 },
    { header: 'L4 Description', key: 'l4Desc', width: 50 },
  ] as ExcelJS.Column[]

  const fixedCols = includeL4 ? [...baseFixedCols, ...l4Cols] : baseFixedCols

  const entityColDefs: ExcelJS.Column[] = entityCols.map((ec) => ({
    header: ec.header,
    key: ec.header,
    width: 22,
  })) as ExcelJS.Column[]

  ws.columns = [...fixedCols, ...entityColDefs]

  const totalCols = fixedCols.length + entityColDefs.length

  // ── 5. Style the header row ──────────────────────────────────────────────
  const headerRow = ws.getRow(1)
  headerRow.height = 24
  for (let c = 1; c <= totalCols; c++) {
    const cell = headerRow.getCell(c)
    applyFill(cell, COLORS.headerBg)
    cell.font = { bold: true, color: { argb: COLORS.headerFg }, size: 10 }
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: false }
    cell.border = {
      bottom: { style: 'medium', color: { argb: '001F5E' } },
    }
  }

  // ── 6. Write data rows ───────────────────────────────────────────────────
  for (const item of rows) {
    const l4s = includeL4 ? (l4Map.get(item.id) ?? []) : []
    const rowCount = Math.max(l4s.length, 1)

    // Build entity values map once per row
    const entityValues = Object.fromEntries(
      entityCols.map((ec) => [ec.header, item.entities[ec.entity]?.[ec.site] ?? 'No']),
    )

    for (let i = 0; i < rowCount; i++) {
      const l4 = l4s[i]
      const isFirstSubrow = i === 0

      const dataRow = ws.addRow({
        domain: isFirstSubrow ? item.domain : '',
        l1Code: isFirstSubrow ? item.level1Code : '',
        l1Name: isFirstSubrow ? item.level1Name : '',
        l2Code: isFirstSubrow ? item.level2Code : '',
        l2Name: isFirstSubrow ? item.level2Name : '',
        l3Code: isFirstSubrow ? item.level3Code : '',
        l3Name: isFirstSubrow ? item.level3Name : '',
        status: isFirstSubrow ? item.level3Status : '',
        description: isFirstSubrow ? item.description : '',
        ...(includeL4
          ? {
              l4Code: l4?.processCode ?? '',
              l4Name: l4?.name ?? '',
              l4Desc: l4?.description ?? '',
            }
          : {}),
        ...(isFirstSubrow
          ? entityValues
          : Object.fromEntries(entityCols.map((ec) => [ec.header, '']))),
      })

      dataRow.height = 18
      dataRow.alignment = { vertical: 'top', wrapText: true }

      // Row background — L3 base row vs L4 continuation row
      const bgColor = isFirstSubrow ? COLORS.l3Bg : COLORS.l4Bg
      for (let c = 1; c <= totalCols; c++) {
        applyFill(dataRow.getCell(c), bgColor)
      }

      // Status cell gets coloured text
      if (isFirstSubrow) {
        const statusCell = dataRow.getCell('status')
        const statusColor = COLORS.statusColors[item.level3Status] ?? '374151'
        statusCell.font = { bold: true, color: { argb: statusColor }, size: 10 }
      }

      // L4 code cell — monospace-style
      if (l4) {
        const l4Cell = dataRow.getCell('l4Code')
        l4Cell.font = { name: 'Courier New', size: 9, color: { argb: '4B5563' } }
      }

      // L3 code cell — monospace-style
      if (isFirstSubrow) {
        const l3Cell = dataRow.getCell('l3Code')
        l3Cell.font = { name: 'Courier New', size: 9, color: { argb: '4B5563' } }

        const l1Cell = dataRow.getCell('l1Code')
        l1Cell.font = { name: 'Courier New', size: 9, color: { argb: '4B5563' } }

        const l2Cell = dataRow.getCell('l2Code')
        l2Cell.font = { name: 'Courier New', size: 9, color: { argb: '4B5563' } }

        bold(dataRow.getCell('domain'))
        bold(dataRow.getCell('l1Name'))
        bold(dataRow.getCell('l2Name'))
      }

      applyBorder(dataRow, totalCols)
    }
  }

  // ── 7. Auto-filter on every column ──────────────────────────────────────
  ws.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: totalCols } }

  // ── 8. Generate file and trigger browser download ────────────────────────
  const buffer = await workbook.xlsx.writeBuffer()
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = `${filename}.xlsx`
  anchor.click()
  URL.revokeObjectURL(url)
}
