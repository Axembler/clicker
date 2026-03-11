import { apiClient } from './apiClient'

interface HealthCache {
  result: boolean
  timestamp: number
}

let cache: HealthCache | null = null
const CACHE_TTL = 5000

export const checkHealth = async (useCache = true): Promise<boolean> => {
  const now = Date.now()

  if (useCache && cache && now - cache.timestamp < CACHE_TTL) {
    return cache.result
  }

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 3000)

    const response = await apiClient('/health', {
      method: 'GET',
      signal: controller.signal,
    })

    clearTimeout(timeout)

    if (!response.ok) {
      cache = { result: false, timestamp: now }
      return false
    }

    const data = await response.json()
    const isOk = data?.status === 'ok'

    cache = { result: isOk, timestamp: now }
    return isOk
  } catch {
    cache = { result: false, timestamp: now }
    return false
  }
}

export const invalidateHealthCache = () => {
  cache = null
}
