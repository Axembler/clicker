const express = require('express')
const router = express.Router()
const User = require('../models/User')
const auth = require('../middleware/auth')

// Увеличить клики и монеты пользователя
router.post('/increment', auth, async (req, res) => {
  try {
    const { increment = 1 } = req.body

    // Защита от некорректных значений
    if (!Number.isInteger(increment) || increment < 1 || increment > 1000) {
      return res.status(400).json({ message: 'Некорректное значение increment' })
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      [
        {
          $set: {
            clicks: { $add: ['$clicks', increment] },
            coins: { $add: ['$coins', { $multiply: ['$clickPower', increment] }] },
            totalCoins: { $add: ['$totalCoins', { $multiply: ['$clickPower', increment] }] }
          }
        }
      ],
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
    res.status(500).json({ message: 'Ошибка сервера', error: error.message })
  }
})

module.exports = router
