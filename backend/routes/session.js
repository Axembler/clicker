const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const passiveIncome = require('../middleware/passiveIncome')
const sessionController = require('../controllers/sessionController')

router.post('/wakeup', auth, passiveIncome, sessionController.wakeUp)
router.post('/sleep', auth, sessionController.sleep)

module.exports = router
