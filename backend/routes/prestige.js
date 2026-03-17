const express = require('express')
const router = express.Router()
const User = require('../models/User')
const Achievement = require('../models/Achievement')
const UserItems = require('../models/UserItems')
const UserAchievements = require('../models/UserAchievements')
const auth = require('../middleware/auth')

router.post('/', auth, async (req, res) => {
  try {
    const userId = req.user.id

    const [userAchievementsCount, totalAchievements] = await Promise.all([
      UserAchievements.countDocuments({ user: userId }),
      Achievement.countDocuments()
    ])

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' })
    }

    if (userAchievementsCount < totalAchievements) {
      return res.status(400).json({
        message: 'Необходимо получить все достижения для престижа',
        current: userAchievementsCount,
        required: totalAchievements
      })
    }

    const [updatedUser] = await Promise.all([
      User.findByIdAndUpdate(
        userId,
        {
          $inc: { prestige: 1, skillPoints: 1 },
          $set: { coins: 0, clicks: 0 }
        },
        { returnDocument: 'after' }
      ),
      UserItems.deleteMany({ user: userId }),
      UserAchievements.deleteMany({ user: userId })
    ])

    res.json({
      message: `Престиж повышен до ${updatedUser.prestige}`,
      prestige: updatedUser.prestige,
      coins: updatedUser.coins,
      clicks: updatedUser.clicks,
      skillPoints: updatedUser.skillPoints
    })
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ message: 'Ошибка сервера' })
  }
})

module.exports = router
