const { catchAsync } = require('../config/logger')
const authService = require('../services/authService')

const register = catchAsync(async (req, res) => {
  const { username, password } = req.body
  
  const data = await authService.register(username, password)

  res.status(201).json(data)
})

const login = catchAsync(async (req, res) => {
  const { username, password } = req.body

  const data = await authService.login(username, password)

  res.json(data)
})

module.exports = { register, login }
