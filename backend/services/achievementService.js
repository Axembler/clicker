const Achievement = require('../models/Achievement')
const UserAchievements = require('../models/UserAchievements')
const UserItems = require('../models/UserItems')
const { PRESTIGE_FIELDS } = require('../constants/achievementConstants')

const EXTERNAL_FIELDS = {
  items: (userId) => UserItems.find({ user: userId }).lean(),
}

const buildUserContext = async (user, achievements) => {
  const requiredFields = new Set(achievements.map((a) => a.condition.field))

  const context = user.toObject ? user.toObject() : { ...user }

  const externalFetches = []

  for (const field of requiredFields) {
    if (EXTERNAL_FIELDS[field]) {
      externalFetches.push(
        EXTERNAL_FIELDS[field](user._id).then((data) => ({ field, data }))
      )
    }
  }

  const externalResults = await Promise.all(externalFetches)

  for (const { field, data } of externalResults) {
    context[field] = data
  }

  return context
}

const checkCondition = (userContext, condition, prestigeMultiplier) => {
  const { field, operator, value } = condition

  const userValue = userContext[field]
  if (userValue === undefined || userValue === null) return false

  const effectiveValue = PRESTIGE_FIELDS.has(field)
    ? value * prestigeMultiplier
    : value

  switch (operator) {
    case 'gte':
      return userValue >= effectiveValue
    case 'lte':
      return userValue <= effectiveValue
    case 'eq':
      return userValue === effectiveValue
    case 'length_gte':
      if (!Array.isArray(userValue)) return false
      return userValue.length >= effectiveValue
    default:
      return false
  }
}

const checkAchievements = async (user, prestigeMultiplier) => {
  const [allAchievements, userAchievements] = await Promise.all([
    Achievement.find(),
    UserAchievements.find({ user: user._id }, { achievement: 1 }).lean(),
  ])

  const unlockedIds = new Set(
    userAchievements.map((ua) => ua.achievement.toString())
  )

  const lockedAchievements = allAchievements.filter(
    (achievement) => !unlockedIds.has(achievement._id.toString())
  )

  const userContext = await buildUserContext(user, lockedAchievements)

  return lockedAchievements.filter((achievement) =>
    checkCondition(userContext, achievement.condition, prestigeMultiplier)
  )
}

const grantAchievements = async (user, prestigeMultiplier) => {
  const newlyUnlocked = await checkAchievements(user, prestigeMultiplier)

  if (newlyUnlocked.length === 0) return []

  const achievementDocs = newlyUnlocked.map((achievement) => ({
    user: user._id,
    achievement: achievement._id,
    unlockedAt: new Date(),
  }))

  const totalReward = newlyUnlocked.reduce((sum, achievement) => {
    const coins = achievement.reward?.coins || 0
    return sum + Math.floor(coins * prestigeMultiplier)
  }, 0)

  const savePromises = [
    UserAchievements.insertMany(achievementDocs, { ordered: false }),
  ]

  if (totalReward > 0) {
    user.coins += totalReward
    user.totalCoins += totalReward
    savePromises.push(user.save())
  }

  await Promise.all(savePromises)

  return newlyUnlocked.map((achievement) =>
    achievement.applyPrestige(prestigeMultiplier)
  )
}

module.exports = { grantAchievements }
