import { apiClient } from "@/utils/apiClient"

interface CounterData {
  clicks: number
  coins: number
}

export const incrementCounter = async (clicks: number): Promise<CounterData> => {
  const response = await apiClient('/counter/increment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ increment: clicks })
  })

  if (!response.ok) {
    throw new Error('Ошибка прибавления счетчика')
  }

  const data = await response.json()

  return data
}
