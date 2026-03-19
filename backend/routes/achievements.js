const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const achievementsController = require('../controllers/achievementsController')

router.get('/', auth, achievementsController.getAchievements)
router.get('/user', auth, achievementsController.getUserAchievements)
router.post('/check', auth, achievementsController.checkAchievements)
router.post('/receive/:achievementId', auth, achievementsController.receiveAchievement)

module.exports = router
