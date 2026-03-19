const { catchAsync } = require('../config/logger')
const skillsService = require('../services/skillsService')

const getAllSkills = catchAsync(async (req, res) => {
  const skills = await skillsService.getAllSkills()

  res.json(skills)
})

const getUserSkills = catchAsync(async (req, res) => {
  const userSkills = await skillsService.getUserSkills(req.user.id)

  res.json(userSkills)
})

const buyOrUpgradeSkill = catchAsync(async (req, res) => {
  const { skillId, nodeId } = req.params
  const result = await skillsService.buyOrUpgradeSkill(req.user.id, skillId, nodeId)

  res.json(result)
})

module.exports = { getAllSkills, getUserSkills, buyOrUpgradeSkill }
