import { BuySkillResponse, Skill, UserSkill } from '@/types/skills'
import { apiClient } from '@/utils/apiClient'

// Получить все скиллы
export const getSkills = async (): Promise<Skill[]> => {
  const response = await apiClient('/skills', {
    method: 'GET',
  })

  if (!response.ok) {
    throw new Error('Ошибка получения скиллов')
  }

  const data = await response.json()

  return data
}

// Получить скиллы текущего пользователя
export const getUserSkills = async (): Promise<UserSkill[]> => {
  const response = await apiClient('/skills/user', {
    method: 'GET',
  })

  if (!response.ok) {
    throw new Error('Ошибка получения скиллов пользователя')
  }

  const data = await response.json()

  return data
}

// Купить или улучшить скилл
export const buySkill = async (skillId: string, nodeId: string): Promise<BuySkillResponse> => {
  const response = await apiClient(`/skills/buy/${skillId}/${nodeId}`, {
    method: 'POST',
  })

  if (!response.ok) {
    const error = await response.json()

    throw new Error(error.error || 'Ошибка покупки скилла')
  }

  const data = await response.json()

  return data
}
