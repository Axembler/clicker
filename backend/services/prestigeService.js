const mongoose = require('mongoose')
const User = require('../models/User')
const Achievement = require('../models/Achievement')
const UserItems = require('../models/UserItems')
const UserAchievements = require('../models/UserAchievements')
const { AppError } = require('../middleware/errorHandler')

const applyPrestige = async (userId) => {
  const objectId = new mongoose.Types.ObjectId(userId)

  const [user, userAchievementsCount, totalAchievements] = await Promise.all([
    User.findById(objectId),
    UserAchievements.countDocuments({ user: objectId }),
    Achievement.countDocuments()
  ])

  if (!user) {
    throw new AppError('Пользователь не найден', 404, { userId })
  }

  if (userAchievementsCount < totalAchievements) {
    throw new AppError('Необходимо получить все достижения для престижа', 400, {
      current: userAchievementsCount,
      required: totalAchievements
    })
  }

  const [updatedUser] = await Promise.all([
    User.findByIdAndUpdate(
      objectId,
      {
        $inc: { prestige: 1, skillPoints: 1 },
        $set: { coins: 0, clicks: 0 },
      },
      { returnDocument: 'after' }
    ),
    UserItems.deleteMany({ user: objectId }),
    UserAchievements.deleteMany({ user: objectId })
  ])

  return {
    message: `Престиж повышен до ${updatedUser.prestige}`,
    prestige: updatedUser.prestige,
    coins: updatedUser.coins,
    clicks: updatedUser.clicks,
    skillPoints: updatedUser.skillPoints
  }
}

module.exports = { applyPrestige }
