// ─── Константы ────────────────────────────────────────────────────────────────

const MAX_TIMESTAMPS          = 250
const MAX_TIMESTAMP_AGE_MS    = 60_000

/** Окно, в котором клики считаются «одновременными» (мультитач) */
const BURST_WINDOW_MS         = 50

/** Максимум пальцев в одной пачке */
const MAX_FINGERS_PER_BURST   = 6

/** Минимальное СКО интервалов между пачками (защита от бота) */
const MIN_INTERVAL_STD_DEV_MS = 8

/** Минимум пачек для проверки дисперсии */
const MIN_BURSTS_FOR_VARIANCE_CHECK = 10

function mean(values) {
  return values.reduce((sum, v) => sum + v, 0) / values.length
}

function standardDeviation(values) {
  const μ = mean(values)
  const variance = mean(values.map(v => (v - μ) ** 2))
  return Math.sqrt(variance)
}

function getIntervals(timestamps) {
  const intervals = []
  for (let i = 1; i < timestamps.length; i++) {
    intervals.push(timestamps[i] - timestamps[i - 1])
  }
  return intervals
}

/**
 * Превращает плоский массив тайпштампов в массив пачек.
 * Пачка — это массив кликов, первый и последний из которых
 * отличаются не более чем на BURST_WINDOW_MS.
 *
 * @param {number[]} timestamps — отсортированный массив
 * @returns {number[][]}
 */
function groupIntoBursts(timestamps) {
  const bursts = []
  let burst = [timestamps[0]]

  for (let i = 1; i < timestamps.length; i++) {
    // Сравнение с началом текущей пачки
    if (timestamps[i] - burst[0] <= BURST_WINDOW_MS) {
      burst.push(timestamps[i])
    } else {
      bursts.push(burst)
      burst = [timestamps[i]]
    }
  }

  bursts.push(burst)
  return bursts
}

function validateTimestamps(timestamps) {

  if (!Array.isArray(timestamps)) {
    return 'timestamps должен быть массивом'
  }
  if (timestamps.length === 0) {
    return 'timestamps не может быть пустым'
  }

  if (timestamps.length > MAX_TIMESTAMPS) {
    return 'Слишком много кликов за один запрос'
  }

  const now = Date.now()

  for (let i = 0; i < timestamps.length; i++) {
    const ts = timestamps[i]

    if (!Number.isInteger(ts)) {
      return `timestamps[${i}] не является целым числом`
    }

    if (ts > now + 10_000) {
      return 'Клик из будущего'
    }

    if (now - ts > MAX_TIMESTAMP_AGE_MS) {
      return 'Клик слишком старый'
    }

    if (i > 0 && ts < timestamps[i - 1]) {
      return `timestamps не отсортированы по возрастанию (индекс ${i})`
    }
  }

  const bursts = groupIntoBursts(timestamps)

  for (let i = 0; i < bursts.length; i++) {
    const burst = bursts[i]

    // Слишком много одновременных кликов
    if (burst.length > MAX_FINGERS_PER_BURST) {
      return `Слишком много одновременных кликов (пачка ${i}: ${burst.length} шт., макс. ${MAX_FINGERS_PER_BURST})`
    }
  }

  if (bursts.length >= MIN_BURSTS_FOR_VARIANCE_CHECK) {
    const burstStarts    = bursts.map(b => b[0])
    const burstIntervals = getIntervals(burstStarts)
    const σ              = standardDeviation(burstIntervals)

    if (σ < MIN_INTERVAL_STD_DEV_MS) {
      return `Подозрительно равномерные клики (СКО = ${σ.toFixed(2)}ms)`
    }
  }

  return null
}

module.exports = {
  validateTimestamps,
  groupIntoBursts,
  getIntervals,
  standardDeviation,
}
