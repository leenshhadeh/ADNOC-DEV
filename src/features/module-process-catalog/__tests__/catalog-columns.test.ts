import { buildCatalogColumns, CATALOG_PINNED_LEFT } from '../components/catalog-columns'

describe('CATALOG_PINNED_LEFT', () => {
  it('contains the four pinnable column IDs in order', () => {
    expect(CATALOG_PINNED_LEFT).toEqual(['domain', 'level1', 'level2', 'level3'])
  })
})

describe('buildCatalogColumns', () => {
  it('returns an array of column definitions', () => {
    const cols = buildCatalogColumns()
    expect(Array.isArray(cols)).toBe(true)
    expect(cols.length).toBeGreaterThan(0)
  })

  it('includes wrapper groups for all four hierarchy columns', () => {
    const cols = buildCatalogColumns()
    const ids = cols.map((c) => c.id)
    expect(ids).toContain('grp__domain')
    expect(ids).toContain('grp__level1')
    expect(ids).toContain('grp__level2')
    expect(ids).toContain('grp__level3')
  })

  it('includes wrapper groups for level3Status, description, and sharedService', () => {
    const cols = buildCatalogColumns()
    const ids = cols.map((c) => c.id)
    expect(ids).toContain('grp__level3Status')
    expect(ids).toContain('grp__description')
    expect(ids).toContain('grp__sharedService')
  })

  it('includes entity column groups', () => {
    const cols = buildCatalogColumns()
    const ids = cols.map((c) => c.id)
    expect(ids.some((id) => id?.startsWith('entity__'))).toBe(true)
  })

  it('each wrapper group has exactly one leaf column', () => {
    const cols = buildCatalogColumns()
    const wrappers = cols.filter((c) => c.id?.startsWith('grp__'))
    for (const wrapper of wrappers) {
      const sub = (wrapper as { columns?: unknown[] }).columns
      expect(sub?.length).toBe(1)
    }
  })

  it('leaf columns have sorting disabled', () => {
    const cols = buildCatalogColumns()
    const wrappers = cols.filter((c) => c.id?.startsWith('grp__'))
    for (const wrapper of wrappers) {
      const [leaf] = (wrapper as { columns: { enableSorting?: boolean }[] }).columns
      expect(leaf.enableSorting).toBe(false)
    }
  })

  it('sharedService leaf has isDivider meta', () => {
    const cols = buildCatalogColumns()
    const grp = cols.find((c) => c.id === 'grp__sharedService') as {
      columns: { meta?: Record<string, unknown> }[]
    }
    expect(grp?.columns?.[0]?.meta?.isDivider).toBe(true)
  })

  describe('without rowActions', () => {
    it('returns columns even without rowActions provided', () => {
      const cols = buildCatalogColumns()
      expect(cols.length).toBeGreaterThan(0)
    })
  })

  describe('with rowActions', () => {
    it('accepts rowActions without throwing', () => {
      expect(() =>
        buildCatalogColumns({
          onAddL2: vi.fn(),
          onRename: vi.fn(),
        }),
      ).not.toThrow()
    })

    it('returns the same column structure as without rowActions', () => {
      const colsWithout = buildCatalogColumns()
      const colsWith = buildCatalogColumns({ onAddL2: vi.fn(), onRename: vi.fn() })
      expect(colsWith.map((c) => c.id)).toEqual(colsWithout.map((c) => c.id))
    })
  })
})
