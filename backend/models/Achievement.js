const mongoose = require('mongoose')
const { formatNumber } = require('../utils/formatNumber')
const { PRESTIGE_FIELDS } = require('../constants/achievementConstants')

/**
 * @typedef {Object} IAchievementMethods
 * @property {(prestigeMultiplier?: number) => AchievementPlain} applyPrestige
 */

/**
 * @typedef {Object} AchievementPlain
 * @property {string} _id
 * @property {string} title
 * @property {string} description
 * @property {{ field: string, operator: string, value: number }} condition
 * @property {{ coins: number }} reward
 */

/**
 * @typedef {mongoose.Model<
 *   mongoose.InferSchemaType<typeof achievementSchema>,
 *   {},
 *   IAchievementMethods
 * >} AchievementModel
 */

/** @type {mongoose.Schema<any, AchievementModel, IAchievementMethods>} */
const achievementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    condition: {
      field: {
        type: String,
        required: true,
        enum: ['clicks', 'coins', 'clickPower', 'passiveIncome', 'items'],
      },
      operator: {
        type: String,
        required: true,
        enum: ['gte', 'lte', 'eq', 'length_gte'],
      },
      value: {
        type: Number,
        required: true,
      },
    },
    reward: {
      coins: {
        type: Number,
        default: 0,
      }
    }
  },
  {
    collection: 'achievements'
  }
)

/**
 * Возвращает plain объект достижения с применённым престиж-множителем.
 * - condition.value умножается только для полей из PRESTIGE_FIELDS
 * - reward.coins умножается всегда
 * - description пересчитывается для coin-based условий
 *
 * @param {number} [prestigeMultiplier=1]
 * @returns {AchievementPlain}
 */
achievementSchema.methods.applyPrestige = function (prestigeMultiplier = 1) {
  const obj = this.toObject()

  if (prestigeMultiplier === 1) return obj

  const isCoinBased = PRESTIGE_FIELDS.has(this.condition.field)

  if (isCoinBased) {
    obj.condition.value = Math.floor(obj.condition.value * prestigeMultiplier)
    obj.description = `Накопить ${formatNumber(obj.condition.value)} монет`
  }

  obj.reward.coins = Math.floor(obj.reward.coins * prestigeMultiplier)

  return obj
}

module.exports = mongoose.model('Achievement', achievementSchema)
