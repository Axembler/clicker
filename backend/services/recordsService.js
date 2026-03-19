const User = require('../models/User')

const ALLOWED_SORT_FIELDS = ['totalClicks', 'totalCoins']
const MAX_LIMIT = 100

const getRecords = async ({ sort, limit: rawLimit }) => {
  const sortField = ALLOWED_SORT_FIELDS.includes(sort) ? sort : 'totalClicks'
  const limit = Math.min(parseInt(rawLimit) || 50, MAX_LIMIT)

  const records = await User.find()
    .sort({ [sortField]: -1 })
    .limit(limit)
    .select('username totalClicks totalCoins')
    .lean()

  const recordsWithRank = records.map((user, index) => ({
    rank: index + 1,
    id: user._id,
    username: user.username,
    totalCoins: user.totalCoins,
    totalClicks: user.totalClicks
  }))

  return {
    sortedBy: sortField,
    total: recordsWithRank.length,
    records: recordsWithRank
  }
}

const getUserRank = async (userId) => {
  const user = await User.findById(userId).lean()

  if (!user) {
    throw new AppError('Пользователь не найден', 404, { userId })
  }

  const rank = await User.countDocuments({
    totalClicks: { $gt: user.totalClicks }
  }) + 1

  return {
    rank,
    user: {
      username: user.username,
      totalClicks: user.totalClicks,
      totalCoins: user.totalCoins,
      prestige: user.prestige
    }
  }
}

module.exports = { getRecords, getUserRank }
