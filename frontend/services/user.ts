import { PrestigeResponse, UserData, UserItem } from "@/types/user"
import { apiClient } from "@/utils/apiClient"

export const getUser = async (): Promise<UserData> => {
  const response = await apiClient('/user', {
    method: 'GET',
  })

  if (!response.ok) {
    throw new Error('Ошибка получения данных о пользователе')
  }

  const data = await response.json()

  return data
}

export const getUserItems = async (): Promise<UserItem[]> => {
  const response = await apiClient('/user/items', {
    method: 'GET',
  })

  if (!response.ok) {
    throw new Error('Ошибка получения предметов пользователя')
  }

  const data = await response.json()

  return data
}

export const prestige = async (): Promise<PrestigeResponse> => {
  const response = await apiClient('/user/prestige', {
    method: 'POST',
  })

  const data = await response.json()

  if (!response.ok) throw new Error(data.message)

  return data
}