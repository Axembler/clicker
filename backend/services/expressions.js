// Множитель престижа: max(1, prestige² * (prestige + 1))
const calcPrestigeMultiplier = (prestige = 0) => Math.max(1, Math.pow(prestige, 2) * (prestige + 1))

module.exports = { calcPrestigeMultiplier }