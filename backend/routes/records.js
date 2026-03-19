const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const recordsController = require('../controllers/recordsController')

router.get('/', auth, recordsController.getRecords)
router.get('/user', auth, recordsController.getUserRank)

module.exports = router
