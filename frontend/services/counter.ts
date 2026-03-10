import { apiClient } from "@/utils/apiClient"

interface CounterData {
  clicks: number
  coins: number
}

export const incrementCounter = async (timestamps: number[]): Promise<CounterData> => {
  const response = await apiClient('/counter/increment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ timestamps })
  })
  
  const data = await response.json()

  console.log(data)
  
  if (!response.ok) {
    throw new Error(data?.message || 'Ошибка сервера')
  }

  

  return data
}

