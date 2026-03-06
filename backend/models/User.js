const mongoose = require('mongoose')

const userAchievementSchema = new mongoose.Schema({
  unlockedAt: {
    type: Date,
    default: Date.now
  },
  title: {
    type: String,
    required: true
  }
})

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  clicks: {
    type: Number,
    default: 0,
  },
  clickPower: {
    type: Number,
    default: 1,
  },
  coins: {
    type: Number,
    default: 0,
  },
  totalCoins: {
    type: Number,
    default: 0,
  },
  passiveIncome: {
    type: Number,
    default: 0,
  },
  items: {
    type: Array,
    default: [],
  },
  lastOnline: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  achievements: {
    type: [userAchievementSchema],
    default: []
  }
}, {
  collection: 'users'
})

// Индексы для быстрой сортировки по рекордам
userSchema.index({ clicks: -1 })
userSchema.index({ totalCoins: -1 })

const User = mongoose.model('User', userSchema)

module.exports = User
