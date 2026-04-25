export const formatPercentFromDecimal = (value: number) => `${Math.round((value || 0) * 100)}%`

export const formatPercent = (value: number) => `${Math.round(value || 0)}%`

export const formatNumber = (value: number) => new Intl.NumberFormat().format(value || 0)
