import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { getToken, saveToken, deleteToken } from '@/utils/token'

interface AuthContextType {
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  signIn: (token: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadToken = async () => {
      try {
        const storedToken = await getToken()

        setToken(storedToken)
      } catch (error) {
        console.error('Ошибка загрузки токена:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadToken()
  }, [])

  const signIn = useCallback(async (newToken: string) => {
    setToken(newToken)
    
    await saveToken(newToken)
  }, [])

  const signOut = useCallback(async () => {
    setToken(null)
    
    await deleteToken()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        token,
        isLoading,
        isAuthenticated: !!token,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  
  return context
}
