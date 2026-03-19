const mongoose = require('mongoose')
const User = require('../models/User')
const Achievement = require('../models/Achievement')
const { getUserAchievements, grantAchievements, receiveAchievement } = require('../services/achievementsService')
const { computeStats } = require('../services/statsService')
const { catchAsync } = require('../config/logger')

// GET /achievements
const getAchievements = catchAsync(async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.user.id)
  const [achievements, { prestigeMultiplier }] = await Promise.all([
    Achievement.find(),
    computeStats(userId),
  ])

  res.json(achievements.map((a) => a.applyPrestige(prestigeMultiplier)))
})

// GET /achievements/user
const getUserAchievementsHandler = catchAsync(async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.user.id)
  const achievements = await getUserAchievements(userId)

  res.json(achievements)
})

// POST /achievements/check
const checkAchievementsHandler = catchAsync(async (req, res, next) => {
  const userId = new mongoose.Types.ObjectId(req.user.id)
  const user = await User.findById(userId)

  if (!user) {
    return next(new AppError('Пользователь не найден', 404, { userId }))
  }

  const { prestigeMultiplier } = await computeStats(userId)
  const achievements = await grantAchievements(user, prestigeMultiplier)

  res.json(achievements)
})

// POST /achievements/receive/:achievementId
const receiveAchievementHandler = catchAsync(async (req, res) => {
  const { achievementId } = req.params
  const userId = req.user.id

  const { achievement, userAchievement } = await receiveAchievement(
    userId,
    achievementId
  )

  res.json({
    message: `Достижение "${achievement.title}" получено`,
    userAchievement,
  })
})

module.exports = {
  getAchievements,
  getUserAchievements: getUserAchievementsHandler,
  checkAchievements: checkAchievementsHandler,
  receiveAchievement: receiveAchievementHandler,
}
