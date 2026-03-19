const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()
const { errorHandler } = require('./middleware/errorHandler')
const { logger } = require('./config/logger')

const clickRoutes = require('./routes/click')
const authRoutes = require('./routes/auth')
const itemsRoutes = require('./routes/items')
const userRoutes = require('./routes/user')
const recordsRoutes = require('./routes/records')
const achievementsRoutes = require('./routes/achievements')
const skillsRoutes = require('./routes/skills')
const statsRoutes = require('./routes/stats')
const sessionRoutes = require('./routes/session')
const prestigeRoutes = require('./routes/prestige')

const app = express()

app.use(cors())
app.use(express.json())

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`, { userId: req.user?.id })
  next()
})

// Подключение к MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => logger.info('✅ MongoDB connected'))
  .catch((err) => logger.error('❌ Error connect', { stack: err.stack }))


// Роуты
app.use('/click', clickRoutes)
app.use('/auth', authRoutes)
app.use('/user', userRoutes)
app.use('/records', recordsRoutes)
app.use('/achievements', achievementsRoutes)
app.use('/items', itemsRoutes)
app.use('/skills', skillsRoutes)
app.use('/stats', statsRoutes)
app.use('/session', sessionRoutes)
app.use('/prestige', prestigeRoutes)

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' })
})

app.use(errorHandler)

process.on('uncaughtException',  (err) => logger.error('uncaughtException',  { stack: err.stack }))
process.on('unhandledRejection', (err) => logger.error('unhandledRejection', { stack: err.stack }))

app.listen(process.env.PORT || 3001, () => {
  console.log(`Сервер запущен на порту ${process.env.PORT}`)
})
