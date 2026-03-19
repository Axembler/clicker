const UserSkills = require('../models/UserSkills')
const UserItems = require('../models/UserItems')
const User = require('../models/User')
const Item = require('../models/Item')
const SKILL_EFFECTS = require('../utils/skillEffects')
const { calcPrestigeMultiplier } = require('../utils/calcPrestigeMultiplier')
const { AppError } = require('../middleware/errorHandler')

/**
 * @typedef {Object} ComputedStats
 * @property {number} prestigeMultiplier           — множитель от престижа
 * @property {number} clickPower                   — итоговая сила клика
 * @property {number} passiveIncome                — пассивный доход (за тик)
 * @property {number} upgradeDiscount              — скидка на апгрейды [0..1)
 * @property {number} globalMultiplier             — глобальный множитель (monopoly)
 * @property {number} passiveIncomeMultiplierBonus — бонус к пассиву от compound [0..0.5]
 */

async function computeStats(userId) {
  const [user, userSkills, userItems, totalItemsCount] = await Promise.all([
    User.findById(userId).lean(),
    UserSkills.find({ user: userId }).lean(),
    UserItems.find({ user: userId }).populate('item').lean(),
    Item.countDocuments()
  ])

  if (!user) {
    throw new AppError('Пользователь не найден', 404, { userId })
  }

  // Для compound: подсчет минут с момента получения скилла
  const compoundSkill = userSkills.find(s => s.nodeId === 'compound')
  const compoundMinutes = compoundSkill
    ? Math.floor((Date.now() - new Date(compoundSkill.purchasedAt)) / 60_000)
    : 0

  // Для monopoly: все ли предметы куплены
  const allItemsBought = userItems.length >= totalItemsCount && totalItemsCount > 0

  const ctx = {
    clicks : user.clicks ?? 0,
    compoundMinutes,
    allItemsBought
  }

  const stats = {
    clickPower: 1,
    passiveIncome: 0,
    upgradeDiscount: 0, // [0..1) — доля скидки
    globalMultiplier: 1, // множитель monopoly
    passiveIncomeMultiplierBonus: 0,
    prestigeMultiplier: calcPrestigeMultiplier(user.prestige ?? 0),
    clicks: user.clicks ?? 0,
  }

  let clickPowerSkill = 0 // суммарный % бонус к клику от скиллов
  let clickPowerItemMultiplier = 1 // множитель к клику от предметов
  let passiveIncomeFlat = 0 // фиксированный бонус пассива от скиллов

  for (const us of userSkills) {
    const effectFn = SKILL_EFFECTS[us.nodeId]
    if (!effectFn) continue

    const effect = effectFn(us.level, ctx)

    if (effect.clickPowerSkill != null) clickPowerSkill += effect.clickPowerSkill
    if (effect.upgradeDiscount != null) stats.upgradeDiscount += effect.upgradeDiscount
    if (effect.passiveIncomeFlat != null) passiveIncomeFlat += effect.passiveIncomeFlat
    if (effect.passiveIncomeMultiplierBonus != null) stats.passiveIncomeMultiplierBonus += effect.passiveIncomeMultiplierBonus
    if (effect.globalMultiplier != null) stats.globalMultiplier = Math.max(stats.globalMultiplier, effect.globalMultiplier)
  }

  for (const ui of userItems) {
    if (!ui.item) continue
    clickPowerItemMultiplier += ui.item.clickPowerBonus    ?? 0
    stats.passiveIncome += ui.item.passiveIncomeBonus ?? 0
  }

  // base × itemMultiplier × (1 + skillBonus%) × prestige × global
  stats.clickPower = Math.floor(
    1
    * clickPowerItemMultiplier
    * (1 + clickPowerSkill)
    * stats.prestigeMultiplier
    * stats.globalMultiplier
  )

  // (itemBase + investorFlat) × (1 + compoundBonus) × prestige × global
  stats.passiveIncome = Math.floor(
    (stats.passiveIncome + passiveIncomeFlat)
    * (1 + stats.passiveIncomeMultiplierBonus)
    * stats.prestigeMultiplier
    * stats.globalMultiplier
  )

  stats.upgradeDiscount = Math.min(stats.upgradeDiscount, 0.50)

  return stats
}

module.exports = { computeStats }
