const { catchAsync } = require('../config/logger')
const userService = require('../services/userService')

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.user.id)

  res.json(user)
})

module.exports = { getUser }
