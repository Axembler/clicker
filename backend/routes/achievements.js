const express = require('express')
const router = express.Router()
const Achievement = require('../models/Achievement')
const User = require('../models/User')
const { grantAchievements } = require('../services/achievementService')
const auth = require('../middleware/auth')

/**
 * GET /achievements
 * Получить все достижения с прогрессом пользователя
 */
router.get('/', auth, async (req, res) => {
  try {
    const [allAchievements, user] = await Promise.all([
      Achievement.find({}).lean(),
      User.findById(req.user.id).lean()
    ])

    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' })
    }

    const unlockedMap = new Map(
      user.achievements.map(a => [a._id.toString(), a])
    )

    // Добавляем статус к каждому достижению
    const achievementsWithStatus = allAchievements.map(achievement => ({
      ...achievement,
      unlocked: unlockedMap.has(achievement._id),
      unlockedAt: unlockedMap.get(achievement._id)?.unlockedAt || null
    }))

    res.json({
      success: true,
      total: allAchievements.length,
      unlocked: unlockedMap.size,
      achievements: achievementsWithStatus
    })

  } catch (error) {
    console.error('GET /achievements error:', error)
    res.status(500).json({ error: 'Внутренняя ошибка сервера' })
  }
})

/**
 * POST /achievements/check
 * Проверить и выдать новые достижения
 * Вызывается после клика / покупки / любого действия
 */
router.post('/check', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)

    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' })
    }

    const newAchievements = await grantAchievements(user)

    res.json({
      success: true,
      newAchievements: newAchievements.map(a => ({
        _id: a._id,
        title: a.title,
        description: a.description,
        icon: a.icon,
        reward: a.reward
      })),
      hasNew: newAchievements.length > 0
    })

  } catch (error) {
    console.error('POST /achievements/check error:', error)
    res.status(500).json({ error: 'Внутренняя ошибка сервера' })
  }
})

module.exports = router
