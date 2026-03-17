import { UserData } from "@/types/user"
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