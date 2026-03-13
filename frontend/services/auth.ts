import { AuthCredentials, AuthResponse } from '@/types/auth'
import { apiClient } from '@/utils/apiClient'

export const authService = {
  login: async (credentials: AuthCredentials): Promise<AuthResponse> => {
    const response = await apiClient('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })

    const data: AuthResponse = await response.json()

    if (!response.ok) {
      throw new Error(data?.message || 'Ошибка авторизации')
    }

    return data
  },

  register: async (
    credentials: AuthCredentials
  ): Promise<AuthResponse> => {
    const response = await apiClient('/auth/register', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })

    const data: AuthResponse = await response.json()

    if (!response.ok) {
      throw new Error(data?.message || 'Ошибка регистрации')
    }

    return data
  }
}
