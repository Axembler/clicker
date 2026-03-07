import { apiClient } from "@/utils/apiClient"
import { AchievementsResponse, CheckAchievementsResponse } from "@/types/achievements"

export const getAchievements = async (): Promise<AchievementsResponse> => {
  const response = await apiClient('/achievements', {
    method: 'GET',
  })

  if (!response.ok) {
    throw new Error('Ошибка получения достижений')
  }

  const data: AchievementsResponse = await response.json()

  return data
}

export const checkAchievements = async (): Promise<CheckAchievementsResponse> => {
  const response = await apiClient('/achievements/check', {
    method: 'POST',
  })

  if (!response.ok) {
    throw new Error('Ошибка обновления достижений')
  }

  const data: CheckAchievementsResponse = await response.json()

  return data
}
