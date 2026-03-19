const User = require('../models/User')

const wakeUp = (user, passiveEarned, passiveSeconds) => {
  if (!user) {
    throw new AppError('Пользователь не найден', 404)
  }

  return {
    passiveEarned: passiveEarned || 0,
    passiveSeconds: passiveSeconds || 0
  }
}

const sleep = async (userId, clientSleepAt) => {
  const now = Date.now()

  const lastOnline = (clientSleepAt && clientSleepAt <= now)
    ? new Date(clientSleepAt)
    : new Date()

  await User.findByIdAndUpdate(userId, { lastOnline })
}

module.exports = { wakeUp, sleep }
