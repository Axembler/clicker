const { catchAsync } = require('../config/logger')
const sessionService = require('../services/sessionService')

const wakeUp = catchAsync(async (req, res) => {
  const data = sessionService.wakeUp(req.userDoc, req.passiveEarned, req.passiveSeconds)
  
  res.json({ success: true, ...data })
})

const sleep = catchAsync(async (req, res) => {
  await sessionService.sleep(req.user.id, req.body?.sleepAt)

  res.json({ success: true, ok: true })
})

module.exports = { wakeUp, sleep }
