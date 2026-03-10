const express = require('express')
const router = express.Router()
const User = require('../models/User')
const Achievement = require('../models/Achievement')
const auth = require('../middleware/auth')
const passiveIncome = require('../middleware/passiveIncome')

// Получить объект пользователя (без пароля)
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' })
    }

    res.json(user)
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ message: 'Ошибка сервера', error: error.message })
  }
})

// Получить предметы пользователя
router.get('/items', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('items')

    res.json(user.items)
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ message: 'Ошибка сервера' })
  }
})

router.post('/prestige', auth, async (req, res) => {
  try {
    const [user, totalAchievements] = await Promise.all([
      User.findById(req.user.id),
      Achievement.countDocuments()
    ])

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' })
    }

    if (user.achievements.length < totalAchievements) {
      return res.status(400).json({
        message: 'Необходимо получить все достижения для престижа',
        current: user.achievements.length,
        required: totalAchievements
      })
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        $inc: { prestige: 1 },
        $set: {
          coins: 0,
          clicks: 0,
          clickPower: 1,
          passiveIncome: 0,
          items: [],
          achievements: []
        }
      },
      { returnDocument: true }
    )

    res.json({
      message: 'Престиж повышен',
      prestige: updatedUser.prestige,
      coins: updatedUser.coins,
      clicks: updatedUser.clicks
    })
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ message: 'Ошибка сервера' })
  }
})



// Вызывается при ВОЗВРАТЕ в приложение
router.post('/wakeup', auth, passiveIncome, (req, res) => {
  const user = req.userDoc

  res.json({
    id: user._id,
    username: user.username,
    coins: user.coins,
    totalCoins: user.totalCoins,
    clicks: user.clicks,
    totalClicks: user.totalClicks,
    clickPower: user.clickPower,
    passiveIncome: user.passiveIncome,
    items: user.items,
    passiveEarned: req.passiveEarned || 0,
    passiveSeconds: req.passiveSeconds || 0,
    prestige: req.prestige
  })
})

// Вызывается, когда пользователь УХОДИТ из приложения
router.post('/sleep', auth, async (req, res) => {
  try {
    const clientSleepAt = req.body?.sleepAt
    const now = Date.now()
    
    const lastOnline = (clientSleepAt && clientSleepAt <= now)
      ? new Date(clientSleepAt)
      : new Date()

    await User.findByIdAndUpdate(req.user.id, { lastOnline })
    res.json({ ok: true })
  } catch {
    console.log(error.message)
    res.status(500).json({ message: 'Ошибка сервера' })
  }
})

module.exports = router
