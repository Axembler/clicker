const User = require('../models/User')
const { AppError } = require('../middleware/errorHandler')

const getUserById = async (userId) => {
  const user = await User.findById(userId).select('-password')

  if (!user) {
    throw new AppError('Пользователь не найден', 404, { userId })
  }

  return user
}

module.exports = { getUserById }
