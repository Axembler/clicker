import { getUser } from '@/services/user'
import { useFocusEffect } from 'expo-router'
import { createContext, useContext, useState, useCallback, useEffect, ReactNode, Dispatch, SetStateAction } from 'react'

interface UserItem {
  _id: string
  name: string
}

interface User {
  _id: string
  username: string
  clicks: number
  clickPower: number
  coins: number
  totalCoins: number
  passiveIncome: number
  items: UserItem[]
  lastOnline: string
  createdAt: string
}

interface UserContextType {
  user: User | null
  isLoading: boolean
  error: string | null
  refetchUser: () => Promise<void>
  setUser: Dispatch<SetStateAction<User | null>>
}

const UserContext = createContext<UserContextType>({
  user: null,
  isLoading: false,
  error: null,
  refetchUser: async () => {},
  setUser: () => {},
})

export const useUserContext = () => useContext(UserContext)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUser = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const data = await getUser()
      setUser(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Неизвестная ошибка')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useFocusEffect(
    useCallback(() => {
      fetchUser()
    }, [fetchUser])
  )

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading,
        error,
        refetchUser: fetchUser,
        setUser,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}
