import { useMemo } from 'react'
import type { RateCardsTableProps, FlattenedRateCardRow } from './types'
import RateCardValueCell from './RateCardValueCell'

type DisplayRow = FlattenedRateCardRow & {
  groupCompanyRowSpan: number
  showGroupCompany: boolean
  domainRowSpan: number
  showDomain: boolean
  level1RowSpan: number
  showLevel1: boolean
  level2RowSpan: number
  showLevel2: boolean
  processLevel3RowSpan: number
  showProcessLevel3: boolean
}

const getRowSpans = (rows: FlattenedRateCardRow[]): DisplayRow[] => {
  const result: DisplayRow[] = rows.map((row) => ({
    ...row,
    groupCompanyRowSpan: 1,
    showGroupCompany: true,
    domainRowSpan: 1,
    showDomain: true,
    level1RowSpan: 1,
    showLevel1: true,
    level2RowSpan: 1,
    showLevel2: true,
    processLevel3RowSpan: 1,
    showProcessLevel3: true,
  }))

  for (let i = 1; i < result.length; i++) {
    const current = result[i]
    const prev = result[i - 1]

    const sameGroupCompany = prev.groupCompany === current.groupCompany
    const sameDomain =
      sameGroupCompany && prev.domain === current.domain && prev.domainCode === current.domainCode
    const sameLevel1 =
      sameDomain && prev.level1 === current.level1 && prev.level1Code === current.level1Code
    const sameLevel2 =
      sameLevel1 && prev.level2 === current.level2 && prev.level2Code === current.level2Code
    const sameLevel3 =
      sameLevel2 &&
      prev.processLevel3 === current.processLevel3 &&
      prev.processLevel3Code === current.processLevel3Code

    if (sameGroupCompany) {
      current.showGroupCompany = false
      let anchor = i - 1
      while (anchor >= 0 && result[anchor].groupCompany === current.groupCompany) anchor--
      result[anchor + 1].groupCompanyRowSpan += 1
    }

    if (sameDomain) {
      current.showDomain = false
      let anchor = i - 1
      while (
        anchor >= 0 &&
        result[anchor].groupCompany === current.groupCompany &&
        result[anchor].domain === current.domain &&
        result[anchor].domainCode === current.domainCode
      )
        anchor--
      result[anchor + 1].domainRowSpan += 1
    }

    if (sameLevel1) {
      current.showLevel1 = false
      let anchor = i - 1
      while (
        anchor >= 0 &&
        result[anchor].groupCompany === current.groupCompany &&
        result[anchor].domain === current.domain &&
        result[anchor].domainCode === current.domainCode &&
        result[anchor].level1 === current.level1 &&
        result[anchor].level1Code === current.level1Code
      )
        anchor--
      result[anchor + 1].level1RowSpan += 1
    }

    if (sameLevel2) {
      current.showLevel2 = false
      let anchor = i - 1
      while (
        anchor >= 0 &&
        result[anchor].groupCompany === current.groupCompany &&
        result[anchor].domain === current.domain &&
        result[anchor].domainCode === current.domainCode &&
        result[anchor].level1 === current.level1 &&
        result[anchor].level1Code === current.level1Code &&
        result[anchor].level2 === current.level2 &&
        result[anchor].level2Code === current.level2Code
      )
        anchor--
      result[anchor + 1].level2RowSpan += 1
    }

    if (sameLevel3) {
      current.showProcessLevel3 = false
      let anchor = i - 1
      while (
        anchor >= 0 &&
        result[anchor].groupCompany === current.groupCompany &&
        result[anchor].domain === current.domain &&
        result[anchor].domainCode === current.domainCode &&
        result[anchor].level1 === current.level1 &&
        result[anchor].level1Code === current.level1Code &&
        result[anchor].level2 === current.level2 &&
        result[anchor].level2Code === current.level2Code &&
        result[anchor].processLevel3 === current.processLevel3 &&
        result[anchor].processLevel3Code === current.processLevel3Code
      )
        anchor--
      result[anchor + 1].processLevel3RowSpan += 1
    }
  }

  return result
}

const HierarchyContent = ({
  name,
  code,
  light = false,
  showCheckbox = false,
  checked = false,
  onCheckboxChange,
}: {
  name?: string
  code?: string
  light?: boolean
  showCheckbox?: boolean
  checked?: boolean
  onCheckboxChange?: (checked: boolean) => void
}) => {
  if (!name && !code && !showCheckbox) return null

  return (
    <div className="flex items-start justify-between">
      <div>
        {name ? (
          <p className={`text-[16px] ${light ? 'font-[400]' : 'font-[500]'} text-[#151718]`}>
            {name}
          </p>
        ) : null}
        {code ? <p className="mt-1 text-[14px] text-[#8C94A6]">{code}</p> : null}
      </div>
      {showCheckbox ? (
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onCheckboxChange?.(e.target.checked)}
          className="border-[#D0D5DD mt-1 ml-1 h-4 w-4 rounded"
        />
      ) : null}
    </div>
  )
}

