import { CounterData, Timestamps } from "@/types/counter"
import { apiClient } from "@/utils/apiClient"

export const incrementCounter = async (timestamps: Timestamps): Promise<CounterData> => {
  const response = await apiClient('/counter/increment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ timestamps })
  })
  
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data?.message || 'Ошибка сервера')
  }

  return data
}

