const express = require('express')
const { default: mongoose } = require('mongoose')
const router = express.Router()
const User = require('../models/User')
const Item = require('../models/Item')
const UserItems = require('../models/UserItems')
const auth = require('../middleware/auth')
const { computeStats } = require('../services/statsService')

// Получить все предметы
router.get('/', auth, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id)

    const [items, { prestigeMultiplier }] = await Promise.all([
      Item.find(),
      computeStats(userId),
    ])

    res.json(items.map((item) => item.applyPrestige(prestigeMultiplier)))
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ message: 'Ошибка сервера' })
  }
})

// Получить все предметы пользователя
router.get('/user', auth, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id)

    const userItems = await UserItems.find({ user: userId })
      .sort({ sortOrder: 1 })
      .populate('item', 'clickPowerBonus description name passiveIncomeBonus sortOrder color')

    res.json(userItems)
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ message: 'Ошибка сервера' })
  }
})

// Купить предмет
router.post('/buy/:itemId', auth, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id)
    const { itemId } = req.params

    const [item, user, existingUserItem, { prestigeMultiplier }] = await Promise.all([
      Item.findById(itemId),
      User.findById(userId),
      UserItems.findOne({ user: userId, item: itemId }),
      computeStats(userId),
    ])

    if (!item) return res.status(404).json({ message: 'Предмет не найден' })
    if (!user) return res.status(404).json({ message: 'Пользователь не найден' })
    if (existingUserItem) return res.status(400).json({ message: 'Предмет уже куплен' }

    )
    const { price: adjustedPrice } = item.applyPrestige(prestigeMultiplier)

    if (user.coins < adjustedPrice) {
      return res.status(400).json({ message: 'Недостаточно монет' })
    }

    user.coins -= adjustedPrice

    const newUserItem = new UserItems({ user: userId, item: itemId })

    await Promise.all([user.save(), newUserItem.save()])

    res.json({
      message: `Предмет "${item.name}" куплен за ${adjustedPrice}`,
      userItem: newUserItem,
      coins: user.coins,
    })
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Предмет уже куплен' })
    }

    console.log('Error: ', error.message)
    res.status(500).json({ message: 'Ошибка сервера', error: error.message })
  }
})

module.exports = router
