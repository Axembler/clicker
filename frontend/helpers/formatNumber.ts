export const formatNumber = (n: number | undefined): string => {
  if (n === undefined || n === null) return '0'

  const floorToFixed1 = (value: number): string =>
    (Math.floor(value * 10) / 10).toFixed(1)

  if (n >= 1_000_000) return `${floorToFixed1(n / 1_000_000)}M`
  if (n >= 1_000)     return `${floorToFixed1(n / 1_000)}K`

  return Number.isInteger(n) ? String(n) : n.toFixed(1)
}
