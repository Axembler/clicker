import { apiClient } from '@/utils/apiClient'

export interface AuthCredentials {
  username: string
  password: string
}

export interface AuthResponse {
  token: string
  user: {
    id: string
    username: string
  }
}

export const authService = {
  login: async (credentials: AuthCredentials): Promise<AuthResponse> => {
    const response = await apiClient('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })

    const data: AuthResponse = await response.json()

    if (!response.ok) {
      throw new Error('Ошибка авторизации')
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
      throw new Error('Ошибка регистрации')
    }

    return data
  }
}
