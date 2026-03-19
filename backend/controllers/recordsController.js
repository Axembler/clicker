const { catchAsync } = require('../config/logger')
const recordsService = require('../services/recordsService')

const getRecords = catchAsync(async (req, res) => {
  const data = await recordsService.getRecords(req.query)

  res.json({ success: true, ...data })
})

const getUserRank = catchAsync(async (req, res) => {
  const data = await recordsService.getUserRank(req.user.id)
  
  res.json({ success: true, ...data })
})

module.exports = { getRecords, getUserRank }
