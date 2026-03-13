import { BuyShopItemResponse, ShopItemData } from "@/types/shop"
import { apiClient } from "@/utils/apiClient"

export const getShopItems = async (): Promise<ShopItemData[]> => {
  const response = await apiClient('/items', {
    method: 'GET',
  })

  if (!response.ok) {
    throw new Error('Ошибка получения предметов')
  }

  const data = await response.json()

  return data
}

export const buyShopItem = async (itemId: string): Promise<BuyShopItemResponse> => {
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