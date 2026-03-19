const Achievement = require('../models/Achievement')
const User = require('../models/User')
const UserAchievements = require('../models/UserAchievements')
const UserItems = require('../models/UserItems')
const { checkCondition } = require('../utils/achievementConditions')

const EXTERNAL_FIELDS = {
  items: (userId) => UserItems.find({ user: userId }).lean(),
}

const buildUserContext = async (user, achievements) => {
  const requiredFields = new Set(achievements.map((a) => a.condition.field))
  const context = user.toObject ? user.toObject() : { ...user }

  const externalFetches = [...requiredFields]
    .filter((field) => EXTERNAL_FIELDS[field])
    .map((field) =>
      EXTERNAL_FIELDS[field](user._id).then((data) => ({ field, data }))
    )

  const results = await Promise.all(externalFetches)

  for (const { field, data } of results) {
    context[field] = data
  }

  return context
}

const getUserAchievements = (userId) =>
  UserAchievements.find({ user: userId }).populate(
    'achievement',
    'title description condition reward'
  )

const grantAchievements = async (user, prestigeMultiplier) => {
  const [allAchievements, userAchievements] = await Promise.all([
    Achievement.find(),
    UserAchievements.find({ user: user._id }, { achievement: 1 }).lean(),
  ])

  const unlockedIds = new Set(
    userAchievements.map((ua) => ua.achievement.toString())
  )

  const lockedAchievements = allAchievements.filter(
    (a) => !unlockedIds.has(a._id.toString())
  )

  const userContext = await buildUserContext(user, lockedAchievements)

  const newlyUnlocked = lockedAchievements.filter((a) =>
    checkCondition(userContext, a.condition, prestigeMultiplier)
  )

  if (newlyUnlocked.length === 0) return []

  const totalReward = newlyUnlocked.reduce(
    (sum, a) => sum + Math.floor((a.reward?.coins || 0) * prestigeMultiplier),
    0
  )

  const savePromises = [
    UserAchievements.insertMany(
      newlyUnlocked.map((a) => ({
        user: user._id,
        achievement: a._id,
        unlockedAt: new Date(),
      })),
      { ordered: false }
    ),
  ]

  if (totalReward > 0) {
    user.coins += totalReward
    user.totalCoins += totalReward
    savePromises.push(user.save())
  }

  await Promise.all(savePromises)

  return newlyUnlocked.map((a) => a.applyPrestige(prestigeMultiplier))
}

const receiveAchievement = async (userId, achievementId) => {
  const [achievement, user, existing] = await Promise.all([
    Achievement.findById(achievementId),
    User.findById(userId),
    UserAchievements.findOne({ user: userId, achievement: achievementId }),
  ])

  if (!achievement) {
    throw new AppError('Достижение не найдено', 404, { achievementId })
  }

  if (!user) {
    throw new AppError('Пользователь не найден', 404, { userId })
  }

  if (existing) {
    throw new AppError('Достижение уже получено', 404, { achievementId })
  }

  const userAchievement = new UserAchievements({
    user: userId,
    achievement: achievementId,
  })

  await userAchievement.save()

  return { achievement, userAchievement }
}

module.exports = {
  getUserAchievements,
  grantAchievements,
  receiveAchievement,
}
