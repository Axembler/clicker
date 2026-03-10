const express = require('express')
const router = express.Router()
const User = require('../models/User')
const Item = require('../models/Item')
const auth = require('../middleware/auth')
const { calcPrestigeMultiplier } = require('../services/expressions')

// Получить все предметы с ценами от престижа
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' })
    }

    const multiplier = calcPrestigeMultiplier(user.prestige)
    const items = await Item.find().sort({ sortOrder: 1 })

    const adjustedItems = items.map(item => ({
      ...item.toObject(),
      price: Math.round(item.price * multiplier),
    }))

    res.json(adjustedItems)
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message })
  }
})

// Купить предмет
router.post('/buy/:itemId', auth, async (req, res) => {
  try {
    const { itemId } = req.params

    const [item, user] = await Promise.all([
      Item.findById(itemId),
      User.findById(req.user.id),
    ])

    if (!item) {
      return res.status(404).json({ message: 'Предмет не найден' })
    }
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' })
    }

    const multiplier = calcPrestigeMultiplier(user.prestige)
    const adjustedPrice = Math.round(item.price * multiplier)

    if (user.coins < adjustedPrice) {
      return res.status(400).json({ message: 'Недостаточно монет' })
    }

    const alreadyOwned = user.items.some(i => i._id.toString() === itemId)
    if (alreadyOwned) {
      return res.status(400).json({ message: 'Предмет уже куплен' })
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        $inc: {
          coins: -adjustedPrice,
          clickPower: item.clickPowerBonus,
          passiveIncome: item.passiveIncomeBonus,
        },
        $push: {
          items: {
            _id: item._id,
            name: item.name,
          },
        },
      },
      { returnDocument: 'after' }
    )

    res.json({
      message: `Предмет "${item.name}" успешно куплен за ${adjustedPrice}`,
      coins: updatedUser.coins,
      clickPower: updatedUser.clickPower,
      passiveIncome: updatedUser.passiveIncome,
      items: updatedUser.items,
    })
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message })
  }
})

module.exports = router
