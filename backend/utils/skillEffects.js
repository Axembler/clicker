/**
 * Каждая функция принимает (level, ctx) где ctx — контекст из computeStats.
 * Возвращает объект с одним или несколькими эффектами.
 *
 * Доступные поля ctx:
 * @param {number}  ctx.totalClicks      — общее число кликов пользователя
 * @param {number}  ctx.compoundMinutes  — минут прошло с момента получения скилла compound
 * @param {boolean} ctx.allItemsBought   — куплены ли все доступные предметы
 */
const SKILL_EFFECTS = {
  strong_hit: (level, _ctx) => ({
    clickPowerSkill: 0.05 * level // +5% к силе клика за уровень
  }),

  /**
   * -10% к ценам апгрейдов за уровень (макс 3 → -30%)
   * Итог: upgradeDiscount = 0.10 | 0.20 | 0.30
   */
  discount: (level, _ctx) => ({
    upgradeDiscount: 0.10 * level
  }),

  /**
   * +1 к пассивному доходу за каждые 250 кликов за уровень
   * Итог: passiveIncomeFlat = floor(clicks / 250) * level
   */
  investor: (level, ctx) => ({
    passiveIncomeFlat: Math.floor((ctx.clicks ?? 0) / 250) * level
  }),

  /**
   * +1% в минуту к пассивному доходу (макс +50%)
   * compoundMinutes передается из statsService
   * Итог: passiveIncomeMultiplierBonus = число от 0 до 0.50
   */
  compound: (level, ctx) => ({
    passiveIncomeMultiplierBonus: Math.min(0.50, 0.01 * (ctx.compoundMinutes ?? 0)) * level
  }),

  /**
   * Куплены все предметы в магазине → глобальный x2 ко всему
   * Итог: globalMultiplier = 1 или 2
   */
  monopoly: (level, ctx) => ({
    globalMultiplier: (ctx.allItemsBought ?? false) ? 2 * level : 1
  }),

  /**
   * +5% за уровень, до +15%
   */
  passive_boost: (level, _ctx) => ({
    passiveIncomeMultiplierBonus: 0.05 * level
  }),

  /**
   * ×1.5
   */
  accumulator: (level, _ctx) => ({
    passiveIncomeMultiplierBonus: 0.5
  })
}

module.exports = SKILL_EFFECTS
