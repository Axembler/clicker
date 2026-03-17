const { default: mongoose } = require('mongoose')
const User = require('../models/User')
const { computeStats } = require('../services/statsService')

const MAX_OFFLINE_HOURS = 12
const MIN_OFFLINE_SECONDS = 4

const passiveIncome = async (req, res, next) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id)

    const [user, { passiveIncome }] = await Promise.all([
      User.findById(userId),
      computeStats(userId)
    ])

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' })
    }

    const now = new Date()

    const serverLastOnline = user.lastOnline ? new Date(user.lastOnline) : null

    const clientFallback = req.body?.fallbackSleepAt
      ? new Date(req.body.fallbackSleepAt)
      : null

    // Защита
    const isFutureDate = (date) => date && date > now

    let sleepAt = serverLastOnline

    if (clientFallback && !isFutureDate(clientFallback)) {
      if (!serverLastOnline || clientFallback > serverLastOnline) {
        // Клиентский fallback новее — значит /sleep не успел записать
        sleepAt = clientFallback
      }
    }

    // Подсчет пассивного дохода
    if (sleepAt && passiveIncome > 0) {
      const diffSeconds = Math.floor((now - sleepAt) / 1000)

      if (diffSeconds >= MIN_OFFLINE_SECONDS) {
        const maxSeconds = MAX_OFFLINE_HOURS * 3600
        const effectiveSeconds = Math.min(diffSeconds, maxSeconds)
        const earned = Math.floor(passiveIncome * effectiveSeconds)

        if (earned > 0) {
          user.coins += earned
          user.totalCoins += earned
          req.passiveEarned = earned
          req.passiveSeconds = effectiveSeconds
        }
      }
    }

    // Дефолт если req.passiveEarned не был установлен
    if (req.passiveEarned === undefined) {
      req.passiveEarned = 0
      req.passiveSeconds = 0
    }

    user.lastOnline = now
    
    await user.save()

    req.userDoc = user

    next()
  } catch (err) {
    console.error('Ошибка passiveIncome middleware:', err)
    res.status(500).json({ message: 'Ошибка сервера' })
  }
}

module.exports = passiveIncome
