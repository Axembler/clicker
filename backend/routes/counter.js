const express = require('express')
const router = express.Router()
const User = require('../models/User')
const auth = require('../middleware/auth')
const { validateTimestamps } = require('../services/clickValidation')
const { computeStats } = require('../services/statsService')
const { default: mongoose } = require('mongoose')

router.post('/increment', auth, async (req, res) => {
  try {
    const { timestamps } = req.body

    const validationError = validateTimestamps(timestamps)
    if (validationError) {
      return res.status(400).json({ message: validationError })
    }

    const userId = new mongoose.Types.ObjectId(req.user.id)

    const stats = await computeStats(userId)

    const increment = timestamps.length

    const totalCoins = increment * stats.clickPower

    const coinsEarned = Math.floor(totalCoins)

    const updated = await User.findByIdAndUpdate(
      userId,
      {
        $inc: {
          clicks: increment,
          totalClicks: increment,
          coins: coinsEarned,
          totalCoins: coinsEarned
        }
      },
      { returnDocument: 'after' }
    )

    res.json({
      clicks: updated.clicks,
      coins: updated.coins,
      earned: coinsEarned,
      clickPower: stats.clickPower
    })

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Ошибка сервера' })
  }
})

module.exports = router
