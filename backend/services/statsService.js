const UserSkills = require('../models/UserSkills')
const UserItems = require('../models/UserItems')
const User = require('../models/User')
const SKILL_EFFECTS = require('../utils/skillEffects')
const { calcPrestigeMultiplier } = require('./expressions')

/**
 * @typedef {Object} ComputedStats
 * @property {number} prestigeMultiplier      — множитель от престижа
 * @property {number} clickPower              — итоговая сила клика
 * @property {number} passiveIncome           — пассивный доход
 */

/**
 * Считает полные итоговые статы пользователя:
 * престиж + скиллы + предметы + базовые значения.
 *
 * @param {string|ObjectId} userId
 * @returns {Promise<ComputedStats>}
 */
async function computeStats(userId) {
  const [user, userSkills, userItems] = await Promise.all([
    User.findById(userId),
    UserSkills.find({ user: userId }).lean(),
    UserItems.find({ user: userId }).populate('item').lean()
  ])

  if (!user) throw new Error('Пользователь не найден')

  const stats = {
    clickPower: 1,
    totalClicks: user.totalClicks ?? 0,
    passiveIncome: 0,
    prestigeMultiplier: calcPrestigeMultiplier(user.prestige ?? 0),
  }

  let clickPowerBase = 1
  let clickPowerSkill = 0
  let clickPowerItem = 1

  for (const us of userSkills) {
    const effectFn = SKILL_EFFECTS[us.nodeId]
    if (!effectFn) continue

    const effect = effectFn(us.level)
    if (effect.clickPowerSkill != null) {
      clickPowerSkill += effect.clickPowerSkill
    }
  }

  for (const ui of userItems) {
    if (!ui.item) continue

    clickPowerItem += ui.item.clickPowerBonus ?? 0
    stats.passiveIncome += ui.item.passiveIncomeBonus ?? 0
  }

  stats.clickPower = Math.floor(
    clickPowerBase * clickPowerItem * (1 + clickPowerSkill) * stats.prestigeMultiplier
  )

  if (stats.passiveIncome !== 0) {
    stats.passiveIncome = Math.floor(stats.passiveIncome * stats.prestigeMultiplier)
  }

  return stats
}

module.exports = { computeStats }
