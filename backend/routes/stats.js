const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const { computeStats } = require('../services/statsService')
const { default: mongoose } = require('mongoose')

// Получить все статы текущего пользователя
router.get('/', auth, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id)

    const stats = await computeStats(userId)

    res.json(stats)
  } catch (error) {
    console.error('Error: ', error.message)

    res.status(500).json({ message: 'Ошибка сервера' })
  }
})

module.exports = router
