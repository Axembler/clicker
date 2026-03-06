const Achievement = require('../models/Achievement')

/**
 * Проверяет одно условие достижения
 */
const checkCondition = (user, condition) => {
  const { field, operator, value } = condition

  const userValue = user[field]

  if (userValue === undefined || userValue === null) return false

  switch (operator) {
    case 'gte':
      return userValue >= value

    case 'lte':
      return userValue <= value

    case 'eq':
      return userValue === value

    case 'length_gte':
      if (!Array.isArray(userValue)) return false

      return userValue.length >= value

    default:
      console.warn(`Неизвестный оператор: ${operator}`)

      return false
  }
}

/**
 * Проверяет все достижения для пользователя
 * Возвращает список новых разблокированных достижений
 */
const checkAchievements = async (user) => {
  try {
    const allAchievements = await Achievement.find({})

    // Ключи уже полученных достижений пользователя
    const unlockedAchievements = new Set(user.achievements.map(a => a._id))

    const newlyUnlocked = []

    for (const achievement of allAchievements) {
      // Пропускаем уже полученные
      if (unlockedAchievements.has(achievement._id)) continue

      // Проверяем условие
      if (checkCondition(user, achievement.condition)) {
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
 *  Выдает новые достижения пользователю и начисляет награду
 */
const grantAchievements = async (user) => {
  const newlyUnlocked = await checkAchievements(user)

  if (newlyUnlocked.length === 0) return []

  let totalReward = 0

  for (const achievement of newlyUnlocked) {
    user.achievements.push({
      _id: achievement._id,
      unlockedAt: new Date(),
      rewardClaimed: true
    })

    totalReward += achievement.reward?.coins || 0
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
  grantAchievements
}
