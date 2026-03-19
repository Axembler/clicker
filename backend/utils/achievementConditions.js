const { PRESTIGE_FIELDS } = require('../constants/achievementConstants')

const checkCondition = (userContext, condition, prestigeMultiplier) => {
  const { field, operator, value } = condition

  const userValue = userContext[field]
  if (userValue === undefined || userValue === null) return false

  const effectiveValue = PRESTIGE_FIELDS.has(field)
    ? value * prestigeMultiplier
    : value

  switch (operator) {
    case 'gte':
      return userValue >= effectiveValue
    case 'lte':
      return userValue <= effectiveValue
    case 'eq':
      return userValue === effectiveValue
    case 'length_gte':
      if (!Array.isArray(userValue)) return false
      return userValue.length >= effectiveValue
    default:
      return false
  }
}

module.exports = { checkCondition }