const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const skillsController = require('../controllers/skillsController')

router.get('/', auth, skillsController.getAllSkills)
router.get('/user', auth, skillsController.getUserSkills)
router.post('/buy/:skillId/:nodeId', auth, skillsController.buyOrUpgradeSkill)

module.exports = router
