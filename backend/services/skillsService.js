const mongoose = require('mongoose')
const Skill = require('../models/Skill')
const UserSkills = require('../models/UserSkills')
const User = require('../models/User')
const { AppError } = require('../middleware/errorHandler')

const getAllSkills = async () => {
  return Skill.find()
}

const getUserSkills = async (userId) => {
  const objectId = new mongoose.Types.ObjectId(userId)

  return UserSkills.find({ user: objectId })
    .populate('skill', 'label emoji color bgColor')
}

const buyOrUpgradeSkill = async (userId, skillId, nodeId) => {
  const skill = await Skill.findById(skillId)
  if (!skill) {
    throw new AppError('Ветка скиллов не найдена', 404, { skillId })
  }

  const node = skill.nodes.find(n => n.id === nodeId)
  if (!node) {
    throw new AppError('Скилл не найден в этой ветке', 404, { skillId, nodeId })
  }

  const user = await User.findById(userId)
  if (!user) {
    throw new AppError('Пользователь не найден', 404, { userId })
  }

  if (node.requires) {
    const requiredNode = await UserSkills.findOne({
      user: userId,
      skill: skillId,
      nodeId: node.requires,
    })

    if (!requiredNode) {
      throw new AppError(
        `Сначала необходимо купить скилл ${node.requires}`,
        400,
        { requires: node.requires }
      )
    }
  }

  const existingUserSkill = await UserSkills.findOne({
    user: userId,
    skill: skillId,
    nodeId,
  })

  if (existingUserSkill) {
    return upgradeSkill(user, node, existingUserSkill)
  } else {
    return purchaseSkill(user, node, userId, skillId, nodeId)
  }
}

const upgradeSkill = async (user, node, existingUserSkill) => {
  const nextLevel = existingUserSkill.level + 1

  if (nextLevel > node.maxLevel) {
    throw new AppError(
      `Скилл "${node.name}" уже на максимальном уровне (${node.maxLevel})`,
      400,
      { maxLevel: node.maxLevel }
    )
  }

  if (user.skillPoints < node.cost) {
    throw new AppError('Недостаточно очков умений', 400, {
      required: node.cost,
      current:  user.skillPoints,
    })
  }

  user.skillPoints -= node.cost
  existingUserSkill.level = nextLevel

  await user.save()
  await existingUserSkill.save()

  return {
    message: `Скилл "${node.name}" улучшен до ${nextLevel} уровня`,
    userSkill: existingUserSkill,
    skillPoints: user.skillPoints,
  }
}

const purchaseSkill = async (user, node, userId, skillId, nodeId) => {
  if (user.skillPoints < node.cost) {
    throw new AppError('Недостаточно очков умений', 400, {
      required: node.cost,
      current:  user.skillPoints,
    })
  }

  user.skillPoints -= node.cost

  const newUserSkill = new UserSkills({
    user: userId,
    skill: skillId,
    nodeId,
    level: 1,
  })

  await user.save()
  await newUserSkill.save()

  return {
    message: `Скилл "${node.name}" куплен`,
    userSkill: newUserSkill,
    skillPoints: user.skillPoints,
  }
}

module.exports = { getAllSkills, getUserSkills, buyOrUpgradeSkill }
