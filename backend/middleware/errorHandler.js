const { logger } = require('../config/logger')

class AppError extends Error {
  constructor(message, status = 500, meta = {}) {
    super(message)
    this.name = 'AppError'
    this.status = status
    this.meta = meta
  }
}

const errorHandler = (err, req, res, next) => {
  const status = err.status ?? 500
  const isOperational = err instanceof AppError

  const logLevel = status >= 500 ? 'error' : 'warn'

  logger[logLevel](err.message, {
    status,
    method:  req.method,
    url:     req.originalUrl,
    userId:  req.user?.id ?? null,
    meta:    err.meta ?? {},
    stack:   err.stack,
  })

  const message =
    isOperational || process.env.NODE_ENV !== 'production'
      ? err.message
      : 'Внутренняя ошибка сервера'

  res.status(status).json({
    message,
    ...(err.meta ?? {}),
  })
}

module.exports = { errorHandler, AppError }
