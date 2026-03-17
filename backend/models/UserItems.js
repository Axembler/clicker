const mongoose = require('mongoose')

const UserItemsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true
  },
  purchasedAt: {
    type: Date,
    default: Date.now
  }
}, {
  collection: 'useritems'
})

UserItemsSchema.index({ user: 1, item: 1 }, { unique: true })

module.exports = mongoose.model('UserItems', UserItemsSchema)
