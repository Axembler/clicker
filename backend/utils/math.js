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

module.exports = { standardDeviation, getIntervals }