const mongoose = require('mongoose')

const NodeSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    trim: true
  },
  emoji: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  desc: {
    type: String,
    required: true
  },
  maxLevel: {
    type: Number,
    required: true,
    min: 1
  },
  cost: {
    type: Number,
    required: true,
    min: 1
  },
  requires: {
    type: String,
    default: null
  }
}, { _id: false })

const SkillSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  label: {
    type: String,
    required: true,
    trim: true
  },
  emoji: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true,
    match: [/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, 'Некорректный HEX-цвет']
  },
  bgColor: {
    type: String,
    required: true,
    match: [/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, 'Некорректный HEX-цвет']
  },
  nodes: {
    type: [NodeSchema],
    required: true,
    validate: {
      validator: (arr) => arr.length > 0,
      message: 'В ветке должен быть хотя бы один узел'
    }
  }
}, {
  collection: 'skills'
})

const Skill = mongoose.model('Skill', SkillSchema)

module.exports = Skill
