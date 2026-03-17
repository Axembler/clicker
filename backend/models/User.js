const mongoose = require('mongoose')

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
  totalClicks: {
    type: Number,
    default: 0,
  },
  coins: {
    type: Number,
    default: 0,
  },
  totalCoins: {
    type: Number,
    default: 0,
  },
  lastOnline: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  prestige: {
    type: Number,
    default: 0
  },
  skillPoints: {
    type: Number,
    default: 0
  }
}, {
  collection: 'users'
})

// Индексы для быстрой сортировки по рекордам
userSchema.index({ totalClicks: -1 })
userSchema.index({ totalCoins: -1 })

const User = mongoose.model('User', userSchema)

module.exports = User
