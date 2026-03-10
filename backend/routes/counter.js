const express = require('express')
const router = express.Router()
const User = require('../models/User')
const auth = require('../middleware/auth')
const { validateTimestamps } = require('../services/clickValidation')
const { prestigeMultiplier } = require('../services/expressions')

router.post('/increment', auth, async (req, res) => {
  try {
    const { timestamps } = req.body

    const validationError = validateTimestamps(timestamps)

    if (validationError) {
      return res.status(400).json({ message: validationError })
    }

    const increment = timestamps.length

    const coinsEarned = {
      $multiply: ['$clickPower', increment, prestigeMultiplier]
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      [{
        $set: {
          clicks:      { $add: ['$clicks', increment] },
          totalClicks: { $add: ['$totalClicks', increment] },
          coins:       { $add: ['$coins', coinsEarned] },
          totalCoins:  { $add: ['$totalCoins', coinsEarned] }
        }
      }],
      {
        returnDocument: 'after',
        updatePipeline: true
      }
    )

    

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' })
    }

    res.json({ clicks: user.clicks, coins: user.coins })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Ошибка сервера' })
  }
})

module.exports = router
