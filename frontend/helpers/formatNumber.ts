export const formatNumber = (n: number | undefined): string => {
  if (n === undefined || n === null) return '0'

  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}K`
  
  // Для дробных чисел вроде 0.5 — тоже хорошо обработать
  return Number.isInteger(n) ? String(n) : n.toFixed(1)
}