const MIN_CLICK_INTERVAL_MS = 10
const MAX_TIMESTAMPS = 250
const MAX_TIMESTAMP_AGE_MS = 60_000

// Минимальное СКО интервалов
const MIN_INTERVAL_STD_DEV_MS = 10
// Минимальное количество кликов для проверки дисперсии
const MIN_CLICKS_FOR_VARIANCE_CHECK = 8

/**
 * Среднее массива чисел
 */
function mean(values) {
  return values.reduce((sum, v) => sum + v, 0) / values.length
}

/**
 * Отклонение (СКО) массива чисел
 */
function standardDeviation(values) {
  const μ = mean(values)
  const squaredDiffs = values.map(v => (v - μ) ** 2)
  const variance = mean(squaredDiffs)
  return Math.sqrt(variance)
}

function getIntervals(timestamps) {
  const intervals = []
  for (let i = 1; i < timestamps.length; i++) {
    intervals.push(timestamps[i] - timestamps[i - 1])
  }
  return intervals
}

function validateTimestamps(timestamps) {

  if (!Array.isArray(timestamps)) {
    return 'timestamps должен быть массивом'
  }

  if (timestamps.length === 0) {
    return 'timestamps не может быть пустым'
  }

  if (timestamps.length > MAX_TIMESTAMPS) {
    return `Слишком много кликов за один запрос (макс. ${MAX_TIMESTAMPS})`
  }

  const now = Date.now()

  for (let i = 0; i < timestamps.length; i++) {
    const ts = timestamps[i]

    if (!Number.isInteger(ts)) {
      return `timestamps[${i}] не является целым числом`
    }

    if (ts > now + 1000) {
      return `timestamps[${i}] из будущего`
    }

    if (now - ts > MAX_TIMESTAMP_AGE_MS) {
      return `timestamps[${i}] слишком старый`
    }

    if (i > 0) {
      const interval = ts - timestamps[i - 1]

      if (interval < 0) {
        return `timestamps не отсортированы по возрастанию (индекс ${i})`
      }

      if (interval < MIN_CLICK_INTERVAL_MS) {
        return `Слишком быстрые клики: интервал ${interval}мс (мин. ${MIN_CLICK_INTERVAL_MS}мс)`
      }
    }
  }

  if (timestamps.length >= MIN_CLICKS_FOR_VARIANCE_CHECK) {
    const intervals = getIntervals(timestamps)
    const σ = standardDeviation(intervals)

    if (σ < MIN_INTERVAL_STD_DEV_MS) {
      return `Подозрительно равномерные клики (σ=${σ.toFixed(1)}мс)`
    }
  }

  return null
}

module.exports = {
  validateTimestamps,
  getIntervals,
  standardDeviation,
}
