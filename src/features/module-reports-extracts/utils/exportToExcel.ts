import ExcelJS from 'exceljs'

type ExportColumn<T> = {
  header: string
  key: keyof T | string
  width?: number
  formatter?: (value: any, row: T) => string | number
}

type ExportExcelParams<T> = {
  fileName: string
  sheetName?: string
  title?: string
  columns: ExportColumn<T>[]
  data: T[]
}

export const exportToExcel = async <T extends Record<string, any>>({
  fileName,
  sheetName = 'Report',
  title,
  columns,
  data,
}: ExportExcelParams<T>) => {
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet(sheetName)

  let currentRow = 1

  if (title) {
    worksheet.mergeCells(currentRow, 1, currentRow, columns.length)
    const titleCell = worksheet.getCell(currentRow, 1)
    titleCell.value = title
    titleCell.font = { bold: true, size: 16 }
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' }
    worksheet.getRow(currentRow).height = 24
    currentRow += 2
  }

  worksheet.columns = columns.map((column) => ({
    header: column.header,
    key: String(column.key),
    width: column.width ?? 24,
  }))

  const headerRow = worksheet.getRow(currentRow)
  columns.forEach((column, index) => {
    const cell = headerRow.getCell(index + 1)
    cell.value = column.header
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } }
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF1F4E78' },
    }
    cell.alignment = { vertical: 'middle', horizontal: 'center' }
    cell.border = {
      top: { style: 'thin', color: { argb: 'FFD0D5DD' } },
      left: { style: 'thin', color: { argb: 'FFD0D5DD' } },
      bottom: { style: 'thin', color: { argb: 'FFD0D5DD' } },
      right: { style: 'thin', color: { argb: 'FFD0D5DD' } },
    }
  })

  currentRow += 1

  data.forEach((row) => {
    const values = columns.map((column) => {
      const rawValue = row[column.key as keyof T]
      return column.formatter ? column.formatter(rawValue, row) : (rawValue ?? '')
    })

    const addedRow = worksheet.addRow(values)

    addedRow.eachCell((cell) => {
      cell.alignment = { vertical: 'middle', horizontal: 'left' }
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFE4E7EC' } },
        left: { style: 'thin', color: { argb: 'FFE4E7EC' } },
        bottom: { style: 'thin', color: { argb: 'FFE4E7EC' } },
        right: { style: 'thin', color: { argb: 'FFE4E7EC' } },
      }
    })
  })

  worksheet.views = [{ state: 'frozen', ySplit: title ? 3 : 1 }]

  const buffer = await workbook.xlsx.writeBuffer()

  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })

  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${fileName}.xlsx`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}
