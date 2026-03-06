import { apiClient } from "@/utils/apiClient"

export interface ItemData {
  _id: string
  clickPowerBonus: number
  description?: string
  name: string
  passiveIncomeBonus: number
  price: number
  sortOrder: number
  color: string
}

export interface BuyItemResponse {
  message: string
  coins: number
  clickPower: number
  passiveIncome: number
  items: Array<{
    _id: string
    name: string
  }>
}

export const getItems = async (): Promise<ItemData[]> => {
  const response = await apiClient('/items', {
    method: 'GET',
  })

  if (!response.ok) {
    throw new Error('Ошибка получения предметов')
  }

  const data = await response.json()

  return data
}

export const buyItem = async (itemId: string | undefined): Promise<BuyItemResponse> => {
  const response = await apiClient(`/items/buy/${itemId}`, {
    method: 'POST',
  })

  if (!response.ok) {
    const error = await response.json()
    
    throw new Error(error.message || 'Ошибка при покупке предмета')
  }

  const data = await response.json()

  return data
}