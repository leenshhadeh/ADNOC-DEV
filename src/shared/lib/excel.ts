/**
 * excel.ts — shared ADNOC Excel export engine
 *
 * Provides a single generic `exportSheet` function that handles all ExcelJS
 * boilerplate: workbook setup, ADNOC-branded header styling, alternating row
 * tints, monospace code-column font, auto-filter, and browser download.
 *
 * Each feature module only needs to define its `SheetColumn<TRow>[]` array
 * and call `exportSheet`. No ExcelJS imports needed outside this file.
 *
 * Usage:
 *   await exportSheet({
 *     rows,
 *     columns: MY_COLUMNS,
 *     sheetName: 'Assessment Data',
 *     filename: 'assessment-data-export',
 *   })
 */

import ExcelJS from 'exceljs'

/**
 * Re-exported so feature modules can type the `onRowWritten` hook
 * parameter without a direct ExcelJS dependency.
 */
export type ExcelSheetRow = ExcelJS.Row

// ── Brand tokens (single source of truth across all ADNOC exports) ────────────

export const ADNOC_EXCEL_COLORS = {
  headerBg: '003087',
  headerFg: 'FFFFFFFF',
  headerBorder: '001F5E',
  rowBg: 'FFFFFF',
  altRowBg: 'F7F9FF',
  borderColor: 'D0D5E8',
  codeFont: '4B5563',
} as const

// ── Column schema ─────────────────────────────────────────────────────────────

/**
 * One column in an exported sheet.
 *
 * @template TRow  The row data type (e.g. `FlatAssessmentRow`, `ProcessItem`).
 *
 * `key`       — `keyof TRow` used for direct property access.
 * `getValue`  — Override for computed/serialized values (arrays, nested objects).
 *               When provided, `key` is still required for the ExcelJS column key
 *               but is NOT used to read the value — `getValue(row)` is called instead.
 * `codeStyle` — When true, renders in Courier New (for hierarchy code columns).
 */
export interface SheetColumn<TRow> {
  header: string
  key: keyof TRow & string
  width: number
  getValue?: (row: TRow) => string
  codeStyle?: boolean
}

// ── Engine options ────────────────────────────────────────────────────────────

export interface ExportSheetOptions<TRow> {
  rows: TRow[]
  columns: SheetColumn<TRow>[]
  sheetName: string
  /** Filename without extension. */
  filename?: string
  /** Creator metadata embedded in the .xlsx file. Defaults to "ADNOC". */
  creator?: string
  /**
   * Override per-row background color.
   * When omitted the engine uses alternating white / light-lavender tints.
   * Receives the resolved row data and its 0-based sheet index.
   */
  rowBgColor?: (row: TRow, rowIndex: number) => string
  /**
   * Called once per data row after all built-in styling is applied.
   * Use this for feature-specific cell overrides (e.g. status-colored text,
   * bold hierarchy labels) without coupling those concerns to the engine.
   */
  onRowWritten?: (excelRow: ExcelSheetRow, row: TRow) => void
}

// ── Engine ────────────────────────────────────────────────────────────────────

export async function exportSheet<TRow>({
  rows,
  columns,
  sheetName,
  filename = 'export',
  creator = 'ADNOC',
  rowBgColor,
  onRowWritten,
}: ExportSheetOptions<TRow>): Promise<void> {
  const C = ADNOC_EXCEL_COLORS

  // 1. Workbook
  const workbook = new ExcelJS.Workbook()
  workbook.creator = creator
  workbook.created = new Date()

  // 2. Worksheet
  const ws = workbook.addWorksheet(sheetName, {
    views: [{ state: 'frozen', ySplit: 1 }],
    pageSetup: { orientation: 'landscape', fitToPage: true, fitToWidth: 1 },
  })

  // 3. Column definitions
  ws.columns = columns.map((col) => ({
    header: col.header,
    key: col.key,
    width: col.width,
  })) as unknown as ExcelJS.Column[]

  const totalCols = columns.length

  // 4. Header row styling
  const headerRow = ws.getRow(1)
  headerRow.height = 24
  for (let c = 1; c <= totalCols; c++) {
    const cell = headerRow.getCell(c)
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: C.headerBg } }
    cell.font = { bold: true, color: { argb: C.headerFg }, size: 10 }
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: false }
    cell.border = { bottom: { style: 'medium', color: { argb: C.headerBorder } } }
  }

  // 5. Data rows
  rows.forEach((row, rowIndex) => {
    const bgColor = rowBgColor
      ? rowBgColor(row, rowIndex)
      : rowIndex % 2 === 0
        ? C.rowBg
        : C.altRowBg

    // Resolve each cell value via getValue override or direct property access
    const values: Record<string, string> = {}
    for (const col of columns) {
      if (col.getValue) {
        values[col.key] = col.getValue(row)
      } else {
        const raw = row[col.key as keyof TRow]
        values[col.key] = raw != null ? String(raw) : ''
      }
    }

    const dataRow = ws.addRow(values)
    dataRow.height = 18
    dataRow.alignment = { vertical: 'top', wrapText: true }

    // Row background + bottom border
    for (let c = 1; c <= totalCols; c++) {
      const cell = dataRow.getCell(c)
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgColor } }
      cell.border = { bottom: { style: 'thin', color: { argb: C.borderColor } } }
    }

    // Monospace font for code-style columns
    for (const col of columns) {
      if (col.codeStyle) {
        const cell = dataRow.getCell(col.key)
        if (cell.value) {
          cell.font = { name: 'Courier New', size: 9, color: { argb: C.codeFont } }
        }
      }
    }

    // Feature-specific cell overrides (bold labels, status colours, etc.)
    if (onRowWritten) onRowWritten(dataRow, row)
  })

  // 6. Auto-filter on all columns
  ws.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: totalCols } }

  // 7. Browser download
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
