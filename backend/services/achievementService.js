const Achievement = require('../models/Achievement')
const { calcPrestigeMultiplier } = require('../services/expressions')

// Поля, которые масштабируются престижем
const PRESTIGE_FIELDS = new Set(['coins'])

/**
 * Проверяет одно условие достижения
 */
const checkCondition = (user, condition, prestigeMultiplier = 1) => {
  const { field, operator, value } = condition

  const userValue = user[field]

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
      console.warn(`Неизвестный оператор: ${operator}`)
      return false
  }
}

/**
 * Проверяет все достижения для пользователя
 * Возвращает список новых разблокированных достижений
 */
const checkAchievements = async (user, prestigeMultiplier = 1) => {
  try {
    const allAchievements = await Achievement.find({})

    const unlockedAchievements = new Set(
      user.achievements.map(a => a._id.toString())
    )

    const newlyUnlocked = []

    for (const achievement of allAchievements) {
      if (unlockedAchievements.has(achievement._id.toString())) continue

      if (checkCondition(user, achievement.condition, prestigeMultiplier)) {
        newlyUnlocked.push(achievement)
      }
    }

    return newlyUnlocked

  } catch (error) {
    console.error('Ошибка при проверке достижений:', error)
    throw error
  }
}

/**
 * Выдает новые достижения пользователю и начисляет награду
 */
const grantAchievements = async (user) => {
  const prestigeMultiplier = calcPrestigeMultiplier(user.prestige)
  const newlyUnlocked = await checkAchievements(user, prestigeMultiplier)

  if (newlyUnlocked.length === 0) return []

  let totalReward = 0

  for (const achievement of newlyUnlocked) {
    user.achievements.push({
      _id: achievement._id,
      unlockedAt: new Date(),
      title: achievement.title
    })

    const reward = achievement.reward?.coins || 0

    totalReward += Math.floor(reward * prestigeMultiplier)
  }

  if (totalReward > 0) {
    user.coins += totalReward
    user.totalCoins += totalReward
  }

  await user.save()

  return newlyUnlocked
}

module.exports = {
  checkCondition,
  checkAchievements,
  grantAchievements,
  PRESTIGE_FIELDS
}
