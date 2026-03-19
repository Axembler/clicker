const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )
}

const register = async (username, password) => {
  const existingUser = await User.findOne({ username })

  if (existingUser) {
    throw new AppError('Никнейм уже занят', 400)
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await User.create({
    username,
    password: hashedPassword
  })

  const token = generateToken(user)

  return {
    token,
    user: { id: user._id, username: user.username }
  }
}

const login = async (username, password) => {
  const user = await User.findOne({ username })

  if (!user) {
    throw new AppError('Неверное имя или пароль', 400)
  }

  const isMatch = await bcrypt.compare(password, user.password)

  if (!isMatch) {
    throw new AppError('Неверное имя или пароль', 400)
  }

  const token = generateToken(user)

  return {
    token,
    user: { id: user._id, username: user.username }
  }
}

module.exports = { register, login }
