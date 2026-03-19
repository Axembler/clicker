const { catchAsync } = require('../config/logger')
const prestigeService = require('../services/prestigeService')

const prestige = catchAsync(async (req, res) => {
  const result = await prestigeService.applyModifiers(req.user.id)

  res.json(result)
})

module.exports = { prestige }
