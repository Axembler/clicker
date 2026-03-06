const mongoose = require('mongoose')

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
      enum: ['clicks', 'coins', 'totalCoins', 'clickPower', 'passiveIncome', 'items']
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
  timestamps: true,
  collection: "achievements"
})

module.exports = mongoose.model('Achievement', achievementSchema)
