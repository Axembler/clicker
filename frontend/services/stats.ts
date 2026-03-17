import { Stats } from '@/types/stats'
import { apiClient } from '@/utils/apiClient'

// Получить статы текущего пользователя
export const getUserStats = async (): Promise<Stats> => {
  const response = await apiClient('/stats', {
    method: 'GET',
  })

  if (!response.ok) {
    throw new Error('Ошибка получения статов пользователя')
  }

  const data = await response.json()

  return data
}
