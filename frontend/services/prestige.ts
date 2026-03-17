import { PrestigeResponse } from "@/types/prestige"
import { apiClient } from "@/utils/apiClient"

export const prestige = async (): Promise<PrestigeResponse> => {
  const response = await apiClient('/prestige', {
    method: 'POST',
  })

  const data = await response.json()

  if (!response.ok) throw new Error(data.message)

  return data
}