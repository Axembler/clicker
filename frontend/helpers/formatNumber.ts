export const formatNumber = (n: number | undefined | null): string => {
  if (n === undefined || n === null) return '0'

  const floorToFixed1 = (value: number): string =>
    (Math.floor(value * 10) / 10).toFixed(1)

  const THRESHOLDS = [
    { value: 1_000_000_000_000, suffix: 'T' },
    { value: 1_000_000_000,     suffix: 'B' },
    { value: 1_000_000,         suffix: 'M' },
    { value: 1_000,             suffix: 'K' }
  ] as const

  const absN = Math.abs(n)

  for (const { value, suffix } of THRESHOLDS) {
    if (absN >= value) {
      return `${floorToFixed1(absN / value)}${suffix}`
    }
  }

  return Number.isInteger(n) ? String(n) : n.toFixed(1)
}
