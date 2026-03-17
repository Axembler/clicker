import { BuyItemResponse, Item, UserItem } from "@/types/shop"
import { apiClient } from "@/utils/apiClient"

export const getItems = async (): Promise<Item[]> => {
  const response = await apiClient('/items', {
    method: 'GET',
  })

  if (!response.ok) {
    throw new Error('Ошибка получения предметов')
  }

  const data = await response.json()

  return data
}

export const getUserItems = async (): Promise<UserItem[]> => {
  const response = await apiClient('/items/user', {
    method: 'GET',
  })

  if (!response.ok) {
    throw new Error('Ошибка получения предметов пользователя')
  }

  const data = await response.json()

  return data
}

export const buyItem = async (itemId: string): Promise<BuyItemResponse> => {
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