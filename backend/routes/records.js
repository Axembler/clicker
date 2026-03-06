const express = require('express')
const router = express.Router()

const User = require("../models/User")
const auth = require('../middleware/auth')

/**
 * GET /api/records?sort=clicks&limit=50
 * 
 * sort  — по какому полю сортировать (clicks | totalCoins)
 * limit — сколько записей вернуть (макс. 100)
 */
router.get('/', auth, async (req, res) => {
  try {
    const ALLOWED_SORT_FIELDS = ['clicks', 'totalCoins']
    const MAX_LIMIT = 100

    const sortField = ALLOWED_SORT_FIELDS.includes(req.query.sort)
      ? req.query.sort
      : 'clicks'

    const limit = Math.min(
      parseInt(req.query.limit) || 50,
      MAX_LIMIT
    )

    const records = await User.find()
      .sort({ [sortField]: -1 })
      .limit(limit)
      .select('username clicks totalCoins')
      .lean()  // возвращает plain JS объект вместо Mongoose документа

    const recordsWithRank = records.map((user, index) => ({
      rank: index + 1,
      id: user._id,
      username: user.username,
      clicks: user.clicks,
      totalCoins: user.totalCoins,
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

/**
 * GET /api/records/me?telegramId=123456
 * 
 * Возвращает место конкретного пользователя в таблице
 */
router.get('/user', auth, async (req, res) => {
  const userId = req.user.id
  
  try {
    const user = await User.findOne({ userId }).lean()

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Пользователь не найден',
      })
    }

    const rank = await User.countDocuments({
      clicks: { $gt: user.clicks }
    }) + 1

    return res.json({
      success: true,
      rank,
      user: {
        username:   user.username,
        clicks:     user.clicks,
        totalCoins: user.totalCoins,
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
