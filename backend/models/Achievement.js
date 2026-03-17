const mongoose = require('mongoose')
const { formatNumber } = require('../utils/formatNumber')
const { PRESTIGE_FIELDS } = require('../constants/achievementConstants')

/**
 * @typedef {Object} IAchievementMethods
 * @property {(prestigeMultiplier?: number) => string} getDescription
 */

/**
 * @typedef {mongoose.Model<
 *   mongoose.InferSchemaType<typeof achievementSchema>,
 *   {},
 *   IAchievementMethods
 * >} AchievementModel
 */

/** @type {mongoose.Schema<any, AchievementModel, IAchievementMethods>} */
const achievementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  condition: {
    field: {
      type: String,
      required: true,
      enum: ['clicks', 'coins', 'clickPower', 'passiveIncome', 'items']
    },
    operator: {
      type: String,
      required: true,
      enum: ['gte', 'lte', 'eq', 'length_gte']
    },
    value: {
      type: Number,
      required: true
    }
  },
  reward: {
    coins: {
      type: Number,
      default: 0
    }
  }
}, {
  collection: "achievements"
})

achievementSchema.methods.getDescription = function (prestigeMultiplier = 1) {
  const isCoinBased = PRESTIGE_FIELDS.has(this.condition.field)

  if (!isCoinBased) return this.description

  const scaledValue = Math.floor(this.condition.value * prestigeMultiplier)

  return `Накопить ${formatNumber(scaledValue)} монет`
}

module.exports = mongoose.model('Achievement', achievementSchema)
