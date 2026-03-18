const express = require('express')
const router = express.Router()
const { default: mongoose } = require('mongoose')
const auth = require('../middleware/auth')
const Achievement = require('../models/Achievement')
const User = require('../models/User')
const UserAchievements = require('../models/UserAchievements')
const { grantAchievements } = require('../services/achievementService')
const { computeStats } = require('../services/statsService')

// Получить все достижения
router.get('/', auth, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id)

    const [achievements, { prestigeMultiplier }] = await Promise.all([
      Achievement.find(),
      computeStats(userId),
    ])

    res.json(achievements.map((achievement) => achievement.applyPrestige(prestigeMultiplier)))
  } catch (error) {
    console.log('Error: ', error.message)
    
    res.status(500).json({ message: 'Ошибка сервера' })
  }
})

// Получить все достижения пользователя
router.get('/user', auth, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id)
    
    const userAchievements = await UserAchievements.find({ user: userId })
      .populate('achievement', 'title description condition reward')

    res.json(userAchievements)
  } catch (error) {
    console.log(error.message)
    
    res.status(500).json({ message: 'Ошибка сервера' })
  }
})

// Проверить и получить достижения
router.post('/check', auth, async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.user.id)
  
  try {
    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' })
    }

    const { prestigeMultiplier } = await computeStats(userId)

    const achievements = await grantAchievements(user, prestigeMultiplier)

    res.json(achievements)
  } catch (error) {
    console.log(error)

    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

// Получить конкретное достижение
router.post('/receive/:achievementId', auth, async (req, res) => {
  try {
    const userId = req.user.id
    const { achievementId } = req.params

    const [achievement, user, existingUserAchievement ] = await Promise.all([
      Achievement.findById(achievementId),
      User.findById(userId),
      UserAchievements.findOne({ user: userId, achievement: achievementId })
    ])

    if (!achievement) {
      return res.status(404).json({ message: 'Достижение не найдено' })
    }
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' })
    }

    if (existingUserAchievement) {
      return res.status(400).json({ message: 'Достижение уже получено' })
    }

    const newUserAchievement = new UserAchievements({
      user: userId,
      achievement: achievementId
    })

    await Promise.all([user.save(), newUserAchievement.save()])

    res.json({
      message: `Достижение "${achievement.name}" получено`,
      userAchievement: newUserAchievement
    })
  } catch (error) {
    console.log(error.message)

    res.status(500).json({ message: 'Ошибка сервера' })
  }
})

module.exports = router
