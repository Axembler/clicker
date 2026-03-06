export function formatSeconds(seconds: number): string {
  if (seconds <= 0) return '0 сек'

  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  const parts: string[] = []

  if (hours > 0) parts.push(`${hours} ч`)
  if (minutes > 0) parts.push(`${minutes} мин`)
  if (secs > 0) parts.push(`${secs} сек`)

  return parts.join(', ')
}
