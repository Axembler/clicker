const mongoose = require('mongoose')

const itemSchema = new mongoose.Schema({
  clickPowerBonus: {
    type: Number,
    required: true,
    default: 0,
  },
  description: {
    type: String,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  passiveIncomeBonus: {
    type: Number,
    required: true,
    default: 0,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  sortOrder: {
    type: Number,
    required: true,
    default: 0,
  },
  color: {
    type: String,
    required: true,
    match: /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, // валидация HEX цвета
  }
}, {
  collection: 'items'
})

/**
 * Возвращает plain объект предмета с применёнными модификаторами цены.
 *
 * Формула: price = floor(basePrice × prestigeMultiplier × (1 − upgradeDiscount))
 *
 * @param {number} [prestigeMultiplier=1] — множитель от престижа
 * @param {number} [upgradeDiscount=0] — скидка [0..1) от скилла discount
 * @returns {Object}
 */
itemSchema.methods.applyModifiers = function (
  prestigeMultiplier = 1,
  upgradeDiscount = 0
) {
  const obj = this.toObject()

  const discountFactor = 1 - Math.min(upgradeDiscount, 0.50) // защита от >50%

  obj.price = Math.floor(obj.price * prestigeMultiplier * discountFactor)

  return obj
}

const Item = mongoose.model('Item', itemSchema)

module.exports = Item
