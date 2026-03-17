const mongoose = require('mongoose')

const UserSkillsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  skill: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill',
    required: true
  },
  nodeId: {
    type: String,
    required: true
  },
  level: {
    type: Number,
    default: 1,
    min: 1
  },
  purchasedAt: {
    type: Date,
    default: Date.now
  }
}, {
  collection: 'userskills'
})

UserSkillsSchema.index({ user: 1, skill: 1, nodeId: 1 }, { unique: true })

module.exports = mongoose.model('UserSkills', UserSkillsSchema)
