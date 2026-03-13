export interface ShopItemData {
  _id: string
  clickPowerBonus: number
  description?: string
  name: string
  passiveIncomeBonus: number
  price: number
  sortOrder: number
  color: string
}

export interface BuyShopItemResponse {
  message: string
  coins: number
  clickPower: number
  passiveIncome: number
  items: Array<{
    _id: string
    name: string
  }>
}