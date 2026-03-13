import { RecordsData, UserRecordData } from "@/types/records"
import { apiClient } from "@/utils/apiClient"

export const getRecords = async (): Promise<RecordsData> => {
  const response = await apiClient('/records', {
    method: 'GET',
  })

  if (!response.ok) {
    throw new Error('Ошибка получения рекордов')
  }

  const data = await response.json()

  return data
}

export const getUserRecord = async (): Promise<UserRecordData> => {
  const response = await apiClient('/records/user', {
    method: 'GET',
  })

  if (!response.ok) {
    throw new Error('Ошибка получения рекордов пользователя')
  }

  const data = await response.json()

  return data
}