const { catchAsync } = require('../config/logger')
const itemsService = require('../services/itemsService')

const getAll = catchAsync(async (req, res) => {
  const data = await itemsService.getAll(req.user.id)
  
  res.json(data)
})

const getUserItems = catchAsync(async (req, res) => {
  const data = await itemsService.getUserItems(req.user.id)

  res.json(data)
})

const buyItem = catchAsync(async (req, res) => {
  const data = await itemsService.buyItem(req.user.id, req.params.itemId)

  res.json(data)
})

module.exports = { getAll, getUserItems, buyItem }
