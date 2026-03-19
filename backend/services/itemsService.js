const { default: mongoose } = require('mongoose')
const User = require('../models/User')
const Item = require('../models/Item')
const UserItems = require('../models/UserItems')
const { computeStats } = require('./statsService')

const getAll = async (userId) => {
  const [items, { prestigeMultiplier }] = await Promise.all([
    Item.find(),
    computeStats(userId),
  ])

  return items.map((item) => item.applyPrestige(prestigeMultiplier))
}

const getUserItems = async (userId) => {
  return UserItems.find({ user: userId })
    .sort({ sortOrder: 1 })
    .populate('item', 'clickPowerBonus description name passiveIncomeBonus sortOrder color')
}

const buyItem = async (userId, itemId) => {
  const [item, user, existingUserItem, { prestigeMultiplier }] = await Promise.all([
    Item.findById(itemId),
    User.findById(userId),
    UserItems.findOne({ user: userId, item: itemId }),
    computeStats(userId),
  ])

  if (!item) {
    throw new AppError('Предмет не найден', 404, { itemId })
  }

  if (!user) {
    throw new AppError('Пользователь не найден', 404, { userId })
  }

  if (existingUserItem) {
    throw new AppError('Предмет уже куплен', 400, { existingUserItem })
  }

  const { price: adjustedPrice } = item.applyPrestige(prestigeMultiplier)

  if (user.coins < adjustedPrice) {
    throw new AppError('Недостаточно денег', 400, {
      coins: existingUserItem,
      price: adjustedPrice
    })
  }

  user.coins -= adjustedPrice

  const newUserItem = new UserItems({ user: userId, item: itemId })

  await Promise.all([user.save(), newUserItem.save()])

  return {
    message: `Предмет "${item.name}" куплен за ${adjustedPrice}`,
    userItem: newUserItem,
    coins: user.coins
  }
}

module.exports = { getAll, getUserItems, buyItem }
