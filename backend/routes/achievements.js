const express = require('express')
const router = express.Router()
const Achievement = require('../models/Achievement')
const User = require('../models/User')
const { grantAchievements, PRESTIGE_FIELDS } = require('../services/achievementService')
const auth = require('../middleware/auth')
const { calcPrestigeMultiplier } = require('../services/expressions')
const { formatNumber } = require('../utils/formatNumber')

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

    const multiplier = calcPrestigeMultiplier(user.prestige ?? 0)

    const unlockedMap = new Map(
      user.achievements.map(a => [a._id.toString(), a])
    )

    const achievementsWithStatus = allAchievements.map(achievement => {
      const id = achievement._id.toString()
      const isCoinBased = PRESTIGE_FIELDS.has(achievement.condition.field)

      const scaledValue = isCoinBased
        ? Math.round(achievement.condition.value * multiplier)
        : achievement.condition.value

      return {
        ...achievement,
        description: isCoinBased
          ? `Накопить ${formatNumber(scaledValue)} монет`
          : achievement.description,
        condition: {
          ...achievement.condition,
          value: scaledValue
        },
        reward: {
          ...achievement.reward,
          coins: Math.round(achievement.reward.coins * multiplier)
        },
        unlocked: unlockedMap.has(id),
        unlockedAt: unlockedMap.get(id)?.unlockedAt || null
      }
    })

    res.json({
      success: true,
      total: allAchievements.length,
      unlocked: unlockedMap.size,
      prestige: user.prestige ?? 0,
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

    const multiplier = calcPrestigeMultiplier(user.prestige ?? 0)

    const newAchievements = await grantAchievements(user)

    res.json({
      success: true,
      newAchievements: newAchievements.map(a => {
        const isCoinBased = PRESTIGE_FIELDS.has(a.condition.field)

        const scaledValue = isCoinBased
          ? Math.round(a.condition.value * multiplier)
          : a.condition.value

        return {
          _id: a._id,
          title: a.title,
          description: isCoinBased
            ? `Накопить ${formatNumber(scaledValue)} монет`
            : a.description,
          reward: {
            ...a.reward,
            coins: Math.round(a.reward.coins * multiplier)
          }
        }
      }),
      hasNew: newAchievements.length > 0
    })

  } catch (error) {
    console.error('POST /achievements/check error:', error)
    res.status(500).json({ error: 'Внутренняя ошибка сервера' })
  }
})

module.exports = router
