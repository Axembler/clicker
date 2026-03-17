const express = require('express')
const { default: mongoose } = require('mongoose')
const router = express.Router()
const auth = require('../middleware/auth')
const Skill = require('../models/Skill')
const UserSkills = require('../models/UserSkills')
const User = require('../models/User')

// Получить все скиллы
router.get('/', auth, async (req, res) => {
  try {
    const skills = await Skill.find()

    res.json(skills)
  } catch (error) {
    console.log('Error: ', error.message)
    
    res.status(500).json({ message: 'Ошибка сервера', error: error.message })
  }
})

// Получить все скиллы пользователя
router.get('/user', auth, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id)

    const userSkills = await UserSkills.find({ user: userId })
      .populate('skill', 'label emoji color bgColor')

    res.json(userSkills)
  } catch (error) {
    console.log('Error: ', error.message)

    res.status(500).json({ message: 'Ошибка сервера', error: error.message })
  }
})

// Купить или улучшить скилл
router.post('/buy/:skillId/:nodeId', auth, async (req, res) => {
  try {
    const userId = req.user.id
    const { skillId, nodeId } = req.params

    const skill = await Skill.findById(skillId)
    if (!skill) {
      return res.status(404).json({ message: 'Ветка скиллов не найдена' })
    }

    const node = skill.nodes.find(n => n.id === nodeId)
    if (!node) {
      return res.status(404).json({ message: 'Скилл не найден в этой ветке' })
    }

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' })
    }

    if (node.requires) {
      const requiredNode = await UserSkills.findOne({
        user: userId,
        skill: skillId,
        nodeId: node.requires
      })

      if (!requiredNode) {
        return res.status(400).json({
          message: `Сначала необходимо купить скилл: ${node.requires}`
        })
      }
    }

    const existingUserSkill = await UserSkills.findOne({
      user: userId,
      skill: skillId,
      nodeId: nodeId
    })

    if (existingUserSkill) {
      // Улучшение
      const nextLevel = existingUserSkill.level + 1

      if (nextLevel > node.maxLevel) {
        return res.status(400).json({
          message: `Скилл "${node.name}" уже на максимальном уровне (${node.maxLevel})`
        })
      }

      const upgradeCost = node.cost

      if (user.skillPoints < upgradeCost) {
        return res.status(400).json({
          message: 'Недостаточно очков умений',
          required: upgradeCost,
          current: user.skillPoints
        })
      }

      user.skillPoints -= upgradeCost
      existingUserSkill.level = nextLevel

      await user.save()
      await existingUserSkill.save()

      return res.json({
        message: `Скилл "${node.name}" улучшен до ${nextLevel} уровня`,
        userSkill: existingUserSkill,
        skillPoints: user.skillPoints
      })

    } else {
      // Первичная покупка
      if (user.skillPoints < node.cost) {
        return res.status(400).json({
          message: 'Недостаточно очков умений',
          required: node.cost,
          current: user.skillPoints
        })
      }

      user.skillPoints -= node.cost

      const newUserSkill = new UserSkills({
        user: userId,
        skill: skillId,
        nodeId: nodeId,
        level: 1
      })

      await user.save()
      await newUserSkill.save()

      return res.json({
        message: `Скилл "${node.name}" успешно куплен`,
        userSkill: newUserSkill,
        skillPoints: user.skillPoints
      })
    }

  } catch (error) {
    console.log('Error: ', error.message)
    
    res.status(500).json({ message: 'Ошибка сервера', error: error.message })
  }
})

module.exports = router
