const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const itemsController = require('../controllers/itemsController')

router.get('/', auth, itemsController.getAll)
router.get('/user', auth, itemsController.getUserItems)
router.post('/buy/:itemId', auth, itemsController.buyItem)

module.exports = router
