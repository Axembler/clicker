const mongoose = require('mongoose')
const { computeStats } = require('../services/statsService')
const { catchAsync } = require('../config/logger')

const getStats = catchAsync(async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.user.id)
  const stats = await computeStats(userId)

  res.json(stats)
})

module.exports = { getStats }
