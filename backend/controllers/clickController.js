const { catchAsync } = require('../config/logger')
const clickService = require('../services/clickService')

const increment = catchAsync(async (req, res) => {
  const { timestamps } = req.body
  const data = await clickService.increment(req.user.id, timestamps)
  
  res.json(data)
})

module.exports = { increment }
