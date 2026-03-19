import { apiClient } from "@/utils/apiClient"
import { Achievement, UserAchievement } from "@/types/achievements"

export const getAchievements = async (): Promise<Achievement[]> => {
  const response = await apiClient('/achievements/', {
    method: 'GET',
  })

  if (!response.ok) {
    throw new Error('Ошибка получения достижений')
  }

  const data = await response.json()

  return data
}

export const getUserAchievements = async (): Promise<UserAchievement[]> => {
  const response = await apiClient('/achievements/user', {
    method: 'GET',
  })

  if (!response.ok) {
    throw new Error('Ошибка получения достижений пользователя')
  }

  const data = await response.json()

  return data
}

export const checkAchievements = async (): Promise<Achievement[]> => {
  const response = await apiClient('/achievements/check', {
    method: 'POST',
  })

  if (!response.ok) {
    throw new Error('Ошибка обновления достижений')
  }

  const data = await response.json()

  return data
}

export const receiveAchievement = async (achievementId: string): Promise<UserAchievement> => {
  const response = await apiClient(`/achievements/receive/${achievementId}`, {
    method: 'POST',
  })

  if (!response.ok) {
    throw new Error('Ошибка получения достижения')
  }

  const data = await response.json()

  return data
}