const cellClass = 'align-top border-b border-r border-[#E6E9F0] bg-white px-4 py-4 text-left'
const headerClass =
  'border-b border-r border-[#E6E9F0] bg-[#F8FAFC] px-4 py-3 text-left text-[12px] font-[600] uppercase tracking-wide text-[#667085]'

const RateCardsTable = ({
  data,
  isBulkEditMode = false,
  selectedRowIds = [],
  onToggleRowSelection,
  onRateCardValueChange,
  onEditRateCardRow,
}: RateCardsTableProps) => {
  const displayRows = useMemo(() => getRowSpans(data), [data])

  return (
    <div className="overflow-x-auto rounded-[12px] border border-[#E6E9F0] bg-white">
      <table className="min-w-full border-separate border-spacing-0">
        <thead>
          <tr>
            <th className={`${headerClass} min-w-[180px]`}>GROUP COMPANY</th>
            <th className={`${headerClass} min-w-[160px]`}>DOMAIN</th>
            <th className={`${headerClass} min-w-[160px]`}>LEVEL 1</th>
            <th className={`${headerClass} min-w-[160px]`}>LEVEL 2</th>
            <th className={`${headerClass} min-w-[220px]`}>PROCESS LEVEL 3</th>
            <th className={`${headerClass} min-w-[220px]`}>PROCESS LEVEL 4</th>
            <th className={`${headerClass} min-w-[140px] border-r-0`}>RATE CARD VALUE</th>
          </tr>
        </thead>

        <tbody>
          {displayRows.length > 0 ? (
            displayRows.map((row) => {
              const isSelected = selectedRowIds.includes(row.id)

              const deepestLevel = row.processLevel4
                ? 'processLevel4'
                : row.processLevel3
                  ? 'processLevel3'
                  : row.level2
                    ? 'level2'
                    : row.level1
                      ? 'level1'
                      : row.domain
                        ? 'domain'
                        : 'groupCompany'

              return (
                <tr key={row.id}>
                  {row.showGroupCompany ? (
                    <td rowSpan={row.groupCompanyRowSpan} className={`${cellClass} min-w-[180px]`}>
                      <HierarchyContent
                        name={row.groupCompany}
                        showCheckbox={isBulkEditMode && deepestLevel === 'groupCompany'}
                        checked={isSelected}
                        onCheckboxChange={(checked) => onToggleRowSelection?.(row.id, checked)}
                      />
                    </td>
                  ) : null}

                  {row.showDomain ? (
                    <td rowSpan={row.domainRowSpan} className={`${cellClass} min-w-[160px]`}>
                      <HierarchyContent
                        name={row.domain}
                        code={row.domainCode}
                        showCheckbox={isBulkEditMode && deepestLevel === 'domain'}
                        checked={isSelected}
                        onCheckboxChange={(checked) => onToggleRowSelection?.(row.id, checked)}
                      />
                    </td>
                  ) : null}

                  {row.showLevel1 ? (
                    <td rowSpan={row.level1RowSpan} className={`${cellClass} min-w-[160px]`}>
                      <HierarchyContent
                        name={row.level1}
                        code={row.level1Code}
                        showCheckbox={isBulkEditMode && deepestLevel === 'level1'}
                        checked={isSelected}
                        onCheckboxChange={(checked) => onToggleRowSelection?.(row.id, checked)}
                      />
                    </td>
                  ) : null}

                  {row.showLevel2 ? (
                    <td rowSpan={row.level2RowSpan} className={`${cellClass} min-w-[160px]`}>
                      <HierarchyContent
                        name={row.level2}
                        code={row.level2Code}
                        showCheckbox={isBulkEditMode && deepestLevel === 'level2'}
                        checked={isSelected}
                        onCheckboxChange={(checked) => onToggleRowSelection?.(row.id, checked)}
                      />
                    </td>
                  ) : null}

                  {row.showProcessLevel3 ? (
                    <td rowSpan={row.processLevel3RowSpan} className={`${cellClass} min-w-[220px]`}>
                      <HierarchyContent
                        name={row.processLevel3}
                        code={row.processLevel3Code}
                        showCheckbox={isBulkEditMode && deepestLevel === 'processLevel3'}
                        checked={isSelected}
                        onCheckboxChange={(checked) => onToggleRowSelection?.(row.id, checked)}
                      />
                    </td>
                  ) : null}

                  <td className={`${cellClass} min-w-[220px]`}>
                    <HierarchyContent
                      name={row.processLevel4}
                      code={row.processLevel4Code}
                      light
                      showCheckbox={isBulkEditMode && deepestLevel === 'processLevel4'}
                      checked={isSelected}
                      onCheckboxChange={(checked) => onToggleRowSelection?.(row.id, checked)}
                    />
                  </td>

                  <td className={`${cellClass} min-w-[140px] border-r-0`}>
                    <RateCardValueCell
                      rowId={row.id}
                      value={row.rateCardValue}
                      isEditing={row.isEditing}
                      isBulkEditMode={isBulkEditMode}
                      onChange={onRateCardValueChange}
                      onEdit={onEditRateCardRow}
                    />
                  </td>
                </tr>
              )
            })
          ) : (
            <tr>
              <td colSpan={7} className="px-4 py-10 text-center text-sm text-[#667085]">
                No records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default RateCardsTable