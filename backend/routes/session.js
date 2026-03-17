const express = require('express')
const router = express.Router()
const User = require('../models/User')
const auth = require('../middleware/auth')
const passiveIncome = require('../middleware/passiveIncome')

// Вызывается при возврате в приложение
router.post('/wakeup', auth, passiveIncome, (req, res) => {
  const user = req.userDoc

  if (!user) {
    return res.status(404).json({ message: 'Пользователь не найден' })
  }

  res.json({
    passiveEarned: req.passiveEarned || 0,
    passiveSeconds: req.passiveSeconds || 0,
  })
})

// Вызывается, когда пользователь уходит из приложения
router.post('/sleep', auth, async (req, res) => {
  try {
    const clientSleepAt = req.body?.sleepAt
    const now = Date.now()
    
    const lastOnline = (clientSleepAt && clientSleepAt <= now)
      ? new Date(clientSleepAt)
      : new Date()

    await User.findByIdAndUpdate(req.user.id, { lastOnline })
    
    res.json({ ok: true })
  } catch (error) {
    console.log(error.message)

    res.status(500).json({ message: 'Ошибка сервера' })
  }
})

module.exports = router
