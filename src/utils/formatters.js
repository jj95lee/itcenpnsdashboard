export function formatNumber(value) {
  if (value === null || value === undefined || value === '') {
    return '-'
  }

  return Number(value).toLocaleString()
}

export function calcChange(y2024, y2025) {
  if (y2024 == null || y2025 == null) return null
  return y2025 - y2024
}

export function calcYoy(y2024, y2025) {
  if (y2024 == null || y2025 == null) return null
  if (y2024 === 0) return 0
  return ((y2025 - y2024) / y2024) * 100
}

export function formatYoy(value) {
  if (value == null) return '-'

  const sign = value > 0 ? '+' : ''
  return `${sign}${value.toFixed(1)}%`
}