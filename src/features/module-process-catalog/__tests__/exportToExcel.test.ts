/**
 * exportToExcel.test.ts
 *
 * Tests for the exportToExcel utility. ExcelJS is mocked so that tests run
 * fast and remain focused on observable behaviour: correct L4 fetching, row
 * construction, and browser-download triggering.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// ── Shared mutable state, hoisted so it's ready when vi.mock factories run ────
const { addedRows, mockWorkbook, mockCells } = vi.hoisted(() => {
  const addedRows: object[] = []
  const mockCells: Record<string, object> = {}

  const makeCell = () => ({ fill: {}, font: {}, border: {}, alignment: {}, value: undefined })

  const mockWorksheet = {
    get columns() {
      return []
    },
    set columns(_v: unknown) {},
    views: [],
    pageSetup: {},
    getRow: vi.fn(() => ({
      height: 0,
      alignment: {},
      getCell: vi.fn((col: string | number) => {
        const key = String(col)
        if (!mockCells[key]) mockCells[key] = makeCell()
        return mockCells[key]
      }),
    })),
    addRow: vi.fn((data: object) => {
      addedRows.push(data)
      return {
        height: 0,
        alignment: {},
        getCell: vi.fn((col: string | number) => {
          const key = String(col)
          if (!mockCells[key]) mockCells[key] = makeCell()
          return mockCells[key]
        }),
      }
    }),
    autoFilter: undefined,
  }

  const mockWorkbook = {
    creator: '',
    created: undefined as Date | undefined,
    addWorksheet: vi.fn(() => mockWorksheet),
    xlsx: {
      writeBuffer: vi.fn().mockResolvedValue(new ArrayBuffer(8)),
    },
  }

  return { addedRows, mockWorksheet, mockWorkbook, mockCells }
})

// ── Mock ExcelJS — Workbook must be a regular function to support `new` ────────
vi.mock('exceljs', () => ({
  default: {
    // eslint-disable-next-line prefer-arrow-callback
    Workbook: vi.fn(function () {
      return mockWorkbook
    }),
  },
}))

// ── Mock level4Service ────────────────────────────────────────────────────────
vi.mock('../api/level4Service', () => ({
  getLevel4ByParent: vi.fn(),
}))

// ── Import after mocks are registered ────────────────────────────────────────
import { exportToExcel } from '../utils/exportToExcel'
import { getLevel4ByParent } from '../api/level4Service'
import type { ProcessItem, GroupCompany, Level4Item } from '../types'

// ── Fixtures ──────────────────────────────────────────────────────────────────

const makeProcess = (overrides: Partial<ProcessItem> = {}): ProcessItem => ({
  id: 'p1',
  domain: 'Exploration',
  level1Name: 'Resource Evaluation',
  level1Code: 'EXP.1',
  level2Name: 'Subsurface Studies',
  level2Code: 'EXP.1.1',
  level3Name: 'Seismic Interpretation',
  level3Code: 'EXP.1.1.1',
  level3Status: 'Published',
  description: 'Interpret seismic data',
  isSharedService: false,
  entities: {},
  ...overrides,
})

const makeL4 = (overrides: Partial<Level4Item> = {}): Level4Item => ({
  id: 'l4-1',
  processCode: 'EXP.1.1.1.1',
  name: '2D Seismic',
  description: 'Process 2D seismic',
  status: 'Published',
  parentId: 'p1',
  ...overrides,
})

const makeGroupCompany = (overrides: Partial<GroupCompany> = {}): GroupCompany => ({
  id: 'gc1',
  name: 'ADNOC HQ',
  sites: ['Abu Dhabi', 'Dubai'],
  ...overrides,
})

// ── Browser API stubs ─────────────────────────────────────────────────────────

let anchorClickSpy: ReturnType<typeof vi.fn>
let createElementSpy: ReturnType<typeof vi.spyOn>
let createObjectURLSpy: ReturnType<typeof vi.spyOn>
let revokeObjectURLSpy: ReturnType<typeof vi.spyOn>

beforeEach(() => {
  addedRows.length = 0
  Object.keys(mockCells).forEach((k) => delete mockCells[k])

  anchorClickSpy = vi.fn()

  createElementSpy = vi.spyOn(document, 'createElement').mockImplementation(function (tag: string) {
    if (tag === 'a') {
      return { href: '', download: '', click: anchorClickSpy } as unknown as HTMLAnchorElement
    }
    return HTMLDocument.prototype.createElement.call(document, tag)
  })

  createObjectURLSpy = vi
    .spyOn(URL, 'createObjectURL')
    .mockReturnValue('blob:http://localhost/fake-url')

  revokeObjectURLSpy = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})

  vi.mocked(getLevel4ByParent).mockResolvedValue([])
})

afterEach(() => {
  vi.restoreAllMocks()
  vi.clearAllMocks()
})

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('exportToExcel', () => {
  describe('browser download', () => {
    it('triggers a download by clicking a synthetic anchor', async () => {
      await exportToExcel({ rows: [makeProcess()], groupCompanies: [] })

      expect(createObjectURLSpy).toHaveBeenCalledOnce()
      expect(anchorClickSpy).toHaveBeenCalledOnce()
      expect(revokeObjectURLSpy).toHaveBeenCalledOnce()
    })

    it('uses the default filename when none is provided', async () => {
      let capturedDownload = ''
      createElementSpy.mockImplementation(() => {
        const el = {
          href: '',
          set download(v: string) {
            capturedDownload = v
          },
          click: anchorClickSpy,
        } as unknown as HTMLAnchorElement
        return el
      })

      await exportToExcel({ rows: [makeProcess()], groupCompanies: [] })

      expect(capturedDownload).toBe('process-catalog-full-report.xlsx')
    })

    it('uses a custom filename when provided', async () => {
      let capturedDownload = ''
      createElementSpy.mockImplementation(() => {
        const el = {
          href: '',
          set download(v: string) {
            capturedDownload = v
          },
          click: anchorClickSpy,
        } as unknown as HTMLAnchorElement
        return el
      })

      await exportToExcel({
        rows: [makeProcess()],
        groupCompanies: [],
        filename: 'my-custom-report',
      })

      expect(capturedDownload).toBe('my-custom-report.xlsx')
    })
  })

  describe('L4 fetching', () => {
    it('calls getLevel4ByParent once per process row', async () => {
      const rows = [makeProcess({ id: 'a' }), makeProcess({ id: 'b' }), makeProcess({ id: 'c' })]

      await exportToExcel({ rows, groupCompanies: [] })

      expect(vi.mocked(getLevel4ByParent)).toHaveBeenCalledTimes(3)
      expect(vi.mocked(getLevel4ByParent)).toHaveBeenCalledWith('a')
      expect(vi.mocked(getLevel4ByParent)).toHaveBeenCalledWith('b')
      expect(vi.mocked(getLevel4ByParent)).toHaveBeenCalledWith('c')
    })

    it('does not throw when getLevel4ByParent rejects for a row', async () => {
      vi.mocked(getLevel4ByParent).mockRejectedValue(new Error('network error'))

      await expect(
        exportToExcel({ rows: [makeProcess()], groupCompanies: [] }),
      ).resolves.toBeUndefined()
    })

    it('still downloads the file when all L4 fetches fail', async () => {
      vi.mocked(getLevel4ByParent).mockRejectedValue(new Error('timeout'))

      await exportToExcel({ rows: [makeProcess()], groupCompanies: [] })

      expect(anchorClickSpy).toHaveBeenCalledOnce()
    })
  })

  describe('row generation', () => {
    it('emits one data row per process when there are no L4 children', async () => {
      vi.mocked(getLevel4ByParent).mockResolvedValue([])

      await exportToExcel({ rows: [makeProcess(), makeProcess({ id: 'p2' })], groupCompanies: [] })

      // One sub-row per process (i === 0, rowCount === max(0, 1) === 1)
      expect(addedRows).toHaveLength(2)
    })

    it('emits one row per L4 child when L4 data exists', async () => {
      vi.mocked(getLevel4ByParent).mockResolvedValue([
        makeL4({ id: 'l4-1' }),
        makeL4({ id: 'l4-2' }),
        makeL4({ id: 'l4-3' }),
      ])

      await exportToExcel({ rows: [makeProcess()], groupCompanies: [] })

      expect(addedRows).toHaveLength(3)
    })

    it('emits L3 data only on the first sub-row and blanks the rest', async () => {
      vi.mocked(getLevel4ByParent).mockResolvedValue([
        makeL4({ id: 'l4-1' }),
        makeL4({ id: 'l4-2' }),
      ])

      await exportToExcel({ rows: [makeProcess()], groupCompanies: [] })

      const [firstRow, secondRow] = addedRows as Array<Record<string, string>>

      expect(firstRow.domain).toBe('Exploration')
      expect(firstRow.l3Name).toBe('Seismic Interpretation')
      expect(secondRow.domain).toBe('')
      expect(secondRow.l3Name).toBe('')
    })

    it('populates L4 code + name on each sub-row', async () => {
      vi.mocked(getLevel4ByParent).mockResolvedValue([makeL4()])

      await exportToExcel({ rows: [makeProcess()], groupCompanies: [] })

      const [row] = addedRows as Array<Record<string, string>>
      expect(row.l4Code).toBe('EXP.1.1.1.1')
      expect(row.l4Name).toBe('2D Seismic')
    })
  })

  describe('entity columns', () => {
    it('builds one column per group-company × site combination', async () => {
      const groupCompanies: GroupCompany[] = [
        makeGroupCompany({ name: 'ADNOC HQ', sites: ['Abu Dhabi', 'Dubai'] }),
        makeGroupCompany({ id: 'gc2', name: 'ADNOC Drilling', sites: ['Ruwais'] }),
      ]

      await exportToExcel({ rows: [makeProcess()], groupCompanies })

      // 3 entity columns expected: "ADNOC HQ: Abu Dhabi", "ADNOC HQ: Dubai", "ADNOC Drilling: Ruwais"
      const [firstRow] = addedRows as Array<Record<string, string>>
      expect(firstRow['ADNOC HQ: Abu Dhabi']).toBeDefined()
      expect(firstRow['ADNOC HQ: Dubai']).toBeDefined()
      expect(firstRow['ADNOC Drilling: Ruwais']).toBeDefined()
    })

    it('produces no entity columns when groupCompanies is empty', async () => {
      await exportToExcel({ rows: [makeProcess()], groupCompanies: [] })

      const [firstRow] = addedRows as Array<Record<string, string>>
      const entityKeys = Object.keys(firstRow).filter((k) => k.includes(':'))
      expect(entityKeys).toHaveLength(0)
    })

    it('uses "No" as the default entity value when entities map is absent', async () => {
      const groupCompanies = [makeGroupCompany({ sites: ['Site A'] })]
      // process has empty entities map
      const process = makeProcess({ entities: {} })

      await exportToExcel({ rows: [process], groupCompanies })

      const [firstRow] = addedRows as Array<Record<string, string>>
      expect(firstRow['ADNOC HQ: Site A']).toBe('No')
    })

    it('reads the entity value from the process entities map', async () => {
      const groupCompanies = [makeGroupCompany({ sites: ['Site A'] })]
      const process = makeProcess({ entities: { 'ADNOC HQ': { 'Site A': 'Yes' } } })

      await exportToExcel({ rows: [process], groupCompanies })

      const [firstRow] = addedRows as Array<Record<string, string>>
      expect(firstRow['ADNOC HQ: Site A']).toBe('Yes')
    })
  })

  describe('empty input', () => {
    it('still triggers download when rows array is empty', async () => {
      await exportToExcel({ rows: [], groupCompanies: [] })

      expect(anchorClickSpy).toHaveBeenCalledOnce()
    })

    it('calls getLevel4ByParent zero times when rows is empty', async () => {
      await exportToExcel({ rows: [], groupCompanies: [] })

      expect(vi.mocked(getLevel4ByParent)).not.toHaveBeenCalled()
    })
  })
})
