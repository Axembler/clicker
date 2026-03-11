import { checkHealth } from "./healthCheck"

// Класс нужен для корректной обработки ошибок (instanceof)
export class ServerUnavailableError extends Error {
  constructor() {
    super('Сервер недоступен')
    this.name = 'ServerUnavailableError'
  }
}

export const withHealthCheck = <T extends unknown[], R>(
  fn: (...args: T) => Promise<R>
) => {
  return async (...args: T): Promise<R> => {
    const isHealthy = await checkHealth()

    if (!isHealthy) {
      throw new ServerUnavailableError()
    }

    return fn(...args)
  }
}
