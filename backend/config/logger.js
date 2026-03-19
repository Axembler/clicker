const path = require('path')
const { createLogger, format, transports } = require('winston')

const { combine, timestamp, printf, colorize, errors } = format

const consoleFormat = combine(
  colorize(),
  timestamp({ format: 'HH:mm:ss' }),
  errors({ stack: true }),

  printf(({ level, message, timestamp, stack, ...meta }) => {
    const metaStr = Object.keys(meta).length
      ? '\n' + JSON.stringify(meta, null, 2)
      : ''

    return `[${timestamp}] ${level}: ${stack ?? message}${metaStr}`
  })
)

const fileFormat = combine(
  timestamp(),
  errors({ stack: true }),
  format.json()
)

const logger = createLogger({
  level: process.env.LOG_LEVEL ?? 'info',
  transports: [
    ...(process.env.NODE_ENV !== 'production'
      ? [new transports.Console({ format: consoleFormat })]
      : []),

    new transports.File({
      filename: path.join('logs', 'combined.log'),
      format: fileFormat
    }),

    new transports.File({
      filename: path.join('logs', 'error.log'),
      level: 'error',
      format: fileFormat
    })
  ]
})

const catchAsync = (fn) => (req, res, next) => {
  fn(req, res, next).catch(next)
}

module.exports = { logger, catchAsync }
