const { default: mongoose } = require('mongoose')
const User = require('../models/User')
const { validateTimestamps } = require('./clickValidation')
const { computeStats } = require('./statsService')

const increment = async (userId, timestamps) => {
  const validationError = validateTimestamps(timestamps)

  if (validationError) {
    throw new AppError('Ошибка валидации клика', 400, { validationError })
  }

  const objectId = new mongoose.Types.ObjectId(userId)
  const stats = await computeStats(objectId)

  const clickCount = timestamps.length
  const coinsEarned = Math.floor(clickCount * stats.clickPower)

  const updated = await User.findByIdAndUpdate(
    objectId,
    {
      $inc: {
        clicks: clickCount,
        totalClicks: clickCount,
        coins: coinsEarned,
        totalCoins: coinsEarned
      }
    },
    { returnDocument: 'after' }
  )

  return {
    clicks: updated.clicks,
    coins: updated.coins,
    earned: coinsEarned,
    clickPower: stats.clickPower
  }
}

module.exports = { increment }
