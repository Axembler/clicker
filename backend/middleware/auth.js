const jwt = require('jsonwebtoken')
const { AppError } = require('./errorHandler')

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    return next(new AppError('Токен не найден', 401, { userId }))
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    req.user = decoded

    next()
  } catch (err) {
    next(err)
  }
}

module.exports = auth