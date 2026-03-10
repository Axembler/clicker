const express = require('express')
const router = express.Router()

const User = require("../models/User")
const auth = require('../middleware/auth')

// Таблица рекордов
router.get('/', auth, async (req, res) => {
  try {
    const ALLOWED_SORT_FIELDS = ['totalClicks', 'totalCoins']
    const MAX_LIMIT = 100

    const sortField = ALLOWED_SORT_FIELDS.includes(req.query.sort)
      ? req.query.sort
      : 'totalClicks'

    const limit = Math.min(
      parseInt(req.query.limit) || 50,
      MAX_LIMIT
    )

    const records = await User.find()
      .sort({ [sortField]: -1 })
      .limit(limit)
      .select('username totalClicks totalCoins')
      .lean()  // возвращает plain JS объект вместо Mongoose документа

    const recordsWithRank = records.map((user, index) => ({
      rank: index + 1,
      id: user._id,
      username: user.username,
      totalCoins: user.totalCoins,
      totalClicks: user.totalClicks
    }))

    return res.json({
      success: true,
      sortedBy: sortField,
      total: recordsWithRank.length,
      records: recordsWithRank,
    })

  } catch (error) {
    console.error('[getRecords] error:', error)
    return res.status(500).json({
      success: false,
      message: 'Ошибка при получении рекордов',
    })
  }
})

// Конкретный пользователь в таблице
router.get('/user', auth, async (req, res) => {
  const userId = req.user.id
  
  try {
    const user = await User.findById(userId).lean()

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Пользователь не найден',
      })
    }

    const rank = await User.countDocuments({
      totalClicks: { $gt: user.totalClicks }
    }) + 1

    return res.json({
      success: true,
      rank,
      user: {
        username:   user.username,
        totalClicks:     user.totalClicks,
        totalCoins: user.totalCoins,
        prestige: user.prestige
      },
    })

  } catch (error) {
    console.error('[getMyRank] error:', error)
    return res.status(500).json({
      success: false,
      message: 'Ошибка при получении ранга',
    })
  }
})

module.exports = router
