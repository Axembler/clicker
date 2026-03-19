const User = require('../models/User')
const Item = require('../models/Item')
const UserItems = require('../models/UserItems')
const { computeStats } = require('./statsService')
const { AppError } = require('../middleware/errorHandler')

const getAll = async (userId) => {
  const [items, stats] = await Promise.all([
    Item.find().sort({ sortOrder: 1 }),
    computeStats(userId)
  ])

  return items.map((item) =>
    item.applyModifiers(stats.prestigeMultiplier, stats.upgradeDiscount)
  )
}

const getUserItems = async (userId) => {
  return UserItems.find({ user: userId })
    .sort({ sortOrder: 1 })
    .populate('item', 'clickPowerBonus description name passiveIncomeBonus sortOrder color')
}

const buyItem = async (userId, itemId) => {
  const [item, user, existingUserItem, stats] = await Promise.all([
    Item.findById(itemId),
    User.findById(userId),
    UserItems.findOne({ user: userId, item: itemId }),
    computeStats(userId)
  ])

  if (!item) throw new AppError('Предмет не найден',  404, { itemId })
  if (!user) throw new AppError('Пользователь не найден', 404, { userId })
  if (existingUserItem) throw new AppError('Предмет уже куплен', 400, { itemId })

  const { price: finalPrice } = item.applyModifiers(
    stats.prestigeMultiplier,
    stats.upgradeDiscount
  )

  if (user.coins < finalPrice) {
    throw new AppError('Недостаточно монет', 400, {
      coins: user.coins,
      price: finalPrice
    })
  }

  user.coins -= finalPrice

  const newUserItem = new UserItems({ user: userId, item: itemId })

  await Promise.all([user.save(), newUserItem.save()])

  return {
    message: `Предмет "${item.name}" куплен за ${finalPrice}`,
    userItem: newUserItem,
    coins: user.coins
  }
}

module.exports = { getAll, getUserItems, buyItem }
