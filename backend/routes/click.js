const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const clickController = require('../controllers/clickController')

router.post('/', auth, clickController.increment)

module.exports = router
