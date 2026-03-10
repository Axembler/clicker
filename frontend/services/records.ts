import { apiClient } from "@/utils/apiClient"

type SortField = 'clicks' | 'totalCoins'

type RecordEntry = {
  rank: number
  id: string
  username: string
  totalClicks: number
  totalCoins: number
}

type RecordsData = {
  success:  boolean
  sortedBy: SortField
  total: number
  records:  RecordEntry[]
  message?: string
}

type UserRecordData = {
  success: boolean
  rank: number
  user: {
    username: string
    totalClicks: number
    totalCoins: number
  }
}

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