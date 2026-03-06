import { apiClient } from "@/utils/apiClient"

interface CounterData {
  clicks: number
  coins: number
}

export const getCounter = async (): Promise<CounterData> => {
  const response = await apiClient('/counter', {
    method: 'GET',
  })

  if (!response.ok) {
    throw new Error('Ошибка получения счетчика')
  }

  const data = await response.json()

  return data
}

export const incrementCounter = async (): Promise<CounterData> => {
  const response = await apiClient('/counter/increment', {
    method: 'POST',
  })

  if (!response.ok) {
    throw new Error('Ошибка прибавления счетчика')
  }

  const data = await response.json()

  return data
}
